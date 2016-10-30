
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
