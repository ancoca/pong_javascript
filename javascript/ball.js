

var animate = undefined;
var subject = require('./observer/Subject');

function Ball(id_ball, context) {
    this.imgBall = document.getElementById(id_ball);
    this.control = "Stop";
    this.speed = 1;
    this.context = context;
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

Ball.prototype = new subject();

Ball.prototype.setDirection = function(CARDINAL_POINT){
    this.posX = this.directions[CARDINAL_POINT].posX;
    this.posY = this.directions[CARDINAL_POINT].posY;
};

Ball.prototype.location = function(x, y) {
  if (y <= 0 || y >= this.context.windowHeight-this.imgBall.height) {
    this.posY = this.posY*(-1);
  }

  if(x <= 0 || x >= this.context.windowWidth-this.imgBall.width) {
    this.posX = this.posX*(-1);
  }

  this.imgBall.style.top = (Math.round(y)) + "px";
  this.imgBall.style.left = (Math.round(x)) + "px";

  this.Notify(this);
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

Ball.prototype.getLocation = function() {
  return {x:parseInt(this.imgBall.style.left),y:parseInt(this.imgBall.style.top)};
}
module.exports = Ball;
