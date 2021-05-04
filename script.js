document.addEventListener("DOMContentLoaded", (event) => {
	document.querySelector(".sort-menu").addEventListener("click", ({ target }) => {
		console.log(target)
		if (target.matches(".sort-menu-button")) {
			console.log("matches!")
			document
				.querySelectorAll(".sort-menu-button")
				.forEach((buttonNode) => buttonNode.classList.remove("selected"))
			target.classList.add("selected")
		}
	})
	document.querySelector("#name-input").addEventListener("keypress", (event) => {
        console.log(event.charCode)
		return (
			(event.charCode > 64 && event.charCode < 91) ||
			(event.charCode > 96 && event.charCode < 123) ||
			event.charCode == 32
		)
	})
	document.querySelector("#age-ascending").addEventListener("click", (event) => {})
	document.querySelector("#age-descending").addEventListener("click", (event) => {})
	document.querySelector("#name-ascending").addEventListener("click", (event) => {})
	document.querySelector("#name-descending").addEventListener("click", (event) => {})
})
