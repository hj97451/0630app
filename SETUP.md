# 🚀 처음 설정 방법 (교사용 가이드)

## 1단계 — 학생 명단 입력

연결된 firebase의 database에서 학생의 명단을 입력하세요.

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
  name: "5학년 1반",
  year: "2026",
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

## 4단계 — 실행 (웹 서버 배포)

학생들이 각자 기기에서 접속하려면 인터넷에 올려야 합니다.

### 방법 GitHub Pages (무료)
1. [GitHub](https://github.com) 계정 만들기
2. 새 저장소(repository) 생성 → 파일 전체 업로드
3. Settings → Pages → Branch: main → Save
4. 생성된 URL을 학생들에게 공유


---

## 관리자 페이지 접속

브라우저에서 아래 관리자페이지를 열거나 URL 뒤에 `/admin.html` 을 붙이면 됩니다.

예: `https://yoursite.github.io/homework-app/admin.html`

---

## 자주 묻는 질문

**Q. 학생이 코드를 잊어버렸어요.**
A. 데이터베이스에 저장되어 있는 내용을 안내 해 주고, 변경하도록 안내합니다.

**Q. 과제를 추가하면 이전 제출 데이터가 사라지나요?**
A. 사라지지 않습니다.

**Q. 전체 데이터를 초기화하고 싶어요.**
A. 개발자 도구 Console에서 `Storage.clearAll()` 을 실행하세요.
   ⚠️ 모든 제출 데이터가 삭제됩니다!
