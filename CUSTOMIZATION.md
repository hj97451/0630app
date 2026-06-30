# 🎨 디자인 & 설정 커스터마이징 가이드

## 색상 변경

`src/styles/base.css` 파일의 `:root` 안에 있는 변수를 수정하세요.

```css
:root {
  --color-primary:      #4A90D9;  /* 메인 파란색 → 원하는 색으로 */
  --color-success:      #34C472;  /* 완료 초록색 */
  --color-warning:      #F5A623;  /* 마감 임박 주황색 */
  --color-bg:           #F5F7FA;  /* 전체 배경색 */
  --color-surface:      #FFFFFF;  /* 카드 배경색 */
}
```

> 🎨 색상 코드를 모르면 [coolors.co](https://coolors.co) 에서 골라보세요.

---

## 폰트 변경

`index.html` / `admin.html` 의 `<head>` 안 Google Fonts 링크를 바꾸고,
`base.css` 의 `--font-main` 변수를 수정하세요.

```css
--font-main: "원하는폰트", sans-serif;
```

[fonts.google.com](https://fonts.google.com) 에서 한국어 폰트를 찾아보세요.
추천: `Noto Sans KR`, `Black Han Sans`, `Jua`

---

## 로그인 화면의 이모지 변경

`src/components/login.js` 의 `render` 함수에서 수정:

```html
<span class="emoji">📚</span>  <!-- 원하는 이모지로 변경 -->
<h1>3학년 2반 과제 제출함</h1>
```

---

## 로그인 화면 배경 그라데이션 변경

`src/styles/student.css` 의 `.login-wrapper`:

```css
.login-wrapper {
  background: linear-gradient(135deg, #EAF4FF 0%, #F5F7FA 60%, #E6F9EE 100%);
  /* 위 값을 바꾸세요 */
}
```

---

## 과제 카드 디자인 변경

`src/styles/student.css` 의 `.assignment-card` 섹션을 수정하세요.

### 완료 시 색상 변경
```css
.assignment-card.submitted {
  border-color: var(--color-success);  /* 테두리 색 */
  background: var(--color-success-light);  /* 배경색 */
}
```

### 카드 그림자 강도 조절
```css
.assignment-card:hover {
  box-shadow: var(--shadow-md);  /* shadow-sm / shadow-md / shadow-lg */
}
```

---

## 관리자 페이지 어두운 배경 변경

`src/styles/admin.css` 의 `.admin-login-wrapper`:

```css
.admin-login-wrapper {
  background: linear-gradient(135deg, #1E2840 0%, #2F4270 100%);
  /* 원하는 색으로 */
}
```

---

## 파일 업로드 크기 제한 변경

`src/config/app-config.js`:

```javascript
upload: {
  maxSizeMB: 10,  // MB 단위로 변경
},
```

---

## Firebase 연동 (여러 기기 지원)

localStorage 대신 Firebase Realtime Database를 쓰면 학생들이
어느 기기에서든 데이터를 공유할 수 있습니다.

1. [firebase.google.com](https://firebase.google.com) 에서 프로젝트 생성
2. Realtime Database 활성화
3. `src/utils/storage.js` 의 `_get` / `_set` 함수를 Firebase 함수로 교체
4. `index.html` 에 Firebase SDK 추가

> 이 부분은 개발자의 도움이 필요할 수 있습니다.
> 클로드에 "storage.js를 Firebase Realtime Database로 바꿔줘" 라고 요청해보세요.

---

## 버튼 텍스트 / 라벨 변경

각 컴포넌트 파일의 HTML 문자열에서 직접 수정:

| 텍스트 | 파일 |
|--------|------|
| "로그인" 버튼 | `src/components/login.js` |
| "과제 제출하기" 버튼 | `src/pages/student-page.js` |
| "제출하기" / "취소" | `src/components/submit.js` |
| "코드 변경" | `src/components/settings.js` |
| 관리자 텍스트 전반 | `src/pages/admin-page.js` |

---

## 모바일 최적화 (반응형 조정)

`src/styles/base.css` 하단의 미디어 쿼리:

```css
@media (max-width: 600px) {
  /* 여기서 모바일 전용 스타일 추가 */
}
```
