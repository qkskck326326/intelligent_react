export const handleAxiosError = (error) => {
    //사용자에게 보여줄 메세지 초기화
    let message = '에러가 발생했습니다.';

    //서버로부터 응답이 있는 경우
    if (error.response) {
        // 서버가 정의한 에러 메세지가 있는지 확인하고, 있으면 사용
        message = error.response.data.message || message;
    } else if (error.request) {
        //요청에 대한 응답이 없는 경우
        message = `서버로 부터 응답을 받지 못했습니다. ${error.message}`;
    } else {
        //요청 생성 중에 문제가 발생한 경우
        message = `서버로 요청 전에 문제가 발생했습니다. ${error.message}`;
    }

    //사용자에게 에러 메세지 표시
    alert(message);
}