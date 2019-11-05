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

function drawMask(){
    function drawCheckeredBackground(can, nRow, nCol) {

        var ctx = can.getContext("2d");
        var w = 256;
        var h = 256;
    
        nRow = nRow || 128;    // default number of rows
        nCol = nCol || 128;    // default number of columns
    
        w /= nCol;            // width of a block
        h /= nRow;            // height of a block
    
    
        
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0,0,256,256);
        
        ctx.fillStyle = "#000000";
    
        for (var i = 0; i < nRow; ++i) {
            if (i % 2 === 0){
              for (var j = 0, col = nCol; j < col; j++) {
                  ctx.rect(1 * j * w - 1, i * h - 1, w, h);
              }        
            }
            else{
              for (var j = 0, col = nCol / 2; j < col; j++) {
                  ctx.rect(2 * j * w - 1, i * h - 1, w, h);
              }
            }
        }
        
        ctx.fill();
    }
    
    const cv = new OffscreenCanvas(256,256);
    
    drawCheckeredBackground(cv);
    return cv;
}

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

    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha:true
    });
    renderer.toneMapping = THREE.LinearToneMapping;

    renderer.setClearColor( 0x000000, 0 ); 

    stepcount.innerHTML =  window.games && window.games.length > 0 && window.games[0].round;
    
    const domEl = document.getElementById('threecontainer');

    renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);

    domEl.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera( 55, domEl.offsetWidth / domEl.offsetHeight, 0.01, 400 ); 
    const scene = new THREE.Scene();

    const cubeMaterials = []
    const textures = []
    var alphaMaskCanvas = drawMask();
    for (let i=0; i< adjacencyInfo.length; i++){
        const canvas = document.getElementById('game' + i);
        const texture = new THREE.Texture(canvas);
        const alphaMap = new THREE.CanvasTexture(alphaMaskCanvas);
        //alphaMap.magFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        textures.push(texture)
        //const cubematerial = new THREE.MeshLambertMaterial({
        const cubematerial = new THREE.MeshBasicMaterial({            
            color:0xFFFFFF,
            map:texture,
            transparent: true
            
        });
        cubematerial.alphaMap = alphaMap;
        cubeMaterials.push(cubematerial)
    }
    const cubegeometry = new THREE.BoxGeometry(90,90,90);
    var cube = new THREE.Mesh(cubegeometry, cubeMaterials);
   
    const ambientlight = new THREE.AmbientLight(0x404040, 2);
    const light = new THREE.PointLight( 0xffffff, 2 );
   // light.castShadow = true;
    light.position.set(45,90,140);
    
    camera.position.set(120,120,120);
    scene.add(cube);
    scene.add(light);
    scene.add(ambientlight);
5
    renderScene = new THREE.RenderPass(scene, camera);

    const bloomStrength = 1.6;
    const bloomRadius = 0.2;
    const bloomThreshold = 0.01;
    
	const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), bloomStrength, bloomRadius, bloomThreshold);
    composer = new THREE.EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.enableZoom = true;
    controls.autoRotate = false;
  
    const animate = function(){

        textures.forEach((texture) => {
            texture.needsUpdate = true;
        })
        
        frameID = requestAnimationFrame( animate );
        now = Date.now();
        delta = now - then;

        composer.render();
        //renderer.render( scene, camera );
        //cube.rotation.x += .003;
        //cube.rotation.y -= .003;
        //cube.rotation.z += .001;
        if (delta > interval) {
            
            if (isplaying){

                window.games.forEach((game) => {
                    game.step();
                    game.draw();         
                })

                toggleBtn.innerHTML = 'Stop';
                stepcount.innerHTML = window.games && window.games.length > 0 && window.games[0].round;
                
            }
            else{
                toggleBtn.innerHTML = 'Start';
            }
            then = now - (delta % interval);

        }
    }

    animate();

};


