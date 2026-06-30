/**
 * 🏫 admin-page.js
 * ─────────────────────────────────────────────
 * 관리자(교사) 페이지 로직
 * 학생별 제출 현황 확인, 제출 내용 열람
 * ─────────────────────────────────────────────
 */

const AdminPage = (() => {

  let _loggedIn         = false;
  let _selectedAssignId = null;

  // ─────────────────────────────────────────
  // 초기화
  // ─────────────────────────────────────────
  function init() {
    _renderLogin();
  }

  // ─────────────────────────────────────────
  // 관리자 로그인
  // ─────────────────────────────────────────
  function _renderLogin() {
    document.getElementById("admin-app").innerHTML = `
      <div class="admin-login-wrapper">
        <div class="admin-login-card">
          <h1>🏫 교사 관리 페이지</h1>
          <p>${APP_CONFIG.class.name} · ${APP_CONFIG.class.year}년도</p>

          <div class="form-group">
            <label class="form-label" for="admin-pw">관리자 비밀번호</label>
            <input
              class="form-input"
              type="password"
              id="admin-pw"
              placeholder="비밀번호 입력"
              onkeydown="if(event.key==='Enter') AdminPage.login()"
              autofocus
            />
          </div>
          <div id="admin-login-error" class="form-error" style="display:none; margin-bottom:12px; color:#f87171;"></div>
          <button class="btn btn-primary" style="width:100%; padding:1rem;" onclick="AdminPage.login()">
            로그인
          </button>
        </div>
      </div>
    `;
  }

  function login() {
    const pw    = document.getElementById("admin-pw").value;
    const errEl = document.getElementById("admin-login-error");

    if (pw === APP_CONFIG.admin.password) {
      _loggedIn = true;
      _selectedAssignId = APP_CONFIG.assignments.filter(a => a.active)[0]?.id || null;
      _renderDashboard();
    } else {
      errEl.textContent  = "비밀번호가 맞지 않아요.";
      errEl.style.display = "block";
      document.getElementById("admin-pw").value = "";
    }
  }

  function logout() {
    _loggedIn = false;
    _renderLogin();
  }

  // ─────────────────────────────────────────
  // 대시보드 렌더
  // ─────────────────────────────────────────
  function _renderDashboard() {
    const allStudents    = Storage.getAllStudents();
    const allAssignments = APP_CONFIG.assignments.filter(a => a.active);

    // 선택된 과제의 제출 목록
    const submissions = _selectedAssignId
      ? Storage.getSubmissionsByAssignment(_selectedAssignId)
      : [];
    const submittedNums = new Set(submissions.map(s => s.studentNumber));

    // 통계
    const totalStudents  = allStudents.length;
    const submittedCount = submittedNums.size;
    const pendingCount   = totalStudents - submittedCount;
    const rate           = totalStudents > 0
      ? Math.round(submittedCount / totalStudents * 100)
      : 0;

    // 탭 버튼
    const assignTabs = allAssignments.map(a => `
      <button
        class="assignment-tab ${a.id === _selectedAssignId ? "active" : ""}"
        onclick="AdminPage.selectAssignment('${a.id}')"
      >
        ${a.title}
      </button>
    `).join("");

    // 학생 행
    const studentRows = allStudents.map(s => {
      const sub     = submissions.find(x => x.studentNumber === s.number);
      const isDone  = !!sub;
      const timeStr = sub ? Storage.formatDate(sub.submittedAt) : "-";
      const typeMap = { text: "✏️ 줄글", image: "📸 사진", pdf: "📄 PDF" };
      const typeStr = sub ? (typeMap[sub.content.type] || sub.content.type) : "";

      return `
        <tr>
          <td class="td-number" data-label="번호">${s.number}</td>
          <td class="td-name"   data-label="이름">${s.name}</td>
          <td data-label="상태">
            <span class="submit-status ${isDone ? "done" : "pending"}">
              <span class="status-dot"></span>
              ${isDone ? "제출 완료" : "미제출"}
            </span>
          </td>
          <td data-label="형식">${typeStr}</td>
          <td class="td-time"  data-label="제출 시각">${timeStr}</td>
          <td class="td-action" data-label="내용">
            <button
              class="view-btn"
              onclick="AdminPage.viewSubmission(${s.number})"
              ${isDone ? "" : "disabled"}
            >
              보기
            </button>
          </td>
        </tr>
      `;
    }).join("");

    document.getElementById("admin-app").innerHTML = `
      <div class="admin-layout">

        <!-- 헤더 -->
        <header class="admin-header">
          <div>
            <h1>${APP_CONFIG.class.name} 과제 현황</h1>
            <div class="sub">${APP_CONFIG.class.year}년도 · 교사용</div>
          </div>
          <div class="admin-header-actions">
            <button class="btn btn-outline" onclick="AdminPage.exportCSV()">📥 CSV 내보내기</button>
            <button class="btn btn-outline" onclick="AdminPage.logout()">로그아웃</button>
          </div>
        </header>

        <!-- 통계 -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${totalStudents}</div>
            <div class="stat-label">전체 학생</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: var(--color-success);">${submittedCount}</div>
            <div class="stat-label">제출 완료</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" style="color: var(--color-warning);">${pendingCount}</div>
            <div class="stat-label">미제출</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${rate}%</div>
            <div class="stat-label">제출률</div>
          </div>
        </div>

        <!-- 과제 탭 -->
        ${allAssignments.length > 0 ? `
          <div class="assignment-tabs">${assignTabs}</div>
        ` : "<p style='color:var(--color-text-muted)'>활성화된 과제가 없어요.</p>"}

        <!-- 학생 목록 테이블 -->
        <div class="student-table-wrapper">
          <div class="table-toolbar">
            <div class="table-title">학생 제출 현황</div>
            <input
              class="table-search"
              type="text"
              placeholder="이름으로 검색..."
              oninput="AdminPage.filterTable(this.value)"
            />
          </div>

          <!-- 진행률 바 -->
          <div class="progress-bar-wrapper">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${rate}%;"></div>
            </div>
            <div class="progress-label">${submittedCount} / ${totalStudents}명</div>
          </div>

          <table class="student-table" id="student-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th>제출 여부</th>
                <th>형식</th>
                <th>제출 시각</th>
                <th>내용 보기</th>
              </tr>
            </thead>
            <tbody id="student-tbody">
              ${studentRows}
            </tbody>
          </table>
        </div>

      </div>

      <!-- 제출 내용 모달 -->
      <div id="submission-modal-overlay" class="modal-overlay"></div>

      <!-- 토스트 -->
      <div id="toast" class="toast"></div>
    `;
  }

  // ─────────────────────────────────────────
  // 과제 탭 선택
  // ─────────────────────────────────────────
  function selectAssignment(assignmentId) {
    _selectedAssignId = assignmentId;
    _renderDashboard();
  }

  // ─────────────────────────────────────────
  // 이름 검색 필터
  // ─────────────────────────────────────────
  function filterTable(query) {
    const rows = document.querySelectorAll("#student-tbody tr");
    rows.forEach(row => {
      const name = row.querySelector(".td-name")?.textContent || "";
      row.style.display = name.includes(query.trim()) ? "" : "none";
    });
  }

  // ─────────────────────────────────────────
  // 제출 내용 보기
  // ─────────────────────────────────────────
  function viewSubmission(studentNumber) {
    const submission = Storage.getSubmission(studentNumber, _selectedAssignId);
    if (!submission) return;

    const student    = Storage.getAllStudents().find(s => s.number === studentNumber);
    const assignment = APP_CONFIG.assignments.find(a => a.id === _selectedAssignId);
    const content    = submission.content;

    let contentHTML = "";
    if (content.type === "text") {
      contentHTML = `<div class="submission-content-box">${_escapeHTML(content.data)}</div>`;
    } else if (content.type === "image") {
      contentHTML = `
        <div class="submission-content-box" style="padding: 0; overflow:hidden;">
          <img class="submission-img-preview" src="${content.data}" alt="제출 이미지" />
        </div>
      `;
    } else if (content.type === "pdf") {
      contentHTML = `
        <div class="submission-content-box" style="text-align:center;">
          <p>📄 ${_escapeHTML(content.filename || "PDF 파일")}</p>
          <a href="${content.data}" download="${content.filename || 'submission.pdf'}"
             class="btn btn-primary" style="margin-top:12px; display:inline-flex;">
            PDF 다운로드
          </a>
        </div>
      `;
    }

    const overlay = document.getElementById("submission-modal-overlay");
    overlay.innerHTML = `
      <div class="modal-box" style="max-width: 560px;">
        <h2 class="modal-title">📋 제출 내용 확인</h2>
        <p class="modal-sub">${assignment?.title || ""}</p>

        <div class="submission-meta">
          <div class="meta-item">학생<strong>${student?.number}번 ${student?.name}</strong></div>
          <div class="meta-item">제출 시각<strong>${Storage.formatDate(submission.submittedAt)}</strong></div>
          <div class="meta-item">형식<strong>${content.type === "text" ? "✏️ 줄글" : content.type === "image" ? "📸 사진" : "📄 PDF"}</strong></div>
        </div>

        <div class="submission-detail">${contentHTML}</div>

        <div class="modal-footer" style="margin-top: var(--space-lg);">
          <button class="btn btn-outline" onclick="AdminPage.closeSubmissionModal()">닫기</button>
          <button class="btn btn-danger" onclick="AdminPage.adminDeleteSubmission(${studentNumber})">
            제출 삭제
          </button>
        </div>
      </div>
    `;
    overlay.classList.add("open");
    overlay.addEventListener("click", e => {
      if (e.target === overlay) AdminPage.closeSubmissionModal();
    });
  }

  function closeSubmissionModal() {
    document.getElementById("submission-modal-overlay").classList.remove("open");
  }

  function adminDeleteSubmission(studentNumber) {
    if (!window.confirm("이 학생의 제출을 삭제할까요?")) return;
    Storage.deleteSubmission(studentNumber, _selectedAssignId);
    closeSubmissionModal();
    _renderDashboard();
    _showToast("제출이 삭제되었어요.", "");
  }

  // ─────────────────────────────────────────
  // CSV 내보내기
  // ─────────────────────────────────────────
  function exportCSV() {
    if (!_selectedAssignId) return;

    const assignment  = APP_CONFIG.assignments.find(a => a.id === _selectedAssignId);
    const allStudents = Storage.getAllStudents();
    const submissions = Storage.getSubmissionsByAssignment(_selectedAssignId);
    const subMap      = Object.fromEntries(submissions.map(s => [s.studentNumber, s]));

    const rows = [
      ["번호", "이름", "제출 여부", "제출 시각", "형식"],
      ...allStudents.map(s => {
        const sub = subMap[s.number];
        return [
          s.number,
          s.name,
          sub ? "O" : "X",
          sub ? Storage.formatDate(sub.submittedAt) : "",
          sub ? sub.content.type : "",
        ];
      }),
    ];

    const csv  = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href     = URL.createObjectURL(blob);
    link.download = `${assignment?.title || "제출현황"}_${new Date().toLocaleDateString("ko")}.csv`;
    link.click();
  }

  // ─────────────────────────────────────────
  // 유틸
  // ─────────────────────────────────────────
  function _escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function _showToast(msg, type = "") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.className   = `toast ${type}`;
    void toast.offsetWidth;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
  }

  return {
    init, login, logout,
    selectAssignment,
    filterTable,
    viewSubmission, closeSubmissionModal, adminDeleteSubmission,
    exportCSV,
  };

})();

window.AdminPage = AdminPage;
