import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Card from "../../components/Card";
import config from "../../config.json";
import styles from "../../styles/Posts.module.scss";
import Bottombar from "../../components/Bottombar";
import Topbar from "../../components/Topbar";
import Loading from "../../components/screens/Loading";
import { CommonContext } from "../../contexts/CommonContext";
import { download } from "../../services/download";

const Posts = ({ posts }) => {
	// states
	const [loading, setLoading] = useState(false); // also set error later on

	// router
	const router = useRouter();
	const { booru, page = 1, filters = "" } = router.query;

	// scroll position
	const container = useRef();
	const { scrollPos, setScrollPos, qdm, toggleQdm } = useContext(CommonContext);

	useEffect(() => {
		container.current.scrollTo(0, scrollPos);
		setScrollPos(0);
	}, []);

	// handlers
	const postClick = (post) => {
		if (qdm) {
			download(booru, post.originalUrl, post.originalSize || 0, post).then(
				(data) => {
					// toast
					console.log(data);
				}
			);
		} else {
			setScrollPos(container.current.scrollTop);
		}
	};
	//

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

	// generators
	const grid = () => {
		const colOne = [],
			colTwo = [];
		for (const [index, post] of posts.entries()) {
			if (index % 2 === 0)
				colOne.push(
					<Card
						booru={booru}
						post={post}
						key={index}
						postClick={postClick}
						qdm={qdm}
						index={index}
					/>
				);
			if (index % 2 === 1)
				colTwo.push(
					<Card
						booru={booru}
						post={post}
						key={index}
						postClick={postClick}
						qdm={qdm}
						index={index}
					/>
				);
		}
		return (
			<>
				<div className={styles.column}>
					{colOne && colOne.map((item) => item)}
				</div>
				<div className={styles.column}>
					{colTwo && colTwo.map((item) => item)}
				</div>
			</>
		);
	};

	return (
		<>
			{loading ? (
				<Loading full={true} />
			) : (
				<>
					<Topbar
						showShade={true}
						booru={booru}
						page={page}
						filters={filters}
						qdm={qdm}
						toggleQdm={toggleQdm}
					/>
					<div ref={container} className={styles.container}>
						<div className={styles.grid}>{grid()}</div>
					</div>
					<Bottombar />
				</>
			)}
		</>
	);
};

export default Posts;

export async function getServerSideProps(context) {
	const { booru, page = 1, filters = "" } = context.query;

	// need to dynamically implement the server_url later on
	const res = await fetch(
		`http://${context.req.headers.host}/api/${booru}/posts?page=${page}&filters=${filters}`
	);

	const data = await res.json();

	if (data.length === 0) {
		return {
			notFound: true,
		};
	}

	return {
		props: { posts: data },
	};
}
