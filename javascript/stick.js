
var withObserver = require('./observer/Observer');

function Stick(id_stick, side, context) {
  this.imgStick = document.getElementById(id_stick);
  this.side= side || "left";
  this.context = context;
  this.separation=50;
  var self = this;

  withObserver.call(Stick.prototype);
  this.context.ball.AddObserver(this);

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

    if (y >= this.context.windowHeight-this.imgStick.height) {
      y = this.context.windowHeight-this.imgStick.height;
    }

    this.imgStick.style.top = (Math.round(y)) + "px";
    this.imgStick.style.left = (Math.round(x)) + "px";
	};

  this.Update = function(ball) {
    var ballPosition = ball.getLocation();
    var stickPosition = this.getLocation();

    var ballCloseStickLeft = (this.side=="left" && ballPosition.x<=stickPosition.x+this.imgStick.width);
    var ballCloseStickRight = (this.side=="right" && ballPosition.x+ball.imgBall.width>=stickPosition.x);

    if (  ballCloseStickLeft || ballCloseStickRight) {

        var distance=Math.abs((stickPosition.y+this.imgStick.height/2)-(ballPosition.y+ball.imgBall.height/2));
        var minDistAllowed=(this.imgStick.height/2+ball.imgBall.height/2);
        if (distance<minDistAllowed) {
            ball.posX = ball.posX*(-1);
        }else{
          if ((ballPosition.x < this.separation) || (ballPosition.x > this.context.windowWidth - this.separation)){
              this.context.stop();
              alert("Game OVER");
              this.context.ball.location(parseInt((this.context.windowWidth/2)-(this.context.ball.imgBall.width/2)) ,parseInt((this.context.windowHeight/2)-(this.context.ball.imgBall.height/2)));
              this.location(parseInt(this.separation) ,parseInt((this.context.windowHeight/2)-(this.imgStick.height/2)));
          }
      }
  }
  }
}

Stick.prototype.getLocation = function() {
  return {x:parseInt(this.imgStick.style.left),y:parseInt(this.imgStick.style.top)};
}

module.exports = Stick;
