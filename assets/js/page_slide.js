// Global Variables:
var pageHeight = 0;    // The inner height of the page.
var canScroll = false; // A flag stating whether or not the user is currently allowed to scroll.
var currentPage = 0;   // The current page being viewed by the user.


// This function will cause a transition to scroll from one page to another.
function goToPage(newPage, timeToTake) {
	var container = document.getElementById("page-slide-container");
	
	// If trying to move to the current page (this is useful for when the page has been resized), do transformation instantly.
	if (newPage == currentPage)
		timeToTake = 0;
	
	// Only change page if the new page is within the range of pages.
	if (0 <= newPage && newPage < document.getElementsByClassName("section").length) {
		
		// A page that is currently transitioning can't be scrolled again.
		canScroll = false;
		
		// Set the current page to the new page.
		currentPage = newPage;
		
		// Translating the camera to pageHeight * currentPage can be done by transforming the page/container to -pageHeight * currentPage instead.
		let newTranslate = -pageHeight * currentPage;
		
		// Set the transformation and transition for the container.
		container.style.transform = "translate(0px, " + newTranslate + "px)";
		container.style.transition = "all " + timeToTake + "ms cubic-bezier(0.645, 0.045, 0.355, 1) 0s";
		
		// Set a timeout so that the user can scroll again once the transition has been completed.
		setTimeout(function(){ canScroll = true; }, timeToTake);
	}
}


function setSize() {
	// Get the inner height.
	pageHeight = window.innerHeight;
	
	// Resize all pages to the inner height.
	const elements = document.getElementsByClassName("section");
	for (let i = 0; i < elements.length; i++) {
		elements[i].setAttribute("style", "height:" + pageHeight + "px");
	}
	
	// Calls goToPage for the current page because a resize in height will have changed what the required transformation is.
	goToPage(currentPage, 0);
};

function innit() {
	// Initialise global variables:
	currentPage = 0;
	canScroll = true;
	
	// Setup dynamically assigned values.
	setSize();
}


// Event Listeners:
window.addEventListener('load', function(e) {
	// Initialise global variables and setup dynamically assigned values.
	innit();
});

window.addEventListener('resize', function(e) {
	// Change the size of the viewed page.
	setSize();
});

document.addEventListener('wheel', function(e) {
	// If the user can scroll (and is trying to scroll), call a transition to the next page in the direction of the scroll.
	if (canScroll)
		goToPage(currentPage + (e.deltaY > 0 ? 1 : -1), 1000);
});