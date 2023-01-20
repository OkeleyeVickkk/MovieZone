const scrollToTopButton = document.querySelector(".scroll-to-top button");
const scrollToTopDiv = document.querySelector(".scroll-to-top");
const mobile_menu_button = document.querySelector(".mobile-menu button");
const mobile_menu = document.querySelector(".mobile-menu .small-menu");

console.log(mobile_menu_button);
// <=======  actions ========>
mobile_menu_button.addEventListener("click", toggleMenu);
scrollToTopButton.addEventListener("click", scrollToTop);

window.addEventListener("scroll", function () {
	if (document.documentElement.scrollTop == 0) {
		fadeOut();
	}
});

function toggleMenu(e) {
	e.stopPropagation();
	!this.classList.contains("active") ? this.classList.add("active") : this.classList.remove("active");
}

const style = {
	slideIn: `transform: rotate(360deg);
	right: 2rem;
	opacity: 1;
	`,
	slideOut: `transform: rotate(-360deg);
	right: 0;
	opacity: 0;
	`,
};

function slideIn() {
	scrollToTopDiv.style = style.slideIn;
	scrollToTopButton.classList.add("active");
}

function fadeOut() {
	scrollToTopDiv.style = style.slideOut;
	scrollToTopButton.classList.remove("active");
}

const windowHalfHeight = window.innerHeight / 1.5;
window.addEventListener("scroll", () => {
	if (window.pageYOffset > windowHalfHeight) {
		slideIn();
	}
});

function scrollToTop() {
	const top = document.body.scrollTo == 0 || document.documentElement.scrollTop == 0;
	if (!top) {
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
	}
	window.addEventListener("scroll", function () {
		if (document.body.scrollTo == 0 || document.documentElement.scrollTop == 0) {
			fadeOut();
		}
	});
}
