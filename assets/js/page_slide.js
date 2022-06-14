window.addEventListener('load', setSize, false);
window.addEventListener('resize', setSize, false);

function setSize(e) {
	// Get the inner height.
	let h = window.innerHeight;
	
	// Resize all pages to the inner height.
	const elements = document.getElementsByClassName("section");
	for (let i = 0; i < elements.length; i++) {
		elements[i].setAttribute("style", "height:" + h + "px");
	}
};