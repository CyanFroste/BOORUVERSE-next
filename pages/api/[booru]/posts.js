import axios from "axios";
import config from "../../../config.json";

export default async (req, res) => {
	if (req.method === "GET") {
		const {
			query: { booru, page, filters, preview },
		} = req;
		return new Promise((resolve, reject) => {
			posts(booru, page, filters, preview)
				.then((data) => {
					res.status(200).json(map(booru, data));
					resolve();
				})
				.catch((err) => {
					console.error(err);
					res.status(404).json([]);
					resolve();
				});
		});
	} else {
		res.status(400).json({ message: "This route only accepts GET method." });
	}
};

async function posts(booru, page, filters, preview) {
	const credentials = { method: "GET", responseType: "json", url: "" };
	const limit = preview === "true" ? 1 : config.booru.post_limit;

	switch (booru) {
		case "yandere":
			credentials.url = config.booru.yandere.posts.list_url;
			credentials.params = {
				limit,
				page,
				tags: filters,
			};
			break;

		case "gelbooru":
			credentials.url = config.booru.gelbooru.posts.list_url;
			credentials.params = {
				limit,
				pid: page - 1,
				tags: filters,
			};
			break;

		case "danbooru":
			credentials.url = config.booru.danbooru.posts.list_url;
			credentials.params = {
				limit,
				page,
				tags: filters,
			};
			break;
	}
	let { data } = await axios(credentials);
	if (typeof data === "string" && data.length === 0) data = [];
	return data;
}

function map(booru, data) {
	switch (booru) {
		case "yandere":
			return data.map((post) => ({
				id: post.id,
				previewUrl: post.preview_url,
				tags: post.tags,
				creatorId: post.creator_id,
				author: post.author,
				source: post.source,
				originalSize: post.file_size,
				fileExt: post.file_ext,
				originalUrl: post.file_url,
				compressedUrl: post.jpeg_url,
				compressedSize: post.jpeg_file_size,
				height: post.height,
				width: post.width,
			}));

		case "gelbooru":
			return data.map((post) => ({
				id: post.id,
				hash: post.hash,
				image: post.image,
				fileExt: post.image.slice(post.image.indexOf(".") + 1),
				source: post.source,
				height: post.height,
				width: post.width,
				directory: post.directory,
				previewUrl: `https://gelbooru.com/thumbnails/${post.directory}/thumbnail_${post.hash}.jpg`,
				tags: post.tags,
				originalUrl: post.file_url,
			}));

		case "danbooru":
			return data.map((post) => ({
				id: post.id,
				source: post.source,
				width: post.image_width,
				height: post.image_height,
				fileExt: post.file_ext,
				originalSize: post.file_size,
				tags: post.tag_string,
				artist: post.tag_string_artist,
				originalUrl: post.file_url,
				compressedUrl: post.large_file_url,
				previewUrl: post.preview_file_url,
			}));

		default:
			return [];
	}
}
