# 📚 과제 제출 관리 앱

초등학교 고학년 학생들의 과제 제출을 한 곳에서 관리하며 학습 동기를 높이는 과제제출 앱 입니다.
학생들의 성취도와 과제에 대한 결과를 한 눈에 볼 수 있어 교사의 업무를 경감시켜줄 수 있습니다.

---

## 📁 파일 구조

```
homework-app/
├── index.html               ← 학생 과제 제출 페이지
├── admin.html               ← 교사 관리자 페이지
│
└── src/
    ├── config/
    │   └── app-config.js    ← ⚙️ 학급·과제·관리자 설정
    ├── styles/
    │   ├── base.css         ← 공통 스타일
    │   ├── student.css      ← 학생 페이지 스타일
    │   └── admin.css        ← 관리자 페이지 스타일
    ├── utils/
    │   └── storage.js       ← Firebase Realtime Database 연동
    ├── components/
    │   ├── login.js         ← 로그인 컴포넌트
    │   ├── submit.js        ← 과제 제출 컴포넌트
    │   └── settings.js      ← 코드 변경 설정
    └── pages/
        ├── student-page.js  ← 학생 메인 페이지
        └── admin-page.js    ← 관리자 대시보드
```

---

## 🚀 빠른 시작

1. `src/config/app-config.js`에서 페이지설정
2. GitHub에 push → Vercel로 배포
3. `admin.html`으로 관리자 화면에 접속

---

## 🔐 개인정보 보안 구조

| 데이터 | 저장 위치 | GitHub 노출 |
|--------|-----------|-------------|
| 학급명, 과제 목록 | `app-config.js` (코드) | ✅ 안전 |
| 학생 명단 (이름, 코드) | Firebase `/students/` | ❌ 없음 |
| 관리자 비밀번호 | Firebase `/admin/password` | ❌ 없음 |
| 제출 데이터 | Firebase `/submissions/` | ❌ 없음 |

**초기 설정 방법:** `setup.html`을 브라우저로 열어 학생 명단과 관리자 비밀번호를 Firebase에 저장 → 완료 후 `setup.html` 삭제



