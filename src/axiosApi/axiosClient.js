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
        if (config.url !== '/reissue') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh');
        console.log('Reissue request sent with refresh token:', refreshToken);
        const response = await axiosClient.post('/reissue', null, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        console.log('Reissue response received:', response);

        const token = response.headers['authorization'] || response.headers['Authorization'];
        const newAccessToken = token.split(' ')[1];
        localStorage.setItem('token', newAccessToken);

        const newRefreshToken = response.data.refresh;
        if (newRefreshToken) {
            localStorage.setItem('refresh', newRefreshToken);
        }

        return newAccessToken;
    } catch (error) {
        if (error.response && error.response.data === 'refresh token expired') {
            logout();
        } else {
            console.error('An error occurred:', error);
        }
        return null;
    }
};

const logout = () => {
    localStorage.clear();
    localStorage.setItem('showLoginAlert', 'true'); // 플래그 설정
    window.location.href = '/user/login';
};

// 응답 인터셉터 추가
axiosClient.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response) {
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosClient(originalRequest);
                }
            }

            if (error.response.status === 403) {
                logout();
                return new Promise(() => {}); // 새로운 Promise 반환하여 후속 처리가 되지 않게 함
            }
        }

        return Promise.reject(error);
    }
);

export { axiosClient };
