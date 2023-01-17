// <== ============ global variables  start =========== ==>
const API_KEY = "ffdcbd3cebcd836ef5c1b4b04f8bb42f";
const image_base_url = "https://image.tmdb.org/t/p/w1280/";
// <== ============ global variables  start ends =========== ==>

const timeline = gsap.timeline();

const formtitle = document.querySelector(".search-layer-inner h2");
const formInput = document.querySelector(".search-layer-inner form .form-floating");
const cancelButton = document.querySelector(".search-layer .cancel-button button");
const submitButton = document.querySelector(".search-layer-inner [type='submit']");
const searchButton = document.querySelector(".nav-theme .git-hub button");
const searchLayer = document.querySelector(".search-layer");

cancelButton.addEventListener("click", cancelSearchLayer);
searchButton.addEventListener("click", callSearchLayer);

// toggle search button
function cancelSearchLayer(e) {
	e.stopPropagation();
	if (searchLayer.classList.contains("active")) {
		gsap.to(searchLayer, { display: "none", xPercent: "100", yPercent: "-100", ease: "linear" });
		searchLayer.classList.remove("active");
	}
}

function callSearchLayer(e) {
	e.stopPropagation();
	if (!searchLayer.classList.contains("active")) {
		searchLayer.classList.add("active");
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
				[formtitle, formInput, submitButton],
				{
					y: 40,
					opacity: 0,
					stagger: 0.25,
				},
				"<0.45"
			);
	}
}

const searchMovie = async () => {
	const url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`;
	const response = await fetch(url);
	if (!response.ok) throw " Error occured! ";
	const skeletonItem = document.getElementById("skeleton-loader");
	const parent = document.querySelector(".movie-wrapper");
	const data = await response.json();
	for (let i = 0; i < data.results.length; i++) {
		const cloneSkeletons = skeletonItem.content.cloneNode(true);
		parent.appendChild(cloneSkeletons);
	}
	console.log(data);
};

searchMovie();
// read more function
// searc function
// intersect observer
