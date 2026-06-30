/**
 * 📱 student-page.js — 학생 메인 페이지
 */

const StudentPage = (() => {

  let _student = null;

  // ── 초기화 ──────────────────────────────────
  async function init() {
    const session = Storage.getSession();
    if (!session) { _renderLogin(); return; }
    _student = session;
    _showLoading(true);
    await _renderPage();
    _showLoading(false);
  }

  function _renderLogin() {
    document.getElementById("app").innerHTML =
      Login.render(APP_CONFIG.class.name, APP_CONFIG.class.school);
  }

  // ── 메인 페이지 렌더 ────────────────────────
  async function _renderPage() {
    const activeAssignments = APP_CONFIG.assignments.filter(a => a.active);

    // Firebase에서 제출 현황 가져오기
    const withStatus = await Promise.all(
      activeAssignments.map(async a => ({
        ...a,
        submission: await Storage.getSubmission(_student.number, a.id),
      }))
    );

    // 미제출 → 제출 완료 순 정렬
    withStatus.sort((a, b) => {
      if (a.submission && !b.submission) return 1;
      if (!a.submission && b.submission) return -1;
      return 0;
    });

    const assignmentCards = withStatus.length > 0
      ? withStatus.map(_buildAssignmentCard).join("")
      : `<div class="empty-state"><div class="emoji">🎉</div><p>지금 제출할 과제가 없어요!</p></div>`;

    document.getElementById("app").innerHTML = `
      <div class="student-layout">
        <header class="student-header">
          <div>
            <div class="greeting">${APP_CONFIG.class.school} · ${APP_CONFIG.class.name}</div>
            <div class="student-name">${_student.number}번 ${_student.name} 👋</div>
          </div>
          <div class="header-actions">
            <button class="header-btn" onclick="StudentPage.openSettings()">⚙️ 설정</button>
            <button class="header-btn" onclick="StudentPage.logout()">로그아웃</button>
          </div>
        </header>

        <div class="section-title">📋 과제 목록</div>
        <div class="assignment-list">${assignmentCards}</div>

        <div style="text-align:center; margin-top: var(--space-xl);">
          <span style="font-size:var(--font-size-xs); color:var(--color-text-muted);">
            ${APP_CONFIG.class.school} · ${APP_CONFIG.class.name} · v${APP_CONFIG.site.version} ·
            <a href="#" onclick="StudentPage.showPrivacy(); return false;" style="color:var(--color-text-muted);">개인정보처리방침</a> ·
            <a href="#" onclick="StudentPage.showTerms(); return false;" style="color:var(--color-text-muted);">이용약관</a> ·
            <a href="${APP_CONFIG.site.githubUrl}" target="_blank" rel="noopener" style="color:var(--color-text-muted);">GitHub</a>
          </span>
        </div>
      </div>

      <div id="submit-modal-overlay"   class="modal-overlay"></div>
      <div id="settings-modal-overlay" class="modal-overlay"></div>
      <div id="policy-modal-overlay"   class="modal-overlay"></div>
      <div id="toast" class="toast"></div>
    `;
  }

  // ── 과제 카드 ──────────────────────────────
  function _buildAssignmentCard(a) {
    const submitted = !!a.submission;
    const daysLeft  = Storage.daysUntilDue(a.due);
    const isDueSoon = daysLeft >= 0 && daysLeft <= 2;

    let cardClass = "assignment-card";
    if (submitted) cardClass += " submitted";
    else if (isDueSoon) cardClass += " due-soon";

    let dueText = `📅 마감 ${a.due}`;
    if (submitted)       dueText = `제출 완료 · ${Storage.formatDate(a.submission.submittedAt)}`;
    else if (daysLeft < 0) dueText = "⚠️ 마감이 지났어요";
    else if (isDueSoon)  dueText = `⏰ 마감 ${daysLeft === 0 ? "오늘까지!" : `${daysLeft}일 남았어요`}`;

    const TYPE_LABELS = { text: "✏️ 줄글", image: "📸 사진", pdf: "📄 PDF" };
    const typeChips   = a.types.map(t => `<span class="type-chip">${TYPE_LABELS[t] || t}</span>`).join("");

    const actionHTML = submitted
      ? `<div class="done-badge"><div class="done-icon">✓</div>제출 완료</div>
         <button class="btn btn-outline" style="font-size:0.8rem;padding:0.5rem 1rem;"
           onclick="StudentPage.cancelSubmission('${a.id}')">다시 제출</button>`
      : `<button class="btn btn-primary" onclick="StudentPage.openSubmit('${a.id}')">과제 제출하기 →</button>`;

    return `
      <div class="${cardClass}" id="card-${a.id}">
        <div class="card-top">
          <h2 class="card-title">${a.title}</h2>
          ${submitted ? '<span class="badge badge-success">✓ 제출 완료</span>'
          : isDueSoon ? '<span class="badge badge-warning">마감 임박</span>'
          : '<span class="badge badge-primary">제출 전</span>'}
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

  // ── 액션 핸들러 ────────────────────────────
  function openSubmit(assignmentId) {
    const assignment = APP_CONFIG.assignments.find(a => a.id === assignmentId);
    if (!assignment) return;
    Submit.open(assignment, _student);
  }

  async function cancelSubmission(assignmentId) {
    if (!window.confirm("제출을 취소하고 다시 제출하시겠어요?")) return;
    await Storage.deleteSubmission(_student.number, assignmentId);
    await refresh();
  }

  function openSettings() { Settings.open(_student); }

  function logout() {
    Storage.clearSession();
    _student = null;
    _renderLogin();
  }

  async function refresh() {
    _showLoading(true);
    await _renderPage();
    _showLoading(false);
  }

  // ── 개인정보처리방침 ────────────────────────
  function showPrivacy() {
    _showPolicyModal("🔒 개인정보처리방침", `
      <p style="margin-bottom:1rem;"><strong>${APP_CONFIG.class.school} ${APP_CONFIG.class.name}</strong> 과제 제출 서비스는 다음과 같이 개인정보를 처리합니다.</p>
      <h4 style="margin-bottom:.5rem;">1. 수집 항목</h4>
      <p style="margin-bottom:1rem;">학번, 이름, 개인 코드(비밀번호), 과제 제출 내용(텍스트/이미지/PDF), 제출 시각</p>
      <h4 style="margin-bottom:.5rem;">2. 이용 목적</h4>
      <p style="margin-bottom:1rem;">학생 과제 제출 및 교사의 제출 현황 확인</p>
      <h4 style="margin-bottom:.5rem;">3. 보관 기간</h4>
      <p style="margin-bottom:1rem;">해당 학년도 종료 후 파기 (Firebase Realtime Database 저장)</p>
      <h4 style="margin-bottom:.5rem;">4. 문의처</h4>
      <p>담임교사: ${APP_CONFIG.class.teacherName} 선생님</p>
    `);
  }

  // ── 이용약관 ────────────────────────────────
  function showTerms() {
    _showPolicyModal("📄 이용약관", `
      <h4 style="margin-bottom:.5rem;">서비스 이용 조건</h4>
      <p style="margin-bottom:1rem;">본 서비스는 ${APP_CONFIG.class.school} ${APP_CONFIG.class.name} 학생 과제 제출 전용입니다.</p>
      <h4 style="margin-bottom:.5rem;">책임 범위</h4>
      <p style="margin-bottom:1rem;">제출된 과제의 내용에 대한 책임은 제출한 학생 본인에게 있습니다.</p>
      <h4 style="margin-bottom:.5rem;">금지 행위</h4>
      <p style="margin-bottom:1rem;">타인의 학번·이름으로 로그인 시도, 허위 과제 제출, 악성 파일 업로드 행위를 금지합니다.</p>
      <h4 style="margin-bottom:.5rem;">변경 안내</h4>
      <p>이용약관 변경 시 담임교사를 통해 사전 안내됩니다.</p>
    `);
  }

  function _showPolicyModal(title, bodyHTML) {
    const overlay = document.getElementById("policy-modal-overlay")
      || document.querySelector(".modal-overlay:last-of-type");
    if (!overlay) { alert(title); return; }

    overlay.innerHTML = `
      <div class="modal-box" style="max-width:500px; max-height:80vh; overflow-y:auto;">
        <h2 class="modal-title">${title}</h2>
        <div style="font-size:var(--font-size-sm); color:var(--color-text-sub); line-height:1.8;">
          ${bodyHTML}
        </div>
        <div class="modal-footer" style="margin-top:var(--space-lg);">
          <button class="btn btn-primary" onclick="StudentPage.closePolicyModal()" style="width:100%;">확인</button>
        </div>
      </div>
    `;
    overlay.classList.add("open");
    overlay.addEventListener("click", e => { if (e.target === overlay) StudentPage.closePolicyModal(); });
  }

  function closePolicyModal() {
    const overlay = document.getElementById("policy-modal-overlay");
    if (overlay) overlay.classList.remove("open");
  }

  // ── 로딩 ────────────────────────────────────
  function _showLoading(show) {
    let el = document.getElementById("global-loading");
    if (show) {
      if (!el) {
        el = document.createElement("div");
        el.id = "global-loading";
        el.className = "loading-overlay";
        el.innerHTML = `<div class="spinner"></div><div class="loading-text">불러오는 중...</div>`;
        document.body.appendChild(el);
      }
    } else {
      if (el) el.remove();
    }
  }

  return { init, refresh, openSubmit, cancelSubmission, openSettings, logout, showPrivacy, showTerms, closePolicyModal };

})();

window.StudentPage = StudentPage;
