import React, { useEffect } from 'react';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Container, ThemeProvider } from 'react-bootstrap';
import { useRouter } from 'next/router';
import HeaderBar from "../components/common/HeaderBar";
import {observer} from 'mobx-react';
import '../styles/style.css';
import authStore from "../stores/authStore";
import ChatContainer from "./chatting";

const queryClient = new QueryClient();

const App = observer (({ Component, pageProps }) => {
  const router = useRouter();
  console.log(authStore.getNickname());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        console.log("Setting authStore values from localStorage");
        authStore.setIsLoggedIn(true);
        authStore.setIsStudent(localStorage.getItem("isStudent") === "true");
        authStore.setIsTeacher(localStorage.getItem("isTeacher") === "true");
        authStore.setIsAdmin(localStorage.getItem("isAdmin") === "true");
        authStore.setUserEmail(localStorage.getItem("userEmail") || '');
        authStore.setProvider(localStorage.getItem("provider") || '');
        authStore.setNickname(localStorage.getItem("nickname") || '');
        authStore.setProfileImageUrl(localStorage.getItem("profileImageUrl") || '');
      }
    }
  }, []);

  useEffect(() => {
    const checkAdminAccess = () => {
      const path = router.pathname;
      if (path.startsWith('/admin') && !authStore.isAdmin) {
        router.push('/user/login');
      }
    };


    checkAdminAccess();
    router.events.on('routeChangeComplete', checkAdminAccess);
    return () => {
      router.events.off('routeChangeComplete', checkAdminAccess);
    };
  }, [router, authStore.isAdmin]);

  const shouldRenderHeader = router.pathname !== '/admin/testAI' &&  router.pathname !== '/user/naverLoginPopupPage' &&  router.pathname !== '/user/googleLoginPopupPage';

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
          {shouldRenderHeader && <HeaderBar />}
          <Container>
            <Component {...pageProps} />
          </Container>
          { authStore.isLoggedIn &&
              <ChatContainer/>
          }
        </ThemeProvider>
      </QueryClientProvider>
  );
});

export default App;
