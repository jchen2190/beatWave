let song;
let button;
let jumpButton;
// let sliderRate;
// let sliderPan;
let amplitude;

let img;
let fft; // Fast Fourier Transform
let particles = [];
// let audio1 = new Audio();

function preload() {
    song = loadSound('Alone_-_Color_Out.mp3');
    img = loadImage('abstract-bg.jpg');
}

function setup() {
    // song = loadSound('Alone_-_Color_Out.mp3');
    // img = loadImage('abstract-bg.jpg');
    playButton = createButton("play");
    playButton.parent("audioControl");
    playButton.mousePressed(togglePlaying);
    // jumpButton = createButton(">>");
    // jumpButton.parent("audioControl");
    // jumpButton.mousePressed(jumpSong);
    slider = createSlider(0, 1, 0.5, 0.01); // 0-1
    slider.parent("audioControl");
    // sliderRate = createSlider(0, 2, 1, 0.25); // song speed (low, high, start, spacing)
    // sliderPan = createSlider(-1, 1, 0, 0.01); // speaker left vs right
    song.setVolume(0.5);

    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    imageMode(CENTER);
    rectMode(CENTER);
    fft = new p5.FFT(0.3);
    amplitude = new p5.Amplitude();

    // img.filter(BLUR, 12);

    noLoop()
}


function togglePlaying() {
    if (song.isPlaying()) {
        song.pause()
        playButton.html("play");
        noLoop()
    } else {
        song.play()
        playButton.html("Pause");
        loop()
    }
}

function jumpSong() {
    song.jump(song.currentTime() + 5);
}

// function loaded() {
//     song.play();
// }

function draw() {
    background(0);
    outputVolume(slider.value());
    // song.rate(sliderRate.value());
    // song.pan(sliderPan.value());
    var volume = amplitude.getLevel();


    translate(width / 2, height / 2);
    
    // beat detection
    fft.analyze();
    let amp = fft.getEnergy(20, 240);

    push();
    if (amp > 230) {
        rotate(random(-0.5, 0.5));
    }
    image(img, 0, 0, width + 100, height + 100);
    pop();

    let alpha = map(amp, 0, 255, 180, 150);
    fill(0, alpha);
    noStroke();
    rect(0, 0, width, height);

    stroke(255);
    strokeWeight(3);
    noFill();

    let wave = fft.waveform();

    for (let t = -1; t <= 1; t += 2) { // complete circle
        beginShape()
        for (let i = 0; i <= 180; i += 0.5) {
            // let index = floor(map(i, 0, width, 0, wave.length))
            // let x = i;
            // let y = wave[index] * 300 + height / 2
            // point(x, y);
            
            // 180 for semi-circle
            let index = floor(map(i, 0, 180, 0, wave.length - 1));
            let r = map(wave[index], -1, 1, 150, 350); // (value, current lower bound, current upper bound, target low bound, target upper bound)
            let x = r * sin(i) * t;
            let y = r * cos(i);
            vertex(x, y);
        }
        endShape()
    }

    let p = new Particle()
    particles.push(p);

    for (let i = particles.length - 1; i >= 0; i--) { // backwards so particles don't flicker
        if (!particles[i].edges()) {
            // particles[i].update();
            particles[i].update(amp > 200);
            particles[i].show();
        } else {
            particles.splice(i, 1);
        }
    }
}

class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(250);
        this.velocity = createVector(0, 0);
        this.accelerate = this.pos.copy().mult(random(0.0001, 0.00001));

        this.width = random(3, 5)
        this.color = [random(200, 255), random(200, 255), random (200, 255),]
    }
    update(cond) {
        this.velocity.add(this.accelerate);
        this.pos.add(this.velocity);

        // particles move faster
        if (cond) {
            this.pos.add(this.velocity);
            this.pos.add(this.velocity);
            this.pos.add(this.velocity);
        }
    }
    edges() { // particle parameters
        if (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2) {
            return true;
        } else {
            return false;
        }
    }
    show() {
        noStroke();
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.width);
    }
}