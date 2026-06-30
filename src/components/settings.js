/**
 * ⚙️ settings.js — 학생 설정 (코드 변경)
 */

const Settings = (() => {

  let _currentStudent = null;

  function open(student) {
    _currentStudent = student;
    const overlay = document.getElementById("settings-modal-overlay");
    overlay.innerHTML = _buildHTML();
    overlay.classList.add("open");
    document.addEventListener("keydown", _handleKeydown);
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  }

  function close() {
    document.getElementById("settings-modal-overlay").classList.remove("open");
    document.removeEventListener("keydown", _handleKeydown);
  }

  function _handleKeydown(e) { if (e.key === "Escape") close(); }

  function _buildHTML() {
    return `
      <div class="modal-box">
        <h2 class="modal-title">⚙️ 설정</h2>
        <p class="modal-sub">${_currentStudent.number}번 ${_currentStudent.name}</p>
        <div class="settings-info">
          개인 코드는 나만 아는 비밀 코드예요.<br>
          다른 사람이 내 이름과 번호를 알아도 코드를 모르면 로그인할 수 없어요. 🔒
        </div>
        <div class="form-group">
          <label class="form-label" for="current-code">현재 코드</label>
          <input class="form-input" type="password" id="current-code" placeholder="지금 사용 중인 코드" autocomplete="off" />
        </div>
        <div class="form-group">
          <label class="form-label" for="new-code">새 코드</label>
          <input class="form-input" type="password" id="new-code" placeholder="새로운 코드 (4자 이상)" autocomplete="off" maxlength="20" />
        </div>
        <div class="form-group">
          <label class="form-label" for="new-code-confirm">새 코드 확인</label>
          <input class="form-input" type="password" id="new-code-confirm" placeholder="새 코드를 한 번 더 입력" autocomplete="off" maxlength="20" />
        </div>
        <div id="settings-error" class="form-error" style="display:none; margin-bottom:12px;"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="Settings.close()">취소</button>
          <button class="btn btn-primary" id="settings-save-btn" onclick="Settings.save()">코드 변경</button>
        </div>
      </div>
    `;
  }

  async function save() {
    const current = document.getElementById("current-code").value.trim();
    const newCode = document.getElementById("new-code").value.trim();
    const confirm = document.getElementById("new-code-confirm").value.trim();
    const errEl   = document.getElementById("settings-error");
    const btn     = document.getElementById("settings-save-btn");

    if (!current || !newCode || !confirm) { showError(errEl, "모든 칸을 입력해주세요."); return; }

    const auth = await Storage.authenticateStudent(_currentStudent.number, _currentStudent.name, current);
    if (!auth) { showError(errEl, "현재 코드가 맞지 않아요."); return; }

    if (newCode.length < 4) { showError(errEl, "새 코드는 4자 이상으로 만들어주세요."); return; }
    if (newCode !== confirm) { showError(errEl, "새 코드가 서로 달라요. 다시 확인해주세요."); return; }

    btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';

    const ok = await Storage.updateStudentCode(_currentStudent.number, newCode);
    if (ok) {
      close();
      _showToast("✅ 코드가 변경되었어요!", "success");
    } else {
      showError(errEl, "저장에 실패했어요. 다시 시도해주세요.");
      btn.disabled = false; btn.textContent = "코드 변경";
    }
  }

  function showError(el, msg) { el.textContent = msg; el.style.display = "block"; }

  function _showToast(msg, type = "") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.className   = `toast ${type}`;
    void toast.offsetWidth;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
  }

  return { open, close, save };

})();

window.Settings = Settings;
