import {makeAutoObservable} from 'mobx';
// mobx를 모듈의 로그인상태 자동확인 설정
// _app.js 에 임포트하여 어딜 가서든 따라다니게 만듬
class AuthStore{
    isLoggedIn = false;
    isAdmin = false;
    constructor() {
        makeAutoObservable(this);
    }

    setIsLoggedIn(status){
        this.isLoggedIn = status
    }

    checkIsLoggedIn(){
        this.isLoggedIn = !!localStorage.getItem("token");
        return this.isLoggedIn;  // 로그인 상태를 반환
    }

    setIsAdmin(status){
        this.isAdmin = status;
    }

    checkIsAdmin(){
        return this.isAdmin; // 관리자인지 여부를 반환
    }
}

export const authStore = new AuthStore();
