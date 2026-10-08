(function(){
  "use strict";
  /* Preferenze ricordate dal browser di chi visita. Al primo accesso non c'e'
     niente di salvato e valgono i predefiniti: suono acceso, Chisciotte che
     segue il mouse. Si scrive qualcosa solo quando la persona cambia scelta. */
  function leggi(k){try{return localStorage.getItem(k);}catch(e){return null;}}
  function scrivi(k,v){try{localStorage.setItem(k,v);}catch(e){}}
  var segue = leggi('rf-segue')!=='0';

  var COLORI={produzione:"#C0503A",collaborazioni:"#D8A22A",
              aforismi:"#5F9E7D",articoli:"#6E9BC4",chisono:"#A07CC4"};

  /* I NOVE INEDITI – uno per simbolo, nell'ordine di BESTIARIO.
     0 occhio · 1 orecchio · 2 bocca · 3 vortice · 4 nota
     5 panda · 6 divano · 7 piramide · 8 onde
     Ogni mese Ricky ne scrive nove nuovi e si sostituiscono qui dentro;
     i precedenti passano nella raccolta della sezione Aforismi. */
  var INEDITI=[
    "Aforisma 1","Aforisma 2","Aforisma 3","Aforisma 4","Aforisma 5",
    "Aforisma 6","Aforisma 7","Aforisma 8","Aforisma 9"
  ];
  var trovati={};

  var elTesto=document.getElementById('testo');
  var INVITO='Nove simboli nascosti.<br>Nove aforismi inediti.';

  /* il cambio del testo al centro: dissolvenza, alone, fioritura */
  function scambiaTesto(html){
    elTesto.classList.remove('pulsa');   /* il primo aforisma spegne il lampeggio */
    var alone=document.getElementById('alone');
    elTesto.classList.remove('fiorisce');alone.classList.remove('acceso');
    void alone.offsetWidth;
    elTesto.classList.add('scambio');alone.classList.add('acceso');
    setTimeout(function(){
      elTesto.innerHTML=html;
      elTesto.classList.remove('scambio');
      elTesto.classList.add('fiorisce');
    },300);
  }
  function mostraInedito(g){
    scambiaTesto(INEDITI[g]+'<span class="chi">\u2014 Ricky</span>');
  }
  /* all'apertura il centro non mostra un aforisma ma l'invito al gioco:
     sara' il primo simbolo toccato a sostituirlo con uno dei nove */
  elTesto.innerHTML=INVITO;
  elTesto.classList.add('pulsa');


  var BESTIARIO=[
    /* occhio */
    '<path d="M -10,0 C -6,-6.5 6,-6.5 10,0 C 6,6.5 -6,6.5 -10,0 Z"/><circle cx="0" cy="0" r="3.4"/>',
    /* orecchio */
    '<path d="M 5,-9 C -3,-11 -9,-4 -7,4 C -6,8.4 -2,10.4 2,9.2"/>'+
      '<path d="M 2.4,-4 C -3,-5.2 -5.2,0.2 -3,3.2 C -2,4.7 0,4.7 1.2,3.4"/>',
    /* bocca */
    '<path d="M -10,0 C -6,-5.6 -2,-2.6 0,-2.6 C 2,-2.6 6,-5.6 10,0 C 6,5.6 -6,5.6 -10,0 Z"/><path d="M -10,0 L 10,0"/>',
    /* vortice patafisico */
    '<path class="sottile" d="M -0.00,0.00 L -0.10,0.02 L -0.18,0.09 L -0.23,0.20 L -0.24,0.33 L -0.19,0.47 L -0.10,0.60 L 0.06,0.71 L 0.25,0.77 L 0.48,0.78 L 0.72,0.72 L 0.95,0.58 L 1.16,0.38 L 1.31,0.10 L 1.40,-0.22 L 1.40,-0.58 L 1.31,-0.95 L 1.12,-1.31 L 0.83,-1.62 L 0.45,-1.87 L 0.00,-2.03 L -0.50,-2.07 L -1.01,-1.98 L -1.51,-1.77 L -1.97,-1.43 L -2.34,-0.97 L -2.60,-0.41 L -2.73,0.21 L -2.70,0.88 L -2.50,1.53 L -2.15,2.15 L -1.64,2.68 L -1.00,3.08 L -0.26,3.33 L 0.54,3.40 L 1.36,3.27 L 2.14,2.95 L 2.85,2.43 L 3.43,1.75 L 3.84,0.92 L 4.05,0.00 L 4.04,-0.97 L 3.79,-1.93 L 3.31,-2.83 L 2.62,-3.60 L 1.74,-4.21 L 0.73,-4.60 L -0.37,-4.74 L -1.50,-4.62 L -2.59,-4.23 L -3.58,-3.58 L -4.40,-2.70 L -5.01,-1.63 L -5.35,-0.42 L -5.40,0.86 L -5.14,2.13 L -4.59,3.33 L -3.75,4.39 L -2.67,5.23 L -1.39,5.81 L -0.00,6.08 L 1.44,6.01 L 2.85,5.59 L 4.14,4.85 L 5.24,3.81 L 6.08,2.52 L 6.60,1.05 L 6.76,-0.53 L 6.55,-2.13 L 5.96,-3.65 L 5.01,-5.01 L 3.76,-6.13 L 2.25,-6.93 L 0.58,-7.37 L -1.17,-7.40 L -2.91,-7.02 L -4.52,-6.23 L -5.93,-5.06 L -7.04,-3.59 L -7.78,-1.87 L -8.10,-0.00 L -7.97,1.91 L -7.40,3.77 L -6.39,5.46 L -5.00,6.88 L -3.29,7.95 L -1.36,8.60 L 0.69,8.78 L 2.75,8.47 L 4.71,7.68 L 6.44,6.44 L 7.86,4.81 L 8.86,2.88 L 9.39,0.74 L 9.40,-1.49 L 8.89,-3.68 L 7.86,-5.71"/>',
    /* nota musicale */
    '<path d="M 3,6 L 3,-9 C 7.2,-7.6 9.6,-5 8.6,-1.8"/>'+
      '<ellipse class="pieno" cx="-1.4" cy="6.4" rx="4.6" ry="3.4" transform="rotate(-18 -1.4 6.4)"/>',
    /* panda */
    '<circle cx="0" cy="-3" r="6.2"/><circle class="pieno" cx="-4.8" cy="-7.8" r="2.4"/>'+
      '<circle class="pieno" cx="4.8" cy="-7.8" r="2.4"/>'+
      '<ellipse class="pieno" cx="-2.6" cy="-3.6" rx="1.7" ry="2.1"/>'+
      '<ellipse class="pieno" cx="2.6" cy="-3.6" rx="1.7" ry="2.1"/>'+
      '<path class="pieno" d="M -1.4,0 L 1.4,0 L 0,1.6 Z"/>'+
      '<path d="M -6.5,3.5 C -8,10 8,10 6.5,3.5"/>'+
      '<path d="M -4.5,9.5 L -4.5,11.5"/><path d="M 4.5,9.5 L 4.5,11.5"/>',
    /* divano */
    '<path d="M -13,-2.5 C -13,-6.2 -9.6,-6.2 -9.6,-2.5 L -9.6,-6.6 C -9.6,-9.2 9.6,-9.2 9.6,-6.6 '+
      'L 9.6,-2.5 C 9.6,-6.2 13,-6.2 13,-2.5 L 13,4 L -13,4 Z"/>'+
      '<path d="M -9.6,-2.5 L 9.6,-2.5"/><path d="M -10,4 L -10,7.4"/><path d="M 10,4 L 10,7.4"/>',
    /* piramide */
    '<path d="M 0,-9.5 L 11,7 L -11,7 Z"/><path d="M 0,-9.5 L -2.6,7"/>',
    /* onde del mare */
    '<path d="M -11,-5.5 C -7.5,-9.5 -4,-1.5 -0.5,-5.5 C 3,-9.5 6.5,-1.5 10,-5.5"/>'+
      '<path d="M -11,0.5 C -7.5,-3.5 -4,4.5 -0.5,0.5 C 3,-3.5 6.5,4.5 10,0.5"/>'+
      '<path d="M -11,6.5 C -7.5,2.5 -4,10.5 -0.5,6.5 C 3,2.5 6.5,10.5 10,6.5"/>'
  ];
  function seme(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

  var CELL=44,COLS,ROWS,W,H,celle,stanze,verticale=false,ciechi=[];
  var MX=14,MY=14;   /* cielo intorno al labirinto, uguale sui quattro lati:
                        14 unita' bastano alla punta della lancia */
  var svg=document.getElementById('maze'),gMuri=document.getElementById('muri'),
      gOgg=document.getElementById('oggetti'),
      scia=document.getElementById('tracciaScia'),cav=document.getElementById('cavaliere'),
      corpo=document.getElementById('corpoCav'),campo=document.getElementById('campo');
  var zampe=[document.getElementById('z1'),document.getElementById('z2'),
             document.getElementById('z3'),document.getElementById('z4')];
  var lancia=document.getElementById('lancia'),caricaDa=-1e9;
  var PERNO=[0.7,-21.2],ARCO=112,DURATA=520;
  function carica(){caricaDa=performance.now();}
  var PIVOT=[[-8.5,-1],[-2.2,0],[6.6,0],[12.2,-2]],SFAS=[0,Math.PI,Math.PI/2,Math.PI*1.5];

  var ORIZZ={cols:22,rows:13,partenza:[9,7],
    /* passaggi aperti a mano: destra di Articoli, destra del mulino */
    porte:[[20,10,1],[13,6,1],[21,10,0],[15,9,1]],
    oggetti:[[21,12,2],[0,0,5],[13,4,7],[8,10,4],[0,9,8],[8,0,6],[21,4,0],[17,8,1],[5,4,3]],
    stanze:{
      produzione:[1,1,6,2],collaborazioni:[15,1,19,3],   /* una riga piu' alta: il sottotitolo e' lungo */
      aforismi:[1,10,5,11],articoli:[15,10,19,11],
      chisono:[9,10,12,11],centro:[9,5,12,7],cieco:[9,1,13,2]}};
  var VERT={cols:11,rows:17,partenza:[4,10],
    porte:[[6,4,0]],          /* il varco sotto le due stanze in alto */
    muretti:[[6,4,3]],        /* e il muretto verticale che lo affianca */
    oggetti:[[10,16,2],[0,1,5],[10,4,7],[2,10,4],[4,4,8],[8,0,6],[9,8,0],[0,6,1],[2,15,3]],
    stanze:{
      produzione:[1,1,5,3],collaborazioni:[6,1,9,3],     /* idem sul telefono */
      cieco:[2,5,8,6],centro:[4,8,7,10],
      aforismi:[1,12,5,13],articoli:[6,12,9,13],
      chisono:[3,15,7,16]}};

  /* schermo piu' alto che largo -> pianta del telefono. Cosi' ruotando il
     telefono si passa davvero all'altra pianta invece di restare tagliati. */
  function formaVerticale(){
    return window.innerHeight > window.innerWidth*1.02;
  }

  function costruisci(){
    verticale=formaVerticale();
    var L=verticale?VERT:ORIZZ;
    COLS=L.cols;ROWS=L.rows;stanze=L.stanze;W=COLS*CELL;H=ROWS*CELL;
    svg.setAttribute('viewBox',(-MX)+' '+(-MY)+' '+(W+2*MX)+' '+(H+2*MY));
    campo.style.aspectRatio=(W+2*MX)+'/'+(H+2*MY);

    celle=[];
    for(var r=0;r<ROWS;r++){celle[r]=[];for(var c=0;c<COLS;c++)celle[r][c]={m:[1,1,1,1],v:0};}

    var rnd=seme(20690402),pila=[[0,0]];celle[0][0].v=1;
    while(pila.length){
      var cu=pila[pila.length-1],cd=[];
      if(cu[1]>0&&!celle[cu[1]-1][cu[0]].v)cd.push([cu[0],cu[1]-1,0,2]);
      if(cu[0]<COLS-1&&!celle[cu[1]][cu[0]+1].v)cd.push([cu[0]+1,cu[1],1,3]);
      if(cu[1]<ROWS-1&&!celle[cu[1]+1][cu[0]].v)cd.push([cu[0],cu[1]+1,2,0]);
      if(cu[0]>0&&!celle[cu[1]][cu[0]-1].v)cd.push([cu[0]-1,cu[1],3,1]);
      if(!cd.length){pila.pop();continue;}
      var n=cd[Math.floor(rnd()*cd.length)];
      celle[cu[1]][cu[0]].m[n[2]]=0;celle[n[1]][n[0]].m[n[3]]=0;
      celle[n[1]][n[0]].v=1;pila.push([n[0],n[1]]);
    }

    for(var k in stanze){
      var q=stanze[k];
      for(var rr=q[1];rr<=q[3];rr++)for(var cc=q[0];cc<=q[2];cc++){
        if(cc<q[2]){celle[rr][cc].m[1]=0;celle[rr][cc+1].m[3]=0;}
        if(rr<q[3]){celle[rr][cc].m[2]=0;celle[rr+1][cc].m[0]=0;}
      }
    }

    /* le stanze delle sezioni hanno un perimetro vero: prima lo chiudo tutto,
       poi ci apro tre porte. Il centro e il vicolo cieco restano radure. */
    function muro(c,r,lato,chiuso){
      var op=[2,3,0,1],dc=[0,1,0,-1],dr=[-1,0,1,0];
      celle[r][c].m[lato]=chiuso?1:0;
      var c2=c+dc[lato],r2=r+dr[lato];
      if(c2>=0&&c2<COLS&&r2>=0&&r2<ROWS)celle[r2][c2].m[op[lato]]=chiuso?1:0;
    }
    for(var ks in stanze){
      if(ks==='centro'||ks==='cieco')continue;
      var q2=stanze[ks],giro=[];
      for(var c3=q2[0];c3<=q2[2];c3++){ muro(c3,q2[1],0,1); if(q2[1]>0)giro.push([c3,q2[1],0]); }
      for(var r3=q2[1];r3<=q2[3];r3++){ muro(q2[2],r3,1,1); if(q2[2]<COLS-1)giro.push([q2[2],r3,1]); }
      for(var c4=q2[2];c4>=q2[0];c4--){ muro(c4,q2[3],2,1); if(q2[3]<ROWS-1)giro.push([c4,q2[3],2]); }
      for(var r4=q2[3];r4>=q2[1];r4--){ muro(q2[0],r4,3,1); if(q2[0]>0)giro.push([q2[0],r4,3]); }
      [.16,.5,.83].forEach(function(f){
        var p=giro[Math.floor(giro.length*f)];
        if(p)muro(p[0],p[1],p[2],0);
      });
    }

    if(L.porte)L.porte.forEach(function(p){muro(p[0],p[1],p[2],0);});

    /* chiudendo i perimetri qualche zona puo' restare isolata: la ricollego */
    (function ripara(){
      for(var giri=0;giri<200;giri++){
        var visto=[],coda=[[0,0]],quanti=1;
        for(var a=0;a<ROWS;a++){visto[a]=[];for(var b2=0;b2<COLS;b2++)visto[a][b2]=0;}
        visto[0][0]=1;
        while(coda.length){
          var cu2=coda.pop();
          vicini(cu2[0],cu2[1]).forEach(function(n){
            if(!visto[n[1]][n[0]]){visto[n[1]][n[0]]=1;quanti++;coda.push(n);}
          });
        }
        if(quanti===COLS*ROWS)return;
        var fatto=false;
        for(var rr2=0;rr2<ROWS&&!fatto;rr2++)for(var cc2=0;cc2<COLS&&!fatto;cc2++){
          if(visto[rr2][cc2])continue;
          var lati=[[0,cc2,rr2-1],[1,cc2+1,rr2],[2,cc2,rr2+1],[3,cc2-1,rr2]];
          for(var li=0;li<4;li++){
            var L2=lati[li];
            if(L2[1]<0||L2[1]>=COLS||L2[2]<0||L2[2]>=ROWS)continue;
            if(visto[L2[2]][L2[1]]){muro(cc2,rr2,L2[0],0);fatto=true;break;}
          }
        }
        if(!fatto)return;
      }
    })();

    /* muretti aggiunti a mano DOPO la riparazione: chiudono un passaggio
       invece di aprirlo. Vanno messi qui perche' la riparazione, girando
       prima, li riaprirebbe se li credesse necessari. */
    if(L.muretti)L.muretti.forEach(function(p){muro(p[0],p[1],p[2],1);});

    /* quali segmenti delimitano quale stanza: chiave 'h,col,riga' oppure 'v,col,riga' */
    var bordo={};
    for(var kb in stanze){
      if(kb==='centro'||kb==='cieco')continue;
      var q=stanze[kb];
      for(var cb=q[0];cb<=q[2];cb++){bordo['h,'+cb+','+q[1]]=kb;bordo['h,'+cb+','+(q[3]+1)]=kb;}
      for(var rb=q[1];rb<=q[3];rb++){bordo['v,'+q[0]+','+rb]=kb;bordo['v,'+(q[2]+1)+','+rb]=kb;}
    }

    var out=[],cx=COLS/2,cy=ROWS/2,maxd=Math.sqrt(cx*cx+cy*cy);
    function j(){return (Math.random()-.5)*1.6;}
    function riga(x1,y1,x2,y2,d,chiave){
      var a=(x1+j()).toFixed(1),b2=(y1+j()).toFixed(1),
          c4=(x2+j()).toFixed(1),d4=(y2+j()).toFixed(1);
      var st=bordo[chiave];
      out.push('<line class="muro"'+(st?' data-stanza="'+st+'"':'')+
               ' x1="'+a+'" y1="'+b2+'" x2="'+c4+'" y2="'+d4+
               '" style="animation-delay:'+d.toFixed(2)+'s"/>');
    }
    for(var r2=0;r2<ROWS;r2++)for(var c2=0;c2<COLS;c2++){
      var d=Math.sqrt(Math.pow(c2-cx,2)+Math.pow(r2-cy,2))/maxd*.8,x=c2*CELL,y=r2*CELL;
      if(celle[r2][c2].m[0])riga(x,y,x+CELL,y,d,'h,'+c2+','+r2);
      if(celle[r2][c2].m[3])riga(x,y,x,y+CELL,d,'v,'+c2+','+r2);
      if(c2===COLS-1&&celle[r2][c2].m[1])riga(x+CELL,y,x+CELL,y+CELL,d,'v,'+(c2+1)+','+r2);
      if(r2===ROWS-1&&celle[r2][c2].m[2])riga(x,y+CELL,x+CELL,y+CELL,d,'h,'+c2+','+(r2+1));
    }
    gMuri.innerHTML=out.join('');

    muriStanza={};
    for(var k2 in COLORI)
      muriStanza[k2]=gMuri.querySelectorAll('line[data-stanza="'+k2+'"]');

    ciechi=[];
    /* disposizione congelata: non va piu' ricalcolata.
       ogni voce e' [colonna, riga, indice dell'oggetto in BESTIARIO] */
    var og=[];
    L.oggetti.forEach(function(v,i){
      ciechi.push({c:v[0],r:v[1]});
      og.push('<g data-ogg="'+i+'" data-glifo="'+v[2]+'" transform="translate('+
        ((v[0]+.5)*CELL)+','+((v[1]+.5)*CELL)+') scale(.8)">'+BESTIARIO[v[2]]+'</g>');
    });
    gOgg.innerHTML=og.join('');

    function collo(el,q){
      var TW=W+2*MX,TH=H+2*MY;
      el.style.left=((q[0]*CELL+MX)/TW*100)+'%';el.style.top=((q[1]*CELL+MY)/TH*100)+'%';
      el.style.width=((q[2]-q[0]+1)*CELL/TW*100)+'%';el.style.height=((q[3]-q[1]+1)*CELL/TH*100)+'%';
    }
    document.querySelectorAll('.stanza').forEach(function(el){
      collo(el,stanze[el.dataset.stanza]);
      el.style.setProperty('--colore',COLORI[el.dataset.stanza]);
    });
    if(stanze.centro)collo(document.getElementById('centro'),stanze.centro);
    collo(document.getElementById('cieco'),stanze.cieco);
    collo(document.getElementById('alone'),stanze.cieco);

    dimensiona();
    var part=L.partenza;
    pos={x:(part[0]+.5)*CELL,y:(part[1]+.5)*CELL};
    percorso=[];punti=[];obiettivo=null;
    scalaCav=(CELL*.95)/70;
  }

  /* il campo non deve mai sforare lo schermo: lo dimensiono io */
  function dimensiona(){
    var zona=campo.parentElement,st=getComputedStyle(zona);
    var padX=parseFloat(st.paddingLeft)+parseFloat(st.paddingRight),
        padY=parseFloat(st.paddingTop)+parseFloat(st.paddingBottom);
    var testa=document.querySelector('.testata'),piede=document.querySelector('.piede');
    /* due misure: quella della zona e quella dedotta dalla finestra.
       prendo la piu' piccola, cosi' non puo' mai sforare */
    var dispW=Math.min(zona.clientWidth,document.documentElement.clientWidth)-padX;
    var dispH=Math.min(
      zona.clientHeight,
      window.innerHeight-(testa?testa.offsetHeight:0)-(piede?piede.offsetHeight:0)
    )-padY;
    var prop=(W+2*MX)/(H+2*MY);
    var larg=Math.min(1400,dispW,dispH>40?dispH*prop:1e9);
    campo.style.width=Math.max(220,Math.floor(larg))+'px';
    /* pubblico la misura di una cella: cosi' il testo delle stanze puo'
       crescere e calare insieme al labirinto invece che con la finestra */
    campo.style.setProperty('--cella',(larg/(COLS+2*MX/CELL))+'px');
  }

  function vicini(c,r){
    var o=[],m=celle[r][c].m;
    if(!m[0]&&r>0)o.push([c,r-1]);
    if(!m[1]&&c<COLS-1)o.push([c+1,r]);
    if(!m[2]&&r<ROWS-1)o.push([c,r+1]);
    if(!m[3]&&c>0)o.push([c-1,r]);
    return o;
  }
  function rotta(da,a){
    if(da[0]===a[0]&&da[1]===a[1])return[];
    var prev={},coda=[da],visto={};visto[da[0]+','+da[1]]=1;
    while(coda.length){
      var cur=coda.shift();
      if(cur[0]===a[0]&&cur[1]===a[1]){
        var p=[],k=cur[0]+','+cur[1];
        while(k){p.unshift(k.split(',').map(Number));k=prev[k];}
        p.shift();return p;
      }
      vicini(cur[0],cur[1]).forEach(function(n){
        var k2=n[0]+','+n[1];
        if(!visto[k2]){visto[k2]=1;prev[k2]=cur[0]+','+cur[1];coda.push(n);}
      });
    }
    return [];
  }

  var pos={x:22,y:22},percorso=[],punti=[],obiettivo=null,ultimo=0,VELOCITA=210,
      fase=0,scalaCav=.78;

  function cellaDi(p){return [Math.floor(p.x/CELL),Math.floor(p.y/CELL)];}
  function puntaA(c,r){
    c=Math.max(0,Math.min(COLS-1,c));r=Math.max(0,Math.min(ROWS-1,r));
    /* sul telefono non ci si ferma in mezzo a una sezione: qualunque punto
       dentro una stanza rimanda al suo angolo. Attraversarla resta libero,
       perche' li' la meta' e' altrove. */
    if(verticale){
      var k=dentroStanza([c,r]);
      if(k&&COLORI[k]){var s=stanze[k];c=s[0];r=s[1];}
    }
    if(obiettivo&&obiettivo[0]===c&&obiettivo[1]===r)return;
    obiettivo=[c,r];percorso=rotta(cellaDi(pos),[c,r]);
  }
  /* dove si ferma dentro una stanza: solo nelle due colonne laterali, mai al
     centro dove sta la scritta, e a parita' di distanza preferisce gli angoli.
     Attraversare una stanza per andare altrove resta libero. */
  function soglia(nome){
    var s=stanze[nome];
    /* sul telefono sempre lo stesso angolo, in alto a sinistra: cosi' e'
       prevedibile e la scritta gli lascia posto per costruzione */
    if(verticale)return [s[0],s[1]];
    var qui=cellaDi(pos),best=null,bd=1e9;
    for(var r=s[1];r<=s[3];r++)for(var c=s[0];c<=s[2];c++){
      if(c!==s[0]&&c!==s[2])continue;
      var d=Math.abs(c-qui[0])+Math.abs(r-qui[1]);
      if(r===s[1]||r===s[3])d-=.4;        /* un filo di preferenza per gli angoli */
      if(d<bd){bd=d;best=[c,r];}
    }
    return best||[s[0],s[1]];
  }

  function cellaSotto(e){
    var b=svg.getBoundingClientRect();
    var ux=(e.clientX-b.left)/b.width*(W+2*MX)-MX,
        uy=(e.clientY-b.top)/b.height*(H+2*MY)-MY;
    return [Math.floor(ux/CELL),Math.floor(uy/CELL)];
  }
  /* al ritorno su una scheda il browser rimanda un pointermove con le ultime
     coordinate note, anche se il mouse non e' sulla pagina: va ignorato */
  var ultimoX=null,ultimoY=null,rientrato=false,tornato=0;
  /* per 800 ms dopo il rientro nessun evento comanda nulla: il browser ne
     rispedisce diversi da solo (pointermove, mouseenter, focus) */
  function appenaTornato(){return performance.now()-tornato<800;}
  function sospendi(){
    percorso=[];obiettivo=null;punti=[];rientrato=true;
    /* e soprattutto: tolgo il fuoco all'ultima sezione cliccata, altrimenti
       il browser glielo restituisce al rientro e lei richiama Chisciotte */
    var a=document.activeElement;
    if(a&&a.classList&&a.classList.contains('stanza'))a.blur();
  }
  document.addEventListener('visibilitychange',function(){
    if(document.hidden)sospendi();
    else{rientrato=true;tornato=performance.now();}
  });
  window.addEventListener('blur',sospendi);
  window.addEventListener('focus',function(){rientrato=true;tornato=performance.now();});
  function muoviVerso(e){
    if(!segue)return;   /* 'solo click': il puntatore non lo trascina */
    if(document.hidden||appenaTornato()){ultimoX=e.clientX;ultimoY=e.clientY;return;}
    /* al rientro il browser rispedisce un pointermove con le ultime coordinate:
       il primo movimento serve solo a ristabilire dov'e' il puntatore */
    if(rientrato){
      rientrato=false;ultimoX=e.clientX;ultimoY=e.clientY;return;
    }
    if(e.clientX===ultimoX&&e.clientY===ultimoY)return;
    ultimoX=e.clientX;ultimoY=e.clientY;
    var c=cellaSotto(e);
    if(c[0]<0||c[0]>=COLS||c[1]<0||c[1]>=ROWS)return;
    puntaA(c[0],c[1]);
  }
  svg.addEventListener('pointermove',muoviVerso);
  function dentroCampo(c){return c[0]>=0&&c[0]<COLS&&c[1]>=0&&c[1]<ROWS;}
  svg.addEventListener('pointerdown',function(e){
    sveglia();
    var c=cellaSotto(e);
    if(!dentroCampo(c))return;
    ultimoX=e.clientX;ultimoY=e.clientY;puntaA(c[0],c[1]);
  });

  document.querySelectorAll('.stanza').forEach(function(el){
    function avvicina(){
      if(document.hidden||appenaTornato())return;
      sveglia();var s=soglia(el.dataset.stanza);puntaA(s[0],s[1]);
    }
    el.addEventListener('mouseenter',function(){if(segue)avvicina();});
    el.addEventListener('focus',avvicina);
    el.addEventListener('click',function(ev){
      sveglia();
      var k=el.dataset.stanza;
      /* Due tempi. Se Chisciotte non e' ancora nella stanza, il primo clic lo
         porta li' e basta: la stanza si accende e compare "entra". Il clic
         successivo apre. Se invece e' gia' dentro – perche' ce l'hai condotto
         tu – il clic apre subito, senza passaggi in piu'.
         Da tastiera si entra sempre al primo Invio: un clic prodotto dalla
         tastiera ha detail 0, e li' un secondo passaggio sarebbe una trappola. */
      if(ev.detail===0||attiva===k)return;
      ev.preventDefault();
      var s=soglia(k);
      pos={x:(s[0]+.5)*CELL,y:(s[1]+.5)*CELL};
      percorso=[];punti=[];obiettivo=s;aggiornaStanza();
    });
  });

  function dentroStanza(cel){
    for(var k in stanze){
      if(k==='centro')continue;
      var s=stanze[k];
      if(cel[0]>=s[0]&&cel[0]<=s[2]&&cel[1]>=s[1]&&cel[1]<=s[3])return k;
    }
    return null;
  }

  var pale=document.querySelector('.mulino .pale');
  var angoloPale=0,velPale=360/11,mulinoVeloce=false,oggNuovo=false;
  var VENTO_CALMO=360/11,VENTO_FORTE=360/2.4;
  function aggiornaMulino(){
    /* il mulino prende vento per una scoperta, non per un passaggio:
       un simbolo gia' verde non lo rimette in moto. Le stanze si', ogni
       volta, perche' toccarle non significa esserci gia' entrati. */
    mulinoVeloce = oggNuovo || !!(attiva&&COLORI[attiva]);
  }
  function giraMulino(dt){
    if(!pale)return;
    var meta=mulinoVeloce?VENTO_FORTE:VENTO_CALMO;
    /* prende vento in fretta, si spegne piano: tau diverso nei due versi */
    var tau=meta>velPale?.35:1.9;
    velPale+=(meta-velPale)*(1-Math.exp(-dt/tau));
    angoloPale=(angoloPale+velPale*dt)%360;
    pale.setAttribute('transform','rotate('+angoloPale.toFixed(2)+',50,40)');
  }
  var muriStanza={};
  function accendi(k,on){
    var col=COLORI[k];if(!muriStanza[k])return;
    /* sul telefono le stanze sono piccole e il testo arriva vicino ai muri:
       l'alone va tenuto piu' stretto, altrimenti lava sopra le lettere */
    var largo=verticale?5:10,stretto=verticale?2:3;
    Array.prototype.forEach.call(muriStanza[k],function(l){
      if(on){
        l.style.stroke=col;l.style.strokeWidth=verticale?'2.4':'2.9';
        l.style.filter='drop-shadow(0 0 '+stretto+'px '+col+') drop-shadow(0 0 '+largo+'px '+col+')';
      }else{l.style.stroke='';l.style.strokeWidth='';l.style.filter='';}
    });
  }
  var attiva=null;

  /* ---------- movimento: mouse e click, oppure solo click ---------- */
  var bSegui=document.getElementById('segui');
  function mostraSegui(){
    if(!bSegui)return;
    bSegui.setAttribute('aria-pressed',segue?'true':'false');
    bSegui.setAttribute('aria-label',segue?'Chisciotte segue il mouse':'Chisciotte si muove solo col click');
    var st=bSegui.querySelector('.stato'); if(st)st.textContent=segue?'mouse e click':'solo click';
  }
  if(bSegui){
    mostraSegui();
    bSegui.addEventListener('click',function(){
      segue=!segue;scrivi('rf-segue',segue?'1':'0');
      percorso=[];obiettivo=null;mostraSegui();
    });
  }

  /* ---------- le frecce: sempre attive ----------
     Un passo per pressione, tenendo premuto cammina; Invio apre la stanza in
     cui Chisciotte si trova. */
  document.addEventListener('keydown',function(e){
    var dir={'ArrowUp':0,'ArrowRight':1,'ArrowDown':2,'ArrowLeft':3}[e.key];
    if(dir===undefined){
      if(e.key==='Enter'&&attiva&&COLORI[attiva]&&document.activeElement===document.body){
        var a=document.querySelector('.stanza[data-stanza="'+attiva+'"]');
        if(a)a.click();
      }
      return;
    }
    if(e.target&&e.target.closest&&e.target.closest('button'))return;
    e.preventDefault();sveglia();
    var q=cellaDi(pos);
    if(celle[q[1]][q[0]].m[dir])return;
    var dc=[0,1,0,-1],dr=[-1,0,1,0];
    puntaA(q[0]+dc[dir],q[1]+dr[dir]);
  });
  function aggiornaStanza(){
    var k=dentroStanza(cellaDi(pos));
    if(k===attiva)return;
    attiva=k;
    document.querySelectorAll('.stanza').forEach(function(el){
      el.classList.toggle('attiva',el.dataset.stanza===k);});
    for(var kk in muriStanza)accendi(kk,kk===k);
    cav.style.color=(k&&COLORI[k])?COLORI[k]:'';
    aggiornaMulino();
    if(k&&COLORI[k]){scatto();carica();}
  }

  var oggAttivo=null;
  function aggiornaOggetti(){
    var q=cellaDi(pos),sopra=null;
    gOgg.querySelectorAll('g').forEach(function(el,i){
      var o=ciechi[i];if(!o)return;
      var d=Math.abs(o.c-q[0])+Math.abs(o.r-q[1]),
          preso=!!trovati[el.dataset.glifo];
      if(d===0)sopra=i;
      /* un simbolo gia' trovato non pulsa piu' e resta verde: e' spento */
      el.classList.toggle('vicino',!preso&&d>0&&d<=3);
      el.classList.toggle('sopra',!preso&&d===0);
    });
    if(sopra!==oggAttivo){
      oggAttivo=sopra;
      oggNuovo=false;
      if(sopra!==null){
        var el=gOgg.querySelectorAll('g')[sopra],g=+el.dataset.glifo;
        if(!trovati[g]){
          trovati[g]=true;oggNuovo=true;
          el.classList.add('trovato');
          carica();voce(g);mostraInedito(g);
        }
      }
      aggiornaMulino();
    }
  }

  /* ---------- suono ---------- */
  var ctx=null,uscita=null,acceso=leggi('rf-suono')!=='0',ultimoZoccolo=0;
  var bottone=document.getElementById('audio');
  function mostraSuono(){
    if(!bottone)return;
    bottone.setAttribute('aria-pressed',acceso?'true':'false');
    bottone.setAttribute('aria-label',acceso?'Suono acceso':'Suono spento');
    var st=bottone.querySelector('.stato'); if(st)st.textContent=acceso?'on':'off';
  }
  mostraSuono();
  if(bottone)bottone.addEventListener('click',function(){
    acceso=!acceso;scrivi('rf-suono',acceso?'1':'0');mostraSuono();
    if(acceso)sveglia();
  });
  function sveglia(){
    if(!acceso)return;
    if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}}
    if(!uscita){
      uscita=ctx.createGain();
      /* telefoni e tablet hanno altoparlanti molto piu' deboli */
      var tocco=window.matchMedia&&window.matchMedia('(pointer:coarse)').matches;
      uscita.gain.value=tocco?2.8:1;
      uscita.connect(ctx.destination);
    }
    if(ctx.state==='suspended')ctx.resume();
  }
  /* muovere il mouse non conta come interazione per il browser: solo un clic,
     un tasto o un tocco sbloccano l'audio. Li ascolto tutti, sull'intera pagina. */
  ['pointerdown','keydown','touchend','click'].forEach(function(ev){
    document.addEventListener(ev,sveglia,{passive:true});
  });
  document.addEventListener('visibilitychange',function(){if(!document.hidden)sveglia();});
  function zoccolo(){
    if(!acceso||!ctx||ctx.state!=='running')return;
    var t=ctx.currentTime;
    /* trotto: due colpi ravvicinati per ogni passo. Il tonfo grave per le casse,
       un colpetto a 1500 hertz perche' si senta anche sugli altoparlanti piccoli. */
    [0,.075].forEach(function(rit,i){
      var vol=i?.042:.058;
      var o=ctx.createOscillator(),g=ctx.createGain(),t0=t+rit;
      o.type='sine';o.frequency.setValueAtTime(185,t0);
      o.frequency.exponentialRampToValueAtTime(72,t0+.08);
      g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+.08);
      o.connect(g);g.connect(uscita);o.start(t0);o.stop(t0+.11);

      var n=Math.floor(ctx.sampleRate*.014),bf=ctx.createBuffer(1,n,ctx.sampleRate),
          d=bf.getChannelData(0);
      for(var k=0;k<n;k++)d[k]=(Math.random()*2-1)*Math.pow(1-k/n,4);
      var s=ctx.createBufferSource();s.buffer=bf;
      var fl=ctx.createBiquadFilter();fl.type='bandpass';fl.frequency.value=1500;fl.Q.value=1.3;
      var g2=ctx.createGain();g2.gain.value=i?.022:.032;
      s.connect(fl);fl.connect(g2);g2.connect(uscita);s.start(t0);
    });
  }

  function scatto(){
    if(!acceso||!ctx||ctx.state!=='running')return;
    var t=ctx.currentTime;
    [0,.055].forEach(function(d,i){
      var b=ctx.createBuffer(1,900,ctx.sampleRate),dt=b.getChannelData(0);
      for(var j=0;j<900;j++)dt[j]=(Math.random()*2-1)*Math.pow(1-j/900,7);
      var s=ctx.createBufferSource();s.buffer=b;
      var f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=1500;f.Q.value=1.1;
      var g=ctx.createGain();g.gain.value=i?.055:.09;
      s.connect(f);f.connect(g);g.connect(uscita);s.start(t+d);
    });
  }

  /* una voce per ogni simbolo: 0 occhio, 1 orecchio, 2 bocca, 3 vortice,
     4 nota, 5 panda, 6 divano, 7 piramide, 8 onde */
  function tono(tipo,f0,f1,dur,vol,ritardo,disaccordo){
    var t0=ctx.currentTime+(ritardo||0);
    var o=ctx.createOscillator(),g=ctx.createGain();
    o.type=tipo;o.frequency.setValueAtTime(f0,t0);
    if(disaccordo)o.detune.setValueAtTime(disaccordo,t0);
    if(f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t0+dur);
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+Math.min(.02,dur/4));
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g);g.connect(uscita);o.start(t0);o.stop(t0+dur+.03);
  }
  function fruscio(dur,f,q,vol,ritardo){
    var t0=ctx.currentTime+(ritardo||0),n=Math.floor(ctx.sampleRate*dur);
    var b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);
    for(var i=0;i<n;i++)d[i]=(Math.random()*2-1);
    var s=ctx.createBufferSource();s.buffer=b;
    var fl=ctx.createBiquadFilter();fl.type='bandpass';fl.frequency.value=f;fl.Q.value=q;
    var g=ctx.createGain();
    g.gain.setValueAtTime(0.0001,t0);
    g.gain.exponentialRampToValueAtTime(vol,t0+dur*.35);
    g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    s.connect(fl);fl.connect(g);g.connect(uscita);s.start(t0);
  }
  var VOCI=[
    /* occhio: doppio ammicco */
    function(){tono('sine',940,900,.05,.045);tono('sine',940,880,.05,.04,.1);},
    /* orecchio: ronzio basso, due voci appena disaccordate */
    function(){tono('sine',176,176,.7,.05);tono('sine',176,176,.68,.03,0,9);},
    /* bocca: una vocale accennata */
    function(){tono('sawtooth',700,700,.28,.022);tono('sawtooth',1150,1150,.26,.014,.01);
               tono('sine',140,140,.3,.03);},
    /* vortice: caduta lunga */
    function(){tono('sine',900,70,.9,.05);},
    /* nota: un la con la sua ottava */
    function(){tono('triangle',440,440,.75,.055);tono('triangle',880,880,.55,.018,.01);},
    /* panda: due colpi di legno */
    function(){tono('square',210,150,.07,.04);tono('square',190,135,.07,.035,.12);},
    /* divano: sprofondare */
    function(){tono('sine',150,52,.34,.06);},
    /* piramide: gong grave */
    function(){tono('sine',196,190,1.7,.05);tono('sine',294,288,1.3,.02,.02);
               tono('sine',110,106,1.9,.03,0);},
    /* onde: risacca in due tempi */
    function(){fruscio(.75,420,.5,.05);fruscio(.6,700,.6,.028,.3);}
  ];

  function voce(i){
    if(!acceso||!ctx||ctx.state!=='running')return;
    if(VOCI[i])VOCI[i]();
  }

  /* ---------- ciclo ---------- */
  function ciclo(t){
    var dt=Math.min((t-ultimo)/1000,.05);ultimo=t;
    var muove=false;
    if(percorso.length){
      muove=true;
      var meta={x:(percorso[0][0]+.5)*CELL,y:(percorso[0][1]+.5)*CELL},
          dx=meta.x-pos.x,dy=meta.y-pos.y,dist=Math.hypot(dx,dy),passo=VELOCITA*dt;
      if(dist<=passo){pos.x=meta.x;pos.y=meta.y;percorso.shift();}
      else{pos.x+=dx/dist*passo;pos.y+=dy/dist*passo;
           if(dx<-.5)cav.dataset.dir='-1';else if(dx>.5)cav.dataset.dir='1';}
      fase+=passo*.115;
      var u=punti[punti.length-1];
      if(!u||Math.hypot(pos.x-u.x,pos.y-u.y)>7)punti.push({x:pos.x,y:pos.y,t:t});
      if(t-ultimoZoccolo>400){ultimoZoccolo=t;zoccolo();}
    }

    while(punti.length&&t-punti[0].t>1700)punti.shift();
    if(punti.length>1){
      var d='M '+punti[0].x.toFixed(1)+' '+punti[0].y.toFixed(1);
      for(var i=1;i<punti.length;i++)d+=' L '+punti[i].x.toFixed(1)+' '+punti[i].y.toFixed(1);
      scia.setAttribute('d',d);
    } else scia.setAttribute('d','');

    /* galoppo */
    for(var z=0;z<4;z++){
      var ang=muove?Math.sin(fase+SFAS[z])*17:0;
      zampe[z].setAttribute('transform','rotate('+ang.toFixed(1)+','+PIVOT[z][0]+','+PIVOT[z][1]+')');
    }
    var tc=(t-caricaDa)/DURATA,ang=0;
    if(tc>=0&&tc<=1){
      var f=tc<.32?(1-Math.pow(1-tc/.32,3)):Math.pow(1-(tc-.32)/.68,2);
      ang=ARCO*f;
    }
    lancia.setAttribute('transform','rotate('+ang.toFixed(1)+','+PERNO[0]+','+PERNO[1]+')');

    var salto=muove?Math.abs(Math.sin(fase))*-1.5:0;
    corpo.setAttribute('transform','translate(0,'+salto.toFixed(2)+') scale('+scalaCav.toFixed(3)+')');

    var dir=cav.dataset.dir==='-1'?-1:1;
    cav.setAttribute('transform','translate('+pos.x.toFixed(1)+','+pos.y.toFixed(1)+') scale('+dir+',1)');
    aggiornaStanza();aggiornaOggetti();giraMulino(dt);
    requestAnimationFrame(ciclo);
  }

  costruisci();
  /* l'intestazione cambia altezza quando il carattere finisce di caricarsi,
     quindi rimisuro appena e' pronto e al primo fotogramma utile */
  requestAnimationFrame(dimensiona);
  window.addEventListener('load',dimensiona);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(dimensiona);
  if(window.ResizeObserver)new ResizeObserver(dimensiona).observe(campo.parentElement);

  requestAnimationFrame(function(t){ultimo=t;ciclo(t);});

  var attesa;
  window.addEventListener('orientationchange',function(){
    setTimeout(function(){
      if(formaVerticale()!==verticale)costruisci();else dimensiona();
    },120);
  });
  window.addEventListener('resize',function(){
    clearTimeout(attesa);
    attesa=setTimeout(function(){
      if(formaVerticale()!==verticale)costruisci();else dimensiona();
    },260);
  });
})();
