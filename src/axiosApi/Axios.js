/**
 * AJAX 요청용 클래스입니다.
 * get, post, put, delete 변수가 있습니다.
 * 사용하실 때 변수에 new 선언으로 객체 생성 후 사용할 수 있습니다.
 * */
export default class Axios {

    constructor() {
        this.baseURL = 'http://localhost:8080';
    }

    /**
     * GET 요청용 API입니다.
     * @Param(URL)
     * BaseURL을 제외한 주소를 /를 처음에 포함시켜 작성합니다.
     * @Param(queryString)
     * GET 요청으로 컨트롤러에 보낼 정보를 담는 쿼리 스트링입니다.
     * 컨트롤러의 RequestParam과 같은 이름을 사용하여야 하며 첫 변수는 ?로 시작합니다.
     * 이후 추가 변수들을 &를 이용해 연결합니다.
     * */
    async get(URL, queryString = '') {
        try {
            const response = await fetch(`${this.baseURL}${URL}${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('GET ERROR:', error);
            throw error;
        }
    }

    /**
     * POST 요청용 API입니다.
     * @Param(URL)
     * BaseURL을 제외한 주소를 /를 처음에 포함시켜 작성합니다.
     * @Param(object)
     * POST 요청으로 컨트롤러에 보낼 객체를 받는 파라미터입니다.
     * JavaScript 객체형태의 변수를 담아주면 됩니다.
     * */
    async post(URL, object) {
        try {
            const response = await fetch(`${this.baseURL}${URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('POST ERROR:', error);
            throw error;
        }
    }

    /**
     * PUT 요청용 API입니다.
     * @Param(URL)
     * BaseURL을 제외한 주소를 /를 처음에 포함시켜 작성합니다.
     * @Param(object)
     * PUT 요청으로 컨트롤러에 보낼 객체를 받는 파라미터입니다.
     * JavaScript 객체형태의 변수를 담아주면 됩니다.
     * */
    async put(URL, object) {
        try {
            const response = await fetch(`${this.baseURL}${URL}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('PUT ERROR:', error);
            throw error;
        }
    }

    /**
     * DELETE 요청용 API입니다.
     * @Param(URL)
     * BaseURL을 제외한 주소를 /를 처음에 포함시켜 작성합니다.
     * @Param(object)
     * DELETE 요청으로 컨트롤러에 보낼 객체를 받는 파라미터입니다.
     * JavaScript 객체형태의 변수를 담아주면 됩니다.
     * */
    async delete(URL, object) {
        try {
            const response = await fetch(`${this.baseURL}${URL}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            });
            if (!response.ok) {
                throw new Error(`status: ${response.status}`);
            }

        } catch (error) {
            console.error('DELETE ERROR:', error);
            throw error;
        }
    }
}
