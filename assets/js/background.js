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
	
	let fov = 70;
	let cameraZ = 50;
	
	// Setup camera.
	camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.01, 1000);
	camera.position.z = cameraZ;
	
	// Setup scene.
	canvasHeight = 2 * (cameraZ * Math.sin(degreesToRadians(fov / 2)) / Math.sin(degreesToRadians(90 - fov / 2)));
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
	renderer.setClearColor(0x080823, 1.0)
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
	
	let xMax = (canvasWidth / 2) * 0.8;
	let yMax = (canvasHeight / 2) * 0.8;
	let zMax = 5;
	
	let mult = 0.01;

	
	if (x > xMax)
		xAccel = -Math.pow((xMax - x) * mult, 2);
	else if (x < -xMax)
		xAccel = Math.pow((xMax - x) * mult, 2);
	
	if (y > yMax)
		yAccel = -Math.pow((yMax - y) * mult, 2);
	else if (y < -yMax)
		yAccel = Math.pow((yMax - y) * mult, 2);
	
	if (z > zMax)
		zAccel = -Math.pow((zMax - z) * mult, 2);
	else if (z < -zMax)
		zAccel = Math.pow((zMax - z) * mult, 2);
	
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
	
	let perFrameRem = 0.2;
	let perFrameAdd = 0.3;
	
	
	// Slightly rotate the camera as the mouse moves.
	camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, ((mouse.y - window.innerHeight / 2) * Math.PI) / 100000, 0.1);
	camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, ((mouse.x - window.innerWidth / 2) * Math.PI) / 100000, 0.1);

	// Update and draw all nodes and edges.
	let chanceRem = perFrameRem / maxEdges;
	let chanceAdd = perFrameAdd / ((nodeCount - 1) * (nodeCount - 1));
	
	removeEdges(chanceRem); // On average, k * 0.001 edges (where k = maxEdges) will be removed (0.2) per frame.
	addEdges(chanceAdd); // On average, (n-1) * (n-1) * 0.00005 edges will be added (where n = nodeCount) will be added (0.31) per frame - assuming not already at maximum edges.
	
	updateNodes();
	updateEdges();
	updateFadeInEdges();
	updateFadeOutEdges();

	renderer.render( scene, camera );
}

window.addEventListener('load', function(e) {
	innitThree();
});

window.addEventListener('mousemove', function(e) {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});