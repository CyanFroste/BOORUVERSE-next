import { Favorite } from "@material-ui/icons";
import styles from "../../styles/Screens.module.scss";

const Loading = ({ full }) => {
	return (
		<div className={styles.loading + " " + (full && styles.full)}>
			<div className={styles.text}>booruverse</div>
			<div className={styles.spinner}>
				<Favorite />
			</div>
		</div>
	);
};

export default Loading;
