import { useState } from "react";
import Link from "next/link";
import { ArrowDropDown } from "@material-ui/icons";
import styles from "../styles/Components.module.scss";
import config from "../config.json";

const Select = ({ booru }) => {
	// states
	const [isDropped, setIsDropped] = useState(false);

	// options
	const options = config.booru.list;

	return (
		<div className={styles.select}>
			<button
				className={styles.dropdownToggle}
				onClick={() => setIsDropped(!isDropped)}
			>
				{booru} <ArrowDropDown />
			</button>
			<ul
				className={styles.dropdownList}
				style={isDropped ? { display: "flex" } : { display: "none" }}
			>
				{options &&
					options.map((option) => (
						<li key={option}>
							<Link href={`/${option}/posts`}>
								<a> {option}</a>
							</Link>
						</li>
					))}
			</ul>
		</div>
	);
};

export default Select;

