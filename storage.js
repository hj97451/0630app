/**
 * 💾 storage.js
 * ─────────────────────────────────────────────
 * 데이터 저장/불러오기 유틸리티 (localStorage 기반)
 *
 * 주의: localStorage는 같은 브라우저에서만 공유됩니다.
 * 여러 기기에서 사용하려면 Firebase 등 서버 연동이 필요합니다.
 * (docs/SETUP.md 참고)
 * ─────────────────────────────────────────────
 */

const Storage = (() => {

  // ── 키 상수 ───────────────────────────────
  const KEYS = {
    STUDENTS:    "hw_students",      // 학생 계정 정보 (코드 포함)
    SUBMISSIONS: "hw_submissions",   // 제출 데이터
    SESSION:     "hw_session",       // 현재 로그인 세션
  };

  // ── 내부 헬퍼 ─────────────────────────────
  function _get(key) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      console.error("[Storage] 읽기 오류:", key, e);
      return null;
    }
  }

  function _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("[Storage] 쓰기 오류:", key, e);
      return false;
    }
  }

  // ─────────────────────────────────────────
  // 📌 학생 계정 관리
  // ─────────────────────────────────────────

  /**
   * 앱 최초 실행 시 app-config.js의 학생 명단으로 초기화
   * 이미 저장된 코드는 덮어쓰지 않음
   */
  function initStudents(configStudents) {
    const existing = _get(KEYS.STUDENTS) || {};
    let changed = false;

    configStudents.forEach(s => {
      const key = String(s.number);
      if (!existing[key]) {
        // 신규 학생: 초기 코드 설정
        existing[key] = {
          number: s.number,
          name:   s.name,
          code:   s.code,       // 초기 비밀코드
        };
        changed = true;
      } else if (existing[key].name !== s.name) {
        // 이름이 바뀐 경우만 업데이트 (코드는 유지)
        existing[key].name = s.name;
        changed = true;
      }
    });

    if (changed) _set(KEYS.STUDENTS, existing);
    return existing;
  }

  /**
   * 학번 + 이름 + 코드로 학생 인증
   * @returns {object|null} 성공 시 학생 객체, 실패 시 null
   */
  function authenticateStudent(number, name, code) {
    const students = _get(KEYS.STUDENTS) || {};
    const student  = students[String(number)];
    if (!student) return null;
    if (student.name !== name.trim()) return null;
    if (student.code !== code.trim()) return null;
    return student;
  }

  /**
   * 학생 비밀코드 변경
   * @returns {boolean} 성공 여부
   */
  function updateStudentCode(number, newCode) {
    const students = _get(KEYS.STUDENTS) || {};
    const key = String(number);
    if (!students[key]) return false;
    students[key].code = newCode.trim();
    return _set(KEYS.STUDENTS, students);
  }

  /**
   * 모든 학생 목록 반환 (번호 순 정렬)
   */
  function getAllStudents() {
    const students = _get(KEYS.STUDENTS) || {};
    return Object.values(students).sort((a, b) => a.number - b.number);
  }

  // ─────────────────────────────────────────
  // 📝 과제 제출 관리
  // ─────────────────────────────────────────

  /**
   * 제출 저장
   * @param {number} studentNumber - 학번
   * @param {string} assignmentId  - 과제 ID
   * @param {object} content       - { type: 'text'|'image'|'pdf', data: ..., filename?: ... }
   */
  function saveSubmission(studentNumber, assignmentId, content) {
    const submissions = _get(KEYS.SUBMISSIONS) || {};
    const compositeKey = `${studentNumber}_${assignmentId}`;

    submissions[compositeKey] = {
      studentNumber,
      assignmentId,
      content,
      submittedAt: new Date().toISOString(),
    };

    return _set(KEYS.SUBMISSIONS, submissions);
  }

  /**
   * 특정 학생의 특정 과제 제출 여부 확인
   * @returns {object|null} 제출 데이터 또는 null
   */
  function getSubmission(studentNumber, assignmentId) {
    const submissions = _get(KEYS.SUBMISSIONS) || {};
    return submissions[`${studentNumber}_${assignmentId}`] || null;
  }

  /**
   * 특정 과제의 모든 제출 목록 반환
   */
  function getSubmissionsByAssignment(assignmentId) {
    const submissions = _get(KEYS.SUBMISSIONS) || {};
    return Object.values(submissions).filter(s => s.assignmentId === assignmentId);
  }

  /**
   * 특정 학생의 모든 제출 목록 반환
   */
  function getSubmissionsByStudent(studentNumber) {
    const submissions = _get(KEYS.SUBMISSIONS) || {};
    return Object.values(submissions).filter(s => s.studentNumber === studentNumber);
  }

  /**
   * 제출 취소 (삭제)
   */
  function deleteSubmission(studentNumber, assignmentId) {
    const submissions = _get(KEYS.SUBMISSIONS) || {};
    delete submissions[`${studentNumber}_${assignmentId}`];
    return _set(KEYS.SUBMISSIONS, submissions);
  }

  // ─────────────────────────────────────────
  // 🔐 세션 관리
  // ─────────────────────────────────────────

  function setSession(student) {
    _set(KEYS.SESSION, {
      number: student.number,
      name:   student.name,
      loginAt: new Date().toISOString(),
    });
  }

  function getSession() {
    return _get(KEYS.SESSION);
  }

  function clearSession() {
    localStorage.removeItem(KEYS.SESSION);
  }

  // ─────────────────────────────────────────
  // 🛠️ 유틸리티
  // ─────────────────────────────────────────

  /**
   * 날짜 포맷 헬퍼 (YYYY-MM-DD HH:MM)
   */
  function formatDate(isoString) {
    if (!isoString) return "-";
    const d = new Date(isoString);
    const pad = n => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} `
         + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  /**
   * 마감일까지 남은 일수 계산
   * @returns {number} 양수=남음, 음수=지남
   */
  function daysUntilDue(dueDateStr) {
    const due  = new Date(dueDateStr);
    const now  = new Date();
    due.setHours(23, 59, 59, 999);
    return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  }

  /**
   * 전체 데이터 초기화 (개발/테스트용)
   */
  function clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    console.log("[Storage] 전체 데이터 초기화 완료");
  }

  // Public API
  return {
    initStudents,
    authenticateStudent,
    updateStudentCode,
    getAllStudents,
    saveSubmission,
    getSubmission,
    getSubmissionsByAssignment,
    getSubmissionsByStudent,
    deleteSubmission,
    setSession,
    getSession,
    clearSession,
    formatDate,
    daysUntilDue,
    clearAll,
  };

})();

window.Storage = Storage;
