import Err from "../components/screens/Error";
import Head from "next/head";

const My404 = () => {
	return (
		<>
			<Head>
				<title>404 | Not Found</title>
			</Head>
			<Err full={true} />
		</>
	);
};

export default My404;
