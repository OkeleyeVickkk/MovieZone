const timeline = gsap.timeline();

const cancelButton = document.querySelector(".search-layer button");
const searchButton = document.querySelector(".nav-theme .git-hub button");
const searchLayer = document.querySelector(".search-layer");
cancelButton.addEventListener("click", cancelSearchLayer);
searchButton.addEventListener("click", callSearchLayer);

var swiper = new Swiper(".swiper", {
	effect: "cards",
	grabCursor: true,
});

// const searchParams = new URLSearchParams();
// const getParams = searchParams.get();

// add skeleton loader
function addSkeletonLoader() {
	const skeletonItem = document.getElementById("movies-recommendation");
	const parent = document.querySelector(".recommendations .grid-wrapper");
	for (let i = 0; i < 8; i++) {
		const cloneSkeletons = skeletonItem.content.cloneNode(true);
		parent.appendChild(cloneSkeletons);
	}
}
addSkeletonLoader();

// toggle search button
function cancelSearchLayer(e) {
	e.stopPropagation();
	if (searchLayer.classList.contains("active")) {
		gsap.to(searchLayer, { display: "none", xPercent: "100", yPercent: "-100", ease: "linear", scale: 0 });
		searchLayer.classList.remove("active");
	}
}

function callSearchLayer(e) {
	e.stopPropagation();
	if (!searchLayer.classList.contains("active")) {
		searchLayer.classList.add("active");
		const formtitle = document.querySelector(".search-layer-inner h2");
		const formInput = document.querySelector(".search-layer-inner form .form-floating");
		timeline
			.from(searchLayer, {
				xPercent: "100",
				yPercent: "-100",
			})
			.to(
				searchLayer,
				{
					xPercent: "0",
					yPercent: "0",
					scale: 1,
					display: "block",
				},
				"<"
			)
			.from(
				[formtitle, formInput],
				{
					y: 40,
					opacity: 0,
					stagger: 0.25,
				},
				"<0.45"
			);
	}
}
