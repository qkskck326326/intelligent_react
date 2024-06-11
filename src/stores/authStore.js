import { makeAutoObservable } from 'mobx';

class AuthStore {
    isLoggedIn = false;
    isAdmin = false;
    nickname = '';
    userEmail = '';
    provider = '';

    constructor() {
        makeAutoObservable(this);
    }

    // 로그인 상태
    setIsLoggedIn(status) {
        this.isLoggedIn = status;
    }

    checkIsLoggedIn() {
        this.isLoggedIn = !!localStorage.getItem("token");
        return this.isLoggedIn;  // 로그인 상태를 반환
    }

    // 관리자 여부
    setIsAdmin(status) {
        this.isAdmin = status;
    }

    checkIsAdmin() {
        return this.isAdmin; // 관리자인지 여부를 반환
    }

    // 닉네임
    setNickname(nickname) {
        this.nickname = nickname;
    }

    getNickname() {
        return this.nickname;
    }

    // 이메일
    setUserEmail(email) {
        this.userEmail = email;
    }

    getUserEmail() {
        return this.userEmail;
    }

    // 제공자
    setProvider(provider) {
        this.provider = provider;
    }

    getProvider() {
        return this.provider;
    }
}

const authStore = new AuthStore();
export default authStore;