import Link from "next/link";
import styles from "../styles/Components.module.scss";

const Card = ({ booru, post, postClick, qdm, index }) => {
	return (
		<Link href={`/${booru}/post/${post.id}`}>
			<a
				onClick={(e) => {
					if (qdm) e.preventDefault();
					postClick(post);
				}}
				className={styles.card}
			>
				<img src={post.previewUrl} alt={post.source} />
				<span className={styles.badge}>{post.fileExt || "unavailable"}</span>
				<div className={styles.details}>
					{post.id} | {index + 1}
				</div>
			</a>
		</Link>
	);
};

export default Card;
