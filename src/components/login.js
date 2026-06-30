/**
 * 🔐 login.js — 학생 로그인 컴포넌트
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
              <span class="form-hint">처음 로그인은 선생님이 알려준 코드(1234)를 입력하세요</span>
            </div>
            <div id="login-error" class="form-error" style="display:none; margin-bottom:12px;"></div>
            <button type="button" class="btn btn-primary login-btn-full" id="login-submit-btn"
              onclick="Login.handleSubmit()">
              로그인
            </button>
          </form>

          <div class="login-footer">
            <a href="#" onclick="StudentPage.showPrivacy(); return false;">개인정보처리방침</a>
            <a href="#" onclick="StudentPage.showTerms(); return false;">이용약관</a>
            <a href="${APP_CONFIG.site.githubUrl}" target="_blank" rel="noopener">GitHub</a>
          </div>
        </div>

        <div class="howto-box" style="max-width:420px; margin-top: var(--space-lg);">
          <h3>📖 사용방법 안내</h3>
          <div class="howto-steps">
            <div class="howto-step">
              <div class="howto-step-num">1</div>
              <div class="howto-step-text"><strong>로그인</strong> — 번호·이름·개인코드를 입력해 로그인하세요. 초기 코드는 <strong>1234</strong>입니다.</div>
            </div>
            <div class="howto-step">
              <div class="howto-step-num">2</div>
              <div class="howto-step-text"><strong>주요 기능</strong> — 제출할 과제를 클릭하고 줄글·사진·PDF 중 원하는 형태로 제출하세요.</div>
            </div>
            <div class="howto-step">
              <div class="howto-step-num">3</div>
              <div class="howto-step-text"><strong>주의사항</strong> — 개인 코드는 ⚙️ 설정에서 언제든 바꿀 수 있어요. 코드를 잊으면 선생님께 문의하세요.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async function handleSubmit() {
    const number = document.getElementById("input-number").value.trim();
    const name   = document.getElementById("input-name").value.trim();
    const code   = document.getElementById("input-code").value.trim();
    const errEl  = document.getElementById("login-error");
    const btn    = document.getElementById("login-submit-btn");

    if (!number || !name || !code) {
      showError(errEl, "번호, 이름, 코드를 모두 입력해주세요.");
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> 확인 중...';
    errEl.style.display = "none";

    const student = await Storage.authenticateStudent(Number(number), name, code);

    if (student) {
      Storage.setSession(student);
      StudentPage.init();
    } else {
      showError(errEl, "번호, 이름 또는 코드가 맞지 않아요. 다시 확인해보세요!");
      document.getElementById("input-code").value = "";
      document.getElementById("input-code").focus();
      btn.disabled = false;
      btn.textContent = "로그인";
    }
  }

  function showError(el, msg) {
    el.textContent = msg;
    el.style.display = "block";
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
  }

  return { render, handleSubmit };

})();

window.Login = Login;
