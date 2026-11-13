// 객관식 문제 화면 (type: "choice")
// QuizChoice.render(box, question, options)
//   options.onAnswer(correct) : 답을 고른 뒤 불린다
//   options.onNext, options.nextLabel : 해설 아래 버튼
window.QuizChoice = (function () {
  var el = Util.el;
  var MARKS = ["①", "②", "③", "④", "⑤"];

  function render(box, question, options) {
    options = options || {};
    var answered = false;

    // 선택지 순서를 섞는다. 각 버튼이 원래 몇 번 선택지인지 기억해서 채점한다.
    var order = Util.shuffle(question.choices.map(function (choice, i) { return i; }));

    var card = el("div", "quiz-card");
    if (question.unit) card.appendChild(el("p", "quiz-unit", question.unit));
    card.appendChild(el("p", "quiz-question", question.question));

    var list = el("div", "choice-list");
    var buttons = [];
    order.forEach(function (choiceIndex, shownIndex) {
      var btn = el("button", "choice-btn");
      btn.type = "button";
      btn.appendChild(el("span", "choice-mark", MARKS[shownIndex] || (shownIndex + 1) + "."));
      btn.appendChild(el("span", "choice-text", question.choices[choiceIndex]));
      btn.onclick = function () { answer(choiceIndex, btn); };
      buttons.push({ btn: btn, choiceIndex: choiceIndex });
      list.appendChild(btn);
    });
    card.appendChild(list);

    var result = el("div", "quiz-result");
    card.appendChild(result);
    box.appendChild(card);

    function answer(chosenIndex, chosenBtn) {
      if (answered) return;
      answered = true;
      var correct = chosenIndex === question.answer;

      buttons.forEach(function (b) {
        b.btn.disabled = true;
        if (b.choiceIndex === question.answer) b.btn.classList.add("is-correct");
        else if (b.btn === chosenBtn) b.btn.classList.add("is-wrong");
      });

      Util.renderFeedback(result, correct,
        correct ? "✅ 정답이에요!" : "❌ 틀렸어요. 초록색이 정답이에요.",
        [question.explain], options);

      if (options.onAnswer) options.onAnswer(correct);
    }
  }

  return { render: render };
})();
