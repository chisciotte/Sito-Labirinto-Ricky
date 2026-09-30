#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Raccoglie gli articoli di Ricky Farina dal Fatto Quotidiano e riscrive
articoli/index.html fra i segni <!-- ULTIMI:INIZIO --> ... <!-- ULTIMI:FINE -->
e <!-- ARCHIVIO:INIZIO --> ... <!-- ARCHIVIO:FINE -->.

Come funziona
-------------
1. Scorre le pagine dell'autore, /autori/rfarina/page/N/, finche' ne trova.
2. Da ogni pagina estrae gli indirizzi degli articoli: hanno tutti la forma
   /ANNO/MESE/GIORNO/parole/NUMERO/ . La data sta nell'indirizzo, quindi non
   dipende da come il Fatto impagina la pagina.
   Si ferma dove finisce l'elenco dell'autore: sotto ci sono gli articoli di
   altre firme, che non devono entrare nel sito di Ricky.
3. Per ogni articolo mai visto prima apre la sua pagina UNA VOLTA SOLA e si
   annota il sommario, che sta nell'intestazione nascosta (og:description).
   Gli articoli gia' noti non vengono piu' aperti: restano in articoli.json.
4. Riscrive la pagina. Quello che sapeva prima non viene mai buttato via:
   una raccolta andata storta non deve svuotare l'archivio.

Si lancia da solo ogni notte (.github/workflows/raccolta.yml).
Per provarlo senza scrivere niente:  python3 raccolta/fatto.py --prova
"""
import json, os, re, sys, time, html
from urllib.request import Request, urlopen

AUTORE = 'https://www.ilfattoquotidiano.it/autori/rfarina/'
# la firma di Ricky: un articolo e' suo solo se la sua pagina d'autore
# e' citata dentro l'articolo stesso
FIRMA = re.compile(r'/autori/rfarina/', re.I)
# l'indirizzo di un articolo, scritto per intero oppure a partire dalla barra
PAGINA = re.compile(r'^(?:https?://www\.ilfattoquotidiano\.it)?'
                    r'/(\d{4})/(\d{2})/(\d{2})/[^/"\'\s]+/(\d+)/?$')
# dove finisce l'elenco dell'autore e cominciano le altre firme
FINE_ELENCO = re.compile(r'In\s+Primo\s+Piano|Dai\s+BLOG', re.I)
# un collegamento qualunque, con apici doppi o singoli
COLLEGAMENTO = re.compile(r'<a\b[^>]*?href\s*=\s*["\']([^"\']+)["\'][^>]*>(.*?)</a>',
                          re.S | re.I)

QUI = os.path.dirname(os.path.abspath(__file__))
SITO = os.path.dirname(QUI)
MEMORIA = os.path.join(QUI, 'articoli.json')
PAGINA_HTML = os.path.join(SITO, 'articoli', 'index.html')
QUANTI_ULTIMI = 5
MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio',
        'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']


def scarica(indirizzo):
    richiesta = Request(indirizzo, headers={
        'User-Agent': 'rickyfarina.it/1.0 (raccolta articoli; contatto: info@rickyfarina.it)'})
    with urlopen(richiesta, timeout=30) as risposta:
        return risposta.read().decode('utf-8', 'replace')


def articoli_nella_pagina(testo, racconta=False):
    """Ogni articolo compare piu' volte (titolo, immagine, commenti): tengo
       l'indirizzo pulito e il testo piu' lungo fra quelli che lo accompagnano."""
    taglio = FINE_ELENCO.search(testo)
    if taglio:
        testo = testo[:taglio.start()]
    trovati = {}
    candidati = 0
    for m in COLLEGAMENTO.finditer(testo):
        indirizzo = m.group(1).split('#')[0].split('?')[0].strip()
        if not PAGINA.match(indirizzo):
            continue
        candidati += 1
        if indirizzo.startswith('/'):
            indirizzo = 'https://www.ilfattoquotidiano.it' + indirizzo
        if not indirizzo.endswith('/'):
            indirizzo += '/'
        titolo = re.sub(r'<[^>]+>', ' ', m.group(2))
        titolo = html.unescape(re.sub(r'\s+', ' ', titolo)).strip()
        if len(titolo) > len(trovati.get(indirizzo, '')):
            trovati[indirizzo] = titolo
    buoni = {k: v for k, v in trovati.items() if len(v) >= 12}
    if racconta:
        print('   collegamenti ad articoli: %d, indirizzi distinti: %d, con titolo: %d'
              % (candidati, len(trovati), len(buoni)))
    return buoni


def leggi_articolo(indirizzo):
    """Apre l'articolo una volta sola e riporta due cose: se e' davvero di
       Ricky, e il suo sommario. Il sommario sta nell'intestazione nascosta,
       quella per i motori di ricerca: non serve leggere il testo.

       La verifica della firma e' la rete di sicurezza di tutta la raccolta:
       qualunque pagina il Fatto ci serva, un articolo che non nomina la
       pagina d'autore di Ricky non entra nel suo sito."""
    try:
        testo = scarica(indirizzo)
    except Exception as errore:
        print('   non sono riuscito ad aprire %s (%s)' % (indirizzo, errore))
        return None, ''
    suo = bool(FIRMA.search(testo))
    # Gli attributi di un <meta> possono stare in qualunque ordine, con apici
    # doppi o singoli. Prima cercavo una forma sola e non trovavo mai niente:
    # ora leggo ogni <meta> e guardo cosa dichiara di essere.
    trovati = {}
    for tag in re.findall(r'<meta\b[^>]*>', testo, re.I):
        def attributo(nome):
            m = re.search(nome + r'\s*=\s*["\']([^"\']*)["\']', tag, re.I)
            return m.group(1) if m else ''
        chi = (attributo('property') or attributo('name')).lower()
        if chi in ('og:description', 'description', 'twitter:description'):
            valore = html.unescape(attributo('content')).strip()
            if valore and chi not in trovati:
                trovati[chi] = valore
    for chi in ('og:description', 'description', 'twitter:description'):
        if trovati.get(chi):
            return suo, trovati[chi]
    return suo, ''


