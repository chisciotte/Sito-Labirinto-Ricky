/* =========================================================================
   Aforismi e Poesie: il lettore sfogliabile delle raccolte.
   Le pagine di prova andranno sostituite con quelle vere dei due libri.
   ========================================================================= */
(function(){
  "use strict";
  var PAGINE=[];
  for(var i=1;i<=24;i++)PAGINE.push('[pagina '+i+']\n\n[qui il testo della poesia,\nverso dopo verso]');
  var apert=0, inCorso=false,
      lettore=document.getElementById('lettore'), g=document.getElementById('girata'),
      avanti=document.getElementById('avanti'), indietro=document.getElementById('indietro'),
      chiudi=document.getElementById('chiudi');
  /* se in pagina non c'e' il lettore, qui non c'e' niente da fare: senza questo
     controllo il codice si fermerebbe e porterebbe giu' anche l'oracolo */
  if(!lettore||!g||!avanti||!indietro||!chiudi)return;
  /* sotto i 640 pixel il libro mostra una pagina per volta */
  function singola(){ return window.matchMedia('(max-width:640px)').matches; }
  function passo(){ return singola() ? 1 : 2; }

  function mostra(){
    document.getElementById('pSin').textContent=PAGINE[apert]||'';
    document.getElementById('pDes').textContent=PAGINE[apert+1]||'';
    document.getElementById('nSin').textContent=apert<PAGINE.length?(apert+1):'';
    document.getElementById('nDes').textContent=(apert+1)<PAGINE.length?(apert+2):'';
    document.getElementById('dove').textContent = singola()
      ? 'pagina '+(apert+1)+' di '+PAGINE.length
      : 'pagine '+(apert+1)+'–'+Math.min(apert+2,PAGINE.length)+' di '+PAGINE.length;
  }
  function gira(avanti){
    /* un giro alla volta: senza questo, premendo in fretta le pagine
       si sommavano e il contatore superava la fine del libro */
    if(inCorso)return;
    var p=passo();
    if(avanti){
      if(apert+p>=PAGINE.length)return;
      inCorso=true;
      /* il foglio che si alza: con due pagine e' quella di destra, con una
         sola e' la pagina che si sta leggendo */
      g.textContent=(singola()?PAGINE[apert]:PAGINE[apert+1])||'';
      g.classList.add('attiva');
      /* la pagina che si scopre sotto si aggiorna subito, non alla fine:
         e' quella che si vede mentre il foglio ruota */
      if(!singola()){
        document.getElementById('pDes').textContent=PAGINE[apert+3]||'';
        document.getElementById('nDes').textContent=(apert+3)<PAGINE.length?(apert+4):'';
      }
      requestAnimationFrame(function(){g.classList.add('vola');});
      setTimeout(function(){
        apert=Math.min(apert+p,PAGINE.length-1);
        mostra();
        g.classList.remove('attiva','vola');g.style.transition='none';
        requestAnimationFrame(function(){g.style.transition='';inCorso=false;});
      },700);
    } else if(apert>0){ apert=Math.max(0,apert-p); mostra(); }
  }
  document.querySelectorAll('[data-libro]').forEach(function(b){
    b.addEventListener('click',function(){apert=0;mostra();lettore.classList.add('su');});
  });
  /* ruotando il telefono si passa da una pagina a due: ridisegno */
  if(window.matchMedia)
    window.matchMedia('(max-width:640px)').addEventListener('change',function(){mostra();});
  avanti.addEventListener('click',function(){gira(true);});
  indietro.addEventListener('click',function(){gira(false);});
  chiudi.addEventListener('click',function(){lettore.classList.remove('su');});
  document.addEventListener('keydown',function(e){
    if(!lettore.classList.contains('su'))return;
    if(e.key==='ArrowRight')gira(true);
    if(e.key==='ArrowLeft')gira(false);
    if(e.key==='Escape')lettore.classList.remove('su');
  });
})();

/* =========================================================================
   Chiedi a Ricky: il libro si apre su un aforisma.

   La domanda NON viene mai spedita da nessuna parte: resta una variabile nel
   browser di chi scrive e sparisce chiudendo la pagina. Il confronto fra la
   domanda e gli aforismi avviene qui, sul suo computer, sugli aforismi che
   sono gia' stati scaricati con la pagina. Nessuna richiesta di rete, niente
   da salvare, niente da dichiarare.
   ========================================================================= */
