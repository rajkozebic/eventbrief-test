import { ChakraProvider } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { wrapper } from "@/store/store";
import { loading } from "@/store/common";
import "@/styles/globals.css";
import LoadingPage from "@/components/loading";

function App({ Component, pageProps }) {
  const pageLoading = useSelector(loading);

  return (
    <ChakraProvider>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {pageLoading && <LoadingPage />}
        <Component {...pageProps} />
        <ToastContainer />
      </main>
    </ChakraProvider>
  );
}

export default wrapper.withRedux(App);
