import { makeAutoObservable } from 'mobx';
import { axiosClient } from "../axiosApi/axiosClient";

class AuthStore {
    isLoggedIn = false;
    isStudent = false;
    isTeacher = false;
    isAdmin = false;
    nickname = '';
    userEmail = '';
    provider = '';
    profileImageUrl = '';

    constructor() {
        makeAutoObservable(this);
    }

    // 로그인 상태
    setIsLoggedIn(isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
    }

    checkIsLoggedIn() {
        this.isLoggedIn = !!localStorage.getItem("token");
        return this.isLoggedIn;  // 로그인 상태를 반환
    }

    // 학생 여부
    setIsStudent(isStudent) {
        this.isStudent = isStudent;
    }

    checkIsStudent() {
        return this.isStudent; // 학생인지 여부를 반환
    }

    // 강사 여부
    setIsTeacher(isTeacher) {
        this.isTeacher = isTeacher;
    }

    checkIsTeacher() {
        return this.isTeacher; // 강사인지 여부를 반환
    }

    // 관리자 여부
    setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
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
    setUserEmail(userEmail) {
        this.userEmail = userEmail;
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


    // 프로필 이미지 URL
    setProfileImageUrl(profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    // 프로필 이미지는 로그인후에 변경이 가능하므로 부트로 요청을 보내서 다시 set
    async fetchProfileImageUrl() {
        try {
            const response = await axiosClient.get(`/users`, {
                params: {
                    userEmail: localStorage.getItem("userEmail"),
                    provider: localStorage.getItem("provider")
                }
            });
            this.setProfileImageUrl(response.data.profileImageUrl);
            return response.data.profileImageUrl;
        } catch (error) {
            console.error('Error fetching profile image URL:', error);
        }
    }

    getProfileImageUrl() {
        
        return this.fetchProfileImageUrl();
    }



}

const authStore = new AuthStore();
export default authStore;
