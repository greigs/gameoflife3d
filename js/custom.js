function rand(min, max){
    return parseInt(Math.random() * (max - min) + min);
};

function toggleInfo(){
    const infoWindow = document.getElementById('infowindow');
    if(!infoWindow.style.display || infoWindow.style.display == 'none'){
        infoWindow.style.display = 'block';
    }
    else{
        infoWindow.style.display = 'none';
    }
};


function init(){
    const fps = 10;
    var now;
    var then = Date.now();
    const interval = 1000/fps;
    var delta; 
    var isplaying = true;

    const stepcount = document.getElementById('count');
    const toggleBtn = document.getElementById('toggle');
    const stepBtn = document.getElementById('step'); 
    const clearBtn = document.getElementById('clear'); 
    const randomBtn = document.getElementById('random'); 
    const adjacencyInfo = [{},{},{},{},{},{}]
    window.games = [];

    toggleBtn.addEventListener('mousedown', function(e){
        isplaying = !isplaying;
    });
    stepBtn.addEventListener('mousedown', function(e){
        window.games.forEach((game) => {
            game.step();
            if (!isplaying){
                game.draw();
            }  
        })
        stepcount.innerHTML = window.games && window.games[0].round;
    });
    clearBtn.addEventListener('mousedown', function(e){
        isplaying = false;               
        
        window.games.forEach((game) => {
            game.clear();
            game.round = 0;    
        })
        stepcount.innerHTML =  window.games && window.games[0].round;
    });
    randomBtn.addEventListener('mousedown', function(e){
        isplaying = false;
        window.games.forEach((game) => {
            game.randomize();
            game.round = 0;
        })
        stepcount.innerHTML =  window.games && window.games[0].round;
    });

    

    for (let i=0; i< adjacencyInfo.length; i++){
        const canvas = document.getElementById('game' + i);
        const game = new Game(canvas, {
            cellColor:'#00ffe5', 
            cellsX:32, 
            cellsY:32, 
            cellSize:2, 
            gridColor:'#FFFFFF', 
            bgColor:'#050505'}
            );
        
        game.randomize();
    
        //window.games.push(game)
    }

   

};


var ws;
var prevGesture = '';

ws = new WebSocket("ws://localhost:6437/v6.json");
ws.onopen = function(event) {
    var enableMessage = JSON.stringify({enableGestures: true});
    ws.send(enableMessage); // Enable gestures
    ws.send(JSON.stringify({focused: true})); // claim focus

};

ws.onmessage = function(event) {
    
        var obj = JSON.parse(event.data);
        // var str = JSON.stringify(obj, undefined, 2);
        //document.getElementById("output").innerHTML = '<pre>' + str + '</pre>';
        // if (pauseOnGesture && obj.gestures.length > 0) {
        //     togglePause();
        // }
        if (obj.gestures.length){
            var gesture = obj.gestures[0].type + ' ' + (obj.gestures[0].direction[0] > 0.0 ? 'right' : 'left')
            if (prevGesture !== gesture)
            {
/*
    HEAP32[ptr >> 2] = SDL.DOMEventToSDLEvent[event.type];
    HEAP8[ptr + 8 >> 0] = down ? 1 : 0;
    HEAP8[ptr + 9 >> 0] = 0;
    HEAP32[ptr + 12 >> 2] = scan;
    HEAP32[ptr + 16 >> 2] = key;
    HEAP16[ptr + 20 >> 1] = SDL.modState;
    HEAP32[ptr + 24 >> 2] = event.keypressCharCode || key;

      120: 27,
  122: 29,
*/
                window.HEAP32[window.ptr >> 2] = 768;
                window.HEAP8[window.ptr + 8 >> 0] = 1;
                window.HEAP8[window.ptr + 9 >> 0] = 0;
                window.HEAP32[window.ptr + 12 >> 2] = 27;
                window.HEAP32[window.ptr + 16 >> 2] = 120;
                //window.HEAP16[ptr + 20 >> 1] = SDL.modState;
                window.HEAP32[window.ptr + 24 >> 2] = 120;
                //debugger

             //   window.codo_key_buffer.push(122); //122
                console.log(gesture)
            }
            prevGesture = gesture;
        }
        else{
            if (prevGesture !== ''){
                console.log('stop')
            }
            prevGesture = '';
        }

    
};
