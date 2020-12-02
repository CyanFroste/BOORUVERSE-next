import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";

export default function Home() {
	return (
		<div className={styles.container}>
			<Head>
				<title>BOORUVERSE</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<Link href="/yandere/posts">
					<a>yandere</a>
				</Link>
			</main>
		</div>
	);
}
