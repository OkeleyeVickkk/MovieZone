const swiper = new Swiper(".trending-section .swiper", {
	slidesPerView: 2,
	spaceBetween: 24,
	loop: true,
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

const swiper2 = new Swiper(".tv-show .swiper", {
	slidesPerView: 2,
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

const API_KEY = "ffdcbd3cebcd836ef5c1b4b04f8bb42f";

const movieWrapper = document.querySelector("section.all-sections .movie-wrapper");

function RandomPage() {
	let numbers = "123456789";
	let fiveDigits = "";
	for (let num = 0; num < 3; num++) {
		fiveDigits += numbers[Math.floor(Math.random() * 4)];
	}
	return fiveDigits;
}
const randomNum = RandomPage();

const image_base_url = "https://image.tmdb.org/t/p/w1280/";
const LATEST_MOVIES_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${randomNum}&with_watch_monetization_types=flatrate`;

document.addEventListener("DOMContentLoaded", GetGeneralMovies);

// fetch General Random Movies
function GetGeneralMovies() {
	fetch(LATEST_MOVIES_URL, {
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			return response.json();
		})
		.then((datagotten) => {
			// let movieLists = datagotten.results;
			// movieLists.forEach((movie) => {
			// 	const { title, vote_average, poster_path, release_date, backdrop_path } = movie;
			// 	Movie(title, vote_average, poster_path, release_date, backdrop_path);
			// });
		})
		.catch((error) => {
			console.log(error);
		});
}

const input = document.querySelector(".search-section input");
const form = document.querySelector(".search-section form");
const formButton = document.querySelector(".search-section form button");

const search_url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&page=1&include_adult=false&query=`;

formButton.addEventListener("click", function (e) {
	e.preventDefault();
	let queryString = input.value;
	movieWrapper.innerHTML = "";
	if (!queryString) {
		GetGeneralMovies();
	}
	GetMovies(search_url + queryString);
	queryString = "";
});

function GetMovies(url) {
	fetch(url)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			data.results.forEach((movie) => {
				const { title, vote_average, poster_path, release_date, backdrop_path } = movie;
				Movie(title, vote_average, poster_path, release_date, backdrop_path);
			});
		});
}

function Movie(title, vote_average, poster_path, release_date, backdrop_path) {
	let posterPath = poster_path ?? backdrop_path;
	let imgSrcPath = `${image_base_url}${posterPath}`;
	const movieTemplate = document.getElementById("movie-item");
	const clonedMovieTemplate = movieTemplate.contentEditable.cloneNode(true);
	let item = `<a href="#" class="each-movie">
			<div class="each-movie-inner">
				<div class="movie-image-wrapper">
					<img src="${imgSrcPath ?? "<span>No image found</span>"}" alt="" class="img-fluid" />
				</div>
				<div class="movie-content">
					<h6 class="movie-title">${title}</h6>
					<div class="inner-content d-flex align-items-center justify-content-between">
						<small class="genre"> Release Date: ${release_date} </small>
						<div class="d-flex align-items right">
							<small class="d-flex align-items-center rating">
								<em>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1.13em"
										height="1em"
										preserveAspectRatio="xMidYMid meet"
										viewBox="0 0 27 24">
										<path
											fill="currentColor"
											d="M1.547 24a.33.33 0 0 1-.327-.295v-.001L0 11.336l-.001-.031c0-.182.147-.329.329-.329h8.233v13.025zm3.36-3.265v.001a1.301 1.301 0 1 0 1.301-1.301h-.002c-.719 0-1.301.582-1.302 1.301zm.48-8c0 .181.147.328.329.328h.764a.328.328 0 0 0 0-.656h-.77a.329.329 0 0 0-.329.329v.003zm-3.61 0c0 .181.147.328.328.328H4.61a.328.328 0 0 0 0-.656H2.099a.328.328 0 0 0-.328.328v.003zm9.8 9.388a1.886 1.886 0 0 1-.494-.253l.006.004l-.1-.063a20.97 20.97 0 0 1-.69-.452l-.101-.071c-.132-.095-.194-.137-.262-.133c-.24.005-.48.007-.72.01V12.01l-.013-.77c.451-.287.867-.56.992-.664c.17-.342.338-.628.524-.902l-.017.027c.085-.133.17-.265.248-.396l1.724-2.894c.08-.136.167-.272.254-.408c.145-.216.299-.474.44-.74l.024-.049a.879.879 0 0 0 .079-.521l.001.005l-.006-3.12c.063-.454.319-.838.68-1.072l.006-.004a1.97 1.97 0 0 1 1.162-.5h.007l.063-.001c.341 0 .663.081.949.224l-.012-.006c.191.092.354.19.507.3l-.01-.007l.106.07c.241.127.421.341.501.6l.002.007c.187.696.358 1.329.517 1.964l.066.259c.101.34.188.751.244 1.172l.005.042c-.171 1.574-.5 3.01-.976 4.378l.042-.138l7.693-.011h.028a1.643 1.643 0 0 1 1.63 1.848l.001-.008a1.982 1.982 0 0 1-.894 1.781l-.008.005a2.171 2.171 0 0 1 .372 1.4v-.007a1.848 1.848 0 0 1-1.137 1.873l-.012.004a2.375 2.375 0 0 1 .299 1.31v-.006a1.905 1.905 0 0 1-.886 1.733l-.008.005a2.791 2.791 0 0 1 .224 1.459l.001-.013v.188a1.834 1.834 0 0 1-2.007 1.719l.007.001h-4.429l-.015.001l-.016-.001h.001h-5.91c-.051 0-.104 0-.16.008c-.068.004-.14.01-.214.01h-.015a1.13 1.13 0 0 1-.299-.04l.008.002zm-6.015-1.387a.64.64 0 1 1 1.281.001a.64.64 0 0 1-1.281-.001z"
										/>
									</svg>
								</em>
								<span>${vote_average} </span>
							</small>
						</div>
					</div>
				</div>
			</div>
		</a> `;

	movieWrapper.innerHTML += item;
}

function addSkeletonLoader() {
	const skeletonItem = document.getElementById("skeleton-loader");
	const parent = document.querySelector(".all-sections > .movie-wrapper");
	for (let i = 0; i < 10; i++) {
		const cloneSkeletons = skeletonItem.content.cloneNode(true);
		parent.appendChild(cloneSkeletons);
	}
}
addSkeletonLoader();