(function(){
  "use strict";
  /* DA SOSTITUIRE con gli aforismi veri. Le parole chiave sono facoltative:
     servono solo ad avvicinare la risposta al tema della domanda. */
  var ORACOLO=[
    {testo:'[un aforisma di Ricky]',     chiavi:['amore','cuore']},
    {testo:'[un altro aforisma]',        chiavi:['lavoro','soldi']},
    {testo:'[un terzo aforisma]',        chiavi:['tempo','morte']},
    {testo:'[un quarto aforisma]',       chiavi:['amicizia','altri']},
    {testo:'[un quinto aforisma]',       chiavi:['viaggio','strada']},
    {testo:'[un sesto aforisma]',        chiavi:[]}
  ];
  /* parole troppo comuni per dire qualcosa sul tema */
  var VUOTE=('il lo la i gli le un uno una di a da in con su per tra fra e o ma se che chi cosa come '+
    'quando dove perche non mi ti si ci vi ne del della dei delle al alla ai alle dal dalla nel nella '+
    'sul sulla piu meno molto poco essere sono sei siamo ho hai ha abbiamo fare faccio fa mio mia tuo '+
    'tua suo sua questo questa quello quella io tu lui lei noi voi loro').split(' ');

  var libro=document.getElementById('libro'),
      scritto=document.getElementById('scritto'),
      campo=document.getElementById('domanda'),
      avviso=document.getElementById('avviso'),
      bottone=document.getElementById('sfoglia');
  if(!libro||!scritto||!bottone)return;

  /* --- la domanda deve essere una domanda ---
     Il pulsante resta sempre premibile: il controllo scatta al momento del
     clic, non mentre si scrive. Avvisare del punto interrogativo mancante
     mentre uno sta ancora componendo la frase sarebbe un rimprovero continuo. */
  /* Undici caratteri: "chi sono io" passa e gli manca solo il punto interrogativo,
     "chi sono?" no. Ogni avviso dice una cosa sola, quella che manca davvero. */
  var MINIMO=11, gia=false;
  function verdetto(d){
    d=(d||'').trim();
    var parole=d.split(/\s+/).filter(Boolean);
    if(!d.length) return 'Scrivi una domanda.';
    if(d.length<MINIMO||parole.length<2) return 'Scrivi ancora un po\u2019.';
    if(d.slice(-1)!=='?') return 'Manca il punto interrogativo.';
    return '';
  }
  function dice(testo,tipo){
    if(!avviso)return;
    avviso.textContent=testo||'';
    avviso.classList.toggle('su',!!testo);
    avviso.classList.toggle('errore',tipo==='errore');
    avviso.classList.toggle('chiuso',tipo==='chiuso');
  }

  function pulisci(s){
    return s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')   /* via gli accenti */
      .replace(/[^a-z0-9\s]/g,' ')
      .split(/\s+/).filter(function(p){return p.length>2&&VUOTE.indexOf(p)<0;});
  }
  function mescola(a){
    a=a.slice();
    for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}
    return a;
  }
  var mazzo=mescola(ORACOLO), carta=0;

  function scegli(domanda){
    var parole=pulisci(domanda||'');
    if(parole.length){
      /* quante parole della domanda compaiono nell'aforisma o fra le sue chiavi */
      var punteggi=ORACOLO.map(function(a){
        var testo=(a.testo+' '+(a.chiavi||[]).join(' ')).toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        var n=0;
        parole.forEach(function(p){ if(testo.indexOf(p)>=0)n++; });
        return {a:a,n:n};
      });
      var max=Math.max.apply(null,punteggi.map(function(x){return x.n;}));
      if(max>0){
        /* fra quelli che pareggiano si sorteggia: due domande simili non danno
           sempre la stessa risposta */
        var migliori=punteggi.filter(function(x){return x.n===max;});
        return migliori[Math.floor(Math.random()*migliori.length)].a.testo;
      }
    }
    /* nessuna corrispondenza: un mazzo mescolato, senza ripetizioni */
    if(carta>=mazzo.length){mazzo=mescola(ORACOLO);carta=0;}
    return mazzo[carta++].testo;
  }

  function apri(){
    if(gia)return;                         /* una sola risposta per visita */
    var male=verdetto(campo?campo.value:'');
    if(male){ dice(male,'errore'); return; }
    /* Da qui non si torna indietro: il libro si apre una volta sola. La prima
       risposta e' quella vera, e ripescare finche' non piace la svuoterebbe. */
    gia=true;
    bottone.disabled=true;
    dice('','');
    libro.classList.remove('aperto');
    scritto.classList.remove('su');
    var frase=scegli(campo?campo.value:'');
    setTimeout(function(){
      libro.classList.add('aperto');
      scritto.innerHTML=frase+'<span class="firma">Ricky</span>';
      setTimeout(function(){
        scritto.classList.add('su');
        dice('Una domanda per visita. Ricarica la pagina per chiederne un\u2019altra.','chiuso');
      },450);
    },180);
  }
  bottone.addEventListener('click',apri);
  if(campo)campo.addEventListener('keydown',function(e){ if(e.key==='Enter'){e.preventDefault();apri();} });
})();

