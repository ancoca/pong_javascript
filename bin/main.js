(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


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

},{"./observer/Subject":6}],2:[function(require,module,exports){

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

},{"./ball":1,"./stick":8}],3:[function(require,module,exports){

var utils = require('./utils');
var singletonContext = require('./singletonContext');

//Once the page has been completely loaded. Including images. We start the game
window.onload=function(){

    var context = singletonContext.getInstance();

    var startGame=function(event){
        event.preventDefault();
        utils.clearSelection();
        if (context.state === "run"){
          context.stop();
        }else{
          context.start();
        }
    };

    window.addEventListener("keypress",startGame,false);



};

},{"./singletonContext":7,"./utils":9}],4:[function(require,module,exports){
//http://www.codeproject.com/Articles/13914/Observer-Design-Pattern-Using-JavaScript

function ArrayList()
{
   this.aList = []; //initialize with an empty array
}

ArrayList.prototype.Count = function()
{
   return this.aList.length;
};

ArrayList.prototype.Add = function( object )
{
   //Object are placed at the end of the array
   return this.aList.push( object );
};

ArrayList.prototype.GetAt = function( index ) //Index must be a number
{
   if( index > -1 && index < this.aList.length )
      return this.aList[index];
   else
      return undefined; //Out of bound array, return undefined
};

ArrayList.prototype.Clear = function()
{
   this.aList = [];
};

ArrayList.prototype.RemoveAt = function ( index ) // index must be a number
{
   var m_count = this.aList.length;

   if ( m_count > 0 && index > -1 && index < this.aList.length )
   {
      switch( index )
      {
         case 0:
            this.aList.shift();
            break;
         case m_count - 1:
            this.aList.pop();
            break;
         default:
            var head   = this.aList.slice( 0, index );
            var tail   = this.aList.slice( index + 1 );
            this.aList = head.concat( tail );
            break;
      }
   }
};

ArrayList.prototype.Insert = function ( object, index )
{
   var m_count       = this.aList.length;
   var m_returnValue = -1;

   if ( index > -1 && index <= m_count )
   {
      switch(index)
      {
         case 0:
            this.aList.unshift(object);
            m_returnValue = 0;
            break;
         case m_count:
            this.aList.push(object);
            m_returnValue = m_count;
            break;
         default:
            var head      = this.aList.slice(0, index - 1);
            var tail      = this.aList.slice(index);
            this.aList    = this.aList.concat(tail.unshift(object));
            m_returnValue = index;
            break;
      }
   }

   return m_returnValue;
};

ArrayList.prototype.IndexOf = function( object, startIndex )
{
   var m_count       = this.aList.length;
   var m_returnValue = - 1;

   if ( startIndex > -1 && startIndex < m_count )
   {
      var i = startIndex;

      while( i < m_count )
      {
         if ( this.aList[i] == object )
         {
            m_returnValue = i;
            break;
         }

         i++;
      }
   }

   return m_returnValue;
};


ArrayList.prototype.LastIndexOf = function( object, startIndex )
{
   var m_count       = this.aList.length;
   var m_returnValue = - 1;

   if ( startIndex > -1 && startIndex < m_count )
   {
      var i = m_count - 1;

      while( i >= startIndex )
      {
         if ( this.aList[i] == object )
         {
            m_returnValue = i;
            break;
         }

         i--;
      }
   }

   return m_returnValue;
};

module.exports = ArrayList;

},{}],5:[function(require,module,exports){
// http://www.codeproject.com/Articles/13914/Observer-Design-Pattern-Using-JavaScript

function withObserver(){

   this.Update = function()
   {
      return;
   }
}

module.exports = withObserver;

},{}],6:[function(require,module,exports){
//http://www.codeproject.com/Articles/13914/Observer-Design-Pattern-Using-JavaScript

var arraylist = require('./ArrayList');

function Subject()
{
   this.observers = new arraylist();
}

// Context represents an object instance (Ball in our case)
Subject.prototype.Notify = function( context )
{
   var m_count = this.observers.Count();

   for( var i = 0; i < m_count; i++ )
      this.observers.GetAt(i).Update( context );
};

Subject.prototype.getCountRajoles = function(  )
{
   var m_count = this.observers.Count();
   var cont=0;
   for( var i = 0; i < m_count; i++ ){
      if (this.observers.GetAt(i) instanceof Rajola) cont++;
   		//alert(this.observers.GetAt(i).getClass());
   }
   return cont;
};

Subject.prototype.AddObserver = function( observer )
{
   if( !observer.Update )
      throw 'Wrong parameter';

   this.observers.Add( observer );
};

Subject.prototype.RemoveObserver = function( observer )
{
   if( !observer.Update )
      throw 'Wrong parameter';

   this.observers.RemoveAt(this.observers.IndexOf( observer, 0 ));
};

module.exports = Subject;

},{"./ArrayList":4}],7:[function(require,module,exports){
/**
 *  Singleton patter aplied to context
 */
"use strict";

var context = require('./context');

var SingletonContext = (function () {
    var instance;

    function createInstance() {
        var object = new context();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

module.exports = SingletonContext;

},{"./context":2}],8:[function(require,module,exports){

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

},{"./observer/Observer":5}],9:[function(require,module,exports){

function clearSelection() {
     if(document.selection && document.selection.empty) {
         document.selection.empty();
     } else if(window.getSelection) {
         var sel = window.getSelection();
         sel.removeAllRanges();
     }
 }

 module.exports.clearSelection = clearSelection;

},{}]},{},[3])