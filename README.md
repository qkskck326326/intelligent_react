# Intelligent React 프로젝트

## 프로젝트 개요
IntelliClass React는 python(Django), aws(S3), SpringBoot와 api로 통신하는 어플리케이션으로,
유저에게 알맞는 UI와 그에 따른 기능( ai 서비스 등)을 제공합니다.

## 주요 기능
- **회원 관리**: Spring Boot와 통신하여 회원의 정보의 입력(회원가입), 수정, 삭제, 색인(관리자일 경우) 기능을 제공합니다.
- **AI 기능**: Django와 api로 통신하여 유용한 ai 기능을 제공합니다.
- **강의 관리**: Spring Boot와 aws(S3)와 api로 통신하여 강의 내용 및 영상을 저장, 수정, 삭제, 색인 기능을 제공합니다.
- **채팅**: 웹소켓을 이용하여 사용자들간의 채팅 기능을 제공합니다.
- **동적 데이터 렌더링**: 입력에 따라 동적으로 변하는 UI 구성을 제공합니다.

## 설치 및 실행 방법
1. 이 저장소를 클론합니다:
   ```bash
   git clone https://github.com/qkskck326326/intelligent_react.git
   ```
2. 프로젝트 폴더로 이동합니다:
   ```bash
   cd intelligent_react
   ```
3. 필요한 패키지를 설치합니다:
   ```bash
   npm install
   ```
4. 로컬 서버를 실행합니다:
   ```bash
   npm run dev
   ```
5. 브라우저에서 `http://localhost:3000`을 열어 애플리케이션을 확인합니다.

## 빌드 방법
프로덕션 환경용 빌드를 생성하려면 다음 명령어를 사용하세요:
```bash
npm run build
```
빌드된 파일은 `/build` 디렉토리에 생성됩니다.
