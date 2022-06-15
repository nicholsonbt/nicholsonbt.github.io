// Converts an angle in degrees to radians (camera FOV is in degrees, but calculations need radians).
function degreesToRadians(theta) {
	return Math.PI * (theta / 180);
}

function innitThree() {
	// Setup variables.
	nodes = [];
	edges = [];
	fadeInEdges = [];
	fadeOutEdges = [];
	
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
		
		weight = Math.random();
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

function getBoundaryForces(x, y, z) {
	// Calculate the forces to be exerted on nodes, in order to keep them mostly in frame.
	// Since the nodes all have the same weight, some constant k, we can use force and acceleration synonymously.
	let xAccel = 0;
	let yAccel = 0;
	let zAccel = 0;
	
	let xMax = (canvasWidth / 2) * 1.2;
	let yMax = (canvasHeight / 2) * 1.2;
	let zMax = 5;
	
	if (x > xMax)
		xAccel = -0.5;
	else if (x > xMax * 0.8)
		xAccel = -0.1;
	else if (x < -xMax)
		xAccel = 0.5;
	else if (x < -xMax * 0.8)
		xAccel = 0.1;
	
	if (y > yMax)
		yAccel = -0.5;
	else if (y > yMax * 0.8)
		yAccel = -0.1;
	else if (y < -yMax)
		yAccel = 0.5;
	else if (y < -yMax * 0.8)
		yAccel = 0.1;
	
	if (z > zMax)
		zAccel = -0.5;
	else if (z > zMax * 0.8)
		zAccel = -0.1;
	else if (z < -zMax)
		zAccel = 0.5;
	else if (z < -zMax * 0.8)
		zAccel = 0.1;
	
	return {x: xAccel, y: yAccel, z: zAccel};
}


function removeEdges(chance) {
	// Iterate through all edges and remove some of them.
	toRemove = [];
	
	for (let k = 0; k < edges.length; k++) {
		if (Math.random() < chance) {
			toRemove.push(k);
		}
	}
	
	for (let i = 0; i < toRemove.length; i++) {
		fadeOutEdges.push(edges.splice(toRemove.pop(), 1)[0])
	}
}

function lineInEdges(lines, nodeA, nodeB) {
	// Go through all edges and return true if the passed nodes are in it.
	for (let k = 0; k < lines.length; k++) {
		if (lines[k].hasNode(nodeA)  && lines[k].hasNode(nodeB)) {
			return true;
		}
	}
	
	return false;
}

function addEdges(chance) {
	// Iterate through all nodes and add some edges to them.
	
	// If there are already the maximum number of edges, return.
	if (edges.length + fadeInEdges.length + fadeOutEdges.length >= maxEdges)
		return;
	
	
	for (let i = 0; i < nodeCount - 1; i++) {
		for (let j = 1; j < nodeCount; j++) {
			// For every unique tuple of nodes, if there is no pre-existing edge between them, there is a certain chance it will be added to the collection of edges to fade in.
			if (Math.random() < chance && !lineInEdges(edges, nodes[i], nodes[j]) && !lineInEdges(fadeInEdges, nodes[i], nodes[j]) && !lineInEdges(fadeOutEdges, nodes[i], nodes[j])) {
				fadeInEdges.push(new BackgroundEdge(nodes[i], nodes[j], Math.random()));
			}
		}
	}
}

function updateNodes() {
	// Update and draw all node.
	for (let i = 0; i < nodeCount; i++) {
		nodes[i].update();
		nodes[i].draw();
	}
}

function updateEdges() {
	// Update and draw all edges.
	for (let i = 0; i < edges.length; i++) {
		edges[i].update();
		edges[i].draw();
	}
}

function updateFadeInEdges() {
	let fadedIn = []
	
	// Iterate through all fadeInEdges and, if it has been faded in fully, add its index to a stack.
	for (let i = 0; i < fadeInEdges.length; i++) {
		// Update and draw all fadeInEdges.
		fadeInEdges[i].update();
		fadeInEdges[i].draw();
		
		// Check if the edge has fully faded in.
		if (fadeInEdges[i].fadeIn()) {
			fadedIn.push(i);
		}
	}
	
	// Use the stack to get all indices to remove in reverse order (as FIFO would change the indices of the next edge to be removed).
	// Add the edge to edges.
	for (let i = 0; i < fadedIn.length; i++) {
		edges.push(fadeInEdges.splice(fadedIn.pop(), 1)[0])
	}
}

function updateFadeOutEdges() {
	let fadedOut = []
	
	// Iterate through all fadeOutEdges and, if it has been faded out fully, add its index to a stack.
	for (let i = 0; i < fadeOutEdges.length; i++) {
		// Update and draw all fadeOutEdges.
		fadeOutEdges[i].update();
		fadeOutEdges[i].draw();
		
		// Check if the edge has fully faded out.
		if (fadeOutEdges[i].fadeOut()) {
			fadedOut.push(i);
		}
	}
	
	// Use the stack to get all indices to remove in reverse order (as FIFO would change the indices of the next edge to be removed).
	// Destroy the removed edge (to prevent it remaining in the scene).
	for (let i = 0; i < fadedOut.length; i++) {
		fadeOutEdges.splice(fadedOut.pop(), 1)[0].destroy();
	}
}

function animate() {
	requestAnimationFrame(animate);

	// Update and draw all nodes and edges.
	removeEdges(0.001); // On average, k * 0.001 edges (where k = maxEdges) will be removed (0.2) per frame.
	addEdges(0.00005); // On average, (n-1) * (n-1) * 0.00005 edges will be added (where n = nodeCount) will be added (0.4) per frame - assuming not already at maximum edges.
	
	updateNodes();
	updateEdges();
	updateFadeInEdges();
	updateFadeOutEdges();

	renderer.render( scene, camera );
}

window.addEventListener('load', function(e) {
	innitThree();
});