def raccogli(prova=False):
    noti = {}
    if os.path.exists(MEMORIA):
        with open(MEMORIA, encoding='utf-8') as f:
            noti = {a['url']: a for a in json.load(f)}
    print('gia noti: %d articoli' % len(noti))

    tutti = {}
    n = 1
    vuote = 0
    viste = set()
    while True:
        indirizzo = AUTORE if n == 1 else '%spage/%d/' % (AUTORE, n)
        try:
            testo = scarica(indirizzo)
        except Exception as errore:
            print('pagina %d: mi fermo (%s)' % (n, errore))
            break
        impronta = hash(testo)
        if impronta in viste:
            print('pagina %d: e uguale a una gia letta, mi fermo' % n)
            break
        viste.add(impronta)
        trovati = articoli_nella_pagina(testo, racconta=(n <= 2))
        nuovi = {k: v for k, v in trovati.items() if k not in tutti}
        print('pagina %-3d %d articoli' % (n, len(nuovi)))
        if nuovi:
            vuote = 0
            tutti.update(nuovi)
        else:
            vuote += 1
            if vuote >= 3:       # tre pagine di fila senza nulla: siamo alla fine
                break
        n += 1
        if n > 200:
            break
        time.sleep(1)            # un respiro fra una pagina e l'altra, per educazione

    # quello che sapevamo resta: una raccolta andata male non svuota l'archivio
    for url, voce in noti.items():
        tutti.setdefault(url, voce.get('titolo', ''))

    nuovi_url = [u for u in tutti if u not in noti]
    # articoli gia' noti a cui manca il sommario e che non abbiamo ancora
    # provato a rileggere: capita quando la lettura era sbagliata
    da_recuperare = [u for u, v in noti.items()
                     if not v.get('sommario') and not v.get('letto')]
    MAX_RECUPERI = 500
    da_recuperare = da_recuperare[:MAX_RECUPERI]
    print('articoli nuovi da leggere: %d' % len(nuovi_url))
    if da_recuperare:
        print('sommari da recuperare: %d' % len(da_recuperare))

    elenco = []
    scartati = 0
    for url, titolo in tutti.items():
        m = PAGINA.match(url)
        if not m:
            continue
        anno, mese, giorno, _ = m.groups()
        voce = dict(noti.get(url, {}))
        if not prova and (url not in noti or url in da_recuperare):
            suo, somm = leggi_articolo(url)
            time.sleep(1)
            if suo is False:          # non e' firmato da Ricky: fuori
                scartati += 1
                continue
            voce['sommario'] = somm or voce.get('sommario', '')
            voce['letto'] = True      # provato: non ci si torna piu'
        elenco.append({'url': url,
                       'titolo': titolo or voce.get('titolo', ''),
                       'anno': anno, 'mese': mese, 'giorno': giorno,
                       'sommario': voce.get('sommario', ''),
                       'letto': voce.get('letto', False)})
    if scartati:
        print('scartati perche non firmati da Ricky: %d' % scartati)
    con_sommario = sum(1 for a in elenco if a['sommario'])
    print('articoli con il sommario: %d su %d' % (con_sommario, len(elenco)))
    elenco.sort(key=lambda a: (a['anno'], a['mese'], a['giorno']), reverse=True)

    if prova:
        print('\n--- i primi cinque ---')
        for a in elenco[:5]:
            print('   %s/%s/%s  %s' % (a['giorno'], a['mese'], a['anno'], a['titolo'][:70]))
        if elenco:
            print('\ntotale: %d articoli, dal %s al %s'
                  % (len(elenco), elenco[-1]['anno'], elenco[0]['anno']))
        return

    if not elenco:
        print('nessun articolo: non tocco niente')
        return
    if len(elenco) < len(noti):
        print('trovati %d articoli ma ne conoscevo %d: qualcosa non va, non tocco niente'
              % (len(elenco), len(noti)))
        return

    with open(MEMORIA, 'w', encoding='utf-8') as f:
        json.dump(elenco, f, ensure_ascii=False, indent=1)
    scrivi_pagina(elenco)
    print('fatto: %d articoli' % len(elenco))


