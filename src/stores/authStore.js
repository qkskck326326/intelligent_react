// stores/authStore.js
import { makeAutoObservable } from 'mobx';

class AuthStore {
    isLoggedIn = false;
    isAdmin = false;
    nickname = '';

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
}

const authStore = new AuthStore();
export default authStore;