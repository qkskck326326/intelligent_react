import React, { useEffect } from 'react';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Container, ThemeProvider } from 'react-bootstrap';
import { useRouter } from 'next/router';
import HeaderBar from "../components/common/HeaderBar";
import '../styles/style.css';
import authStore from "../stores/authStore";
// import '/public/ckeditor5/sample/styles.css'; // CKEditor 스타일 포함

const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  const router = useRouter();

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

  const shouldRenderHeader = router.pathname !== '/admin/testAI' &&  router.pathname !== '/user/naverLoginPopupPage';

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
        </ThemeProvider>
      </QueryClientProvider>
  );
};

export default App;