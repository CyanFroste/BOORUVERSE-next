import { GetApp, FilterList } from "@material-ui/icons";
import styles from "../styles/Components.module.scss";

const Menu = ({ booru, filters, toggleMenu }) => {
	const activeFilters = filters !== "" && filters.trim().split(" ");

	return (
		<div
			className={styles.menuBackdrop}
			id="menu-backdrop"
			onClick={(e) => {
				e.stopPropagation();
				if (e.target.id !== "menu-backdrop") return;
				toggleMenu(false);
			}}
		>
			<div className={styles.menu}>
				<span className={styles.booru}>{booru}</span>
				{activeFilters.length > 0 && (
					<>
						<div className={styles.title}>
							<FilterList /> <p>Active Filters</p>
						</div>
						<div className={styles.activeFilters}>
							{activeFilters.map((f) => (
								<p key={f}>{f}</p>
							))}
						</div>
					</>
				)}

				<div className={styles.copyrights}>
					<span>Cyan Froste 2020</span>
				</div>
			</div>
		</div>
	);
};

export default Menu;
