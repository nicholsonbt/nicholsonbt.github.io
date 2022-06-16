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
		elements[i].setAttribute("style", "height:" + pageHeight + "px; visibility: visible;");
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