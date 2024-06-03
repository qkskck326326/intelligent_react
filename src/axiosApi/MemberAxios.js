import axios from "./authApi";
import {authStore} from '../stores/authStore';

export const signUp = (signUpData) => {
    return axios.post("/members", signUpData).then(res => {
        return res;
    });
};

export const login = (loginData) => {
    return axios.post("/api/auth/login", loginData).then(response => {
        //로그인 성공시 토큰 처리
        const token = response.headers['authorization'] || response.headers['Authorization'];
        if(token){
            const pureToken = token.split(' ')[1];
            window.localStorage.setItem("token", pureToken);
            window.localStorage.setItem("isAdmin", response.data.isAdmin);
            window.localStorage.setItem("refresh", response.data.refresh);
            authStore.setIsAdmin(response.data.isAdmin); 
            authStore.checkLoggedIn();
        } 
        return response;
    });
};

export const logout = () => {
    return axios.post("/logout").then(res => {
        return res;
    });
};

//마이페이지, 회원정보수정, 회원탈퇴
//관리자 : 회원목록 조회, 회원 검색 (아이디, 가입날짜, 로그인가능여부 등)
