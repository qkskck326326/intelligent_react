import { useEffect, useRef } from 'react'
import styles from "../../styles/user/login/naverLogin.module.css"

const NaverLogin = () => {
    
// useRef 를 선언 해준다. 
	const naverRef = useRef()
	// const { naver } = window
    
// 환경 변수 처리를 해주었다면 ?
    // 환경 변수를 사용하여 CLIENT ID, CALLBACK URL 불러온다.  
    // 설명이 필요하다면 댓글 또는 메일을 남겨주세요! 
	const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
	const NAVER_CALLBACK_URL = process.env.NEXT_PUBLIC_NAVER_CALLBACK_URL

	const initializeNaverLogin = () => {
		// const naverLogin = new naver.LoginWithNaverId({
		//
        //   // 위에 Client Id 랑 Callback Url 적었는데 ? 라고 혹시 생각한다면
        //   // 변수 처리를 해준 것이기에 그냥 넘어가면 된다.
		// 	clientId: NAVER_CLIENT_ID,
		// 	callbackUrl: NAVER_CALLBACK_URL,
		// 	isPopup: false,
		// 	loginButton: { color: 'green', type: 3, height: 58 },
		// 	callbackHandle: true,
		// })
		// naverLogin.init()
	}
    
	const userAccessToken = () => {
		window.location.href.includes('access_token') && getToken()
	}
	const getToken = () => {
		const token = window.location.href.split('=')[1].split('&')[0]
	}

	useEffect(() => {
		initializeNaverLogin()
		userAccessToken()
	}, [])


       // handleClick 함수 onClick 이벤트 발생 시 useRef 를 통해 지정한 naverRef 항목이 클릭 된다.
       // current 를 통해 아래 div 태그의 ref={} 속성을 줄 수 있다. ( 자세한 내용은 공식문서를 확인하자. )
	const handleNaverLogin = () => {
		naverRef.current.children[0].click()
	}

	return (
        <div className={styles.NaverIdLogin} id="naverIdLogin" ref={naverRef}>
			<button className={styles.NaverLoginBtn} onClick={handleNaverLogin}>
				<div className={styles.NaverIcon} alt="navericon" />
				<span className={styles.NaverLoginTitle}>네이버로 시작하기</span>
			</button>
        </div>
	)
}

export default NaverLogin