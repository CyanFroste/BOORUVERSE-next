import styles from "../styles/Navbars.module.scss";
import Link from "next/link";
import MenuIcon from "@material-ui/icons/Menu";
import Select from "./Select";
import { useState } from "react";
import Menu from "./Menu";
import { Forward } from "@material-ui/icons";
import { useRouter } from "next/router";

const Topbar = ({ showShade, booru, page, filters, qdm, toggleQdm }) => {
	const [isMenuOpen, toggleMenu] = useState(false);
	const [pageControl, setPageControl] = useState(false);
	const [nPage, setNPage] = useState(page);

	const router = useRouter();

	return (
		<header className={styles.top}>
			<nav className={styles.main}>
				<Link href={`/${booru}/posts?page=1`}>
					<a className={styles.logo}>
						<span>booru</span>verse
					</a>
				</Link>

				<button
					className="menu-toggle "
					onClick={() => toggleMenu(!isMenuOpen)}
				>
					<MenuIcon />
				</button>
				{isMenuOpen && (
					<Menu toggleMenu={toggleMenu} filters={filters} booru={booru} />
				)}
			</nav>
			{showShade && (
				<nav className={styles.shade}>
					{/* booru select */}
					<Select booru={booru} />

					{/* qdm toggle */}
					<button
						className={styles.qdm + " " + (qdm && styles.active)}
						onClick={() => toggleQdm(!qdm)}
					>
						qdm
					</button>

					{/* page controls */}
					<div className={styles.pageControl}>
						<div
							className={styles.pageControlToggle}
							onClick={() => setPageControl(!pageControl)}
						>
							pg
						</div>
						{pageControl ? (
							<div className={styles.pageChanger}>
								<input
									placeholder="goto"
									type="text"
									onChange={(e) => setNPage(e.target.value)}
								/>
								<button
									onClick={() => {
										setPageControl(false);
										router.push(
											`/${booru}/posts?page=${nPage}&filters=${filters}`
										);
									}}
								>
									<Forward />
								</button>
							</div>
						) : (
							<div className={styles.pageDisplay}>{page}</div>
						)}
					</div>
				</nav>
			)}
		</header>
	);
};

export default Topbar;
