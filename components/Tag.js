import styles from "../styles/Components.module.scss";

const Tag = ({ name, count, selected, onClick }) => {
	// utility
	const shortenCount = (count) => {
		const numLen = count.toString().length;
		if (numLen > 3 && numLen < 7) {
			return (count / 1000).toFixed(2) + " K";
		} else if (numLen > 6 && numLen < 10) {
			return (count / 1000000).toFixed(2) + " M";
		} else return count;
	};

	return (
		<span
			className={styles.tag + " " + (selected && styles.selected)}
			onClick={onClick}
		>
			{name}
			{count && (
				<span className={styles.countBadge}>{shortenCount(count)}</span>
			)}
		</span>
	);
};

export default Tag;
