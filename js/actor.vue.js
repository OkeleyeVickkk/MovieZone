const { createApp } = Vue;

const root = document.getElementById("vue-app");

const actor_id = "";
const app = createApp({
	data: () => ({
		name: "",
	}),
	methods: {},
	created: {},
	mounted: {
		doThis: function () {
			console.log("Doings");
		},
	},
});

app.mount(root);
