import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
	LocalOffer,
	ChevronLeft,
	ChevronRight,
	Settings,
	ClearAll,
	Search,
	CheckBox,
	CheckBoxOutlineBlank,
	Clear,
	Done,
	Close,
} from "@material-ui/icons";

import styles from "../styles/Filters.module.scss";
import Tag from "./Tag";
import config from "../config.json";
import Loading from "./screens/Loading";

const Filters = ({ booru, filters, toggleFiltersModal }) => {
	//router
	const router = useRouter();

	// states
	const [page, setPage] = useState(1);
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTags, setSelectedTags] = useState(() => {
		if (filters.length) {
			let tags = filters.split(" ");
			if (tags[tags.length - 1].includes("id:<")) {
				tags.pop();
				return tags;
			} else return tags;
		} else return [];
	});
	const [nFilters, setNFilters] = useState("");
	const [limitId, setLimitId] = useState(() => {
		if (filters.length) {
			let tags = filters.split(" ");
			if (tags[tags.length - 1].includes("id:<")) {
				return tags.pop().slice(4);
			} else return "";
		} else return "";
	});
	const [searchString, setSearchString] = useState("");
	const [inverseTag, setInverseTag] = useState(false);

	// fetch tags
	useEffect(() => {
		setLoading(true);
		fetch(`/api/${booru}/tags?page=${page}&searchstring=${searchString}`)
			.then((res) => res.json())
			.then((data) => {
				setTags(data);
				setLoading(false);
			})
			.catch((err) => console.error(err));
	}, [page, searchString]);
	//

	useEffect(() => {
		if (limitId.length) setNFilters(`${selectedTags.join(" ")} id:<${limitId}`);
		else setNFilters(`${selectedTags.join(" ")}`);
	}, [selectedTags, limitId]);

	const clearFilters = () => {
		setSelectedTags([]);
		setNFilters("");
		setLimitId("");
		setSearchString("");
		setInverseTag(false);
		document.querySelector("#limit-id").value = "";
		document.querySelector("#search-bar").value = "";
	};

	const handleTagSelection = (tag) => {
		let maxTags = 4;
		if (booru === "danbooru") maxTags = 2;
		if (
			!selectedTags.includes(tag.name) &&
			!selectedTags.includes(`-${tag.name}`) &&
			selectedTags.length < maxTags
		) {
			if (inverseTag) setSelectedTags([...selectedTags, `-${tag.name}`]);
			else setSelectedTags([...selectedTags, tag.name]);
		} else {
			if (inverseTag)
				setSelectedTags(selectedTags.filter((t) => t !== `-${tag.name}`));
			else setSelectedTags(selectedTags.filter((t) => t !== tag.name));
		}
	};

	const limitIdOnChange = (e) => {
		setLimitId(e.target.value);
	};

	const searchOnChange = (e) => {
		setPage(1);
		setSearchString(e.target.value);
	};

	return (
		<div
			className={styles.filtersBackdrop}
			id="filters-backdrop"
			onClick={(e) => {
				e.stopPropagation();
				if (e.target.id !== "filters-backdrop") return;
				toggleFiltersModal(false);
			}}
		>
			<div className={styles.filters}>
				<div className={styles.content}>
					<div className={styles.active}>
						<p>{nFilters || "all"}</p>
					</div>
					<div className={styles.title}>
						<Search /> <p>Search</p>
					</div>
					<div className={styles.search}>
						<input id="search-bar" type="text" onChange={searchOnChange} />

						<button
							className={styles.clearSearch}
							onClick={() => {
								document.querySelector("#search-bar").value = "";
								setSearchString("");
							}}
						>
							<Clear />
						</button>
					</div>

					<div className={styles.title}>
						<Settings /> <p>Limit Id</p>
					</div>

					<div className={styles.limitId}>
						<button>
							<ChevronLeft />
						</button>
						<input
							id="limit-id"
							onChange={limitIdOnChange}
							defaultValue={limitId}
						/>
					</div>

					<div className={styles.title}>
						<LocalOffer />
						<p>Tags</p>

						<button
							className={styles.invertTagSelection}
							onClick={() => setInverseTag(!inverseTag)}
						>
							{!inverseTag ? <CheckBoxOutlineBlank /> : <CheckBox />}
							<span>Invert tags</span>
						</button>
					</div>

					{loading ? (
						<div className={styles.tags}>
							<Loading />
						</div>
					) : (
						<div className={styles.tags}>
							<div className={styles.tagsWrap}>
								{tags.map((tag) => (
									<Tag
										key={tag.id}
										name={tag.name}
										count={tag.count}
										selected={
											selectedTags.includes(tag.name) ||
											selectedTags.includes(`-${tag.name}`)
										}
										onClick={() => handleTagSelection(tag)}
									/>
								))}
							</div>
						</div>
					)}
				</div>

				<nav className={styles.controls}>
					<button onClick={() => setPage((old) => Math.max(old - 1, 1))}>
						<ChevronLeft />
					</button>
					<p>{page}</p>
					<button onClick={() => setPage((old) => old + 1)}>
						<ChevronRight />
					</button>
				</nav>

				<div className={styles.bottom}>
					<button
						className={styles.go}
						onClick={() => router.push(`/${booru}/posts?filters=${nFilters}`)}
					>
						<Done />
					</button>

					<button onClick={clearFilters}>
						<ClearAll />
					</button>

					<button onClick={() => toggleFiltersModal(false)}>
						<Close />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Filters;
