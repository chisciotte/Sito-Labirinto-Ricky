/* =========================================================================
   Chisciotte Produzioni: il giorno a caso e i due nastri degli artisti.
   ========================================================================= */
(function(){
  "use strict";

  /* ------------------------------------------------------------------
     DA SOSTITUIRE CON L'ARCHIVIO VERO.
     Ogni voce e' [giorno, mese, anno, titolo, codice del video].
     Nel sito finito questo elenco sara' generato una volta al giorno da
     GitHub leggendo l'archivio del canale, e salvato qui accanto: il
     browser di chi visita non contattera' YouTube finche' non clicca.
     ------------------------------------------------------------------ */
  var GIORNI=[   /* segnaposto: sostituiti dalla raccolta notturna */
    ['14','03','2019','[titolo del video]',''],
    ['02','04','2021','[titolo del video]',''],
    ['09','11','2016','[titolo del video]',''],
    ['27','07','2023','[titolo del video]',''],
    ['31','12','2014','[titolo del video]',''],
    ['18','01','2025','[titolo del video]',''],
    ['05','06','2012','[titolo del video]',''],
    ['22','10','2018','[titolo del video]','']
  ];

  /* ------------------------------------------------------------------
     DA COMPLETARE: nome, mestiere e collegamento al suo videoritratto.
     ------------------------------------------------------------------ */
  var ARTISTI=[
    ['Alda Merini','poetessa','#'],
    ['Silvano Agosti','regista','#'],
    ['Flavio Costantini','illustratore','#'],
    ['Tony Munzlinger','illustratore','#'],
    ['Severino Saltarelli','da verificare','#'],
    ['Nicola Gelo','pianista','#'],
    ['Gabriele Contini','poeta','#']
  ];

  /* ---------------- il giorno a caso ----------------
     Un mazzo mescolato, non un dado: finche' non si sono viste tutte le
     date non se ne ripete nessuna. */
  function mescola(a){
    a=a.slice();
    for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}
    return a;
  }
  var mazzo=mescola(GIORNI),carta=0;

  /* I giorni veri arrivano da produzioni/giorni.json, riscritto ogni notte dalla
     raccolta. Finche' quel file non c'e', restano i segnaposto qui sopra: cosi'
     la pagina funziona comunque e non mostra mai un buco. */
  fetch('giorni.json').then(function(r){ return r.ok ? r.json() : null; })
    .then(function(dati){
      if(!dati || !dati.giorni || !dati.giorni.length) return;
      GIORNI = dati.giorni.map(function(g){
        return [g.giorno, g.mese, g.anno, g.film || []];
      });
      mazzo = mescola(GIORNI); carta = 0;
    })
    .catch(function(){});
  function scritta(g){return g[0]+'<span class="sep">·</span>'+g[1]+'<span class="sep">·</span>'+g[2];}

  var elD=document.getElementById('data'),
      elL=document.getElementById('filmGiorno'),
      elT=document.getElementById('titolo'),
      elV=document.getElementById('vai'),
      bottone=document.getElementById('pesca');

  if(bottone&&elD){
    bottone.addEventListener('click',function(){
      if(!GIORNI.length)return;
      elD.classList.remove('attesa');
      elV.classList.remove('su');
      elT.textContent='';
      if(elL)elL.innerHTML='';
      if(carta>=mazzo.length){mazzo=mescola(GIORNI);carta=0;}
      var scelto=mazzo[carta++],giri=0;
      var t=setInterval(function(){
        /* il rullo mostra solo date vere: mai un giorno senza un film */
        elD.innerHTML=scritta(GIORNI[Math.floor(Math.random()*GIORNI.length)]);
        if(++giri>12){
          clearInterval(t);
          elD.innerHTML=scritta(scelto);
          var film=scelto[3];
          if(Object.prototype.toString.call(film)!=='[object Array]'){
            /* i segnaposto hanno ancora la forma vecchia: titolo e codice */
            film=[{titolo:scelto[3],url:scelto[4]?('https://www.youtube.com/watch?v='+scelto[4]):''}];
          }
          if(film.length<=1){
            elT.textContent=film[0]?film[0].titolo:'';
            if(film[0]&&film[0].url){elV.href=film[0].url;elV.classList.add('su');}
          }else{
            /* piu' film nello stesso giorno: si elencano numerati, cosi' si
               capisce che sono tutti di quel giorno */
            elT.textContent=film.length+' film, quel giorno';
            var righe='';
            film.forEach(function(f,i){
              righe+='<li><span class="n">'+(i+1)+'</span>'+
                     '<a href="'+f.url+'" target="_blank" rel="noopener">'+
                     f.titolo.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</a></li>';
            });
            if(elL)elL.innerHTML=righe;
          }
        }
      },55);
    });
  }

  /* ---------------- i due nastri ---------------- */
  /* Se per un artista manca l'indirizzo di un film preciso - perche' ne ha piu'
     di uno - il nome apre la ricerca dentro il canale: mostra tutti i suoi
     ritratti, e se domani ne uscira' un altro comparira' li' da solo. */
  var CANALE='https://www.youtube.com/@rickyfarina';
  function dove(x){
    if(x[2] && x[2] !== '#') return x[2];
    return CANALE + '/search?query=' + encodeURIComponent(x[0]);
  }

  function nastro(lista){
    var h='';
    for(var k=0;k<2;k++)                       /* due copie: il giro e' continuo */
      lista.forEach(function(x){
        h+='<a href="'+dove(x)+'" target="_blank" rel="noopener">'+
           '<span>'+x[0]+'</span><span class="mest">'+x[1]+'</span></a>'+
           '<span class="p">·</span>';
      });
    return h;
  }
  var uno=document.getElementById('nastroUno'),due=document.getElementById('nastroDue');
  if(uno&&due&&ARTISTI.length){
    var meta=Math.ceil(ARTISTI.length/2);
    uno.innerHTML=nastro(ARTISTI.slice(0,meta));
    due.innerHTML=nastro(ARTISTI.slice(meta).concat(ARTISTI.slice(0,1)));
  }
})();
