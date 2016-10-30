(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

function Ball(id_ball) {
    this.imgBall = document.getElementById(id_ball);
    this.control = "Stop";
    this.speed = 1;
    var self = this;
    this.getBallSelf = function(){return self;};

    this.directions={
      NORTH:{posX:0,posY:-1},
      SOUTH:{posX:0,posY:1},
      EAST:{posX:1,posY:0},
      WEST:{posX:-1,posY:0},
      NORTH_EAST:{posX:1,posY:-1},
      SOUTH_EAST:{posX:1,posY:1},
      SOUTH_WEST:{posX:-1,posY:1},
      NORTH_WEST:{posX:-1,posY:-1},
    };
}

Ball.prototype.setDirection = function(CARDINAL_POINT){
    this.posX = this.directions[CARDINAL_POINT].posX;
    this.posY = this.directions[CARDINAL_POINT].posY;
};

Ball.prototype.location = function(x, y) {
  if (y <= 0 || y >= this.windowHeight-this.imgBall.height) {
    this.posY = this.posY*(-1);
  }

  if(x <= 0 || x >= this.windowWidth-this.imgBall.width) {
    this.posX = this.posX*(-1);
  }

  this.imgBall.style.top = (Math.round(y)) + "px";
  this.imgBall.style.left = (Math.round(x)) + "px";
};

Ball.prototype.move = function() {
  this.location(parseInt(this.imgBall.style.left) + (this.posX * this.speed) ,parseInt(this.imgBall.style.top) + (this.posY * this.speed));
};

Ball.prototype.start = function() {
  var self = this.getBallSelf();
  animate = setInterval(function(){self.move();}, 5);
};

Ball.prototype.stop = function() {
  clearTimeout(animate);
};

module.exports = Ball;

},{}],2:[function(require,module,exports){

var bola = require('./ball');
var barra = require('./stick');
var utils = require('./utils');
var windowWidth=window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowHeight=window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;


window.onload=function(){
    var ball=new bola("bola");
    ball.windowWidth = windowWidth;
    ball.windowHeight = windowHeight;
    ball.location(parseInt((ball.windowWidth/2)-(ball.imgBall.width/2)) ,parseInt((ball.windowHeight/2)-(ball.imgBall.height/2)));

    var stick=new barra("stick");
    stick.windowWidth = windowWidth;
    stick.windowHeight = windowHeight;
    stick.location(parseInt(stick.separation) ,parseInt((stick.windowHeight/2)-(stick.imgStick.height/2)));

    var controlMovimiento=function(event){
        event.preventDefault();
        utils.clearSelection();
        if (ball.control.match("Start")) {
            ball.control="Stop";
            ball.stop();
        }else{
            switch (event.type){
                case "dblclick":
                    ball.control="Start";
                    ball.setDirection("NORTH_WEST");
                    break;
                case "click":
                    ball.control="Start";
                    ball.setDirection("NORTH");
                    break;
                default:
                    ball.control="Start";
                    ball.setDirection("WEST");
                    break;
            }
            ball.start();
        }
    };

    window.addEventListener("dblclick",controlMovimiento,false);
    window.addEventListener("click",controlMovimiento,false);
    window.addEventListener("keyup",controlMovimiento,false);

};

},{"./ball":1,"./stick":3,"./utils":4}],3:[function(require,module,exports){

function Stick(id_stick, side) {
  this.imgStick = document.getElementById(id_stick);
  this.side= side || "left";
  this.separation=50;
  var self = this;

  window.addEventListener("mousemove",
    function(e){
      y= (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      self.location(self.separation,y);
  },false);

	//Draw stick on screen using coordinates
	this.location = function(x,y){
    if (y <= 0) {
      y = 0;
    }

    if (y >= this.windowHeight-this.imgStick.height) {
      y = this.windowHeight-this.imgStick.height;
    }

    this.imgStick.style.top = (Math.round(y)) + "px";
    this.imgStick.style.left = (Math.round(x)) + "px";
	};
}

module.exports = Stick;

},{}],4:[function(require,module,exports){

function clearSelection() {
     if(document.selection && document.selection.empty) {
         document.selection.empty();
     } else if(window.getSelection) {
         var sel = window.getSelection();
         sel.removeAllRanges();
     }
 }

 module.exports.clearSelection = clearSelection;

},{}]},{},[2])