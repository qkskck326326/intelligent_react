import Head from 'next/head';
//리액트 쿼리 Router 설정 관련 모듈
import {QueryClient, QueryClientProvider} from 'react-query';
import {Container, ThemeProvider} from 'react-bootstrap';
import {authStore} from '../stores/authStore';
import NavigationBar from "../components/common/navigationBar";
import '../styles/style.css'
import '../components/common/CourseList'
import CourseList from "../components/common/CourseList";
import React from "react";
import CourseCard from "../components/common/CourseCard";
import NavBar from "../components/common/NavBar";
const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
          breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
          minBreakpoint='sm'>
        <Head>
          <link rel='icon' href='/public/images/favicon.ico'/>
          <title>IntelligentClass</title>
        </Head>
        <Container>
          <NavigationBar/>
        </Container>
        <main>
          <img src='/images/banner.png' alt="Banner" style={{width: '100%', height:'auto'}}/>
          <NavBar/>
          <CourseList/>
        </main>
        <Container>
          <Component {...pageProps} authStore={authStore}/>
        </Container>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

