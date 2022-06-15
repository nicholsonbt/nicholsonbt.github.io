// Holds all global js variables, class names, and function names to prevent undesired over overriding.

// Global Variables:
var pageHeight = 0;				// The inner height of the page.
var canScroll = false;			// A flag stating whether or not the user is currently allowed to scroll.
var currentPage = 0;			// The current page being viewed by the user.
var nodeRadius = 0.2;			// The radius of the node.
var nodeWidthSegments = 32;		// The number of horizontal segments per node.
var nodeHeightSegments = 16;	// The number of vertical segments per node.
var deltaT = 0.01;				// The amount of time simulated for the background per frame.
var camera;
var scene;
var renderer;
var nodes;
var edges;
var canvasWidth;
var canvasHeight;
var nodeCount = 20;
var maxEdges = 20;

// Class Names:

// BackgroundEdge		background_node.js
// BackgroundNode		background_node.js

// Function Names (JavaScript does not support overloading, so same function names = same function signature):

// addEdges				background.js
// animate				background.js
// degreesToRadians		background.js
// goToPage				page_slide.js
// innit				page_slide.js
// innitThree			background.js
// lineInEdges			background.js
// removeEdges			background.js
// setSize				page_slide.js