import { createContext, useState, useEffect } from "react";
// import io from "socket.io-client";

export const CommonContext = createContext();

export const CommonContextProvider = ({ children }) => {
	const [scrollPos, setScrollPos] = useState(0);
	const [qdm, toggleQdm] = useState(false);

	/*
	const [downloads, setDownloads] = useState({
		downloading: [],
		completed: [],
	});
	// socket setup
	useEffect(() => {
		const socket = io("http://localhost:3000");
		socket.on("download", (data) => {
			setDownloads(data);
		});
	}, []);
  //*/

	return (
		<CommonContext.Provider
			value={{ scrollPos, setScrollPos, qdm, toggleQdm }}
		>
			{children}
		</CommonContext.Provider>
	);
};
