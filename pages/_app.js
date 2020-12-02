import "../styles/globals.scss";
import { CommonContextProvider } from "../contexts/CommonContext";

function App({ Component, pageProps }) {
	return (
		<CommonContextProvider>
			<Component {...pageProps} />
		</CommonContextProvider>
	);
}

export default App;
