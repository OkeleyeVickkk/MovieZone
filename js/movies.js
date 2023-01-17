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

cancelButton.addEventListener("click", cancelSearchLayer);
searchButton.addEventListener("click", callSearchLayer);
readMoreButton.addEventListener("click", readMore);

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
		console.log(movie);
		const clone = movieTemplate.content.cloneNode(true);

		const { backdrop_path, poster_path, title, vote_average, id } = movie;

		clone.querySelector(".movie-image-wrapper img").src = `${image_base_url}${backdrop_path ?? poster_path}`;
		clone.querySelector(".movie-content .movie-title").textContent = title;
		clone.querySelector(".movie-image-wrapper .vote-average .value").textContent = filterVoteAverage(vote_average);

		parent.append(clone); //paste to the screen
	});

	function filterVoteAverage(vote_average) {
		let [rateMajor, rateMinor] = vote_average.toString().split(".");
		console.log(rateMajor, rateMinor);
		if (rateMinor) {
			rateMinor.length > 1 ? rateMinor.split("")[0] : rateMinor;
		} else {
			rateMinor = (0).toString();
		}
		return `${parseInt(rateMajor)}.${parseInt(rateMinor)}`;
	}
};

searchMovie();
// read more function
// search function
// intersect observer
