const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

class Circle {
  constructor(x, y, r, type,ax, ay, m, vx, vy, color) {
    this.id = this.generateID();
    this.type = type
    this.x = x;
    this.y = y;
    this.r = r;
    this.face = 2 * this.r;
    this.vx = vx ?? Math.floor(Math.random() * 200 - 100);
    this.vy = vy ?? Math.floor(Math.random() * 200 - 100);
    this.v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    this.ax = ax ?? Math.floor(Math.random() * 120 - 60);
    this.ay = ay ?? Math.floor(Math.random() * 120 - 60);
    // this.vx = 1000
    // this.vy = 1000
    // this.v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    // this.ax = 100
    // this.ay = 100
    this.inputSpeed = 300
    this.history = {};
    this.timeX = 1 / this.vx;
    this.timeY = 1 / this.vy;
    this.Ks = 0.7;
    this.airKs = 0.0001;
    this.frictionStop = 0.5
    this.maxTime = 100
    this.dt1 = new Date().getTime()
    // this.ax = 0
    // this.ay = 0
    this.inputs = {
      right: false,
      left: false,
      top: false,
      bottom: false,
      stop:false
    };

    this.m = m ?? Math.PI * (this.r * this.r);
    this.color = color
      ? color
      : `hsla(${Math.floor(Math.random() * 360)}, 100%, 60%, 0.5)`;
    // this.color = color
    //   ? color
    //   : `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`;



    if (this.type === "main") {
      this.vx = 0
      this.vy = 0
      this.ax = 0
      this.ay = 0
    }
  }

  generateID() {
    this.id = Math.floor(Math.random() * 100 + 1);
    while (
      main.circles.map((circle) => circle.id).some((id) => id == this.id)
    ) {
      this.id = Math.floor(Math.random() * 100 + 1);
    }
    return this.id;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    this.drawDirLines();
    if (this.type==="main"){
      ctx.textAlign = "center"
      ctx.fillText(this.v.toFixed(2),this.x, this.y)
    }
  }

  drawDirLines() {
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = "55";
    ctx.lineWidth = Math.abs(this.v / 100);
    this.lineHeight = Math.abs(this.v / 10);
    this.alpha = Math.atan2(this.vy, this.vx);
    this.alphaDik = Math.atan(-1 / Math.tan(this.alpha));
    this.moveToX = this.x + Math.cos(this.alphaDik) * this.r;
    this.moveToY = this.y + Math.sin(this.alphaDik) * this.r;
    this.lineToX = this.moveToX - Math.cos(this.alpha) * this.lineHeight;
    this.lineToY = this.moveToY - Math.sin(this.alpha) * this.lineHeight;
    this.moveToX2 = this.x - Math.cos(this.alphaDik) * this.r;
    this.moveToY2 = this.y - Math.sin(this.alphaDik) * this.r;
    this.lineToX2 = this.moveToX2 - Math.cos(this.alpha) * this.lineHeight;
    this.lineToY2 = this.moveToY2 - Math.sin(this.alpha) * this.lineHeight;
    ctx.beginPath();
    ctx.moveTo(this.moveToX, this.moveToY);
    ctx.lineTo(this.lineToX, this.lineToY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.moveToX2, this.moveToY2);
    ctx.lineTo(this.lineToX2, this.lineToY2);
    ctx.stroke();
  }

  checkOut() {
    if (this.x + this.r > canvas.width) {
      this.x = canvas.width - this.r;
      this.ax = this.ax * -1;
      let f = Math.abs(this.ay) * this.m;
      let fs = Math.abs(this.ax) * this.m * this.Ks;
      if (this.ay > 0) {
        this.ay = (f - fs) / this.m;
      } else {
        this.ay = -1 * ((f - fs) / this.m);
      }
      this.vx = this.ax * this.timeX - this.vx;
    }
    if (this.x - this.r < 0) {
      this.x = this.r;
      this.ax = this.ax * -1;
      let f = Math.abs(this.ay) * this.m;
      let fs = Math.abs(this.ax) * this.m * this.Ks;
      if (this.ay > 0) {
        this.ay = (f - fs) / this.m;
      } else {
        this.ay = -1 * ((f - fs) / this.m);
      }
      this.vx = this.ax * this.timeX - this.vx;
    }
    if (this.y + this.r > canvas.height) {
      this.y = canvas.height - this.r;
      this.ay = this.ay * -1;
      let f = Math.abs(this.ax) * this.m;
      let fs = Math.abs(this.ay) * this.m * this.Ks;
      if (this.ax > 0) {
        this.ax = (f - fs) / this.m;
      } else {
        this.ax = -1 * ((f - fs) / this.m);
      }
      this.vy = this.ay * this.timeY - this.vy;
    }
    if (this.y - this.r < 0) {
      this.y = this.r;
      this.ay = this.ay * -1;
      let f = Math.abs(this.ax) * this.m;
      let fs = Math.abs(this.ay) * this.m * this.Ks;
      if (this.ax > 0) {
        this.ax = (f - fs) / this.m;
      } else {
        this.ax = -1 * ((f - fs) / this.m);
      }
      this.vy = this.ay * this.timeY - this.vy;
    }
  }

  airFriction() {
    let fy = Math.abs(this.ay) * this.m;
    let fsy = this.face * this.airKs * (this.vy * this.vy);

    if (this.ay > 0) {
      this.ay = (fy - fsy) / this.m;
    } else {
      this.ay = -1 * ((fy - fsy) / this.m);
    }

    let fx = Math.abs(this.ax) * this.m;
    let fsx = this.face * this.airKs * (this.vx * this.vx);
    if (this.ax > 0) {
      this.ax = (fx - fsx) / this.m;
    } else {
      this.ax = -1 * ((fx - fsx) / this.m);
    }
  }

