// 생성기 데이터 → 문제 객체로 바꾸기
//   template가 있으면 띄어쓰기(객관식) 생성기, tokens가 있으면 품사 생성기
// 만들어진 문제는 은행 문제와 똑같은 모양이라서 같은 화면에서 풀 수 있다.
window.QuestionGenerator = (function () {
  // slots와 groups에서 값을 하나씩 고른다
  function chooseValues(gen) {
    var values = {};
    var slots = gen.slots || {};
    Object.keys(slots).forEach(function (name) {
      values[name] = Util.pick(slots[name]);
    });
    // groups가 있으면 한 묶음을 골라 그 안의 값들을 함께 쓴다
    if (gen.groups && gen.groups.length) {
      var group = Util.pick(gen.groups);
      Object.keys(group).forEach(function (name) {
        values[name] = group[name];
      });
    }
    return values;
  }

  // {이름} 을 고른 값으로 바꾼다
  function fill(text, values) {
    return text.replace(/\{(\w+)\}/g, function (match, name) {
      return values.hasOwnProperty(name) ? values[name] : match;
    });
  }

  // 띄어쓰기 생성기 → 객관식 문제
  function makeChoice(gen) {
    var values = chooseValues(gen);
    var filled = fill(gen.template, values);
    var spaced = Hangul.resolve(filled.replace(/\^/g, " "));
    var joined = Hangul.resolve(filled.replace(/\^/g, ""));

    var right = gen.kind === "attach" ? joined : spaced;
    var wrong = gen.kind === "attach" ? spaced : joined;

    return {
      id: "gen-" + right,
      generatorId: gen.id,
      question: "맞게 띄어 쓴 것은?",
      choices: [right, wrong],
      answer: 0,
      explain: Hangul.resolve(fill(gen.explain, values))
    };
  }

  // 품사 생성기 → 품사 문제
  function makePos(gen) {
    var values = chooseValues(gen);
    var tokens = [];

    gen.tokens.forEach(function (t) {
      var text = t.slot ? values[t.slot] : t.text;
      // (을/를) 같은 조사는 바로 앞 단어의 받침을 보고 고른다
      var prev = tokens.length ? tokens[tokens.length - 1].text : "";
      var token = { text: Hangul.resolveMarks(text, prev), pos: t.pos };
      if (t.attach) token.attach = true;
      tokens.push(token);
    });

    return {
      id: "gen-" + Util.joinTokens(tokens),
      generatorId: gen.id,
      tokens: tokens,
      explain: Hangul.resolve(fill(gen.explain, values))
    };
  }

  function make(gen) {
    if (gen.template) return makeChoice(gen);
    if (gen.tokens) return makePos(gen);
    throw new Error("알 수 없는 생성기 형식: " + gen.id);
  }

  // 테스트: 생성기마다 문제를 count개씩 만들어 콘솔에 출력한다
  // 브라우저 콘솔(F12)에서 testGenerators() 라고 입력하면 된다.
  function testAll(count) {
    count = count || 5;
    var all = window.GENERATORS || {};
    Object.keys(all).forEach(function (bankName) {
      console.log("===== " + bankName + " =====");
      all[bankName].forEach(function (gen) {
        console.log("--- " + gen.id);
        for (var i = 0; i < count; i++) {
          var q = make(gen);
          if (q.choices) {
            console.log("  O " + q.choices[0] + "   X " + q.choices[1]);
          } else {
            console.log("  " + q.tokens.map(function (t) {
              return t.text + (t.pos ? "/" + t.pos : "");
            }).join(" "));
          }
          console.log("    해설: " + q.explain);
        }
      });
    });
  }

  window.testGenerators = testAll;

  return {
    make: make,
    testAll: testAll
  };
})();
