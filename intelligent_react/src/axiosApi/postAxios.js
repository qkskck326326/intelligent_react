import axios from "axios";

//기본 url 지정
const POST_BASE_URL = "http://localhost:8080/posts";

class PostAxios {
  //각 서비스별 메서드 작성
  //게시글 목록 조회 요청 처리용
  getPostList() {
    return axios.get(`${POST_BASE_URL}/list?page=1&limit=10`);
  }

  //게시글 상세보기 요청 처리용
  getPostDetail(boardNum) {
    return axios.get(POST_BASE_URL + "/" + boardNum);
  }

  //새 게시글 등록 처리용
  postInsert() {}

  //게시글 수정 처리용
  putPostUpdate() {}

  //게시글 삭제 처리용
  deletePost() {}

  //게시글 검색
  getPostTitleOrContent(keyword) {
    return axios.get(`${POST_BASE_URL}/search`);
  }
} // class closed

//외부에서 이 클래스를 import해서 사용하게 하려면
export default new PostAxios(); //객체를 내보냄
