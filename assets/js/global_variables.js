// Holds all global js variables, class names, and function names to prevent undesired over overriding.

// Global Variables:
var pageHeight = 0;				// The inner height of the page.
var canScroll = false;			// A flag stating whether or not the user is currently allowed to scroll.
var currentPage = 0;			// The current page being viewed by the user.
var nodeRadius = 0.2;			// The radius of the node.
var nodeWidthSegments = 32;		// The number of horizontal segments per node.
var nodeHeightSegments = 16;	// The number of vertical segments per node.
var deltaT = 0.025;				// The amount of time simulated for the background per frame.
var camera;						// The three.js camera used for the background.
var scene;						// The three.js scene used for the background.
var renderer;					// The three.js renderer used for the background.
var nodes;						// An array of BackgroundNodes.
var edges;						// An array of BackgroundEdges.
var fadeInEdges;				// An array of BackgroundEdges that are being faded in.
var fadeOutEdges;				// An array of BackgroundEdges that are being faded out.
var fadeLength = 500;			// The number of frames that instances of BackgroundEdge should fade in/out.
var canvasWidth;				// The width of the canvas at z = 0.
var canvasHeight;				// The height of the canvas at z = 0.
var nodeCount = 80;			// The number of nodes.
var maxEdges = 200;				// The maximum number of edges.
var maxWeight = 0.5;			// The maximum weight of nodes and edges (used for opacity).
var minSpeed = 0.5;				// The minimum speed of a node.
var maxSpeed = 1;				// The maximum speed of a node.

// Class Names:

// BackgroundEdge		background_node.js
// BackgroundNode		background_node.js

// Function Names (JavaScript does not support overloading, so same function names = same function signature):

// addEdges				background.js
// animate				background.js
// degreesToRadians		background.js
// getBoundaryForces	background.js
// goToPage				page_slide.js
// innit				page_slide.js
// innitThree			background.js
// lineInEdges			background.js
// removeEdges			background.js
// setSize				page_slide.js
// updateEdges			background.js
// updateFadeInEdges	background.js
// updateFadeOutEdges	background.js
// updateNodes			background.js