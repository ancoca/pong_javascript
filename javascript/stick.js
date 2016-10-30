
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
