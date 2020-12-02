import { Error } from "@material-ui/icons";
import styles from "../../styles/Screens.module.scss";

const Err = ({ full }) => {
	return (
		<div className={styles.error + " " + (full && styles.full)}>
			<div className={styles.text}>404</div>
			<div className={styles.spinner}>
				<Error />
			</div>
		</div>
	);
};

export default Err;
