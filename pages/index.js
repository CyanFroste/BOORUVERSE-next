import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.scss";
import { ChevronRight } from "@material-ui/icons";
import config from "../config.json";
import Loading from "../components/screens/Loading";
import { useEffect, useState } from "react";

export default function Home() {
	// states
	const [loading, setLoading] = useState(false); // also set error later on

	// router
	const router = useRouter();
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

	return (
		<>
			<Head>
				<title>BOORUVERSE</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{loading ? (
				<Loading full={true} />
			) : (
				<main className={styles.container}>
					<h1>booruverse</h1>
					<span className={styles.ver}>v3.0.0</span>
					<h2>
						NSFW <span>18+</span>
					</h2>
					<div className={styles.list}>
						{config.booru.list.map((booru) => (
							<Link href={`/${booru}/posts`}>
								<a>
									{booru} <ChevronRight />
								</a>
							</Link>
						))}
					</div>
					<div className={styles.credits}>
						<p>Cyan Froste</p>
						<span>© 2020</span>
					</div>
				</main>
			)}
		</>
	);
}
