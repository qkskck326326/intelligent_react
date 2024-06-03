import {makeAutoObservable} from 'mobx';
// mobx를 모듈의 로그인상태 자동확인 설정
// _app.js 에 임포트하여 어딜 가서든 따라다니게 만듬
class AuthStore {
    loggedIn = false;
    isAdmin = false;

    constructor(){
        makeAutoObservable(this);
    }

    setLoggedIn(status){
        this.loggedIn = status
    }

    setIsAdmin(status){
        this.isAdmin = status
    }

    checkLoggedIn(){
        this.loggedIn = !!localStorage.getItem("token");
    }
}

export const authStore = new AuthStore();
