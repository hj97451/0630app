# 📚 과제 제출 관리 앱

초등학생을 위한 과제 제출 및 교사 관리 시스템입니다.

---

## 📁 파일 구조

```
homework-app/
├── README.md                   ← 이 파일 (전체 구조 안내)
├── index.html                  ← 앱 진입점 (학생 로그인/과제 제출)
├── admin.html                  ← 교사 관리자 페이지
│
├── src/
│   ├── config/
│   │   └── app-config.js       ← ⚙️ 앱 전체 설정 (과제 목록, 학급 정보 등)
│   │
│   ├── styles/
│   │   ├── base.css            ← 공통 기본 스타일 (변수, 리셋)
│   │   ├── student.css         ← 학생 페이지 전용 스타일
│   │   └── admin.css           ← 관리자 페이지 전용 스타일
│   │
│   ├── utils/
│   │   └── storage.js          ← 데이터 저장/불러오기 유틸리티 (localStorage)
│   │
│   ├── components/
│   │   ├── login.js            ← 로그인 컴포넌트 (학번+이름+코드 검증)
│   │   ├── submit.js           ← 과제 제출 컴포넌트 (PDF/이미지/텍스트)
│   │   └── settings.js         ← 학생 설정 컴포넌트 (비밀번호 변경)
│   │
│   └── pages/
│       ├── student-page.js     ← 학생 메인 페이지 로직
│       └── admin-page.js       ← 관리자 페이지 로직
│
└── docs/
    ├── SETUP.md                ← 🚀 처음 설정 방법 (교사용 가이드)
    └── CUSTOMIZATION.md        ← 🎨 디자인/설정 커스터마이징 가이드
```

---

## 🚀 빠른 시작

1. `docs/SETUP.md` 를 읽고 초기 설정을 완료하세요.
2. `src/config/app-config.js` 에서 학생 명단과 과제를 입력하세요.
3. `index.html` 을 브라우저로 열거나 웹 서버에 올리세요.
4. 관리자 페이지는 `admin.html` 입니다.

---

## 🔑 기술 스택

- **순수 HTML/CSS/JavaScript** (외부 라이브러리 없음)
- **localStorage** 로 데이터 저장 (서버 불필요)
- 모든 파일은 독립적으로 수정 가능

> ⚠️ localStorage는 같은 브라우저/기기에서만 데이터가 공유됩니다.
> 여러 기기에서 사용하려면 `docs/SETUP.md`의 "서버 배포" 항목을 참고하세요.
