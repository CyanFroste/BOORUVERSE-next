import axios from "axios";
import fs from "fs";
import path from "path";
import ProgressBar from "progress";
import config from "../../config.json";

export default async (req, res) => {
	if (req.method === "POST") {
		const {
			body: { booru, url, fileName, size },
		} = req;
		return new Promise((resolve, reject) => {
			download(booru, url, fileName, size)
				.then((data) => {
					res.status(200).json(data);
					resolve();
				})
				.catch((err) => {
					console.error(err);
					res.status(404).json([]);
					resolve();
				});
		});
	} else {
		res.status(400).json({ message: "This route only accepts POST method." });
	}
};

// download to server pc
const downloads = { downloading: [], downloaded: [] };
async function download(booru, url, fileName, size) {
	//
	let fileId = `${booru} ${fileName.split(" ")[1]}`;
	let fileDir = config.booru[booru].dl_location;

	if (booru === "gelbooru")
		url = "https://" + url.slice(url.indexOf("gelbooru"));

	// send response when download is already queued
	if (downloads.downloading.includes(fileId)) {
		console.log("\n---- File already in queue! ----");
		return { message: "File already in queue", downloads };
	}

	try {
		// check if file exists, if exists, this won't throw error
		const stats = fs.statSync(path.resolve(fileDir, fileName));
		if (stats.size != size) throw "DIFFERENT_SIZES";
		console.log("\n---- File already exists! ----");
		// send response to client
		return { message: "File already exists", file: fileName };
	} catch (err) {
		// if file doesn't exist or different file with same name exists, start download
		if (err === "DIFFERENT_SIZES")
			console.log("\n---- Same file which differ in size exists! ----");

		const { data, headers } = await axios({
			url,
			method: "GET",
			responseType: "stream",
		});
		const totalLength = headers["content-length"];
		const progressBar = new ProgressBar(
			`Downloading ${fileId} [:bar] :percent :etas`,
			{
				width: 40,
				complete: "=",
				incomplete: " ",
				renderThrottle: 1,
				total: parseInt(totalLength),
			}
		);

		// push file id into downloads(list)
		downloads.downloading.push(fileId);

		// log download queue onto a file
		fs.writeFile(
			path.resolve(config.logs_location, "DL_QUEUE.json"),
			JSON.stringify(downloads),
			(err) => {
				if (err) console.error(err);
			}
		);

		console.log("\n---- Downloads ----\n", downloads, "\n");
		// create stream
		const file = fs.createWriteStream(path.resolve(fileDir, fileName));
		// pipe data to the stream and move progress bar
		data.on("data", (chunk) => progressBar.tick(chunk.length));
		data.pipe(file);
		// on finish writing
		file.on("finish", () => {
			file.end();
			console.log("\n---- File saved! ----");
			downloads.downloading = downloads.downloading.filter(
				(dl) => dl !== fileId
			);
			// add file id to downloaded
			downloads.downloaded.push(fileId);
			console.log("\n---- Downloads ----\n", downloads, "\n");
		
			// log download queue onto a file
			fs.writeFile(
				path.resolve(config.logs_location, "DL_QUEUE.json"),
				JSON.stringify(downloads),
				(err) => {
					if (err) console.error(err);
				}
			);
		});

		// on error
		file.on("error", (err) => {
			file.end();
			console.log("\n---- File not saved! ----");
			downloads.downloading = downloads.downloading.filter(
				(dl) => dl !== fileId
			);
			console.log("\n---- Downloads ----\n", downloads, "\n");
			
			// log download queue onto a file
			fs.writeFile(
				path.resolve(config.logs_location, "DL_QUEUE.json"),
				JSON.stringify(downloads),
				(err) => {
					if (err) console.error(err);
				}
			);
			throw err;
		});
		return { message: "Download Queued", downloads };
	}
}
