/**
 * 💾 storage.js
 * ─────────────────────────────────────────────
 * Firebase Realtime Database 기반 데이터 저장/불러오기
 *
 * ✅ 학생 명단 · 관리자 비밀번호는 코드에 없음
 *    → Firebase DB에 직접 저장 (setup.html로 1회 입력)
 * ✅ Firebase API key는 공개해도 안전 (DB 보안 규칙으로 접근 제어)
 * ─────────────────────────────────────────────
 */

const Storage = (() => {

  const DB_URL = "https://app-16081-default-rtdb.firebaseio.com/";
  const SESSION_KEY = "hw_session";

  // ─────────────────────────────────────────
  // Firebase REST API 헬퍼
  // ─────────────────────────────────────────
  async function _fbGet(path) {
    try {
      const res = await fetch(`${DB_URL}${path}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.error("[Firebase] GET 실패:", path, e);
      return null;
    }
  }

  async function _fbSet(path, value) {
    try {
      const res = await fetch(`${DB_URL}${path}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      return res.ok;
    } catch (e) {
      console.error("[Firebase] SET 실패:", path, e);
      return false;
    }
  }

  async function _fbPatch(path, value) {
    try {
      const res = await fetch(`${DB_URL}${path}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      return res.ok;
    } catch (e) {
      console.error("[Firebase] PATCH 실패:", path, e);
      return false;
    }
  }

  async function _fbDelete(path) {
    try {
      const res = await fetch(`${DB_URL}${path}.json`, { method: "DELETE" });
      return res.ok;
    } catch (e) {
      console.error("[Firebase] DELETE 실패:", path, e);
      return false;
    }
  }

  // ─────────────────────────────────────────
  // 관리자 인증
  // 비밀번호는 코드에 없음 — Firebase /admin/password 에서 읽어옴
  // ─────────────────────────────────────────
  async function verifyAdminPassword(inputPassword) {
    const stored = await _fbGet("/admin/password");
    return stored !== null && stored === inputPassword;
  }

  // ─────────────────────────────────────────
  // 학생 계정 관리
  // 학생 명단은 코드에 없음 — Firebase /students 에서 읽어옴
  // ─────────────────────────────────────────

  /**
   * 학번 + 이름 + 코드 인증
   */
  async function authenticateStudent(number, name, code) {
    const students = await _fbGet("/students") || {};
    const student  = students[String(number)];
    if (!student) return null;
    if (student.name !== name.trim()) return null;
    if (student.code !== code.trim()) return null;
    return student;
  }

  /**
   * 학생 코드 변경
   */
  async function updateStudentCode(number, newCode) {
    return await _fbPatch(`/students/${number}`, { code: newCode.trim() });
  }

  /**
   * 모든 학생 목록 반환 (번호 순)
   */
  async function getAllStudents() {
    const students = await _fbGet("/students") || {};
    return Object.values(students).sort((a, b) => a.number - b.number);
  }

  // ─────────────────────────────────────────
  // 과제 제출 관리
  // ─────────────────────────────────────────

  async function saveSubmission(studentNumber, assignmentId, content) {
    const key = `${studentNumber}_${assignmentId}`;
    return await _fbSet(`/submissions/${key}`, {
      studentNumber,
      assignmentId,
      content,
      submittedAt: new Date().toISOString(),
    });
  }

  async function getSubmission(studentNumber, assignmentId) {
    const key = `${studentNumber}_${assignmentId}`;
    return await _fbGet(`/submissions/${key}`);
  }

  async function getSubmissionsByAssignment(assignmentId) {
    const all = await _fbGet("/submissions") || {};
    return Object.values(all).filter(s => s.assignmentId === assignmentId);
  }

  async function deleteSubmission(studentNumber, assignmentId) {
    const key = `${studentNumber}_${assignmentId}`;
    return await _fbDelete(`/submissions/${key}`);
  }

  // ─────────────────────────────────────────
  // 세션 관리 (localStorage — 로그인 상태만)
  // ─────────────────────────────────────────

  function setSession(student) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      number:  student.number,
      name:    student.name,
      loginAt: new Date().toISOString(),
    }));
  }

  function getSession() {
    try {
      const v = localStorage.getItem(SESSION_KEY);
      return v ? JSON.parse(v) : null;
    } catch { return null; }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // ─────────────────────────────────────────
  // 유틸리티
  // ─────────────────────────────────────────

  function formatDate(isoString) {
    if (!isoString) return "-";
    const d = new Date(isoString);
    const p = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  function daysUntilDue(dueDateStr) {
    const due = new Date(dueDateStr);
    due.setHours(23, 59, 59, 999);
    return Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
  }

  async function clearAllSubmissions() {
    await _fbDelete("/submissions");
    console.log("[Storage] 제출 데이터 초기화 완료");
  }

  return {
    verifyAdminPassword,
    authenticateStudent,
    updateStudentCode,
    getAllStudents,
    saveSubmission,
    getSubmission,
    getSubmissionsByAssignment,
    deleteSubmission,
    setSession,
    getSession,
    clearSession,
    formatDate,
    daysUntilDue,
    clearAllSubmissions,
  };

})();

window.Storage = Storage;
