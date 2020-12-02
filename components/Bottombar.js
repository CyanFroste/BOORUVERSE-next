import { ChevronLeft, ChevronRight, FilterList } from "@material-ui/icons";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Navbars.module.scss";
import Filters from "./Filters";

const Bottombar = () => {
	const router = useRouter();
	const { booru, page = 1, filters = "" } = router.query;
	const [isFiltersModalOpen, toggleFiltersModal] = useState(false);

	return (
		<>
			<nav className={styles.bottom}>
				<button
					className="prev-button"
					onClick={() =>
						parseInt(page) !== 1 &&
						router.push(
							`/${booru}/posts?page=${parseInt(page) - 1}&filters=${filters}`
						)
					}
				>
					<ChevronLeft />
				</button>
				<button onClick={() => toggleFiltersModal(true)}>
					<FilterList />
				</button>
				<button
					className="next-button"
					onClick={() =>
						router.push(
							`/${booru}/posts?page=${parseInt(page) + 1}&filters=${filters}`
						)
					}
				>
					<ChevronRight />
				</button>
			</nav>
			{isFiltersModalOpen && (
				<Filters
					booru={booru}
					filters={filters}
					toggleFiltersModal={toggleFiltersModal}
				/>
			)}
		</>
	);
};

export default Bottombar;
