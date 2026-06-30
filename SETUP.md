# 🚀 처음 설정 방법 (교사용 가이드)

## 1단계 — 학생 명단 입력

`src/config/app-config.js` 파일을 열고 `students` 배열을 수정하세요.

```javascript
students: [
  { number: 1,  name: "홍길동", code: "1234" },
  { number: 2,  name: "이순신", code: "1234" },
  // ...
],
```

- `number`: 학번 (1~30)
- `name`: 학생 이름
- `code`: **처음 로그인용 임시 코드** → 학생이 직접 바꾸도록 안내하세요

> 💡 초기 코드는 모두 `"1234"` 로 같아도 됩니다.
> 학생이 처음 로그인 후 **⚙️ 설정**에서 자신만의 코드로 바꾸게 해주세요.

---

## 2단계 — 학급 이름 변경

같은 파일 상단의 `class` 항목을 수정하세요.

```javascript
class: {
  name: "3학년 2반",
  year: "2025",
  totalStudents: 30,
},
```

---

## 3단계 — 과제 등록

`assignments` 배열에 과제를 추가/수정하세요.

```javascript
{
  id: "hw_001",           // 영문 고유 ID (절대 바꾸지 마세요)
  title: "독서 감상문",    // 과제 제목
  desc: "설명...",         // 학생에게 보이는 설명
  due: "2025-03-28",      // 마감일 YYYY-MM-DD
  types: ["text", "image", "pdf"],  // 허용 형식
  active: true,           // true = 공개, false = 숨김
},
```

> ⚠️ `id` 는 한 번 정하면 바꾸지 마세요. 제출 데이터 키로 사용됩니다.

---

## 4단계 — 관리자 비밀번호 변경

```javascript
admin: {
  password: "teacher2025",  // ← 이걸 꼭 바꾸세요!
},
```

---

## 5단계 — 실행

### 로컬에서 실행 (같은 컴퓨터만)
`index.html` 을 더블클릭해서 브라우저로 열면 됩니다.

> ⚠️ 단, 같은 브라우저에서만 데이터가 공유됩니다.
> 학생마다 각자의 기기에서 접속하려면 **웹 서버 배포**가 필요합니다.

---

## 여러 기기에서 사용하기 (웹 서버 배포)

학생들이 각자 기기에서 접속하려면 인터넷에 올려야 합니다.

### 방법 A — GitHub Pages (무료, 쉬움)
1. [GitHub](https://github.com) 계정 만들기
2. 새 저장소(repository) 생성 → 파일 전체 업로드
3. Settings → Pages → Branch: main → Save
4. 생성된 URL을 학생들에게 공유

### 방법 B — Netlify (무료, 드래그 앤 드롭)
1. [netlify.com](https://netlify.com) 접속 → 무료 계정 생성
2. `homework-app` 폴더를 통째로 드래그 앤 드롭
3. 생성된 URL 공유

> ⚠️ **중요**: localStorage는 기기마다 따로 저장됩니다.
> 학생들이 여러 기기에서 사용하거나 데이터를 클라우드에 저장하려면
> Firebase 같은 데이터베이스 연동이 필요합니다.
> 이 부분은 개발자에게 문의하거나 `CUSTOMIZATION.md` 를 참고하세요.

---

## 관리자 페이지 접속

브라우저에서 `admin.html` 을 열거나 URL 뒤에 `/admin.html` 을 붙이면 됩니다.

예: `https://yoursite.github.io/homework-app/admin.html`

---

## 자주 묻는 질문

**Q. 학생이 코드를 잊어버렸어요.**
A. `app-config.js` 에서 해당 학생의 `code` 를 수정해도 이미 저장된 데이터는 바뀌지 않아요.
   개발자 도구(F12) → Console에서 아래를 실행하면 됩니다:
   ```javascript
   Storage.updateStudentCode(학번, "새코드");
   ```

**Q. 과제를 추가하면 이전 제출 데이터가 사라지나요?**
A. 아니요, 안 사라집니다. 안심하고 추가하세요.

**Q. 전체 데이터를 초기화하고 싶어요.**
A. 개발자 도구 Console에서 `Storage.clearAll()` 을 실행하세요.
   ⚠️ 모든 제출 데이터가 삭제됩니다!
