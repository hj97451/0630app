/**
 * 📱 student-page.js
 * ─────────────────────────────────────────────
 * 학생 메인 페이지 로직
 * 로그인 후 표시되는 과제 목록 및 제출 화면
 * ─────────────────────────────────────────────
 */

const StudentPage = (() => {

  let _student = null;

  // ─────────────────────────────────────────
  // 초기화
  // ─────────────────────────────────────────
  function init() {
    const session = Storage.getSession();
    if (!session) {
      _renderLogin();
      return;
    }

    // 세션에서 학생 정보 복원
    _student = session;
    _renderPage();
  }

  // ─────────────────────────────────────────
  // 렌더: 로그인 화면
  // ─────────────────────────────────────────
  function _renderLogin() {
    document.getElementById("app").innerHTML = Login.render(APP_CONFIG.class.name);
  }

  // ─────────────────────────────────────────
  // 렌더: 메인 과제 페이지
  // ─────────────────────────────────────────
  function _renderPage() {
    const activeAssignments = APP_CONFIG.assignments.filter(a => a.active);

    // 제출 여부 확인 후 정렬: 미제출 → 제출 완료 순
    const withStatus = activeAssignments.map(a => ({
      ...a,
      submission: Storage.getSubmission(_student.number, a.id),
    }));
    withStatus.sort((a, b) => {
      if (a.submission && !b.submission) return 1;
      if (!a.submission && b.submission) return -1;
      return 0;
    });

    const assignmentCards = withStatus.length > 0
      ? withStatus.map(_buildAssignmentCard).join("")
      : `<div class="empty-state">
           <div class="emoji">🎉</div>
           <p>지금 제출할 과제가 없어요!</p>
         </div>`;

    document.getElementById("app").innerHTML = `
      <div class="student-layout">

        <!-- 상단 헤더 -->
        <header class="student-header">
          <div>
            <div class="greeting">${APP_CONFIG.class.name}</div>
            <div class="student-name">${_student.number}번 ${_student.name} 👋</div>
          </div>
          <div class="header-actions">
            <button class="header-btn" onclick="StudentPage.openSettings()">⚙️ 설정</button>
            <button class="header-btn" onclick="StudentPage.logout()">로그아웃</button>
          </div>
        </header>

        <!-- 과제 목록 -->
        <div class="section-title">📋 과제 목록</div>
        <div class="assignment-list">
          ${assignmentCards}
        </div>

      </div>

      <!-- 제출 모달 -->
      <div id="submit-modal-overlay" class="modal-overlay"></div>

      <!-- 설정 모달 -->
      <div id="settings-modal-overlay" class="modal-overlay"></div>

      <!-- 토스트 알림 -->
      <div id="toast" class="toast"></div>
    `;
  }

  // ─────────────────────────────────────────
  // 과제 카드 HTML 생성
  // ─────────────────────────────────────────
  function _buildAssignmentCard(a) {
    const submitted = !!a.submission;
    const daysLeft  = Storage.daysUntilDue(a.due);
    const isDueSoon = daysLeft >= 0 && daysLeft <= 2;

    let cardClass = "assignment-card";
    if (submitted) cardClass += " submitted";
    else if (isDueSoon) cardClass += " due-soon";

    // 마감일 표시
    let dueText = `📅 마감 ${a.due}`;
    if (submitted) {
      dueText = `제출 완료 · ${Storage.formatDate(a.submission.submittedAt)}`;
    } else if (daysLeft < 0) {
      dueText = "⚠️ 마감이 지났어요";
    } else if (isDueSoon) {
      dueText = `⏰ 마감 ${daysLeft === 0 ? "오늘까지!" : `${daysLeft}일 남았어요`}`;
    }

    // 허용 제출 형식 칩
    const TYPE_LABELS = { text: "✏️ 줄글", image: "📸 사진", pdf: "📄 PDF" };
    const typeChips = a.types.map(t =>
      `<span class="type-chip">${TYPE_LABELS[t] || t}</span>`
    ).join("");

    // 제출 상태 버튼/배지
    const actionHTML = submitted
      ? `<div class="done-badge">
           <div class="done-icon">✓</div>
           제출 완료
         </div>
         <button
           class="btn btn-outline"
           style="font-size:0.8rem; padding:0.5rem 1rem;"
           onclick="StudentPage.cancelSubmission('${a.id}')"
         >
           다시 제출
         </button>`
      : `<button
           class="btn btn-primary"
           onclick="StudentPage.openSubmit('${a.id}')"
         >
           과제 제출하기 →
         </button>`;

    return `
      <div class="${cardClass}" id="card-${a.id}">
        <div class="card-top">
          <h2 class="card-title">${a.title}</h2>
          ${submitted ? '<span class="badge badge-success">✓ 제출 완료</span>' :
            isDueSoon ? '<span class="badge badge-warning">마감 임박</span>' :
            '<span class="badge badge-primary">제출 전</span>'}
        </div>
        <p class="card-desc">${a.desc}</p>
        <div class="card-meta">
          <span class="due-label">${dueText}</span>
          <div class="allowed-types">${typeChips}</div>
        </div>
        <div class="card-action">${actionHTML}</div>
      </div>
    `;
  }

  // ─────────────────────────────────────────
  // 액션 핸들러
  // ─────────────────────────────────────────

  function openSubmit(assignmentId) {
    const assignment = APP_CONFIG.assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    Submit.open(assignment, _student);
  }

  function cancelSubmission(assignmentId) {
    if (!window.confirm("제출을 취소하고 다시 제출하시겠어요?")) return;
    Storage.deleteSubmission(_student.number, assignmentId);
    refresh();
  }

  function openSettings() {
    Settings.open(_student);
  }

  function logout() {
    Storage.clearSession();
    _student = null;
    _renderLogin();
  }

  // 과제 목록 새로 고침 (제출 후 호출)
  function refresh() {
    _renderPage();
  }

  return { init, refresh, openSubmit, cancelSubmission, openSettings, logout };

})();

window.StudentPage = StudentPage;