  input() {
    if(this.type==="main") {
      if (this.dt2 - this.dt1 > this.maxTime){
        this.inputs['stop'] = false
      }
      window.addEventListener("keydown", function(e) {
        if (e.key === "w"){
          this.inputs['top'] = true
        }
        if (e.key === "d"){
          this.inputs['right'] = true
          
        }
        if (e.key === "s"){
          this.inputs['bottom'] = true
          
        }
        if (e.key === "a"){
          this.inputs['left'] = true

        }
        if(e.key==="e" && this.dt2 - this.dt1 > this.maxTime){
          this.inputs['stop'] = true
          this.dt1 = new Date().getTime()
        }
      }.bind(this))
      window.addEventListener("keyup", function(e) {
        if (e.key === "w"){
          this.inputs['top'] = false
        }
        if (e.key === "d"){
          this.inputs['right'] = false
          
        }
        if (e.key === "s"){
          this.inputs['bottom'] = false
          
        }
        if (e.key === "a"){
          this.inputs['left'] = false
          
        }
        if(e.key==="e"){
          this.inputs['stop'] = false
        }
      }.bind(this))

      if(this.inputs.top){
        this.vy-=this.inputSpeed*main.dt
      }
      if(this.inputs.bottom){
        this.vy+=this.inputSpeed*main.dt
      }
      if(this.inputs.right){
        this.vx+=this.inputSpeed*main.dt
      }
      if(this.inputs.left){
        this.vx-=this.inputSpeed*main.dt
      }
      if(this.inputs.stop){
        main.stop()
      }

    }

  }

  update() {
    this.dt2 = new Date().getTime()
    this.input()
    this.checkOut();
    this.airFriction();
    
    this.timeX = 1 / this.vx;
    this.timeY = 1 / this.vy;
    this.vx += this.ax * main.dt;
    this.vy += this.ay * main.dt;
    this.x += this.vx * main.dt;
    this.y += this.vy * main.dt;
    this.v = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
  }
}

class Main {
  constructor() {
    this.dt = 16.66 / 1000;
    this.circles = [];
    this.circlesNum = 30;
  }

  makeCircles() {
    for (let i = 0; i < this.circlesNum; i++) {
      let r = Math.floor(Math.random() * 25 + 25);
      let x = Math.floor(Math.random() * (canvas.width - r - r) + r);
      let y = Math.floor(Math.random() * (canvas.height - r - r) + r);
      let newCircle = new Circle(x, y, r);
      this.circles.push(newCircle);
    }
    let r = Math.floor(Math.random() * 25 + 25);
    let x = Math.floor(Math.random() * (canvas.width - r - r) + r);
    let y = Math.floor(Math.random() * (canvas.height - r - r) + r);
    let myCircle = new Circle(x, y, r, 'main');
    this.circles.push(myCircle);
  }

  drawCircles() {
    this.circles.forEach((circle) => {
      circle.draw();
    });
  }

  updateCircles() {
    this.circles.forEach((circle) => {
      circle.update();
    });

  }

  penResBB(b1, b2) {
    let dx = b1.x - b2.x;
    let dy = b1.y - b2.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(d) < b2.r + b1.r) {
      let pdx = b1.r + b2.r - Math.abs(dx);
      let pdy = b1.r + b2.r - Math.abs(dy);
      // let pd = Math.atan(pdy, pdx)
      // let prx = ((Math.cos(pd)) * pdx/2);
      // let pry = ((Math.sin(pd)) * pdy/2);
      // let pd = Math.atan(pdy, pdx)
      let prx = ((dx / d) * pdx) / 2;
      let pry = ((dy / d) * pdy) / 2;
      b1.x += prx;
      b1.y += pry;
      b2.x += -1 * prx;
      b2.y += -1 * pry;
    }
  }

  colResBB(b1, b2) {
    let dx = b1.x - b2.x;
    let dy = b1.y - b2.y;
    let d = Math.sqrt(dx * dx + dy * dy);
    if (Math.abs(d) < b2.r + b1.r) {
      let normal = Math.sqrt(
        (b1.x - b2.x) * (b1.x - b2.x) + (b1.y - b2.y) * (b1.y - b2.y)
      );
      let normalX = (b1.x - b2.x) / normal;
      let normalY = (b1.y - b2.y) / normal;
      let relVelX = b1.vx - b2.vx;
      let relVelY = b1.vy - b2.vy;
      let sepVel = normalX * relVelX + normalY * relVelY;
      let newSepVel = -sepVel;
      let sepVelVecX = normalX * newSepVel;
      let sepVelVecY = normalY * newSepVel;
      b1.vx += sepVelVecX;
      b1.vy += sepVelVecY;
      b2.vx += -sepVelVecX;
      b2.vy += -sepVelVecY;
    }
  }

  stop() {
    this.circles.forEach(function(b){
      b.ax = 0
      b.ay = 0
      b.vx *=b.frictionStop 
      b.vy *= b.frictionStop
      console.log(b.vx)
    }.bind(this))
  }

  loop() {
    this.makeCircles();

    this.mainLoop = setInterval(
      function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawCircles();
        this.updateCircles();
        this.circles.forEach((b, index) => {
          for (let i = index + 1; i < this.circles.length; i++) {
            this.colResBB(this.circles[index], this.circles[i]);
            this.penResBB(this.circles[index], this.circles[i]);
          }
        });
      }.bind(this),
      this.dt * 1000
    );
  }
}

const main = new Main();
main.loop();
