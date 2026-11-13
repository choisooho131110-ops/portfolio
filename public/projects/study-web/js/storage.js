// localStorage 저장/불러오기 (오답노트, 점수)
// localStorage를 못 쓰는 환경에서도 오류 없이 작동하도록 모두 try/catch로 감싼다.
// 그럴 때는 memory에 임시로 기억해서, 새로고침 전까지는 오답노트가 보인다.
window.StudyStorage = (function () {
  var KEYS = {
    wrongNotes: "studyweb.wrongNotes",
    scores: "studyweb.scores"
  };
  var memory = {};

  function load(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return memory.hasOwnProperty(key) ? memory[key] : fallback;
    }
  }

  function save(key, value) {
    memory[key] = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // 저장 못 해도 문제 풀기는 계속된다
    }
  }

  // ===== 오답노트 =====
  // 한 항목: { subject, topic, question: {…문제 객체…}, wrongCount, lastWrongAt }

  function getWrongNotes() {
    var list = load(KEYS.wrongNotes, []);
    return Array.isArray(list) ? list : [];
  }

  function findIndex(list, subject, topic, questionId) {
    for (var i = 0; i < list.length; i++) {
      var note = list[i];
      if (note.subject === subject && note.topic === topic &&
          note.question && note.question.id === questionId) {
        return i;
      }
    }
    return -1;
  }

  // 틀린 문제 저장. 이미 있으면 틀린 횟수만 올린다.
  function addWrong(subject, topic, question) {
    var list = getWrongNotes();
    var index = findIndex(list, subject, topic, question.id);
    if (index >= 0) {
      list[index].wrongCount += 1;
      list[index].lastWrongAt = Date.now();
    } else {
      list.push({
        subject: subject,
        topic: topic,
        question: question,
        wrongCount: 1,
        lastWrongAt: Date.now()
      });
    }
    save(KEYS.wrongNotes, list);
  }

  function removeWrong(subject, topic, questionId) {
    var list = getWrongNotes();
    var index = findIndex(list, subject, topic, questionId);
    if (index >= 0) {
      list.splice(index, 1);
      save(KEYS.wrongNotes, list);
    }
  }

  function countWrong(subject, topic) {
    return getWrongNotes().filter(function (note) {
      return note.subject === subject && (!topic || note.topic === topic);
    }).length;
  }

  // ===== 점수 (주제별 최고 연속 정답) =====
  // 모양: { "korean/spacing": { bestStreak: 7 }, ... }

  function getBestStreak(scoreKey) {
    var scores = load(KEYS.scores, {});
    return (scores && scores[scoreKey] && scores[scoreKey].bestStreak) || 0;
  }

  // 지금 연속 정답이 기록보다 크면 저장하고 true를 돌려준다
  function updateBestStreak(scoreKey, streak) {
    var scores = load(KEYS.scores, {}) || {};
    var best = (scores[scoreKey] && scores[scoreKey].bestStreak) || 0;
    if (streak <= best) return false;
    scores[scoreKey] = { bestStreak: streak };
    save(KEYS.scores, scores);
    return true;
  }

  return {
    getWrongNotes: getWrongNotes,
    addWrong: addWrong,
    removeWrong: removeWrong,
    countWrong: countWrong,
    getBestStreak: getBestStreak,
    updateBestStreak: updateBestStreak
  };
})();
