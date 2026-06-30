/**
 * ⚙️ app-config.js
 * ─────────────────────────────────────────────
 * 앱 전체 설정 파일입니다.
 * 이 파일에서 학생 명단, 과제 목록, 관리자 비밀번호를 설정하세요.
 * ─────────────────────────────────────────────
 */

const APP_CONFIG = {

  // ──────────────────────────────────────────
  // 1. 학급 기본 정보
  // ──────────────────────────────────────────
  class: {
    name: "5학년 1반",       // 학급 이름 (화면 상단에 표시됨)
    year: "2026",            // 학년도
    totalStudents: 30,       // 전체 학생 수 (1번 ~ 이 숫자까지 자동 생성)
  },

  // ──────────────────────────────────────────
  // 2. 학생 명단
  // 형식: { number: 번호, name: "이름", code: "초기 비밀코드" }
  // 학생이 처음 로그인 시 이 코드를 사용하고, 이후 설정에서 변경 가능
  // ──────────────────────────────────────────
  students: [
    { number: 1,  name: "김민준", code: "1234" },
    { number: 2,  name: "이서연", code: "1234" },
    { number: 3,  name: "박지호", code: "1234" },
    { number: 4,  name: "최수아", code: "1234" },
    { number: 5,  name: "정도윤", code: "1234" },
    { number: 6,  name: "강하은", code: "1234" },
    { number: 7,  name: "조민서", code: "1234" },
    { number: 8,  name: "윤재원", code: "1234" },
    { number: 9,  name: "장예린", code: "1234" },
    { number: 10, name: "임시우", code: "1234" },
    { number: 11, name: "한가을", code: "1234" },
    { number: 12, name: "오준혁", code: "1234" },
    { number: 13, name: "서나연", code: "1234" },
    { number: 14, name: "신동현", code: "1234" },
    { number: 15, name: "류지아", code: "1234" },
    { number: 16, name: "문성민", code: "1234" },
    { number: 17, name: "배소희", code: "1234" },
    { number: 18, name: "홍태양", code: "1234" },
    { number: 19, name: "고은서", code: "1234" },
    { number: 20, name: "남준호", code: "1234" },
    { number: 21, name: "심다은", code: "1234" },
    { number: 22, name: "권현우", code: "1234" },
    { number: 23, name: "안지수", code: "1234" },
    { number: 24, name: "황민채", code: "1234" },
    { number: 25, name: "전우진", code: "1234" },
    { number: 26, name: "노예슬", code: "1234" },
    { number: 27, name: "하승현", code: "1234" },
    { number: 28, name: "마지원", code: "1234" },
    { number: 29, name: "구태인", code: "1234" },
    { number: 30, name: "표나린", code: "1234" },
  ],

  // ──────────────────────────────────────────
  // 3. 과제 목록
  // 형식:
  //   id       : 고유 식별자 (영문, 변경 금지)
  //   title    : 과제 제목
  //   desc     : 과제 설명 (학생에게 보임)
  //   due      : 마감일 (YYYY-MM-DD)
  //   types    : 허용 제출 형식 ["pdf", "image", "text"] 중 선택
  //   active   : true = 현재 제출 가능 / false = 숨김
  // ──────────────────────────────────────────
  assignments: [
    {
      id: "hw_001",
      title: "독서 감상문 쓰기",
      desc: "이번 주에 읽은 책의 줄거리와 느낀 점을 써서 제출하세요.",
      due: "2025-03-28",
      types: ["text", "image", "pdf"],
      active: true,
    },
    {
      id: "hw_002",
      title: "수학 풀이 사진 제출",
      desc: "교재 32~34쪽 풀이를 사진 찍어 제출하세요.",
      due: "2025-03-25",
      types: ["image", "pdf"],
      active: true,
    },
    {
      id: "hw_003",
      title: "자기소개서 작성",
      desc: "나를 소개하는 글을 자유롭게 써주세요.",
      due: "2025-04-01",
      types: ["text", "pdf"],
      active: false,  // 아직 공개 안 함
    },
  ],

  // ──────────────────────────────────────────
  // 4. 관리자(교사) 설정
  // ──────────────────────────────────────────
  admin: {
    password: "teacher2026",   // 관리자 페이지 접속 비밀번호 (반드시 변경하세요!)
  },

  // ──────────────────────────────────────────
  // 5. 파일 업로드 제한
  // ──────────────────────────────────────────
  upload: {
    maxSizeMB: 10,             // 최대 파일 크기 (MB)
    allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    allowedPdfTypes: ["application/pdf"],
  },

};

// 외부 파일에서 사용할 수 있도록 export (모듈 방식 미사용 시 window에 등록)
if (typeof module !== "undefined") {
  module.exports = APP_CONFIG;
} else {
  window.APP_CONFIG = APP_CONFIG;
}
