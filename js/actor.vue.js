const { createApp } = Vue;

const root = document.getElementById("vue-app");

const _ = window.location.search.split("?");
const searchParams = new URLSearchParams(_[1]);
const baseurl = "https://api.themoviedb.org/3/person/";
const imageURL = `https://image.tmdb.org/t/p/w1280/`;

const app = createApp({
	data: () => {
		return {
			pageLoading: false,
			actorDetails: {},
			userImages: [],
		};
	},
	methods: {
		fetchActorDetails: async function (id) {
			this.loading = true;

			const config = {
				url: `${baseurl}${id}`,
				headers: {
					accept: "application/json",
					Authorization:
						"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmRjYmQzY2ViY2Q4MzZlZjVjMWI0YjA0ZjhiYjQyZiIsInN1YiI6IjYzM2UyYjhlN2Q0MWFhMDA3ZTI4ODc4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YHlbsAwjAy53p5lmFD_k5iClatx1o1UQwUo3hgWoiYg",
				},
			};
			try {
				const response = await axios({ ...config });
				if (response.status != 200) {
					this.loading = false;
					return new Error("Error occured");
				}
				const actorData = await response.data;
				const fullImage = `${imageURL}${actorData.profile_path}`;
				// remove the profile_path property
				const { profile_path, ...otherData } = actorData;
				this.actorDetails = { userImage: fullImage, ...otherData };
				document.title = actorData.name;
			} catch (error) {}
		},

		fetchActorImages: async function (actorId) {
			this.loading = true;
			const config = {
				url: `${baseurl}${actorId}/images`,
				headers: {
					accept: "application/json",
					Authorization:
						"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmRjYmQzY2ViY2Q4MzZlZjVjMWI0YjA0ZjhiYjQyZiIsInN1YiI6IjYzM2UyYjhlN2Q0MWFhMDA3ZTI4ODc4ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YHlbsAwjAy53p5lmFD_k5iClatx1o1UQwUo3hgWoiYg",
				},
			};

			await axios({ ...config })
				.then((response) => {
					if (response.status != 200) {
						return new Error("Error occured");
					}
					this.loading = false;
					const images = response.data.profiles
						.filter((eachImage) => eachImage.file_path != null)
						.slice(1, 5)
						.map((_) => `${imageURL}${_.file_path}`);
					this.userImages = [...images];
				})
				.catch((err) => {})
				.finally(() => {});
		},
	},

	created() {
		const searchActorId = searchParams.get("actor_id");
		this.fetchActorDetails(searchActorId);
		this.fetchActorImages(searchActorId);
	},
	mounted: function () {},
});

app.mount(root);
