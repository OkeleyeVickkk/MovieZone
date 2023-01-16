window.addEventListener("DOMContentLoaded", function () {
	// <== ============ global variables  start =========== ==>
	const API_KEY = "ffdcbd3cebcd836ef5c1b4b04f8bb42f";
	const image_base_url = "https://image.tmdb.org/t/p/w1280/";
	// <== ============ global variables  start ends =========== ==>

	const timeline = gsap.timeline();

	// get the parameter in the url

	const queryId = window.location.search;

	const searchParams = new URLSearchParams(queryId);
	const movieId = searchParams.get("id");

	const formtitle = document.querySelector(".search-layer-inner h2");
	const formInput = document.querySelector(".search-layer-inner form .form-floating");
	const cancelButton = document.querySelector(".search-layer .cancel-button button");
	const submitButton = document.querySelector(".search-layer-inner [type='submit']");
	const searchButton = document.querySelector(".nav-theme .git-hub button");
	const searchLayer = document.querySelector(".search-layer");
	cancelButton.addEventListener("click", cancelSearchLayer);
	searchButton.addEventListener("click", callSearchLayer);

	const swiper = new Swiper(".swiper", {
		effect: "cards",
		grabCursor: true,
	});

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

	async function fetchMedia(URL) {
		if (!movieId) return;
		const response = await fetch(URL, { method: "GET" });
		if (!response.ok) throw " Error occured! ";
		const datagotten = await response.json();
		return datagotten;
	}

	// fetch tv shows
	const movie = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`;
	const movieDetail = fetchMedia(movie);

	movieDetail.then((response) => {
		console.log(response);
		const {
			backdrop_path,
			release_date,
			poster_path,
			runtime,
			overview,
			title,
			video,
			vote,
			tagline,
			id,
			spoken_languages: { ...name },
			genres: [...names],
		} = response;

		// const movieImages = fetchMovieImages(id);
		fetchMovieCasts(id);
		const similarMovies = fetchSimilarMovies(id);
		const movieSummary = document.querySelector(".movie-summary p");
		const duration = document.querySelector(".little-content .runtime span .duration");
		const releaseDate = document.querySelector(".little-content .release-date span .date");
		const language = document.querySelector(".little-content .lang span .language");
		const genre = document.querySelector(".little-content .genre span .genres");
		const thriller = document.querySelector(".thriller #thriller-video");
		const movieTitle = document.querySelector(".movie-details .title h3");
		const bannerImage = document.querySelector(".banner .banner-image");
		const moviePoster = document.querySelector(".movie-poster img");

		const posterImages = document.querySelector(".posters-images #slide-template");

		// paste them to the screen
		moviePoster.src = `${image_base_url}${backdrop_path ?? poster_path}`;
		bannerImage.style = `background-image: url(${image_base_url}${poster_path ?? backdrop_path})`;
		movieTitle.innerHTML = `${title} <span class="text-sm"> ${tagline == "" ? "" : `: ${tagline}`}</span>`;
		movieSummary.textContent = overview;
		duration.textContent = runtime;
	});

	// async function fetchMovieImages(id) {
	// 	const movie_url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=${API_KEY}&language=en-US`;
	// 	const response = await fetch(movie_url);
	// 	if (!response.ok || !response.status === 200) throw "Error occured";
	// 	const data = await response.json();
	// }

	async function fetchMovieCasts(id) {
		const movie_url = `https://api.themoviedb.org/3/movie/${id}/casts?api_key=${API_KEY}&language=en-US`;
		const response = await fetch(movie_url);
		if (!response.ok || !response.status === 200) throw "Error occured";
		const casts = await response.json();

		// get the dom
		const castTemplate = document.getElementById("cast-template");
		const castswrapper = document.querySelector(".casts .grid-wrapper");
		// filter casts with images
		const res = casts.cast.filter((cast) => {
			const { profile_path } = cast;
			return profile_path != null;
		});

		res.splice(0, 10).forEach((cast) => {
			const clonedTemplate = castTemplate.content.cloneNode(true);

			const { name, id, profile_path } = cast;

			clonedTemplate.querySelector(".grid-cast-item a").href = `./cast.html?${id}`;
			clonedTemplate.querySelector(".grid-cast-item").id = id;
			clonedTemplate.querySelector(".grid-cast-image img").src = `${image_base_url}${profile_path}`;
			clonedTemplate.querySelector(".grid-cast-item .name").textContent = name;

			// paste to the screen
			castswrapper.appendChild(clonedTemplate);
		});
	}

	// function runSearchQuery() {}

	async function fetchSimilarMovies(id) {
		const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`;
		const response = await fetch(url);
		if (!response.ok || !response.status === 200) throw "Error occured";
		const results = await response.json();
		console.log(results);
	}
});
