import React, { useEffect } from 'react';
import Head from 'next/head';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Container, ThemeProvider } from 'react-bootstrap';
import { useRouter } from 'next/router';
import HeaderBar from "../components/common/HeaderBar";
import '../styles/style.css';
import authStore from "../stores/authStore";

const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        authStore.setIsLoggedIn(true);
        authStore.setIsAdmin(localStorage.getItem("isAdmin") === "true");
        authStore.setNickname(localStorage.getItem("nickname") || '');
        authStore.setUserEmail(localStorage.getItem("userEmail") || '');
        authStore.setProvider(localStorage.getItem("provider") || '');
      }
    }
  }, []);

  // 현재 경로가 /admin/testAI가 아닌 경우에만 HeaderBar를 렌더링합니다.
  const shouldRenderHeader = router.pathname !== '/admin/testAI';

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
