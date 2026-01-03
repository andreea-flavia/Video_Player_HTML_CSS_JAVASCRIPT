
playlist = [
    {title: "V1", src:"Media/P1_brown_cat_candle.mp4"},
    {title: "V2", src:"Media/P2_kitten_pumpkin.mp4"},
    {title: "V3", src:"Media/P3_silly_orange.mp4"},
    {title: "V4", src:"Media/P4_sleeping_white.mp4"},
    {title: "V5", src:"Media/P5_white_cat_piano.mp4"},
    {title: "V6", src: "Media/WhatsApp Video 2025-12-14 at 12.45.54.mp4"}
]



let index_video_curent = 0;

//hardcodam galeria video cu video uri deja existente
const galerie = document.getElementById("galerie_video");

/*for(let i=0; i<playlist.length; i++){
    let video = document.createElement("video");
    video.setAttribute("class", "galerie_obj");
    video.muted = true;
    video.setAttribute("id", playlist[i].title);
    let source = document.createElement("source");
    source.setAttribute("src", playlist[i].src);
    source.setAttribute("type", "video/mp4");
    video.appendChild(source);
    galerie.appendChild(video);
}*/

const canvas_video = document.getElementById("canvas_player_video");
const context = canvas_video.getContext("2d");
let init_w = 1300;//canvas_video.width;
let init_h = 630;//canvas_video.height;




const galerie_obj = document.getElementsByClassName("galerie_obj");


const videoCanvas = document.createElement("video");
videoCanvas.muted = false;
videoCanvas.playsInline = true;


const slider_timp = document.getElementById("slider_timp");
const timer = document.getElementById("timer");




function draw(){
  if(videoCanvas.readyState >= 2){
    context.clearRect(0, 0, canvas_video.width, canvas_video.height);
    context.drawImage(videoCanvas, 0, 0, canvas_video.width, canvas_video.height);

    //punem controalele 
    drawControale(context);

    //efecte speciale
    adaugaEfect();
  }
  requestAnimationFrame(draw);
}


draw();

/*for (let i = 0; i < galerie_obj.length; i++) {
  galerie_obj[i].addEventListener("click", () => {
    
  console.log("Videoclip selectat: ", playlist[i].title, "galerie length:", galerie_obj.length);

    document.getElementById("text_selectVideo").style.display = "none";
    canvas_video.style.display = "block";
    document.getElementById("elem_video").style.display = "flex";
    index_video_curent = i;
    playVideo(i);

  });
}*/

for (let i = 0; i < playlist.length; i++) {
  incarcaVideoCanvas(i); 
}


function incarcaVideoCanvas(poz, fisier = null){
  let sursa_fisier;
  //daca e video nou de la upload (folosesc mai jos)
  if(fisier){
    sursa_fisier = URL.createObjectURL(fisier);
    playlist.push({title: fisier.name, src: sursa_fisier});
    poz = playlist.length - 1;
  }
  else sursa_fisier = playlist[poz].src;

  let video = document.createElement("video");
  video.setAttribute("class", "galerie_obj");
  video.muted = true;
  let sursa = document.createElement("source");
  sursa.setAttribute("src", sursa_fisier);
  sursa.setAttribute("type", "video/mp4");
  video.appendChild(sursa);

  video.addEventListener("click", () => {
    document.getElementById("text_selectVideo").style.display = "none";
    canvas_video.style.display = "block";
    // document.getElementById("elem_video").style.display = "flex";
    document.getElementById("efecte_speciale").style.display = "flex";
    efecte_active = { gri: false, blue: false, invert: false, sepia: false, luminozitate: 0, contrast: 0 };
    index_video_curent = poz;
    playVideo(poz);
    // .log("Videoclip selectat: ", playlist[poz].title, "pozitie: ", poz);
  });

  galerie.appendChild(video);
}



function playVideo(poz)
{
  const video_lcl = galerie_obj[poz];

  let video_w = video_lcl.videoWidth;
  let video_h = video_lcl.videoHeight;

  let scale = Math.min(init_w / video_w, init_h / video_h, 1);

  canvas_video.width = video_w * scale;
  canvas_video.height = video_h * scale;

  videoCanvas.src = playlist[poz].src;
  // videoCanvas.currentTime = 0; 

  if(poz === index_video_curent && timp_salvat > 0){
    videoCanvas.currentTime = timp_salvat;
    timp_salvat = 0;
    console.log("reluat de la sec: ", videoCanvas.currentTime);
  }
  else{
    videoCanvas.currentTime = 0;
  }

  videoCanvas.play();

  salveaza_setari();

}


