var swiper = new Swiper(".swiper", {
	effect: "cards",
	grabCursor: true,
});

// const searchParams = new URLSearchParams();
// const getParams = searchParams.get();

function addSkeletonLoader() {
	const skeletonItem = document.getElementById("movies-recommendation");
	const parent = document.querySelector(".recommendations .grid-wrapper");
	for (let i = 0; i < 8; i++) {
		const cloneSkeletons = skeletonItem.content.cloneNode(true);
		parent.appendChild(cloneSkeletons);
	}
}
addSkeletonLoader();
