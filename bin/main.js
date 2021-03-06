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

  this.stick=new barra("stick", "left", this, true);
  this.stick.location(parseInt(this.stick.separation) ,parseInt((this.windowHeight/2)-(this.stick.imgStick.height/2)));

  this.stick2=new barra("stick2", "right", this, true);
  
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

    utils.checkCookie(function(){  window.addEventListener("keypress",startGame,false);});
    window.onresize = function(){
        context.windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        context.windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        context.stick.rezise();
        context.stick2.rezise();
    }



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

function Stick(id_stick, side, context, autopilot) {
  this.imgStick = document.getElementById(id_stick);
  this.side= side || "left";
  this.context = context;
  this.separation=50;
  this.autopilot = autopilot || false;
  var self = this;


  if (this.side=="left") {
    this.imgStick.style.left=this.separation+'px'
  } else {
    this.imgStick.style.left=this.context.windowWidth-this.imgStick.width-this.separation;
  }

  withObserver.call(Stick.prototype);
  this.context.ball.AddObserver(this);

  if (!this.autopilot) {
    window.addEventListener("mousemove",
      function(e){
        y= (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        self.location(self.separation,y);
    },false);
  }

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

    if (autopilot) {
      this.location(parseInt(this.imgStick.style.left) ,ballPosition.y);
    }

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
          }
      }
  }
  }
}

Stick.prototype.getLocation = function() {
  return {x:parseInt(this.imgStick.style.left),y:parseInt(this.imgStick.style.top)};
}

Stick.prototype.rezise = function() {
  if (this.side=="left") {
    this.imgStick.style.left=this.separation+'px'
  } else {
    this.imgStick.style.left=this.context.windowWidth-this.imgStick.width-this.separation;
  }
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

function setCookie(cname, cvalue, exdays) {
    if (cvalue && cvalue!== ""){
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showPlayerProfile(){
  var user = getCookie("username");
  if (user && user!==""){
    var nicknameElement=document.getElementById("playerLeft");
    nicknameElement.innerHTML= user;
    var dataImage = localStorage.getItem('imgData');
    if (dataImage){
      var profileImg=document.createElement("img");
      profileImg.src = "data:image/png;base64," + dataImage;
      profileImg.width=48;
      profileImg.height=64;
      nicknameElement.parentNode.insertBefore(profileImg,nicknameElement);
    }
    return true;
  }else{
    return false;
  }
}

function checkCookie(addGameKeyBindings) {

    var user = getCookie("username");
    if (user !== "") {
        showPlayerProfile();
        addGameKeyBindings();
    } else {
        // Get the modal
        var modal = document.getElementById('myModal');
        document.getElementById('blah').style.display="none";
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];
        span.onclick = function() {
            if (showPlayerProfile()){
              modal.style.display = "none";
              addGameKeyBindings();
            }
        };
        window.onclick = function(event) {
          if (event.target == modal) {
            if (showPlayerProfile()){
              modal.style.display = "none";
              addGameKeyBindings();
            }
          }
        };
        modal.style.display = "block";

        var nickname = document.getElementById("nickname_");
        nickname.addEventListener("change",function(){setCookie("username", nickname.value, 365);});
        nickname.addEventListener("blur",function(){setCookie("username", nickname.value, 365);});
        nickname.addEventListener("focus",function(){setCookie("username", nickname.value, 365);});

        var imgProfile = document.getElementById("imgProfile");
        imgProfile.addEventListener("change",function(){readURL(this);});
    }
    document.getElementById("playerRight").innerHTML= "Computer";
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var MAX_WIDTH = 48;
    var MAX_HEIGHT = 64;
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    var dataURL = canvas.toDataURL("image/jpg");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function save(){
  var bannerImage = document.getElementById('blah');
  var imgData = getBase64Image(bannerImage);
  localStorage.setItem("imgData", imgData);
}

function readURL(input) {
  if (input.files && input.files[0]) {
      document.getElementById('blah').style.display="block";
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("blah").src=e.target.result;
          //$('#blah').attr('src', e.target.result);
          save();
      };
      reader.readAsDataURL(input.files[0]);
  }
}

 module.exports.clearSelection = clearSelection;
 module.exports.checkCookie = checkCookie;

},{}]},{},[3])