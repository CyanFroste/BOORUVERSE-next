import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../../../styles/Preview.module.scss";
import Loading from "../../../components/screens/Loading";
import Tag from "../../../components/Tag";
import { GetApp, Error, InsertLink, Fullscreen } from "@material-ui/icons";
import { download } from "../../../services/download";

const Preview = ({ post }) => {
	// router
	const router = useRouter();
	const { booru, id } = router.query;

	const [loading, setLoading] = useState(false);
	// route change actions
	const onLoad = () => setLoading(true);
	const onDone = () => setLoading(false);

	useEffect(() => {
		router.events.on("routeChangeStart", onLoad);
		router.events.on("routeChangeComplete", onDone);
		router.events.on("routeChangeError", onDone);

		return () => {
			router.events.off("routeChangeStart", onLoad);
			router.events.off("routeChangeComplete", onDone);
			router.events.off("routeChangeError", onDone);
		};
	}, []);

	const handleDownload = (url, size) => {
		download(booru, url, size, post).then((data) => {
			// toast
			console.log(data);
		});
	};

	const button = (type) => {
		const originalUrl = post.originalUrl;
		const compressedUrl = post.compressedUrl;
		const originalSize = post.originalSize
			? Math.ceil((post.originalSize / 1024 / 1024 + Number.EPSILON) * 100) /
			  100
			: undefined;
		const compressedSize = post.compressedSize
			? Math.floor((post.compressedSize / 1024 / 1024 + Number.EPSILON) * 100) /
			  100
			: undefined;

		switch (type) {
			case "COMPRESSED":
				if (compressedSize)
					return (
						<button
							onClick={() => handleDownload(compressedUrl, post.compressedSize)}
						>
							<GetApp />
							COMPRESSED - {compressedSize}Mb
						</button>
					);
				return null;

			case "ORIGINAL":
				if (originalSize && originalUrl)
					return (
						<button
							onClick={() => handleDownload(originalUrl, post.originalSize)}
						>
							<GetApp />
							ORIGINAL - {originalSize}Mb
						</button>
					);
				if (!originalSize && originalUrl)
					return (
						<button onClick={() => handleDownload(originalUrl, 0)}>
							<GetApp /> ORIGINAL
						</button>
					);
				return (
					<button>
						<Error /> DOWNLOAD NOT AVAILABLE
					</button>
				);

			case "OPEN_IN_NEW_TAB":
				return (
					<button
						onClick={() => {
							let _url = post.originalUrl;
							if (booru === "gelboooru")
								_url = `${_url.slice(0, 8)}${_url.slice(
									_url.indexOf("gelbooru")
								)}`;
							window.open(_url, "_blank");
						}}
					>
						<Fullscreen /> OPEN IMAGE IN A NEW TAB
					</button>
				);

			case "SOURCE":
				if (post.source)
					return (
						<button
							onClick={() => {
								window.open(post.source, "_blank");
							}}
						>
							<InsertLink /> SOURCE
						</button>
					);
				return null;
		}
	};

	const details = () => {
		let variable = null;
		switch (booru) {
			case "yandere":
				variable = (
					<p>
						<span>Author</span> {post.author} ({post.creatorId})
					</p>
				);
				break;
			case "gelbooru":
				variable = (
					<>
						<p>
							<span>Hash</span> {post.hash}
						</p>
						<p>
							<span>Image</span> {post.image}
						</p>
					</>
				);
				break;
			case "danbooru":
				variable = (
					<p>
						<span>Artist</span> {post.artist}
					</p>
				);
				break;
		}
		return (
			<>
				{variable}
				<p>
					<span>Extension</span> {post.fileExt}
				</p>
				<p>
					<span>Resolution</span> {post.width} x {post.height}
				</p>
			</>
		);
	};

	return (
		<>
			<Head>
				<title>
					BOORUVERSE | {booru} | {id}
				</title>
			</Head>
			{loading ? (
				<Loading full={true} />
			) : (
				<main className={styles.preview}>
					<header className={styles.header}>
						<Link href={`/${booru}/posts?page=1`}>
							<a className={styles.logo}>
								<span>booru</span>verse
							</a>
						</Link>
					</header>
					<div className={styles.container}>
						<img src={post.previewUrl} alt={post.source} />

						<section className={styles.buttons}>
							{button("COMPRESSED")}
							{button("ORIGINAL")}
							{button("OPEN_IN_NEW_TAB")}
							{button("SOURCE")}
						</section>
						<span className={styles.id}>
							{booru} <span>{post.id}</span>
						</span>
						<section className={styles.tags}>
							{post.tags &&
								post.tags.split(" ").map((tag) => (
									<Tag
										key={tag}
										name={tag}
										onClick={() => {
											router.push(`/${booru}/posts?filters=${tag}`);
										}}
									/>
								))}
						</section>
						<section className={styles.details}>{details()}</section>
					</div>
				</main>
			)}
		</>
	);
};

export default Preview;

export async function getServerSideProps(context) {
	const { booru, id } = context.query;

	// need to dynamically implement the server_url later on
	const res = await fetch(
		`http://${
			context.req.headers.host
		}/api/${booru}/posts?page=1&filters=id:${parseInt(id)}&preview=true`
	);

	const data = await res.json();

	if (data.length === 0) {
		return {
			notFound: true,
		};
	}

	return {
		props: { post: data[0] },
	};
}
