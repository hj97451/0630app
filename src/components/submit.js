/**
 * 📤 submit.js — 과제 제출 모달 컴포넌트 (Firebase 비동기)
 */

const Submit = (() => {

  let _currentAssignment = null;
  let _currentStudent    = null;
  let _selectedFile      = null;
  let _activeType        = null;

  const TYPE_LABELS = {
    text:  { icon: "✏️", label: "줄글" },
    image: { icon: "📸", label: "사진" },
    pdf:   { icon: "📄", label: "PDF" },
  };

  function open(assignment, student) {
    _currentAssignment = assignment;
    _currentStudent    = student;
    _selectedFile      = null;
    _activeType        = assignment.types[0];

    const overlay = document.getElementById("submit-modal-overlay");
    overlay.innerHTML = _buildModalHTML();
    overlay.classList.add("open");
    _bindEvents();
    _renderTypePanel(_activeType);
  }

  function close() {
    document.getElementById("submit-modal-overlay").classList.remove("open");
    _selectedFile = null;
  }

  function _buildModalHTML() {
    const a = _currentAssignment;
    const tabs = a.types.map(t => `
      <button class="type-tab ${t === _activeType ? "active" : ""}" data-type="${t}"
        onclick="Submit._selectType('${t}')">
        ${TYPE_LABELS[t].icon} ${TYPE_LABELS[t].label}
      </button>
    `).join("");

    return `
      <div class="modal-box" role="dialog" aria-modal="true">
        <h2 class="modal-title">📤 과제 제출</h2>
        <p class="modal-sub">${a.title}</p>
        ${a.types.length > 1 ? `<div class="type-tabs">${tabs}</div>` : ""}
        <div id="type-panel"></div>
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="Submit.close()">취소</button>
          <button class="btn btn-primary" id="submit-confirm-btn" onclick="Submit.confirm()">제출하기</button>
        </div>
      </div>
    `;
  }

  function _renderTypePanel(type) {
    const panel = document.getElementById("type-panel");
    if (!panel) return;

    if (type === "text") {
      panel.innerHTML = `
        <textarea class="text-area" id="text-input"
          placeholder="여기에 내용을 써주세요..." maxlength="3000"
          oninput="Submit._updateCharCount()"></textarea>
        <div class="char-count"><span id="char-count">0</span> / 3000자</div>
      `;
    } else {
      const isImage = type === "image";
      const accept  = isImage
        ? APP_CONFIG.upload.allowedImageTypes.join(",")
        : APP_CONFIG.upload.allowedPdfTypes.join(",");

      panel.innerHTML = `
        <div id="upload-zone" class="upload-zone" onclick="document.getElementById('file-input').click()">
          <div class="upload-icon">${isImage ? "📸" : "📄"}</div>
          <div class="upload-label">클릭하거나 파일을 여기로 끌어다 놓으세요</div>
          <div class="upload-hint">${isImage ? "JPG, PNG, GIF, WEBP" : "PDF 파일"} · 최대 ${APP_CONFIG.upload.maxSizeMB}MB</div>
        </div>
        <input type="file" id="file-input" accept="${accept}" style="display:none"
          onchange="Submit._onFileSelected(event)" />
        <div id="upload-preview" style="display:none" class="upload-preview">
          <span id="preview-filename"></span>
          <span class="remove-btn" onclick="Submit._removeFile()">✕</span>
        </div>
      `;

      const zone = document.getElementById("upload-zone");
      zone.addEventListener("dragover",  e => { e.preventDefault(); zone.classList.add("dragover"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
      zone.addEventListener("drop", e => {
        e.preventDefault(); zone.classList.remove("dragover");
        if (e.dataTransfer.files[0]) Submit._processFile(e.dataTransfer.files[0]);
      });
    }
  }

  function _bindEvents() {
    document.addEventListener("keydown", _handleKeydown);
    const overlay = document.getElementById("submit-modal-overlay");
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
  }

  function _handleKeydown(e) {
    if (e.key === "Escape") { close(); document.removeEventListener("keydown", _handleKeydown); }
  }

  function _selectType(type) {
    _activeType = type;
    _selectedFile = null;
    document.querySelectorAll(".type-tab").forEach(b => b.classList.toggle("active", b.dataset.type === type));
    _renderTypePanel(type);
  }

  function _onFileSelected(e) {
    if (e.target.files[0]) _processFile(e.target.files[0]);
  }

  function _processFile(file) {
    const maxBytes = APP_CONFIG.upload.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) { _showToast(`파일이 너무 커요! (최대 ${APP_CONFIG.upload.maxSizeMB}MB)`, "error"); return; }

    const allowed = _activeType === "image" ? APP_CONFIG.upload.allowedImageTypes : APP_CONFIG.upload.allowedPdfTypes;
    if (!allowed.includes(file.type)) { _showToast("허용되지 않는 파일 형식이에요.", "error"); return; }

    _selectedFile = file;
    document.getElementById("upload-zone").style.display    = "none";
    document.getElementById("upload-preview").style.display = "flex";
    document.getElementById("preview-filename").textContent = `📎 ${file.name} (${_formatSize(file.size)})`;
  }

  function _removeFile() {
    _selectedFile = null;
    document.getElementById("upload-zone").style.display    = "block";
    document.getElementById("upload-preview").style.display = "none";
    document.getElementById("file-input").value = "";
  }

  function _updateCharCount() {
    const ta = document.getElementById("text-input");
    const c  = document.getElementById("char-count");
    if (ta && c) c.textContent = ta.value.length;
  }

  function _formatSize(bytes) {
    if (bytes < 1024)      return bytes + "B";
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + "KB";
    return (bytes/1024/1024).toFixed(1) + "MB";
  }

  async function confirm() {
    const btn = document.getElementById("submit-confirm-btn");

    if (_activeType === "text") {
      const ta = document.getElementById("text-input");
      const text = ta ? ta.value.trim() : "";
      if (!text) { _showToast("내용을 입력해주세요!", "error"); return; }
      btn.disabled = true; btn.innerHTML = '<span class="spinner"></span>';
      await _doSave({ type: "text", data: text });
    } else {
      if (!_selectedFile) { _showToast("파일을 선택해주세요!", "error"); return; }
      btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> 저장 중...';

      const reader = new FileReader();
      reader.onload = async e => {
        await _doSave({
          type:     _activeType,
          data:     e.target.result,
          filename: _selectedFile.name,
          filesize: _selectedFile.size,
          mimetype: _selectedFile.type,
        });
      };
      reader.onerror = () => {
        _showToast("파일 읽기에 실패했어요.", "error");
        btn.disabled = false; btn.textContent = "제출하기";
      };
      reader.readAsDataURL(_selectedFile);
    }
  }

  async function _doSave(content) {
    const ok = await Storage.saveSubmission(
      _currentStudent.number,
      _currentAssignment.id,
      content
    );

    if (ok) {
      close();
      await StudentPage.refresh();
      _showToast("🎉 제출 완료!", "success");
    } else {
      _showToast("저장에 실패했어요. 다시 시도해주세요.", "error");
      const btn = document.getElementById("submit-confirm-btn");
      if (btn) { btn.disabled = false; btn.textContent = "제출하기"; }
    }
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
    open, close, confirm,
    _selectType, _onFileSelected, _processFile,
    _removeFile, _updateCharCount,
  };

})();

window.Submit = Submit;
