new Swiper(".trending-section .swiper", {
	slidesPerView: 2,
	spaceBetween: 24,
	breakpoints: {
		991: {
			slidesPerView: 6,
			spaceBetween: 20,
		},
		600: {
			slidesPerView: 4,
			spaceBetween: 22,
		},
		375: {
			slidesPerView: 3,
			spaceBetween: 18,
		},
	},

	// Optional parameters
	direction: "horizontal",
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},

	// And if we need scrollbar
	scrollbar: {
		el: ".swiper-scrollbar",
	},
});

new Swiper(".tv-show .swiper", {
	slidesPerView: 1,
	spaceBetween: 24,
	loop: true,
	breakpoints: {
		991: {
			slidesPerView: 3,
			spaceBetween: 22,
		},
		600: {
			slidesPerView: 2,
			spaceBetween: 22,
		},
		375: {
			slidesPerView: 1,
			spaceBetween: 18,
		},
	},

	// Optional parameters
	direction: "horizontal",
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},

	// And if we need scrollbar
	scrollbar: {
		el: ".swiper-scrollbar",
	},
});

// <== ============ global variables  start =========== ==>
const API_KEY = "ffdcbd3cebcd836ef5c1b4b04f8bb42f";
const image_base_url = "https://image.tmdb.org/t/p/w1280/";
// <== ============ global variables  start ends =========== ==>

const movieWrapper = document.querySelector("section.all-sections .movie-wrapper");

const input = document.querySelector(".search-section input");
const form = document.querySelector(".search-section form");
const formButton = document.querySelector(".search-section form button");

const search_url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=`;

async function fetchMedia(URL) {
	const response = await fetch(URL, { method: "GET" });
	if (!response.ok) throw " Error occured! ";
	const skeletonItem = document.getElementById("skeleton-loader");
	const parent = document.querySelector(".all-sections > .movie-wrapper");
	for (let i = 0; i < 10; i++) {
		const cloneSkeletons = skeletonItem.content.cloneNode(true);
		parent.appendChild(cloneSkeletons);
	}
	const datagotten = await response.json();
	return datagotten;
}

// fetch tv shows
const tvshows = `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&language=en-US`;
const shows = fetchMedia(tvshows);

// fetch movie
const upcoming = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const $movies = fetchMedia(upcoming);

// fetch actors
// const actors = `https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&language=en-US&page=1`;
// const $actors = fetchMedia(actors);

const mediaResults = [shows, $movies];

Promise.allSettled(mediaResults)
	.then((results) => {
		const [tvShows, movies] = [results[0], results[1]];
		pasteShowsToScreen(tvShows);
		pasteMoviesToScreen(movies);
	})
	.catch((error) => console.log(error));

function pasteShowsToScreen(tvShows) {
	const {
		value: { results },
	} = tvShows;

	const showTemplate = document.getElementById("tv-show-slide-item");
	const sliderWrapper = document.querySelector(".tv-show .swiper-wrapper");

	results.forEach((result) => {
		const clonedTemplate = showTemplate.content.cloneNode(true); //clone the template
		const { backdrop_path, id, name, poster_path, vote_average } = result;

		clonedTemplate.querySelector(".swiper-slide a").href = `./tv-show.html?id=${id}`;
		clonedTemplate.querySelector(".tv-image img").src = `${image_base_url}${backdrop_path ?? poster_path}`;
		clonedTemplate.querySelector(".swiper-slide .after h5").textContent = vote_average;
		clonedTemplate.querySelector(".swiper-slide .show-name h6").textContent = name;
		clonedTemplate.querySelector(".swiper-slide li").setAttribute("poster-link", poster_path ?? backdrop_path);

		// paste to the screen
		sliderWrapper.appendChild(clonedTemplate);
	});

	const screenSizes = {
		phone: 600,
		tablet: 769,
	};

	const posterBg = document.querySelector(".tv-show .image-background");
	const allslider = document.querySelectorAll(".tv-show .swiper-slide");
	// get default first slide ==> allslider[0]
	allslider.forEach((slide) => {
		const poster_path = slide.querySelector("li").getAttribute("poster-link");
		slide.addEventListener("mouseenter", () => {
			posterBg.style = `background-image: url(${image_base_url}${poster_path})`;
		});
	});
}
function pasteMoviesToScreen(movies) {
	const {
		value: { results },
	} = movies;

	const showTemplate = document.getElementById("movie-item");
	const parent = document.querySelector(".all-sections > .movie-wrapper");

	parent.innerHTML = ""; //clear the template

	results.forEach((result) => {
		const clonedTemplate = showTemplate.content.cloneNode(true); //clone the template
		const { backdrop_path, id, title, poster_path, vote_average, release_date } = result;

		const date = getProperDate(release_date);
		clonedTemplate.querySelector("a.each-movie").href = `./movie.html?id=${id}`;
		clonedTemplate.querySelector(".each-movie-inner img").src = `${image_base_url}${backdrop_path ?? poster_path}`;
		clonedTemplate.querySelector(".each-movie .vote").textContent = vote_average;
		clonedTemplate.querySelector(".each-movie .movie-title").innerHTML = title;
		clonedTemplate.querySelector(".each-movie .movie-content .date span").textContent = date;

		// paste to the screen
		parent.appendChild(clonedTemplate);
	});
}

function getProperDate(date) {
	const dateArray = date.split("-");
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
	let response = `${dateArray[2]}, ${months[parseInt(dateArray[1]) - 1]} ${dateArray[0]}`;
	return response;
}
