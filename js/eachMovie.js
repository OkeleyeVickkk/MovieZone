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

	new Swiper(".swiper", {
		effect: "cards",
		grabCursor: true,
	});

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

	const movieSummary = document.querySelector(".movie-summary p");
	const duration = document.querySelector(".little-content .runtime span .duration");
	const releaseDate = document.querySelector(".little-content .release-date span .date");
	const lang_parent = document.querySelector(".little-content .lang span");
	const lang_item = document.querySelector(".little-content .lang span .lang_template");
	const genre_parent = document.querySelector(".little-content .genre span");
	const genre_item = document.querySelector(".little-content .genre span .genre_template");
	const thriller = document.querySelector(".thriller #thriller-video");
	const movieTitle = document.querySelector(".movie-details .title h3");
	const bannerImage = document.querySelector(".banner .banner-image");
	const moviePoster = document.querySelector(".movie-poster img");

	movieDetail.then((response) => {
		const {
			backdrop_path,
			release_date,
			poster_path,
			runtime,
			overview,
			title,
			tagline,
			id,
			spoken_languages,
			genres: [...names],
		} = response;

		arrange(spoken_languages, lang_item, lang_parent);
		arrange(names, genre_item, genre_parent);

		fetchMovieCasts(id);
		fetchSimilarMovies(id);

		const posterImages = document.querySelector(".posters-images #slide-template");

		// paste them to the screen
		moviePoster.src = `${image_base_url}${backdrop_path ?? poster_path}`;
		bannerImage.style = `background-image: url(${image_base_url}${poster_path ?? backdrop_path})`;
		movieTitle.innerHTML = `${title} <span class="text-sm"> ${tagline == "" ? "" : `: ${tagline}`}</span>`;
		movieSummary.textContent = overview;
		duration.textContent = runtime;
		releaseDate.textContent = getProperDate(release_date);
	});

	function arrange(items, tag, parentTag) {
		items.forEach((item) => {
			const { name } = item;
			const clone = tag.content.cloneNode(true); // clone tag
			clone.querySelector("span").textContent = name;
			parentTag.appendChild(clone);
		});
	}

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

			clonedTemplate.querySelector(".grid-cast-item a").href = `#`;
			clonedTemplate.querySelector(".grid-cast-item").id = id;
			clonedTemplate.querySelector(".grid-cast-image img").src = `${image_base_url}${profile_path}`;
			clonedTemplate.querySelector(".grid-cast-item .name").textContent = name;

			// paste to the screen
			castswrapper.appendChild(clonedTemplate);
		});
	}

	async function fetchSimilarMovies(id) {
		// get the dom
		const skeletonItem = document.getElementById("movies-recommendation");
		const parent = document.querySelector(".recommendations .grid-wrapper");

		const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`;
		const response = await fetch(url);
		for (let i = 0; i < 10; i++) {
			const cloneSkeletons = skeletonItem.content.cloneNode(true);
			parent.appendChild(cloneSkeletons);
		}
		if (!response.ok || !response.status === 200) throw "Error occured";
		const movies = await response.json();
		const firstTenMovies = movies.results.splice(0, 10);

		parent.innerHTML = "";
		const movieTemplate = document.getElementById("movieTemplate");

		firstTenMovies.forEach((movie) => {
			const _movieTemplate = movieTemplate.content.cloneNode(true);
			const { backdrop_path, poster_path, title, id } = movie;

			_movieTemplate.querySelector(".grid-movie-item a").href = `/movie.html?id=${id}`;
			_movieTemplate.querySelector(".grid-movie-image img").src = `${image_base_url}${poster_path ?? backdrop_path}`;
			_movieTemplate.querySelector(".grid-movie-item .title small").textContent = title;

			parent.append(_movieTemplate);
		});
	}

	function getProperDate(date) {
		const dateArray = date.split("-");
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let response = `${dateArray[2]}, ${months[parseInt(dateArray[1]) - 1]} ${dateArray[0]}`;
		return response;
	}
});
