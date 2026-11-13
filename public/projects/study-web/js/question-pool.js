// 은행 + 생성기를 섞어서 다음 문제 뽑기
//   - 50% 확률로 은행, 50% 확률로 생성기 (한쪽이 비어 있으면 다른 쪽)
//   - 은행 문제는 한 바퀴를 다 돌기 전에는 다시 나오지 않는다
//   - 생성 문제는 최근 20문제와 같으면 다시 만든다 (최대 10번)
window.QuestionPool = (function () {
  var RECENT_SIZE = 20;
  var MAX_TRIES = 10;
  var states = {}; // 주제별 상태 { deck: 남은 은행 문제, recent: 최근 문제 id }

  // 주제의 은행 문제 전체. bank가 배열이면 여러 은행을 합친다.
  function getBank(topic) {
    var names = [].concat(topic.bank || []);
    var all = [];
    names.forEach(function (name) {
      all = all.concat((window.QUESTION_BANK || {})[name] || []);
    });
    return all;
  }

  // 주제의 생성기 목록. generators가 없으면 빈 목록 (은행 문제만 낸다)
  function getGenerators(topic) {
    if (!topic.generators) return [];
    return (window.GENERATORS || {})[topic.generators] || [];
  }

  function getState(topic) {
    var key = [].concat(topic.bank || []).join(",") + "|" + (topic.generators || "");
    if (!states[key]) states[key] = { deck: [], recent: [] };
    return states[key];
  }

  function fromBank(bank, state) {
    // 다 썼으면 다시 섞는다
    if (state.deck.length === 0) state.deck = Util.shuffle(bank);
    return state.deck.pop();
  }

  function fromGenerators(generators, state) {
    var question = null;
    for (var i = 0; i < MAX_TRIES; i++) {
      question = QuestionGenerator.make(Util.pick(generators));
      if (state.recent.indexOf(question.id) === -1) break;
    }
    return question;
  }

  function remember(state, id) {
    state.recent.push(id);
    if (state.recent.length > RECENT_SIZE) state.recent.shift();
  }

  // 모든 과목·주제에 쓰는 함수. 문제가 하나도 없으면 null.
  function getNextQuestion(topic) {
    var bank = getBank(topic);
    var generators = getGenerators(topic);
    if (bank.length === 0 && generators.length === 0) return null;

    var state = getState(topic);
    var useBank = generators.length === 0 || (bank.length > 0 && Math.random() < 0.5);
    var original = useBank ? fromBank(bank, state) : fromGenerators(generators, state);

    // 복사본을 돌려준다 (화면에서 바꿔도 원래 데이터는 그대로)
    var question = JSON.parse(JSON.stringify(original));
    question.source = useBank ? "bank" : "generator";
    remember(state, question.id);
    return question;
  }

  return {
    getNextQuestion: getNextQuestion,
    getBank: getBank,
    getGenerators: getGenerators
  };
})();
