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
	setNameSize();
});