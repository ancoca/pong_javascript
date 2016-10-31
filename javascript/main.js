
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
