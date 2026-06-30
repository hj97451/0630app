/**
 * 🦶 footer.js
 * ─────────────────────────────────────────────
 * 모든 페이지(학생/관리자) 하단에 공통으로 표시되는 Footer
 * - 서비스명, 저작권, 이용약관·개인정보처리방침 링크
 * - 개발자(개인정보책임자) 실명·소속학교·연락처 명시
 * ─────────────────────────────────────────────
 */

const AppFooter = (() => {

  const D = APP_CONFIG.developer;
  const year = new Date().getFullYear();

  // ── Footer HTML 반환 ────────────────────────
  // showAdminLink: true면 "교사용 페이지" 링크를 작게 표시 (학생 화면에서만 사용)
  function render(showAdminLink) {
    return `
      <footer class="app-footer">
        <div class="app-footer-inner">
          <div class="app-footer-top">
            <span class="app-footer-copyright">© ${year} ${D.serviceName}. All rights reserved.</span>
            <span class="app-footer-links">
              <a href="#" onclick="AppFooter.showTerms(); return false;">이용약관</a>
              <span class="app-footer-divider">|</span>
              <a href="#" onclick="AppFooter.showPrivacy(); return false;">개인정보처리방침</a>
              ${showAdminLink ? `
              <span class="app-footer-divider">|</span>
              <a href="admin.html" class="app-footer-admin-link">교사용 페이지</a>` : ""}
            </span>
          </div>
          <div class="app-footer-bottom">
            개인정보책임자: ${D.name} ${D.role} (${D.school}) · 문의: ${D.contact}
          </div>
        </div>
      </footer>
      <div id="footer-policy-overlay" class="modal-overlay"></div>
    `;
  }

  // ── 모달 공통 ────────────────────────────────
  function _showModal(title, bodyHTML) {
    let overlay = document.getElementById("footer-policy-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "footer-policy-overlay";
      overlay.className = "modal-overlay";
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="modal-box policy-modal-box">
        <h2 class="modal-title">${title}</h2>
        <div class="policy-modal-body">${bodyHTML}</div>
        <div class="modal-footer">
          <button class="btn btn-primary" style="width:100%;" onclick="AppFooter.close()">확인</button>
        </div>
      </div>
    `;
    overlay.classList.add("open");
    overlay.onclick = e => { if (e.target === overlay) close(); };
  }

  function close() {
    const overlay = document.getElementById("footer-policy-overlay");
    if (overlay) overlay.classList.remove("open");
  }

  // ── 이용약관 전문 ────────────────────────────
  function showTerms() {
    _showModal("📄 이용약관", `
      <p class="policy-lead">본 이용약관(이하 "약관")은 <strong>${D.serviceName}</strong>(이하 "본 서비스")이 제공하는
      교육용 웹 애플리케이션 서비스의 이용에 관한 사항을 규정합니다.</p>

      <h4>제1조 (목적)</h4>
      <p>이 약관은 본 서비스를 이용함에 있어 서비스 제공자와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>

      <h4>제2조 (정의)</h4>
      <p>"서비스"란 본 플랫폼에서 제공하는 교육용 과제 제출 웹 애플리케이션을 말하며, "이용자"란 본 서비스에 접속하여
      이용하는 학생 및 교사를 말합니다.</p>

      <h4>제3조 (서비스의 제공)</h4>
      <p>본 서비스는 교육 목적의 무료 웹 애플리케이션이며, 상업적 목적으로 운영되지 않습니다.</p>

      <h4>제4조 (회원가입 및 로그인)</h4>
      <p>이용자는 교사가 부여한 학번·이름·초기 코드를 입력하여 서비스를 이용합니다.
      <strong>만 14세 미만 학생은 학교 가정통신문 등을 통해 보호자(법정대리인)의 동의를 받은 후 서비스를 이용</strong>합니다.
      로그인에 사용하는 개인 코드는 이용자 본인이 관리할 책임이 있으며, 타인에게 양도·공유해서는 안 됩니다.</p>

      <h4>제5조 (이용자의 의무)</h4>
      <p>이용자는 허위 내용 등록, 타인의 학번·이름·코드를 이용한 무단 로그인, 서비스 운영 방해,
      악성 파일 업로드 등의 행위를 하여서는 안 됩니다.</p>

      <h4>제6조 (저작권)</h4>
      <p>본 서비스가 작성한 저작물에 대한 저작권은 서비스 개발자(교사)에게 귀속됩니다.
      학생이 제출한 과제물의 저작권은 해당 학생 본인에게 귀속됩니다.
      소스코드는 <a href="${APP_CONFIG.site.githubUrl}" target="_blank" rel="noopener">GitHub</a>에 공개되어 있습니다.</p>

      <h4>제7조 (면책조항)</h4>
      <p>본 서비스는 무료로 제공되는 교육용 서비스로서 기술적 문제나 오류에 대해 제한적 책임을 집니다.
      데이터는 Google Firebase 및 Vercel 플랫폼에 저장·운영됩니다.</p>

      <h4>제8조 (분쟁해결)</h4>
      <p>본 서비스와 이용자 간 분쟁은 대한민국 법을 적용하며, 서비스 제공자 소재지 관할 법원을 관할법원으로 합니다.</p>

      <p class="policy-footer-line">시행일: 2026년 6월 30일 · 서비스 제공자: ${D.name} ${D.role} (${D.school})</p>
    `);
  }

  // ── 개인정보처리방침 전문 ────────────────────
  function showPrivacy() {
    _showModal("🔒 개인정보처리방침", `
      <p class="policy-lead"><strong>${D.serviceName}</strong>(이하 "본 서비스")은 개인정보 보호법 제30조에 따라
      정보주체의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
      다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>

      <h4>제1조 (개인정보의 처리 목적)</h4>
      <p>학번·이름·개인 코드를 통한 본인 확인(로그인), 과제 제출 내용 저장 및 교사 확인,
      과제 제출 여부·시각 등 학습 이력 관리를 위해 개인정보를 처리합니다.</p>

      <h4>제2조 (처리 및 보유 기간)</h4>
      <p>학생 계정 정보 및 과제 제출 데이터는 <strong>해당 학년도 종료 시(익년 2월 말)</strong> 또는
      학생 졸업·진급 시까지 보유하며, 보유 기간 종료 후 5일 이내 파기합니다.</p>

      <h4>제3조 (수집하는 개인정보 항목)</h4>
      <p><strong>수집 항목:</strong> 학번, 이름, 개인 코드(비밀번호), 학급 정보, 과제 제출 내용(텍스트·이미지·PDF), 제출 시각</p>
      <p><strong>수집하지 않는 항목:</strong> 주민등록번호, 주소, 전화번호, 이메일, 위치 정보 등 불필요한 민감 정보</p>

      <h4>제4조 (만 14세 미만 아동의 개인정보 처리)</h4>
      <p>학기 초 학교 가정통신문(개인정보 수집·이용 동의서)을 통해 법정대리인의 동의를 받습니다.
      법정대리인이 동의하지 않는 경우 해당 아동은 서비스 이용이 제한될 수 있습니다.
      보호자는 담임교사를 통해 자녀의 개인정보 열람·정정·삭제를 요청할 수 있습니다.</p>

      <h4>제5조 (개인정보의 파기 절차 및 방법)</h4>
      <p>보유 기간 경과 시 Firebase Realtime Database에서 해당 개인정보를 지체 없이 영구 삭제합니다.</p>

      <h4>제6조 (개인정보의 안전성 확보조치)</h4>
      <ul class="policy-list">
        <li>Google Firebase Realtime Database(보안 인증 클라우드 플랫폼) 사용</li>
        <li>전 구간 HTTPS 보안 통신 적용</li>
        <li>개인 코드는 학생 본인이 직접 설정·변경 가능</li>
        <li>관리자(교사) 계정은 별도 비밀번호로 분리 운영</li>
        <li>소스코드는 GitHub 공개 저장소에서 확인 가능</li>
      </ul>
      <p class="policy-warn">⚠️ 개인 코드는 별도의 암호화(Hash) 처리 없이 저장되므로,
      다른 서비스와 동일한 비밀번호 사용을 권장하지 않습니다.</p>

      <h4>제7조 (정보주체와 법정대리인의 권리·행사방법)</h4>
      <p>학생(정보주체) 및 법정대리인은 개인정보 열람·정정·삭제·처리정지를 요구할 수 있으며,
      담임교사에게 요청 시 지체 없이 조치합니다. 개인 코드는 서비스 내 <strong>⚙️ 설정</strong> 메뉴에서
      본인이 직접 변경할 수 있습니다.</p>

      <h4>제8조 (개인정보 보호책임자)</h4>
      <table class="policy-table">
        <tr><td>성명</td><td>${D.name} (개발자)</td></tr>
        <tr><td>소속</td><td>${D.school}</td></tr>
        <tr><td>직위</td><td>${D.role}</td></tr>
        <tr><td>연락처</td><td>${D.contact} (※ 개인 휴대전화 미기재)</td></tr>
      </table>

      <p class="policy-footer-line">이 개인정보 처리방침은 2026년 6월 30일부터 적용됩니다.</p>
    `);
  }

  return { render, showTerms, showPrivacy, close };

})();

window.AppFooter = AppFooter;
