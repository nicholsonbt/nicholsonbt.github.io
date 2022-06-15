// Converts an angle in degrees to radians (camera FOV is in degrees, but calculations need radians).
function degreesToRadians(theta) {
	return Math.PI * (theta / 180);
}

function innitThree() {
	// Setup variables.
	nodes = [];
	edges = [];
	
	// Setup camera.
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
	camera.position.z = 50;
	
	// Setup scene.
	canvasHeight = 2 * (50 * Math.sin(degreesToRadians(70 / 2)) / Math.sin(degreesToRadians(90 - 70 / 2)));
	canvasWidth = (window.innerWidth / window.innerHeight) * canvasHeight;
	
	scene = new THREE.Scene();
	
	// Create nodes.
	let x, y, z, xVel, yVel, zVel, weight, colour;
	
	for (let i = 0; i < nodeCount; i++) {
		
		x = canvasWidth * (Math.random() - 0.5) * 1.2;
		y = canvasHeight * (Math.random() - 0.5) * 1.2;
		z = 20 * (Math.random() - 0.5);
		
		xVel = (Math.random() * 2) - 1;
		yVel = (Math.random() * 2) - 1;
		zVel = (Math.random() * 2) - 1;
		
		weight = Math.random() / 2 + 0.5;
		colour = Math.floor(256 * Math.random()) * 65793; // 65793 = (2^8)^0 + (2^8)^1 + (2^8)^2 which, when multiplied by an integer (0 <= x < 256), will output a greyscale colour.
		
		nodes[i] = new BackgroundNode(x, y, z, xVel, yVel, zVel, weight, colour);
	}
	
	// Setup renderer.
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x000000, 1.0)
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild(renderer.domElement);
	
	// Start animation loop.
	animate();
}


function removeEdges(chance) {
	// Iterate through all edges and remove some of them.
}

function lineInEdges(lines, nodeA, nodeB) {
	// Go through all nodes and 
}

function addEdges(chance) {
	// Iterate through all nodes and add some edges to them.
}


function animate() {
	requestAnimationFrame(animate);

	// Update and draw all nodes and edges.
	for (let i = 0; i < nodeCount; i++) {
		nodes[i].update();
		nodes[i].draw();
	}

	renderer.render( scene, camera );
}

window.addEventListener('load', function(e) {
	innitThree();
});