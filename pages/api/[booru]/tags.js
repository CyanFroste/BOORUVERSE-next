import axios from "axios";
import config from "../../../config.json";

export default async (req, res) => {
	if (req.method === "GET") {
		const {
			query: { booru, page, searchstring },
		} = req;
		return new Promise((resolve, reject) => {
			tags(booru, page, searchstring)
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

async function tags(booru, page, searchstring = "") {
	const credentials = { method: "GET", responseType: "json", url: "" };
	const limit = config.booru.tag_limit;
	const order = config.booru.tag_order;

	switch (booru) {
		case "yandere":
			credentials.url = config.booru.yandere.tags.list_url;
			credentials.params = {
				limit,
				page,
				order,
				name: searchstring.toLowerCase(),
			};
			break;

		case "gelbooru":
			credentials.url = config.booru.gelbooru.tags.list_url;
			credentials.params = {
				limit,
				pid: page - 1,
				orderby: order,
				name_pattern: `%${searchstring.toLowerCase()}%`,
			};
			break;

		case "danbooru":
			credentials.url = config.booru.danbooru.tags.list_url;
			credentials.params = {
				limit,
				page,
				"search[order]": order,
				"search[name_matches]": `*${searchstring.toLowerCase()}*`,
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
			return data.map((tag) => ({
				id: tag.id,
				name: tag.name,
				count: tag.count,
			}));

		case "gelbooru":
			return data.map((tag) => ({
				id: tag.id,
				name: tag.tag,
				count: tag.count,
			}));

		case "danbooru":
			return data.map((tag) => ({
				id: tag.id,
				name: tag.name,
				count: tag.post_count,
			}));

		default:
			return [];
	}
}