def salva(t):
    return html.escape(t, quote=True)


def scrivi_pagina(elenco):
    ultimi = ['      <ul class="pezzi">']
    for a in elenco[:QUANTI_ULTIMI]:
        quando = '%d %s %s' % (int(a['giorno']), MESI[int(a['mese']) - 1], a['anno'])
        somm = ('<p class="sommario">%s</p>' % salva(a['sommario'])) if a['sommario'] else ''
        ultimi.append('        <li><span class="quando">%s</span>'
                      '<span class="titolo">%s</span>%s'
                      '<a class="vai" href="%s" target="_blank" rel="noopener">leggilo sul Fatto</a></li>'
                      % (quando, salva(a['titolo']), somm, a['url']))
    ultimi.append('      </ul>')

    per_anno = {}
    for a in elenco:
        per_anno.setdefault(a['anno'], {}).setdefault(a['mese'], []).append(a)
    archivio = []
    for anno in sorted(per_anno, reverse=True):
        quanti = sum(len(v) for v in per_anno[anno].values())
        archivio.append('      <details class="anno">')
        archivio.append('        <summary><span class="cifra">%s</span>'
                        '<span class="conta">%d articoli</span>'
                        '<span class="segno" aria-hidden="true">+</span></summary>' % (anno, quanti))
        for mese in sorted(per_anno[anno], reverse=True):
            archivio.append('        <details class="mese-a">')
            archivio.append('          <summary><span class="nome">%s</span>'
                            '<span class="segno" aria-hidden="true">+</span></summary>'
                            % MESI[int(mese) - 1])
            archivio.append('          <ul class="elenco-a">')
            for a in sorted(per_anno[anno][mese], key=lambda x: int(x['giorno']), reverse=True):
                archivio.append('            <li><a href="%s" target="_blank" rel="noopener">'
                                '<span class="g">%d</span>%s</a></li>'
                                % (a['url'], int(a['giorno']), salva(a['titolo'])))
            archivio.append('          </ul>')
            archivio.append('        </details>')
        archivio.append('      </details>')

    with open(PAGINA_HTML, encoding='utf-8') as f:
        pagina = f.read()
    for segno, pezzi in [('ULTIMI', ultimi), ('ARCHIVIO', archivio)]:
        pagina = re.sub(r'(<!-- %s:INIZIO -->)[\s\S]*?(<!-- %s:FINE -->)' % (segno, segno),
                        lambda m: m.group(1) + '\n' + '\n'.join(pezzi) + '\n      ' + m.group(2),
                        pagina)
    with open(PAGINA_HTML, 'w', encoding='utf-8') as f:
        f.write(pagina)


if __name__ == '__main__':
    raccogli(prova='--prova' in sys.argv)
