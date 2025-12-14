let index = 0
let loopCount = 0;

let canvas1=document.getElementById("canvas1");
let context1=canvas1.getContext("2d");

let canvasPrev=document.getElementById("canvasPrev");
let contextPrev=canvasPrev.getContext("2d");

let canvasNext=document.getElementById("canvasNext");
let contextNext=canvasNext.getContext("2d");

let cw1 = canvas1.width;
let ch1 = canvas1.height;

//--------------CARUSEL VIDEO-----------------
function toggleCarusel() {
    const carusel = document.getElementById("caruselVideo");
    const isHidden = carusel.classList.toggle("hidden");

    if (isHidden) {
        videos[index].pause();                
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
    } else {       
        videos[index].currentTime = 0;  
        videos[index].play();                   
        cropVideo(context1, videos[index], canvas1);
    }
}


let videos =[document.getElementById("v1"),
             document.getElementById("v2"),
             document.getElementById("v3"),
             document.getElementById("v4"),
             document.getElementById("v5")];

function cropVideo(context, video, canvas){
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const cw = canvas.width;
    const ch = canvas.height;

    let sx, sy, sWidth, sHeight;

    if (vw / vh > cw / ch) { 
        sHeight = vh;
        sWidth = vh * cw / ch;
        sx = (vw - sWidth) / 2;
        sy = 0;
    } else { 
        sWidth = vw;
        sHeight = vw * ch / cw;
        sx = 0;
        sy = (vh - sHeight) / 2;
    }

    context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, cw, ch);
}


function puneVideo() { 
    let IndexPrev, IndexNext;
    if (index === 0) {
        IndexPrev = videos.length - 1;
        IndexNext = index + 1;
    } else if (index === videos.length - 1) {
        IndexPrev = index - 1;
        IndexNext = 0;
    } else {
        IndexPrev = index - 1;
        IndexNext = index + 1;
    }
 
    context1.clearRect(0, 0, canvas1.width, canvas1.height);
    contextPrev.clearRect(0, 0, canvasPrev.width, canvasPrev.height);
    contextNext.clearRect(0, 0, canvasNext.width, canvasNext.height);
 
    videos[index].play();
    videos[IndexPrev].pause();
    videos[IndexNext].pause();

    videos[IndexPrev].currentTime = 0;
    videos[IndexNext].currentTime = 0;

    cropVideo(contextPrev, videos[IndexPrev], canvasPrev);
    cropVideo(context1, videos[index], canvas1);
    cropVideo(contextNext, videos[IndexNext], canvasNext);

    requestAnimationFrame(puneVideo);
}

puneVideo();


function nextVideo(){
    videos[index].pause();
    index++;
    if (index >= videos.length) index = 0;
    videos[index].currentTime = 0;
    videos[index].play();
}

function prevVideo(){
    videos[index].pause();
    index--;
    if (index < 0) index = videos.length - 1;
    videos[index].currentTime = 0;
    videos[index].play();
}

function pauzaVideo(){
    videos[index].currentTime = 0; 
    videos[index].pause();  
}

function playVideo(){
    videos[index].play(); 
}


//--------------CARUSEL VIDEO-----------------