/*
function formatTime(t) {
  let m = Math.floor(t / 60).toString().padStart(2, "0");
  let s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
slider_timp.oninput = (e) => {
  let procent = e.target.value / 100;
  videoCanvas.currentTime = videoCanvas.duration * procent;
};
slider_timp.onchange = (e) => {
  let procent = e.target.value / 100;
  videoCanvas.currentTime = videoCanvas.duration * procent;
};
videoCanvas.addEventListener("timeupdate", () => {
  slider_timp.value = (videoCanvas.currentTime / videoCanvas.duration) * 100;
  timer.textContent = `${formatTime(videoCanvas.currentTime)} / ${formatTime(videoCanvas.duration)}`;
});
document.getElementById("buton_play").addEventListener("click", () => videoCanvas.play());
document.getElementById("buton_pause").addEventListener("click", () => videoCanvas.pause());*/

videoCanvas.addEventListener("ended", () => {
  document.getElementById("notificare_urmVideo").style.display = "block";

  setTimeout(() => {
    document.getElementById("notificare_urmVideo").style.display = "none";
    if(index_video_curent >= playlist.length - 1) {
      index_video_curent = 0;
    } else {  index_video_curent++; }

    playVideo(index_video_curent);
  }, 2000);
});
 


// Adauga un videoclip in galerie
const btn_adauga_video = document.getElementById("btn_adauga_video");
const input_adauga_video = document.getElementById("input_adauga_video");
btn_adauga_video.addEventListener("click", () => {
  // let context1 = new Video();
  input_adauga_video.click();
});


input_adauga_video.addEventListener("change", (e) => {
  const fisier = e.target.files[0];
  if(!fisier) return;

  incarcaVideoCanvas(null, fisier);

  // console.log("2: Videoclip adaugat in galerie:", fisier.name,"Length galerie: ", galerie_obj.length);
});



// Sterge + select + deselect cu reset player 

let video_selectat = null;
const obiecte_galerie = document.getElementById("galerie_video");
const btn_sterge_video = document.getElementById("btn_sterge_video");

function getIndexSelectat() {
  let i = 0;
  while (i < galerie_obj.length) {
    if (galerie_obj[i] === video_selectat) return i;
    i++;
  }
  return -1;
}

obiecte_galerie.addEventListener("click", function (e) {
  const v = e.target;
  if (!v.classList.contains("galerie_obj")) return;

  if (video_selectat === v) {
    v.classList.remove("v_selectat");
    video_selectat = null;
    return;
  }

  if (video_selectat) {
    video_selectat.classList.remove("v_selectat");
  }

  video_selectat = v;
  video_selectat.classList.add("v_selectat");

  let poz = getIndexSelectat();
  if (poz === -1) return;

  index_video_curent = poz;
  playVideo(poz);
});

btn_sterge_video.addEventListener("click", function () {
  if (!video_selectat) return alert("Selecteaza un videoclip!");
  let poz = getIndexSelectat();
  if (poz === -1) return;

  if (index_video_curent === poz) {
    videoCanvas.pause();
    videoCanvas.src = "";
    context.clearRect(0, 0, canvas_video.width, canvas_video.height);
    document.getElementById("text_selectVideo").style.display = "block";
    canvas_video.style.display = "none";
    // document.getElementById("elem_video").style.display = "none";
    document.getElementById("efecte_speciale").style.display = "none";
  }

  video_selectat.remove();
  playlist.splice(poz, 1);

  index_video_curent = 0;
  video_selectat = null;
});


//muta video selectat stanga / dreapta
const btn_muta_stg =  document.getElementById("muta_stg");
const btn_muta_dr =  document.getElementById("muta_dr");

btn_muta_stg.addEventListener("click", function(){
  if (!video_selectat) return alert("Selecteaza un videoclip!");

  let poz_veche = getIndexSelectat();
  let poz_noua = poz_veche - 1;

  if (poz_veche === -1) return;
  if(poz_veche === 0) {
    alert("Acest videoclip este deja primul in playlist!");
    return;
  }

  interschimbaVideo(poz_veche, poz_noua);

} );

btn_muta_dr.addEventListener("click", function(){
  if (!video_selectat) return alert("Selecteaza un videoclip!");

  let poz_veche = getIndexSelectat();
  let poz_noua = poz_veche + 1;

  if (poz_veche === -1) return;
  if(poz_veche === playlist.length-1) {
    alert("Acest videoclip este deja ultimul in playlist!");
    return;
  }

  interschimbaVideo(poz_veche, poz_noua);

} );

