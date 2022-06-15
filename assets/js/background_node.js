class BackgroundNode {
	constructor(x, y, z, xVel, yVel, zVel, weight, colour) {
		// The x, y and z starting positions should only slightly extend off of the screen.
		// The weight of the node represents its' brightness and the brightness of any edges connected to it.
		// The colour of the node should be a bluish-white.
		this.x = x;
		this.y = y;
		this.z = z;
		
		this.xVel = xVel;
		this.yVel = yVel;
		this.zVel = zVel;
		
		this.weight = weight;
		this.colour = colour;
		
		// Create a sphere mesh.
		var nodeGeometry = new THREE.SphereGeometry(nodeRadius, nodeWidthSegments, nodeHeightSegments)
		var nodeMaterial = new THREE.MeshBasicMaterial( { color: colour, transparent : true, opacity : this.weight } );
		
		this.node = new THREE.Mesh(nodeGeometry, nodeMaterial);
		
		scene.add(this.node);
	}
	
	update() {
		// Calculate the new velocities and positions.
		this.x += this.xVel * deltaT;
		this.y += this.yVel * deltaT;
		this.z += this.zVel * deltaT;
	}
	
	draw() {
		// Draw the node.
		this.node.position.set(this.x, this.y, this.z);
	}
	
	destroy() {
		// Remove the node from the scene.
		scene.remove(this.node);
	}
}


class BackgroundEdge {
	constructor(nodeA, nodeB, weight) {
		// Connect two nodes with a weighted edge (the weight will also depend upon the average weighting of the two nodes).
		
		// An edge is a line between two nodes.
		this.nodeA = nodeA;
		this.nodeB = nodeB;
		
		// The colour of the edge is the average colour of both nodes.
		let colour = (this.nodeA.colour + this.nodeB.colour) / 2;
		
		// The weight of the edge is the average weight of both nodes, multiplied by the passed weight.
		weight = weight * (this.nodeA.weight + this.nodeB.weight) / 2;
		
		// Create the line.
		this.lineGeometry = new THREE.BufferGeometry();
		this.lineMaterial = new THREE.LineBasicMaterial( { color : colour, linewidth : 1, transparent : true, opacity : weight } );
		
		this.lineData = new Float32Array(6);
		this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.lineData, 3));
		
		this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
		
		scene.add(this.line);
	}
	
	update() {
		// Update the start and end positions of the line using the node positions.
		this.lineData[0] = this.nodeA.x;
		this.lineData[1] = this.nodeA.y;
		this.lineData[2] = this.nodeA.z;
		this.lineData[3] = this.nodeB.x;
		this.lineData[4] = this.nodeB.y;
		this.lineData[5] = this.nodeB.z;
	}
	
	draw() {
		// Draw the line.
		this.lineGeometry.setDrawRange(0, 6);
		this.lineGeometry.attributes.position.needsUpdate = true;
	}
	
	destroy() {
		// Remove the line from the scene.
		scene.remove(this.line);
	}
	
	fadeIn() {
		// Fade the line in (opacity 0 to maximum).
	}
	
	fadeOut() {
		// Fade the line out (opacity maximum to 0).
	}
}