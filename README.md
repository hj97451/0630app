# 📚 과제 제출 관리 앱

**소속학교:** 서울목동초등학교 | **제작자:** 박주옥

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

1. `src/config/app-config.js`에서 학생 명단·과제·관리자 비밀번호 설정
2. GitHub에 push → Vercel/Netlify로 배포
3. `admin.html`은 교사만 접속

---

## 🔐 개인정보 보안 구조

| 데이터 | 저장 위치 | GitHub 노출 |
|--------|-----------|-------------|
| 학급명, 과제 목록 | `app-config.js` (코드) | ✅ 안전 |
| 학생 명단 (이름, 코드) | Firebase `/students/` | ❌ 없음 |
| 관리자 비밀번호 | Firebase `/admin/password` | ❌ 없음 |
| 제출 데이터 | Firebase `/submissions/` | ❌ 없음 |

**초기 설정 방법:** `setup.html`을 브라우저로 열어 학생 명단과 관리자 비밀번호를 Firebase에 저장 → 완료 후 `setup.html` 삭제 (또는 `.gitignore`로 제외됨)



- 순수 HTML/CSS/JavaScript (외부 라이브러리 없음)
- **Firebase Realtime Database** — 실시간 데이터 저장 (여러 기기 지원)
- 세션 관리: localStorage (로그인 상태 유지)

---


## 🔒 Firebase Realtime Database 보안 규칙

Firebase 콘솔 → Realtime Database → 규칙에 아래를 적용하세요:

```json
{
  "rules": {
    "students": {
      ".read":  true,
      ".write": true
    },
    "submissions": {
      ".read":  true,
      ".write": true
    }
  }
}
```

> ⚠️ 학교 내부용 앱이므로 단순 공개 규칙을 사용합니다.
> 보안을 강화하려면 Firebase Authentication 연동이 필요합니다.
