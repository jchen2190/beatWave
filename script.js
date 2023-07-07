let song;
let fft // Fast Fourier Transform
let particles = [];

function preload() {
    song = loadSound('Alone_-_Color_Out.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    angleMode(DEGREES);
    fft = new p5.FFT();
}

function draw() {
    background(0);
    stroke(255);
    noFill();

    translate(width / 2, height / 2);

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
            let r = map(wave[index], -1, 1, 150, 350);
            let x = r * sin(i) * t;
            let y = cos(i);
            vertex(x, y);
        }
        endShape()
    }

    let p = new Particle()
    particles.push(p);

    for (let i = particles.length - 1; i >= 0; i--) { // backwards so particles don't flicker
        if (!particles[i].edges()) {
            particles[i].update();
            particles[i].show();
        } else {
            particles.splice(i, 1);
        }
    }
}

function mouseClicked() {
    if (song.isPlaying()) {
        song.pause()
        noLoop()
    } else {
        song.play()
        loop()
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
    update() {
        this.velocity.add(this.accelerate);
        this.pos.add(this.velocity);
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