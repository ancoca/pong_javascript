
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
