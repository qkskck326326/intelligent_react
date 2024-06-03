import React, { useState } from "react";
import { useMutation } from 'react-query';
import { login } from '../../axiosApi/MemberAxios';
import { useRouter } from "next/router";
import { handleAxiosError } from '../../axiosApi/errorAxiosHandler';

const LoginForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        userId: '',
        userPwd: '',
    });

    const loginMutation = useMutation(loginData => login(loginData), {
        onSuccess: (data) => {
            //로그인 성공 후의 동작을 정의함
            router.push('/');   //홈(시작) 페이지로 리다이렉션 처리함
        },
        onError: (error) => {
            //에러 핸들러를 호출해서 사용자에게 에러를 알림
            handleAxiosError(error);
        },
    });

    //input 의 값이 변경되면 작동돌 이벤트핸들러로 준비
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData);  //mutate 함수로 로그인 요청을 보냄
    };

    return (
        <div className="center-div">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="userId">아이디</label>
                    <input type="text" id="userId" name="userId" 
                        value={formData.userId} onChange={handleInputChange}
                        required />
                </div>
                <div className="form-group">
                    <label htmlFor="userPwd">비밀번호</label>
                    <input type="password" id="userPwd" name="userPwd" 
                        value={formData.userPwd} onChange={handleInputChange}
                        required />
                </div>
                <div className="button-container">
                    {loginMutation.isLoading ? (
                        //로그인 중일때는 로딩 텍스트를 표시함
                        <p>로그인 중...</p>
                    ) : (
                        //로그인 중이 아닐 때는 로그인 버튼을 표시함
                        <button type="submit">로그인</button>
                    )}
                    { //에러 발생시 에러 메세지 처리하는 코드 작성 영역임
                      //handleAxioError 함수에서 자동 처리하므로 코드 생략임
                    }
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
