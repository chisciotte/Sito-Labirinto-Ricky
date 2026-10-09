/* =========================================================================
   Il videoritratto si carica solo su richiesta.

   Finche' nessuno preme, in pagina non c'e' nulla di YouTube: nessuna
   richiesta parte, nessun dato lascia il sito. Premendo, al posto del
   riquadro compare il lettore, servito da youtube-nocookie.com, che e'
   l'indirizzo che YouTube tiene apposta per non installare nulla prima
   che si guardi davvero.
   ========================================================================= */
(function(){
  "use strict";
  var schermo = document.getElementById('schermo'),
      bottone = document.getElementById('accendi');
  if(!schermo || !bottone) return;

  var codice = schermo.dataset.video || '';
  if(!codice){
    bottone.disabled = true;               /* niente video: niente pulsante */
    bottone.style.display = 'none';
    return;
  }

  bottone.addEventListener('click', function(){
    var lettore = document.createElement('iframe');
    lettore.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(codice) +
                  '?autoplay=1&rel=0';
    lettore.title = 'Un videoritratto di Ricky Farina';
    lettore.allow = 'accelerometer; autoplay; encrypted-media; picture-in-picture';
    lettore.setAttribute('allowfullscreen', '');
    lettore.referrerPolicy = 'strict-origin-when-cross-origin';
    schermo.innerHTML = '';
    schermo.appendChild(lettore);
  });
})();
