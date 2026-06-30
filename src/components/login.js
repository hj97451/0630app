/**
 * 🔐 login.js — 학생 로그인 컴포넌트
 * ─────────────────────────────────────────────
 * 최초 로그인(=회원가입) 시 개인정보 수집 동의 체크 필수
 * 이후 로그인부터는 체크박스 생략 (동의 여부는 Firebase에 기록)
 * ─────────────────────────────────────────────
 */

const Login = (() => {

  function render(className, school) {
    return `
      <div class="login-wrapper">
        <div class="login-card">
          <div class="login-logo">
            <span class="emoji">📚</span>
            <div class="login-school-badge">🏫 ${school}</div>
            <h1>${className} 과제 제출함</h1>
            <p>학번과 이름, 개인 코드를 입력하세요</p>
          </div>

          <form id="login-form" onsubmit="return false;">
            <div class="form-group">
              <label class="form-label" for="input-number">번호</label>
              <input class="form-input" type="number" id="input-number"
                placeholder="예: 7" min="1" max="30" autocomplete="off" />
            </div>
            <div class="form-group">
              <label class="form-label" for="input-name">이름</label>
              <input class="form-input" type="text" id="input-name"
                placeholder="예: 김민준" autocomplete="off" />
            </div>
            <div class="form-group">
              <label class="form-label" for="input-code">개인 코드</label>
              <input class="form-input" type="password" id="input-code"
                placeholder="나만 아는 코드" autocomplete="off"
                onkeydown="if(event.key==='Enter') Login.handleSubmit()" />
              <span class="form-hint">처음 로그인은 선생님이 알려준 코드를 입력하세요</span>
            </div>

            <!-- 최초 로그인(회원가입) 시에만 표시되는 동의 영역 -->
            <div id="consent-area"></div>

            <div id="login-error" class="form-error" style="display:none; margin-bottom:12px;"></div>
            <button type="button" class="btn btn-primary login-btn-full" id="login-submit-btn"
              onclick="Login.handleSubmit()">
              로그인
            </button>
          </form>
        </div>
      </div>
    `;
  }

  // ── 동의 체크박스 HTML ───────────────────────
  function _consentHTML() {
    return `
      <div class="consent-group" id="consent-group">
        <label class="consent-item">
          <input type="checkbox" id="consent-privacy" />
          <span><span class="required-tag">(필수)</span> 개인정보 수집 및 이용에 동의합니다.
          (<a href="#" onclick="AppFooter.showPrivacy(); return false;">처리방침 보기</a>)</span>
        </label>
        <label class="consent-item">
          <input type="checkbox" id="consent-minor" />
          <span><span class="required-tag">(필수)</span> 만 14세 미만인 경우, 학교 가정통신문 등을 통해
          보호자 동의를 완료하였습니다. (만 14세 이상은 체크해 주세요)</span>
        </label>
      </div>
    `;
  }

  // ── 로그인 처리 ──────────────────────────────
  async function handleSubmit() {
    const number = document.getElementById("input-number").value.trim();
    const name   = document.getElementById("input-name").value.trim();
    const code   = document.getElementById("input-code").value.trim();
    const errEl  = document.getElementById("login-error");
    const btn    = document.getElementById("login-submit-btn");
    const consentArea = document.getElementById("consent-area");

    if (!number || !name || !code) {
      showError(errEl, "번호, 이름, 코드를 모두 입력해주세요.");
      return;
    }

    // 동의 체크박스가 이미 표시된 상태(최초 로그인 시도 후) → 동의 여부 검사
    const privacyChecked = document.getElementById("consent-privacy");
    const minorChecked   = document.getElementById("consent-minor");
    if (privacyChecked && (!privacyChecked.checked || !minorChecked.checked)) {
      showError(errEl, "필수 동의 항목에 모두 체크해주세요.");
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> 확인 중...';
    errEl.style.display = "none";

    const student = await Storage.authenticateStudent(Number(number), name, code);

    if (!student) {
      showError(errEl, "번호, 이름 또는 코드가 맞지 않아요. 다시 확인해보세요!");
      document.getElementById("input-code").value = "";
      document.getElementById("input-code").focus();
      btn.disabled = false;
      btn.textContent = "로그인";
      return;
    }

    // 이 학생이 처음 로그인(=최초 동의 필요)인지 확인
    const hasConsented = await Storage.hasConsented(student.number);

    if (!hasConsented && !privacyChecked) {
      // 동의 체크박스를 아직 보여준 적 없음 → 표시하고 재시도 요청
      consentArea.innerHTML = _consentHTML();
      btn.disabled = false;
      btn.textContent = "동의 후 로그인";
      showError(errEl, "최초 로그인입니다. 아래 필수 동의 항목을 확인해주세요.");
      return;
    }

    if (!hasConsented && privacyChecked) {
      // 동의 체크 완료 → Firebase에 동의 기록 저장
      await Storage.recordConsent(student.number);
    }

    Storage.setSession(student);
    StudentPage.init();
  }

  function showError(el, msg) {
    el.textContent = msg;
    el.style.display = "block";
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
  }

  return { render, handleSubmit };

})();

window.Login = Login;
