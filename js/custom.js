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


