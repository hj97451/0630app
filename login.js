/**
 * 🔐 login.js
 * ─────────────────────────────────────────────
 * 학생 로그인 컴포넌트
 * 학번 + 이름 + 개인 코드 검증
 * ─────────────────────────────────────────────
 */

const Login = (() => {

  /**
   * 로그인 폼 HTML 반환
   */
  function render(className) {
    return `
      <div class="login-wrapper">
        <div class="login-card">
          <div class="login-logo">
            <span class="emoji">📚</span>
            <h1>${className} 과제 제출함</h1>
            <p>학번과 이름, 개인 코드를 입력하세요</p>
          </div>

          <form id="login-form" onsubmit="return false;">
            <div class="form-group">
              <label class="form-label" for="input-number">번호</label>
              <input
                class="form-input"
                type="number"
                id="input-number"
                placeholder="예: 7"
                min="1"
                max="30"
                autocomplete="off"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="input-name">이름</label>
              <input
                class="form-input"
                type="text"
                id="input-name"
                placeholder="예: 김민준"
                autocomplete="off"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="input-code">개인 코드</label>
              <input
                class="form-input"
                type="password"
                id="input-code"
                placeholder="나만 아는 코드"
                autocomplete="off"
              />
              <span class="form-hint">처음 로그인은 선생님이 알려준 코드를 입력하세요</span>
            </div>

            <div id="login-error" class="form-error" style="display:none; margin-bottom: 12px;"></div>

            <button
              type="submit"
              class="btn btn-primary login-btn-full"
              id="login-submit-btn"
              onclick="Login.handleSubmit()"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    `;
  }

  /**
   * 로그인 시도 처리
   */
  function handleSubmit() {
    const number = document.getElementById("input-number").value.trim();
    const name   = document.getElementById("input-name").value.trim();
    const code   = document.getElementById("input-code").value.trim();
    const errEl  = document.getElementById("login-error");
    const btn    = document.getElementById("login-submit-btn");

    // 입력 검증
    if (!number || !name || !code) {
      showError(errEl, "번호, 이름, 코드를 모두 입력해주세요.");
      return;
    }

    // 버튼 비활성화 (중복 클릭 방지)
    btn.disabled = true;
    btn.textContent = "확인 중...";

    // 인증
    const student = Storage.authenticateStudent(Number(number), name, code);

    setTimeout(() => {
      if (student) {
        Storage.setSession(student);
        // 학생 메인 페이지로 전환
        StudentPage.init();
      } else {
        showError(errEl, "번호, 이름 또는 코드가 맞지 않아요. 다시 확인해보세요!");
        // 코드 입력칸 초기화
        document.getElementById("input-code").value = "";
        document.getElementById("input-code").focus();
      }
      btn.disabled = false;
      btn.textContent = "로그인";
    }, 350); // 약간의 딜레이로 자연스럽게
  }

  function showError(el, msg) {
    el.textContent = msg;
    el.style.display = "block";
    // 에러 입력 강조
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250 });
  }

  return { render, handleSubmit };

})();

window.Login = Login;
