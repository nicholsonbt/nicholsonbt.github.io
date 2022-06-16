var pageHeight = 0;				// The inner height of the page.
var canScroll = false;			// A flag stating whether or not the user is currently allowed to scroll.
var currentPage = 0;			// The current page being viewed by the user.
var menuOpen = false;			// Whether the menu is open or not.


function setNameSize() {
	let element = document.getElementById("top-bar__name-input");
	document.getElementById("top-bar__name-inner").setAttribute("style", "width: " + element.clientWidth + "px");
	element.setAttribute("style", "visibility: visible"); // Hide the form until loaded correctly.
};

function toggleMenu() {
	let element = document.getElementById("top-bar__menu-button");
	
	if (menuOpen) {
		element.classList.remove("active");
	} else {
		element.classList.add("active");
	}
	
	menuOpen = !menuOpen;
}



// Event Listeners:
window.addEventListener('load', function(e) {
	// Initialise global variables and setup dynamically assigned values.
	innit();
	setNameSize();
	NODE_ANIMATION.NodeAnimation(window.innerWidth, window.innerHeight);
});


window.addEventListener('mousemove', function(e) {
	NODE_ANIMATION.updateMouse(e.clientX, e.clientY);
});


window.addEventListener('resize', function(e) {
	// Change the size of the viewed page.
	setSize();
	NODE_ANIMATION.Resize(window.innerWidth, window.innerHeight);
});

document.addEventListener('wheel', function(e) {
	// If the user can scroll (and is trying to scroll), call a transition to the next page in the direction of the scroll.
	if (canScroll)
		goToPage(currentPage + (e.deltaY > 0 ? 1 : -1), 1000);
});

document.addEventListener('keydown', function(e) {
	console.log(e.keyCode);
	
	if (canScroll && e.keyCode == '38')
		goToPage(currentPage - 1, 1000);
	else if (canScroll && e.keyCode == '40')
		goToPage(currentPage + 1, 1000);
});