function interschimbaVideo(pozitieVeche, pozitieNoua){
  if (pozitieVeche < 0 || pozitieNoua < 0 || 
    pozitieVeche >= playlist.length || pozitieNoua >= playlist.length || 
    pozitieVeche === pozitieNoua) {
    console.log("Eroare interschimbare: ",pozitieVeche, " ", pozitieNoua  );
    return;
  }

  [playlist[pozitieVeche], playlist[pozitieNoua]] = [playlist[pozitieNoua], playlist[pozitieVeche]];

  [galerie_obj[pozitieVeche], galerie_obj[pozitieNoua]] = [galerie_obj[pozitieNoua], galerie_obj[pozitieVeche]];

  const elementVechi = obiecte_galerie.children[pozitieVeche];
  const elementNou = obiecte_galerie.children[pozitieNoua];

  if (pozitieVeche < pozitieNoua) { 
    obiecte_galerie.insertBefore(elementNou, elementVechi);
  } else { 
    obiecte_galerie.insertBefore(elementVechi, elementNou);
  }

  if (index_video_curent === pozitieVeche) {
    index_video_curent = pozitieNoua;
    console.log(`Index curent actualizat la ${pozitieNoua}.`);
  } else if (index_video_curent === pozitieNoua) {
    index_video_curent = pozitieVeche;
    console.log(`Index curent actualizat la ${pozitieVeche}.`);
  }

  console.log(`Interschimbare reusita intre pozitiile ${pozitieVeche} si ${pozitieNoua}.`);

}

////


//Adauga efecte speciale la video

let btn_efecte_speciale = document.getElementById("btn_efecte_speciale");
btn_efecte_speciale.addEventListener("click",()=>{
  document.querySelectorAll(".btn_efect").forEach(b => { b.style.display = (b.style.display === "block") ? "none" : "block"; });
  document.querySelectorAll(".slider_efect").forEach(b => { b.style.display = (b.style.display === "block") ? "none" : "block"; });
    btn_efecte_speciale.textContent = (btn_efecte_speciale.textContent === "Efecte speciale") 
      ? "Inchide efecte" 
      : "Efecte speciale";

});

// let efectCurent = "normal";
let luminozitate = 0;
let contrast = 0;
//facem un vector cu toate efectele pentru a putea aplica mai multe efecte simultan
let efecte_active = {
  gri: false,
  invert: false,
  alblueastru: false,
  sepia: false,
  luminozitate: 0,
  contrast: 0
};



document.getElementById("efect_gri").addEventListener("click", function (){
  // efectCurent = "gri";
  efecte_active.gri = !efecte_active.gri;
});

document.getElementById("efect_blue").addEventListener("click", () => {
  // efectCurent = "blue";
  efecte_active.blue = !efecte_active.blue;
});

document.getElementById("efect_invert").addEventListener("click", () => {
  // efectCurent = "invert";
  efecte_active.invert = !efecte_active.invert;
});

document.getElementById("efect_sepia").addEventListener("click", () => {
  // efectCurent = "sepia";
  efecte_active.sepia = !efecte_active.sepia;
});

document.getElementById("btn_sterge_efecte").addEventListener("click", () => {
  // efectCurent = "normal";
  // luminozitate = 0;
  // contrast = 0;
   efecte_active = {
    gri: false,
    blue: false,
    invert: false,
    sepia: false,
    luminozitate: 0,
    contrast: 0
  };

  document.getElementById("slider_luminozitate").value = 0;
  document.getElementById("slider_contrast").value = 0;

  // context.drawImage(videoCanvas, 0, 0, canvas_video.width, canvas_video.height);
});

document.getElementById("slider_luminozitate").oninput = (e) => {
  // luminozitate = Number(e.target.value);
  // efectCurent = "luminozitate";
  efecte_active.luminozitate = Number(e.target.value);
};

document.getElementById("slider_contrast").oninput = (e) => {
  // contrast = Number(e.target.value);
  // efectCurent = "contrast";
  efecte_active.contrast = Number(e.target.value);
};


