/**
 * 📤 submit.js
 * ─────────────────────────────────────────────
 * 과제 제출 모달 컴포넌트
 * PDF / 이미지 / 줄글(텍스트) 제출 처리
 * ─────────────────────────────────────────────
 */

const Submit = (() => {

  let _currentAssignment = null;
  let _currentStudent    = null;
  let _selectedFile      = null;
  let _activeType        = null;  // 'text' | 'image' | 'pdf'

  // ── 타입 레이블 매핑 ──────────────────────
  const TYPE_LABELS = {
    text:  { icon: "✏️", label: "줄글" },
    image: { icon: "📸", label: "사진" },
    pdf:   { icon: "📄", label: "PDF" },
  };

  // ─────────────────────────────────────────
  // 모달 열기
  // ─────────────────────────────────────────
  function open(assignment, student) {
    _currentAssignment = assignment;
    _currentStudent    = student;
    _selectedFile      = null;
    _activeType        = assignment.types[0]; // 첫 번째 허용 타입 기본 선택

    const overlay = document.getElementById("submit-modal-overlay");
    overlay.innerHTML = _buildModalHTML();
    overlay.classList.add("open");

    _bindEvents();
    _renderTypePanel(_activeType);
  }

  function close() {
    const overlay = document.getElementById("submit-modal-overlay");
    overlay.classList.remove("open");
    _selectedFile = null;
  }

  // ─────────────────────────────────────────
  // HTML 생성
  // ─────────────────────────────────────────
  function _buildModalHTML() {
    const a = _currentAssignment;

    // 허용 타입 탭 버튼 생성
    const tabs = a.types.map(t => `
      <button
        class="type-tab ${t === _activeType ? "active" : ""}"
        data-type="${t}"
        onclick="Submit._selectType('${t}')"
      >
        ${TYPE_LABELS[t].icon} ${TYPE_LABELS[t].label}
      </button>
    `).join("");

    return `
      <div class="modal-box" role="dialog" aria-modal="true" aria-label="과제 제출">
        <h2 class="modal-title">📤 과제 제출</h2>
        <p class="modal-sub">${a.title}</p>

        ${a.types.length > 1 ? `
          <div class="type-tabs">${tabs}</div>
        ` : ""}

        <div id="type-panel"></div>

        <div class="modal-footer">
          <button class="btn btn-outline" onclick="Submit.close()">취소</button>
          <button class="btn btn-primary" id="submit-confirm-btn" onclick="Submit.confirm()">
            제출하기
          </button>
        </div>
      </div>
    `;
  }

  // ─────────────────────────────────────────
  // 타입 패널 렌더
  // ─────────────────────────────────────────
  function _renderTypePanel(type) {
    const panel = document.getElementById("type-panel");
    if (!panel) return;

    if (type === "text") {
      panel.innerHTML = `
        <textarea
          class="text-area"
          id="text-input"
          placeholder="여기에 내용을 써주세요..."
          maxlength="3000"
          oninput="Submit._updateCharCount()"
        ></textarea>
        <div class="char-count"><span id="char-count">0</span> / 3000자</div>
      `;
    } else {
      const isImage = type === "image";
      const accept  = isImage
        ? APP_CONFIG.upload.allowedImageTypes.join(",")
        : APP_CONFIG.upload.allowedPdfTypes.join(",");
      const hint = isImage ? "JPG, PNG, GIF, WEBP" : "PDF 파일";

      panel.innerHTML = `
        <div id="upload-zone" class="upload-zone" onclick="document.getElementById('file-input').click()">
          <div class="upload-icon">${isImage ? "📸" : "📄"}</div>
          <div class="upload-label">클릭하거나 파일을 여기로 끌어다 놓으세요</div>
          <div class="upload-hint">${hint} · 최대 ${APP_CONFIG.upload.maxSizeMB}MB</div>
        </div>
        <input
          type="file"
          id="file-input"
          accept="${accept}"
          style="display:none"
          onchange="Submit._onFileSelected(event)"
        />
        <div id="upload-preview" style="display:none" class="upload-preview">
          <span id="preview-filename"></span>
          <span class="remove-btn" onclick="Submit._removeFile()">✕</span>
        </div>
      `;

      // 드래그 앤 드롭
      const zone = document.getElementById("upload-zone");
      zone.addEventListener("dragover",  e => { e.preventDefault(); zone.classList.add("dragover"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
      zone.addEventListener("drop",      e => {
        e.preventDefault();
        zone.classList.remove("dragover");
        const files = e.dataTransfer.files;
        if (files[0]) Submit._processFile(files[0]);
      });
    }
  }

  // ─────────────────────────────────────────
  // 이벤트 바인딩
  // ─────────────────────────────────────────
  function _bindEvents() {
    // ESC로 닫기
    document.addEventListener("keydown", _handleKeydown);
    // 오버레이 바깥 클릭으로 닫기
    const overlay = document.getElementById("submit-modal-overlay");
    overlay.addEventListener("click", e => {
      if (e.target === overlay) close();
    });
  }

  function _handleKeydown(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", _handleKeydown);
    }
  }

  // ─────────────────────────────────────────
  // 타입 선택
  // ─────────────────────────────────────────
  function _selectType(type) {
    _activeType = type;
    _selectedFile = null;

    // 탭 활성화
    document.querySelectorAll(".type-tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.type === type);
    });

    _renderTypePanel(type);
  }

  // ─────────────────────────────────────────
  // 파일 처리
  // ─────────────────────────────────────────
  function _onFileSelected(e) {
    const file = e.target.files[0];
    if (file) _processFile(file);
  }

  function _processFile(file) {
    const maxBytes = APP_CONFIG.upload.maxSizeMB * 1024 * 1024;

    // 크기 검사
    if (file.size > maxBytes) {
      _showToast(`파일이 너무 커요! (최대 ${APP_CONFIG.upload.maxSizeMB}MB)`, "error");
      return;
    }

    // 타입 검사
    const allowed = _activeType === "image"
      ? APP_CONFIG.upload.allowedImageTypes
      : APP_CONFIG.upload.allowedPdfTypes;
    if (!allowed.includes(file.type)) {
      _showToast("허용되지 않는 파일 형식이에요.", "error");
      return;
    }

    _selectedFile = file;

    // 미리보기 표시
    const zone    = document.getElementById("upload-zone");
    const preview = document.getElementById("upload-preview");
    const fname   = document.getElementById("preview-filename");
    if (zone)    zone.style.display    = "none";
    if (preview) preview.style.display = "flex";
    if (fname)   fname.textContent     = `📎 ${file.name} (${_formatSize(file.size)})`;
  }

  function _removeFile() {
    _selectedFile = null;
    document.getElementById("upload-zone").style.display    = "block";
    document.getElementById("upload-preview").style.display = "none";
    document.getElementById("file-input").value = "";
  }

  function _updateCharCount() {
    const ta    = document.getElementById("text-input");
    const count = document.getElementById("char-count");
    if (ta && count) count.textContent = ta.value.length;
  }

  function _formatSize(bytes) {
    if (bytes < 1024)       return bytes + "B";
    if (bytes < 1024*1024)  return (bytes/1024).toFixed(1) + "KB";
    return (bytes/1024/1024).toFixed(1) + "MB";
  }

  // ─────────────────────────────────────────
  // 제출 확정
  // ─────────────────────────────────────────
  function confirm() {
    const btn = document.getElementById("submit-confirm-btn");

    if (_activeType === "text") {
      const ta = document.getElementById("text-input");
      const text = ta ? ta.value.trim() : "";
      if (!text) {
        _showToast("내용을 입력해주세요!", "error");
        return;
      }

      _doSave({ type: "text", data: text });

    } else {
      if (!_selectedFile) {
        _showToast("파일을 선택해주세요!", "error");
        return;
      }

      btn.disabled = true;
      btn.textContent = "저장 중...";

      const reader = new FileReader();
      reader.onload = e => {
        _doSave({
          type:     _activeType,
          data:     e.target.result,   // base64
          filename: _selectedFile.name,
          filesize: _selectedFile.size,
          mimetype: _selectedFile.type,
        });
      };
      reader.onerror = () => {
        _showToast("파일 읽기에 실패했어요.", "error");
        btn.disabled = false;
        btn.textContent = "제출하기";
      };
      reader.readAsDataURL(_selectedFile);
    }
  }

  function _doSave(content) {
    const ok = Storage.saveSubmission(
      _currentStudent.number,
      _currentAssignment.id,
      content
    );

    if (ok) {
      close();
      StudentPage.refresh();
      _showToast("🎉 제출 완료!", "success");
    } else {
      _showToast("저장에 실패했어요. 다시 시도해주세요.", "error");
      const btn = document.getElementById("submit-confirm-btn");
      if (btn) { btn.disabled = false; btn.textContent = "제출하기"; }
    }
  }

  // ─────────────────────────────────────────
  // 토스트 (간단 알림)
  // ─────────────────────────────────────────
  function _showToast(msg, type = "") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent  = msg;
    toast.className    = `toast ${type}`;
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
