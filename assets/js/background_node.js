class BackgroundNode {
	constructor(x, y, z, xVel, yVel, zVel, weight, colour) {
		// The x, y and z starting positions should only slightly extend off of the screen.
		// The weight of the node represents its' brightness and the brightness of any edges connected to it.
		// The colour of the node should be a bluish-white.
		
		// Create a sphere mesh here.
	}
	
	update() {
		// Calculate the new velocities and positions here.
	}
	
	draw() {
		// Draw the node here.
	}
	
	destroy() {
		// Remove the node from the scene.
	}
}


class BackgroundEdge {
	constructor(nodeA, nodeB, weight) {
		// Connect two nodes with a weighted edge (the weight will also depend upon the average weighting of the two nodes).
	}
	
	update() {
		// Update the start and end positions of the line using the node positions.
	}
	
	draw() {
		// Draw the line.
	}
	
	destroy() {
		// Remove the line from the scene.
	}
	
	fadeIn() {
		// Fade the line in (opacity 0 to maximum).
	}
	
	fadeOut() {
		// Fade the line out (opacity maximum to 0).
	}
}