/*
function adaugaEfect() {
  if (efectCurent === "normal") return; 

  let W = canvas_video.width;
  let H = canvas_video.height;
  let img = context.getImageData(0, 0, W, H);
  let d = img.data;
  let i = 0;

  while (i < d.length) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    if (efectCurent === "gri") {
      let medie = (r + g + b) / 3;
      d[i] = d[i+1] = d[i+2] = medie;
    }

    else if (efectCurent === "blue") {
      d[i] = 0; 
      d[i+1] = 0; 
    }

    else if (efectCurent === "invert") {
      d[i]   = 255 - r;
      d[i+1] = 255 - g;
      d[i+2] = 255 - b;
    }

    else if (efectCurent === "sepia") {
      let nr = 0.393*r + 0.769*g + 0.189*b;
      let ng = 0.349*r + 0.686*g + 0.168*b;
      let nb = 0.272*r + 0.534*g + 0.131*b;

      d[i]   = nr > 255 ? 255 : nr;
      d[i+1] = ng > 255 ? 255 : ng;
      d[i+2] = nb > 255 ? 255 : nb;
    }
    
    //le despartim
    if (efectCurent === "luminozitate") {
      let inc = luminozitate * 1.5;
      d[i]   = Math.min(255, Math.max(0, r + inc));
      d[i+1] = Math.min(255, Math.max(0, g + inc));
      d[i+2] = Math.min(255, Math.max(0, b + inc));
    }

    else if (efectCurent === "contrast") {
      let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      d[i]   = Math.min(255, Math.max(0, factor * (r - 128) + 128));
      d[i+1] = Math.min(255, Math.max(0, factor * (g - 128) + 128));
      d[i+2] = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }

    i += 4;
  }

  context.putImageData(img, 0, 0);
}*/

