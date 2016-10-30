
var bola = require('./ball');
var barra = require('./stick');

function Context() {
  this.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  this.windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  this.ball=new bola("bola", this);
  this.ball.location(parseInt((this.windowWidth/2)-(this.ball.imgBall.width/2)) ,parseInt((this.windowHeight/2)-(this.ball.imgBall.height/2)));
  this.ball.setDirection("SOUTH_EAST");
  
  this.stick=new barra("stick", "left", this);
  this.stick.location(parseInt(this.stick.separation) ,parseInt((this.windowHeight/2)-(this.stick.imgStick.height/2)));

}

Context.prototype.start = function(){
    this.state = "run";
    this.ball.start();
};

Context.prototype.stop = function(){
    this.state = "stop";
    this.ball.stop();
};

module.exports = Context;
