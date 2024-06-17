import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        'Content-Type': 'application/json'
    },
});

// 요청 인터셉터 추가
axiosClient.interceptors.request.use(
    config => {
        // '/reissue' 요청은 인터셉터에서 엑세스 토큰을 추가하지 않도록 함
        // '/login' 요청시 토큰이 저장되도록 처리하기 위함
        // 또는 저장된 토큰을 확인해서 로그인 상태 확인을 하기 위함
        if (config.url != '/reissue'){ // 사용자 요청이 /reissue가 아니면
            const token = localStorage.getItem('token'); // localStorage에서 'token'을 가져 와서
            if (token){  // 로그인 상태, 토큰이 존재하면
                config.headers['Authorization'] = `Bearer ${token}`; // 주의 : `(백팁) 사용,  Authorization 헤더에 Bearer ${token} 형식으로 토큰을 추가
            }
        }
        return config;
    },
    error => Promise.reject(error)
);


const refreshToken = async() => {
    try{
        const refreshToken = localStorage.getItem('refresh');
        const response = await instance.post('/reissue', null, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        const token = response.headers['authorization'] || response.headers['Authorization']; 
        const newAccessToken = token.split(' ')[1]; // 새로운 액세스 토큰
        localStorage.setItem('token', newAccessToken);  // 재발급된 엑세스토큰 저장
        return newAccessToken;
    } catch (error){
        // 에러 응답 코드를 확인함
        if (error.response && error.response.data === 'refresh token expired'){
            // 리프래시 토큰이 만료된 경우 로그아웃 처리
            logout();
        }else {
            // 다른 종류의 에러 처리
            console.error('An error occurred : ', error);
        }
    }
};

const logout = () => {
    // 로컬 스토리지의 모든 항목을 지움
    localStorage.clear();
    // 첫(로그인) 페이지로 리다이렉트 
    window.location.href = '/';
};

// 응답 인터셉터(intercepter : 중간에 가로채다) 추가
// 응답올 때 작동되는 인터셉터임
axiosClient.interceptors.response.use(
    response => response, // 정상 응답
    async (error) => {  // 에러 조치
        const originalRequest = error.config;

        // 401 오류가 발생하고, 재시도 한 적이 없다면, originalRequest._retry가 false인 경우
        if(error.response.status === 401 && !originalRequest._retry) { // 액세스, 리프레쉬 둘다 죽었을경우 처리
            originalRequest._retry = true;  // 재시도로 변경
            // 토큰을 갱신하고 재시도
            const newAccessToken = await refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            // 원래 요청을 다시 수행
            return instance(originalRequest);
        }
        return Promise.reject(error);
    }
);

export {axiosClient};
