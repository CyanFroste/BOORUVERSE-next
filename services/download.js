const mod = (text) => {
	// removes special chars from text and shortens to 200 chars
	text = text.replace(/([^a-z0-9]+)/gi, " ");
	if (text.length > 200) return text.slice(0, 200);
	return text;
};

export const download = async (booru, url, size, post) => {
	// if booru === yandere
	let fileName = `yande.re ${post.id} ${mod(post.tags)}.${post.fileExt}`;
	if (booru === "gelbooru") {
		let ext = post.image.slice(post.hash.length - 1);
		fileName = `gelbooru ${post.id} ${mod(post.tags)}.${ext}`;
	}
	if (booru === "danbooru")
		fileName = `danbooru ${post.id} ${mod(post.tags)}.${post.fileExt}`;

	try {
		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				booru,
				url,
				fileName,
				size,
			}),
		};

		const res = await fetch("/api/posts", options);
		return res.json();
	} catch (error) {
		console.log(error);
	}
};
