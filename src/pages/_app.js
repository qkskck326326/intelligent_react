import Head from 'next/head';
import {QueryClient, QueryClientProvider} from 'react-query';
import {Container, ThemeProvider} from 'react-bootstrap';
import HeaderBar from "../components/common/HeaderBar";
import '../styles/style.css';
import React from "react";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
            breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
            minBreakpoint='sm'
        >
          <Head>
            <link rel='icon' href='/public/images/favicon.ico'/>
            <title>IntelligentClass</title>
          </Head>
          <HeaderBar/>
          <Container>
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </QueryClientProvider>
  );
};

export default App;
