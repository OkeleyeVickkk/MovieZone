// <== ============ global variables  start =========== ==>
const API_KEY = "ffdcbd3cebcd836ef5c1b4b04f8bb42f";
const image_base_url = "https://image.tmdb.org/t/p/w1280/";
// <== ============ global variables  start ends =========== ==>

const timeline = gsap.timeline();

const formtitle = document.querySelector(".search-layer-inner h2");
const formInput = document.querySelector(".search-layer-inner form .form-floating");
const actualFormInput = formInput.querySelector("#floatingInput");
const cancelButton = document.querySelector(".search-layer .cancel-button button");
const submitButton = document.querySelector(".search-layer-inner [type='submit']");
const searchButton = document.querySelector(".nav-theme .git-hub button");
const searchLayer = document.querySelector(".search-layer");
const readMoreButton = document.querySelector(".read_more button");
const cancelSearchInputButton = document.querySelector("form button.clear-search-input");

cancelButton.addEventListener("click", cancelSearchLayer);
searchButton.addEventListener("click", callSearchLayer);
readMoreButton.addEventListener("click", readMore);
cancelSearchInputButton.addEventListener("click", clearSearchText);
submitButton.addEventListener("click", runSearchFetch);

checkEffect(); //for input form effect

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
	const num = ++defaultPageNumber;
	getMoreMovies(num);
}

const getMoreMovies = async (num) => {
	const url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${num}`;
	const response = await fetch(url);
	if (!response.ok) throw " Error occured! ";
	const data = await response.json();

	const movies = data.results;

	paste_to_screen(movies);
};

getMoreMovies();

function paste_to_screen(movies) {
	const parent = document.querySelector(".movie-wrapper");
	const movieTemplate = document.getElementById("movie-item");
	parent.innerHTML = "";

	movies.forEach((movie) => {
		const clone = movieTemplate.content.cloneNode(true);

		const { backdrop_path, poster_path, title, vote_average, id, release_date } = movie;

		clone.querySelector(".each-movie").href = `./movie.html?id=${id}`;
		clone.querySelector(".movie-image-wrapper img").src = `${image_base_url}${backdrop_path ?? poster_path}`;
		clone.querySelector(".movie-content .movie-title").textContent = title;
		clone.querySelector(".movie-image-wrapper .vote-average .value").textContent = filterVoteAverage(vote_average);
		clone.querySelector(".movie-content .date span").textContent = getProperDate(release_date);

		parent.append(clone); //paste to the screen
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
}
// read more function ✅
// intersect observer
// scroll to top function ✅
// search function ✅

function checkEffect() {
	actualFormInput.addEventListener("focus", function () {
		const active = cancelSearchInputButton.classList.contains("active");
		if (!((this.value == "" || this.value == null) && active)) {
			this.addEventListener("input", () => {
				if (this.value == "" || this.value == null) {
					cancelSearchInputButton.classList.remove("active");
				} else {
					cancelSearchInputButton.classList.add("active");
				}
			});
		}
	});
}

function clearSearchText(e) {
	e.stopPropagation();
	if (!(actualFormInput.value == "" || actualFormInput.value == null)) {
		actualFormInput.focus();
		actualFormInput.value = " ";
	}
}

async function runSearchFetch(e) {
	e.preventDefault();
	cancelSearchLayer(e);
	let inputValue = actualFormInput.value;
	const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=${inputValue}`;
	const response = await fetch(url);
	const data = await response.json();
	const movies = data.results;

	const completeMovies = movies.filter((movie) => {
		const { backdrop_path, poster_path } = movie;
		return backdrop_path !== null && poster_path !== null;
	});
	actualFormInput.value = "";
	cancelSearchInputButton.classList.remove("active");

	paste_to_screen(completeMovies); // paste to the dom
}