/* =========================================================================
   Un lettore solo per due sezioni: gli aforismi dal blog e le poesie.

   In pagina ci sono le prime voci, scritte nel codice: si vedono subito e i
   motori di ricerca le trovano. Le altre stanno in un file a parte, sullo
   stesso sito, e si scaricano soltanto quando si arriva in fondo alle prime.
   ========================================================================= */
(function(){
  "use strict";

  function lettore(opzioni){
    var elenco = document.getElementById(opzioni.elenco),
        avanti = document.getElementById(opzioni.avanti),
        indietro = document.getElementById(opzioni.indietro),
        posto = document.getElementById(opzioni.posto);
    if(!elenco || !avanti || !indietro) return;

    var voci = Array.prototype.slice.call(elenco.children),
        qui = 0, totale = voci.length, resto = null, sto_caricando = false;

    function mostra(n){
      if(n < 0 || n >= voci.length) return;
      voci[qui].classList.remove('in-vista');
      qui = n;
      voci[qui].classList.add('in-vista');
      if(posto) posto.textContent = (qui + 1) + ' di ' + totale;
      indietro.disabled = (qui === 0);
      avanti.disabled = (qui >= totale - 1);
    }

    function riga(v){
      var li = document.createElement('li');
      if(v.titolo){
        var h = document.createElement('div');
        h.className = 'titolo'; h.textContent = v.titolo;
        li.appendChild(h);
      }
      var p = document.createElement('p');
      p.className = opzioni.classeTesto || '';
      /* gli a capo della poesia vanno rispettati: li ricostruisco a mano
         invece di affidarli al testo, che li appiattirebbe */
      (v.testo || v.titolo || '').split('\n').forEach(function(r, k){
        if(k) p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode(r));
      });
      li.appendChild(p);
      var q = document.createElement('span');
      q.className = 'quando';
      q.appendChild(document.createTextNode(v.quando + ' \u00b7 '));
      var a = document.createElement('a');
      a.href = v.url; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'sul blog';
      q.appendChild(a);
      li.appendChild(q);
      return li;
    }

    function aggiungi(nuove){
      var pezzo = document.createDocumentFragment();
      nuove.forEach(function(v){ var li = riga(v); pezzo.appendChild(li); voci.push(li); });
      elenco.appendChild(pezzo);
    }

    function vaiAvanti(){
      if(qui + 1 < voci.length){ mostra(qui + 1); return; }
      if(resto || sto_caricando) return;
      sto_caricando = true;
      avanti.disabled = true;
      fetch(opzioni.file)
        .then(function(r){ if(!r.ok) throw new Error(r.status); return r.json(); })
        .then(function(dati){
          resto = dati.resto || [];
          totale = dati.totale || (voci.length + resto.length);
          aggiungi(resto);
          sto_caricando = false;
          mostra(qui + 1);
        })
        .catch(function(){
          sto_caricando = false;
          totale = voci.length;          /* piu' di cosi' non ce n'e' */
          mostra(qui);
        });
    }

    avanti.addEventListener('click', vaiAvanti);
    indietro.addEventListener('click', function(){ mostra(qui - 1); });
    document.addEventListener('keydown', function(e){
      var cassetto = elenco.closest('details');
      if(!cassetto || !cassetto.open) return;
      if(e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if(e.key === 'ArrowRight') vaiAvanti();
      if(e.key === 'ArrowLeft') mostra(qui - 1);
    });

    /* il totale vero arriva col file: lo chiedo subito, senza mostrare nulla */
    fetch(opzioni.file).then(function(r){ return r.ok ? r.json() : null; })
      .then(function(dati){ if(dati && dati.totale){ totale = dati.totale; mostra(qui); } })
      .catch(function(){});

    mostra(0);
  }

  lettore({elenco:'dalBlog',  avanti:'avantiAf', indietro:'indietroAf',
           posto:'postoAf',   file:'altri.json'});
  lettore({elenco:'lePoesie', avanti:'avantiPo', indietro:'indietroPo',
           posto:'postoPo',   file:'poesie.json', classeTesto:'versi'});
})();
