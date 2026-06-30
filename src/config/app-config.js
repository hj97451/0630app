/**
 * ⚙️ app-config.js
 * ─────────────────────────────────────────────
 * ✅ GitHub에 올라가도 안전한 설정만 포함
 * ❌ 학생 명단, 관리자 비밀번호 → Firebase DB에 저장 (setup.html로 1회 입력)
 * ─────────────────────────────────────────────
 */

const APP_CONFIG = {

  // ── 학급 기본 정보 (공개해도 무방) ──────────
  class: {
    name: "5학년 1반",
    year: "2026",
    school: "서울목동초등학교",
    teacherName: "박주옥",
  },

  // ── 과제 목록 (공개해도 무방) ───────────────
  // 과제 내용은 민감 정보 아님 — 코드에 유지
  assignments: [
    {
      id: "hw_001",
      title: "독서 감상문 쓰기",
      desc: "이번 주에 읽은 책의 줄거리와 느낀 점을 써서 제출하세요.",
      due: "2025-07-10",
      types: ["text", "image", "pdf"],
      active: true,
    },
    {
      id: "hw_002",
      title: "수학 풀이 사진 제출",
      desc: "교재 32~34쪽 풀이를 사진 찍어 제출하세요.",
      due: "2025-07-08",
      types: ["image", "pdf"],
      active: true,
    },
  ],

  // ── 파일 업로드 제한 ────────────────────────
  upload: {
    maxSizeMB: 5,
    allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    allowedPdfTypes: ["application/pdf"],
  },

  // ── 사이트 정보 ─────────────────────────────
  site: {
    githubUrl: "https://github.com/hj97451/0630app",
    frontendUrl: "",   // Vercel 배포 후 입력
    version: "1.0.0",
  },

  // ──────────────────────────────────────────────────────────────
  // ❌ 아래 항목은 코드에 없음 — Firebase DB에 직접 저장
  //
  //  /students/{번호}  → { number, name, code }
  //  /admin/password   → "your_password_here"
  //
  //  → setup.html 을 열어서 1회 입력하세요.
  //    입력 완료 후 setup.html은 배포 폴더에서 삭제하세요.
  // ──────────────────────────────────────────────────────────────
};

if (typeof module !== "undefined") {
  module.exports = APP_CONFIG;
} else {
  window.APP_CONFIG = APP_CONFIG;
}
