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
		var nodeMaterial = new THREE.MeshBasicMaterial( { color: colour, transparent : true, opacity : this.weight * maxWeight } );
		
		this.node = new THREE.Mesh(nodeGeometry, nodeMaterial);
		
		scene.add(this.node);
	}
	
	update() {
		// Calculate the new velocities and positions.
		let forces = getBoundaryForces(this.x, this.y, this.z);

		
		// v = u + at.
		let xVelNew = this.xVel + forces.x * deltaT;
		let yVelNew = this.yVel + forces.y * deltaT;
		let zVelNew = this.zVel + forces.z * deltaT;
		
		
		// Bound the node speed.
		let k;
		let speed = Math.sqrt(xVelNew * xVelNew + yVelNew * yVelNew + zVelNew * zVelNew);
		
		if (speed > maxSpeed) {
			k = maxSpeed / speed;
			
			xVelNew = xVelNew * k;
			yVelNew = yVelNew * k;
			zVelNew = zVelNew * k;
		} else if (speed < minSpeed) {
			k = minSpeed / speed;
			
			xVelNew = xVelNew * k;
			yVelNew = yVelNew * k;
			zVelNew = zVelNew * k;
		}
		
		// s = (u + v)t / 2.
		let newX = this.x + (this.xVel + xVelNew) * deltaT / 2;
		let newY = this.y + (this.yVel + yVelNew) * deltaT / 2;
		let newZ = this.z + (this.zVel + zVelNew) * deltaT / 2;
		
		
		// Set the current velocity as the new velocity.
		this.xVel = xVelNew;
		this.yVel = yVelNew;
		this.zVel = zVelNew;

		// Set the current position as the new position.
		this.x = newX;
		this.y = newY;
		this.z = newZ;
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
		
		this.fadeValue = fadeLength;
		
		// The weight of the edge is the average weight of both nodes, multiplied by the passed weight.
		this.maxOpacity = maxWeight * weight * (this.nodeA.weight + this.nodeB.weight) / 2;
		
		// The colour of the edge is the average colour of both nodes.
		let c = ((this.nodeA.colour / 65793) + (this.nodeB.colour / 65793)) / 2;
		let colour = Math.floor(c) * 65793;
		
		// Create the line.
		this.lineGeometry = new THREE.BufferGeometry();
		this.lineMaterial = new THREE.LineBasicMaterial( { color : colour, transparent : true, opacity : 0 } );
		
		this.lineData = new Float32Array(6);
		this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.lineData, 3));
		
		this.line = new THREE.Line(this.lineGeometry, this.lineMaterial);
		
		scene.add(this.line);
	}
	
	hasNode(node) {
		if (node == this.nodeA || node == this.nodeB)
			return true;
		
		return false;
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
		this.lineMaterial.opacity = this.maxOpacity * (fadeLength - this.fadeValue) / fadeLength;
		
		this.fadeValue -= 1;
		
		// If the node has finished fading in, return true.
		if (this.fadeValue <= 0) {
			this.fadeValue = 0;
			this.lineMaterial.opacity = this.maxOpacity;
			return true;
		}
		
		return false;
	}
	
	fadeOut() {
		// Fade the line out (opacity maximum to 0).
		this.lineMaterial.opacity = this.maxOpacity * (fadeLength - this.fadeValue) / fadeLength;
		
		this.fadeValue += 1;
		
		// If the node has finished fading out, return true.
		if (this.fadeValue >= fadeLength) {
			this.count = fadeLength;
			this.lineMaterial.opacity = 0;
			return true;
		}
		
		return false;
	}
}