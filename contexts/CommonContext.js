import { createContext, useState } from "react";

export const CommonContext = createContext();

export const CommonContextProvider = ({ children }) => {
	const [scrollPos, setScrollPos] = useState(0);
	const [qdm, toggleQdm] = useState(false);

	return (
		<CommonContext.Provider value={{ scrollPos, setScrollPos, qdm, toggleQdm }}>
			{children}
		</CommonContext.Provider>
	);
};
