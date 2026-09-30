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
  var GIORNI=[
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
  function scritta(g){return g[0]+'<span class="sep">·</span>'+g[1]+'<span class="sep">·</span>'+g[2];}

  var elD=document.getElementById('data'),
      elT=document.getElementById('titolo'),
      elV=document.getElementById('vai'),
      bottone=document.getElementById('pesca');

  if(bottone&&elD){
    bottone.addEventListener('click',function(){
      if(!GIORNI.length)return;
      elD.classList.remove('attesa');
      elV.classList.remove('su');
      elT.textContent='';
      if(carta>=mazzo.length){mazzo=mescola(GIORNI);carta=0;}
      var scelto=mazzo[carta++],giri=0;
      var t=setInterval(function(){
        /* il rullo mostra solo date vere: mai un giorno senza un film */
        elD.innerHTML=scritta(GIORNI[Math.floor(Math.random()*GIORNI.length)]);
        if(++giri>12){
          clearInterval(t);
          elD.innerHTML=scritta(scelto);
          elT.textContent=scelto[3];
          if(scelto[4])elV.href='https://www.youtube.com/watch?v='+scelto[4];
          elV.classList.add('su');
        }
      },55);
    });
  }

  /* ---------------- i due nastri ---------------- */
  function nastro(lista){
    var h='';
    for(var k=0;k<2;k++)                       /* due copie: il giro e' continuo */
      lista.forEach(function(x){
        h+='<a href="'+x[2]+'" target="_blank" rel="noopener">'+
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