function adaugaEfect() {
  let W = canvas_video.width;
  let H = canvas_video.height;
  let img = context.getImageData(0, 0, W, H);
  let d = img.data;
  let i = 0;

  while (i < d.length) {
    let r = d[i];
    let g = d[i+1];
    let b = d[i+2];

    if (efecte_active.blue) {
      r = 0;
      g = 0;
    }

    if (efecte_active.invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    if (efecte_active.gri) {
      let medie = (r + g + b) / 3;
      r = g = b = medie;
    }

    if (efecte_active.sepia) {
      let nr = 0.393*r + 0.769*g + 0.189*b;
      let ng = 0.349*r + 0.686*g + 0.168*b;
      let nb = 0.272*r + 0.534*g + 0.131*b;
      r = nr>255?255:nr;
      g = ng>255?255:ng;
      b = nb>255?255:nb;
    }

    if (efecte_active.luminozitate !== 0) {
      let inc = efecte_active.luminozitate * 1.5;
      r = Math.min(255, Math.max(0, r + inc));
      g = Math.min(255, Math.max(0, g + inc));
      b = Math.min(255, Math.max(0, b + inc));
    }

    if (efecte_active.contrast !== 0) {
      let factor = (259 * (efecte_active.contrast + 255)) / (255 * (259 - efecte_active.contrast));
      r = Math.min(255, Math.max(0, factor * (r - 128) + 128));
      g = Math.min(255, Math.max(0, factor * (g - 128) + 128));
      b = Math.min(255, Math.max(0, factor * (b - 128) + 128));
    }

    d[i]   = r;
    d[i+1] = g;
    d[i+2] = b;

    i += 4;
  }

  context.putImageData(img, 0, 0);
}




//////////////CONTROALE

let hoverBtn = null;
let hoverCanvas = false;

let controale = {
  play:   { x: 20,  y: 20,  w: 60, h: 40 },
  pause:  { x: 90,  y: 20,  w: 60, h: 40 },
  bar:    { x: 20, y:  canvas_video.height - 30, w: canvas_video.width - 40, h: 10 }
}

function drawControale(ctx) {
  if (!hoverCanvas) return;

  let W = canvas_video.width;
  let H = canvas_video.height;

  const btnW = 35;
  const btnH = 35;
  const y = H - 60;
  const centruH = H/2 - btnH/2;
  const culoareEvidenta = `rgba(222, 152, 227,0.7)`; // Culoarea ta
  const culoareNormala = `rgba(0,0,0,0.4)`;

  //play
  if (videoCanvas.paused) {
      ctx.fillStyle = culoareNormala;

  } else {
      ctx.fillStyle = culoareEvidenta;
  }
  ctx.fillRect(20, y, btnW, btnH);
  ctx.fillStyle = "white";
  ctx.fillText("▶", 20 + btnW/2, y + btnH/2);

  //pause
  if (!videoCanvas.paused) {
      ctx.fillStyle = culoareNormala;

  } else {
      ctx.fillStyle = culoareEvidenta;
  }
  ctx.fillRect(70, y, btnW, btnH);
  ctx.fillStyle = "white";
  ctx.fillText("❚❚", 70 + btnW/2, y + btnH/2);

  //bara timp
  let barX = 250;
  let barY = H - 46.5;
  let barW = W - barX - 20;
  let barH = 8;
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(barX, barY, barW, barH);

  let p = videoCanvas.currentTime / videoCanvas.duration || 0;
  ctx.fillStyle = "rgba(222, 152, 227, 0.7)";
  ctx.fillRect(barX, barY, barW * p, barH);

  

  //timer
  const currentTime = videoCanvas.currentTime;
  const duration = videoCanvas.duration;
  const formattedCurrentTime = formatTimp(currentTime);
  const formattedDuration = formatTimp(duration);
  const timerText = `${formattedCurrentTime} / ${formattedDuration}`;
  ctx.fillStyle = "white"; 
  ctx.font = "14px sans-serif";
  ctx.textAlign = "right";  
  const textX = W - 20; 
  const textY = H - 30;
  ctx.fillText(timerText, textX, textY);

  
  //previous
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(10, centruH, btnW, btnH);
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("◀", 10 + btnW/2, centruH + btnH/2);

  //next
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(W - 45, centruH, btnW, btnH);
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("▶", W - 45 + btnW/2, centruH + btnH/2);


  //volum
  const volX = 160; 
  const volY = H - 46.5; //y + (btnH / 2) - 4;
  const volW = 80;
  const volH = 8;
  const volIconX = 120;

  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fillRect(volIconX, y, btnW, btnH);
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";

  let volIcon = "🔊"; 
  if (videoCanvas.muted || videoCanvas.volume === 0) {
      volIcon = "🔇";
  } else if (videoCanvas.volume < 0.5) {
      volIcon = "🔉";
  }
  ctx.fillText(volIcon, volIconX + btnW/2, y + btnH/2);

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillRect(volX, volY, volW, volH);

  if(videoCanvas.muted) 
    vol_pct = 0 ; 
    else 
      vol_pct = videoCanvas.volume; 
  ctx.fillStyle = "rgba(222, 152, 227, 0.7)";
  ctx.fillRect(volX, volY, volW * vol_pct, volH);
}

canvas_video.addEventListener("mouseenter", () => hoverCanvas = true);
canvas_video.addEventListener("mouseleave", () => hoverCanvas = false);



canvas_video.addEventListener("click", (e) => {
  const r = canvas_video.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  const H = canvas_video.height;
  const W = canvas_video.width;

  const y_jos = H - 60;

  console.log("Click la: ", x, y);

  const btnW = 35;
  const btnH = 35;
  const centruH = H/2 - btnH/2;


  //play
  if (x > 20 && x < 20 + btnW && y > y_jos && y < y_jos + btnH) {
    if (videoCanvas.paused) {
        videoCanvas.play();
    }
    console.log("PLAY");
    return; 
  }

  //pause
  if (x > 70 && x < 70 + btnW && y > y_jos && y < y_jos + btnH) {
    if (!videoCanvas.paused) {
        videoCanvas.pause();
    }
    console.log("PAUSE");
    return; 
  }


  //bara timp
  const barX = 250; 
  const barY = H - 46.5; 
  const barW = W - barX - 20; 
  const barH = 8;

  if (x > barX && x < barX + barW && y > barY && y < barY + barH) {
    let pct = (x - barX) / barW;
    if (videoCanvas.duration) { 
        videoCanvas.currentTime = videoCanvas.duration * pct;
    }

    console.log("Bara Timp");
    return;
  }



    //toggle play/pause pe tot canvasul // inafara de bara de timp
  if(y < (H - 60)){
    if (videoCanvas.paused ) {
        videoCanvas.play();
    } else {
        videoCanvas.pause();
    }
  }

//prev
  let px = 10; 
  let py = centruH; 
  if (x > px && x < px + btnW && y > py && y < py + btnH) {
      index_video_curent--;
      if (index_video_curent < 0) {
          index_video_curent = playlist.length - 1;
      }
      playVideo(index_video_curent);
      console.log("PREVIOUS");
      return; 
  }

//next
  let nx = W - 45; 
  let ny = centruH;

  if (x > nx && x < nx + btnW && y > ny && y < ny + btnH) {
      index_video_curent++;
      if (index_video_curent > playlist.length - 1) {
          index_video_curent = 0;
      }
      playVideo(index_video_curent);
      console.log("NEXT");
      return; 
  }

  //volum

  const volIconX = 120;
  const volX = 160; 
  const volY = H - 46.5; // y_jos + (btnH / 2) - 4; 
  const volW = 80;
  const volH = 8;

  if (x > volIconX && x < volIconX + btnW && y > y_jos && y < y_jos + btnH) {
    videoCanvas.muted = !videoCanvas.muted;
    console.log("MUTE:", videoCanvas.muted);
    return;
  }

  if (x > volX && x < volX + volW && y > volY && y < volY + volH) {
    let pct = (x - volX) / volW; 
    
    videoCanvas.volume = pct;
    if (pct > 0) {
        videoCanvas.muted = false;
    }
    
    console.log("Volum setat la:", pct.toFixed(2));
    return;
}

  // console.log("Playlist Length: ", playlist.length);

});


function formatTimp(secunde){
  if(isNaN(secunde) || secunde< 0){
    return "00:00";
  }
  const minute = Math.floor(secunde/60);
  const sec = Math.floor(secunde%60)

  const formatMinute = String(minute).padStart(2, '0');
  const formatSecunde = String(sec).padStart(2, '0');
  
  return `${formatMinute}:${formatSecunde}`;
}



// SUBTITRARI

let mapare_sub = {}; 
const subtitrari_container = document.getElementById("subtitrari");
let subtitles_load_status = {}; 


async function citireJSON(title){
  //const cale = `subtitrari/${title}.json`
  const cale = `Media/subtitrari/${title}.json`
  try{
    const rasp = await fetch(cale);
    if(!rasp.ok){
        return [];
    }

    const data = await rasp.json();
    return data;
  } catch(error){
    console.log("Eroare la incarcare subtitrari pt ", title);
    return [];
  }
}


function addSubtitrari(){
  if (index_video_curent < 0 || index_video_curent >= playlist.length) {
    return; 
  }
  
  const currentTitle = playlist[index_video_curent].title;
  const currentTime = videoCanvas.currentTime;
  
  if (!subtitles_load_status[currentTitle]) {
    subtitles_load_status[currentTitle] = 'pending';
    citireJSON(currentTitle)
      .then(subtitlesArray => {
        mapare_sub[currentTitle] = subtitlesArray;
      
        if (subtitlesArray.length > 0) {
          subtitles_load_status[currentTitle] = 'loaded';
        } else {
          subtitles_load_status[currentTitle] = 'not_found';
        }
      });
    
    return; 
  }
  
  if (subtitles_load_status[currentTitle] !== 'loaded') {
    if (subtitrari_container) {
      subtitrari_container.style.display = "none";
      subtitrari_container.textContent = "";
    }
    return;
  }

  const sub_activa = mapare_sub[currentTitle] || [];
  let subtitrare_gasita = null;

  for (const sub of sub_activa){
    if (currentTime >= sub.start && currentTime < sub.end) {
      subtitrare_gasita = sub;
      break; 
    }
  }

  if (subtitrari_container) {
    if (subtitrare_gasita) {
      if (subtitrari_container.textContent !== subtitrare_gasita.text) {
        subtitrari_container.textContent = subtitrare_gasita.text;
        subtitrari_container.style.display = "block";
      }
    } else {
      subtitrari_container.style.display = "none";
      subtitrari_container.textContent = ""; 
    }
  }
}


videoCanvas.addEventListener("timeupdate", addSubtitrari);



//stocare setari

const cheie = "setariPlayer";

function salveaza_setari(){
  const setari = {
    volume: videoCanvas.volume,
    i_video_curent: index_video_curent,
    timp_curent: videoCanvas.currentTime
  }

  try{
    localStorage.setItem(cheie, JSON.stringify(setari));
    console.log("Setari salvate: ", setari);
  } catch(e){
    console.log("Eroare salvare setari: ", e);
  }
}

let timp_salvat = 0;

function incarca_setari() {
  try {
    const setari_stocate = localStorage.getItem(cheie);
    if (setari_stocate) {
      const setari = JSON.parse(setari_stocate);
      if (setari.volume !== undefined) {
          videoCanvas.volume = setari.volume;
      }
      if (setari.i_video_curent !== undefined && setari.i_video_curent < playlist.length) {
          index_video_curent = setari.i_video_curent; 
          if (setari.timp_curent !== undefined) {
              timp_salvat = setari.timp_curent; 
          }
      }
      console.log("Setari incarcate", setari);
    }
  } catch (e) {
    console.error("Eroare la incarcare:", e);
  }
}
