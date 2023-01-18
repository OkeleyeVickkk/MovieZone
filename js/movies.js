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
const readMoreButton = document.querySelector(".read_more button");
const scrollToTopButton = document.querySelector(".scroll-to-top");

cancelButton.addEventListener("click", cancelSearchLayer);
searchButton.addEventListener("click", callSearchLayer);
readMoreButton.addEventListener("click", readMore);
scrollToTopButton.addEventListener("click", scrollToTop);

function slideIn() {
	timeline.to(scrollToTopButton, {
		x: "-7rem",
		duration: 0.8,
		opacity: 1,
	});
	// .to(
	// 	scrollToTopButton,
	// 	{
	// 		y: -25,
	// 		yoyo: true,
	// 		repeat: -1,
	// 	},
	// 	"  > 0.2"
	// );
}

function scrollToTop() {}

function cancelSearchLayer(e) {
	e.stopPropagation();
	if (searchLayer.classList.contains("active")) {
		gsap.to(searchLayer, { display: "none", xPercent: "100", yPercent: "-100", ease: "linear", duration: 0.25 });
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
					duration: 0.5,
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

let defaultPageNumber = 1;

function readMore(e) {
	e.stopPropagation();
	// const skeletonItem = document.getElementById("skeleton-loader");
	// const parent = document.querySelector(".movie-wrapper");
	// for (let i = 0; i < 20; i++) {
	// 	const cloneSkeletons = skeletonItem.content.cloneNode(true);
	// 	parent.innerHTML += cloneSkeletons;
	// }
	const num = ++defaultPageNumber;
	searchMovie(num);
}

const searchMovie = async (num) => {
	const parent = document.querySelector(".movie-wrapper");
	const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${num}`;
	const response = await fetch(url);
	if (!response.ok) throw " Error occured! ";
	const data = await response.json();

	const movieTemplate = document.getElementById("movie-item");
	const movies = data.results;
	movies.forEach((movie) => {
		const clone = movieTemplate.content.cloneNode(true);

		const { backdrop_path, poster_path, title, vote_average, id, release_date } = movie;

		clone.querySelector(".each-movie").href = `./movie.html?id=${id}`;
		clone.querySelector(".movie-image-wrapper img").src = `${image_base_url}${backdrop_path ?? poster_path}`;
		clone.querySelector(".movie-content .movie-title").textContent = title;
		clone.querySelector(".movie-image-wrapper .vote-average .value").textContent = filterVoteAverage(vote_average);
		clone.querySelector(".movie-content .date span").textContent = getProperDate(release_date);

		parent.append(clone); //paste to the screen
		readMoreButton.style = `opacity: 1`;
	});

	function filterVoteAverage(vote_average) {
		let [rateMajor, rateMinor] = vote_average.toString().split(".");
		if (rateMinor) {
			rateMinor.length > 1 ? rateMinor.split("")[0] : rateMinor;
		} else {
			rateMinor = (0).toString();
		}
		return `${parseInt(rateMajor)}.${parseInt(rateMinor)}`;
	}

	function getProperDate(date) {
		const dateArray = date.split("-");
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let response = `${dateArray[2]}, ${months[parseInt(dateArray[1]) - 1]} ${dateArray[0]}`;
		return response;
	}
};

searchMovie();
// read more function ✅
// intersect observer
// scroll to top function
// search function

const windowHalfHeight = window.innerHeight / 2;
const x = document.documentElement.body || document.body;
window.addEventListener("scroll", () => {
	if (window.pageYOffset > windowHalfHeight) {
		slideIn();
	}
});
