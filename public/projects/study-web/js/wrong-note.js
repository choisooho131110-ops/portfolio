// 오답노트 화면
// WrongNote.render(box, subject, quizTypes)
//   quizTypes: { choice: QuizChoice, pos: QuizPos } — 다시 풀기에 쓸 문제 화면
window.WrongNote = (function () {
  var el = Util.el;

  function render(box, subject, quizTypes) {
    box.innerHTML = "";
    window.scrollTo(0, 0);

    var notes = StudyStorage.getWrongNotes().filter(function (note) {
      return note.subject === subject.id;
    });

    if (notes.length === 0) {
      var empty = el("div", "notice");
      empty.appendChild(el("p", "", "👍 틀린 문제가 없어요."));
      empty.appendChild(el("p", "notice-sub", "문제를 풀다가 틀리면 여기에 저장돼요."));
      box.appendChild(empty);
      return;
    }

    box.appendChild(el("p", "guide", "틀린 문제를 다시 풀어 보세요. 맞히면 지울 수 있어요."));

    // 주제별로 묶어서, 최근에 틀린 문제가 위로
    subject.topics.forEach(function (topic) {
      var list = notes.filter(function (note) { return note.topic === topic.id; });
      if (list.length === 0) return;
      list.sort(function (a, b) { return b.lastWrongAt - a.lastWrongAt; });

      var section = el("section", "note-section");
      section.appendChild(el("h2", "note-section-title", topic.name + " (" + list.length + ")"));
      list.forEach(function (note) {
        section.appendChild(noteItem(box, subject, topic, note, quizTypes));
      });
      box.appendChild(section);
    });
  }

  // 목록에 보여 줄 글: 품사는 문장, 두 문장 고르기(띄어쓰기)는 두 선택지, 그 밖에는 문제
  function previewText(question) {
    if (question.tokens) return Util.joinTokens(question.tokens);
    if (question.choices.length <= 2) return question.choices.join("  /  ");
    return question.question;
  }

  function noteItem(box, subject, topic, note, quizTypes) {
    var item = el("div", "note-item");
    if (note.question.unit) item.appendChild(el("p", "quiz-unit", note.question.unit));
    item.appendChild(el("p", "note-preview", previewText(note.question)));
    item.appendChild(el("p", "note-meta",
      "틀린 횟수 " + note.wrongCount + "번 · 마지막 " + Util.formatDate(note.lastWrongAt)));

    var actions = el("div", "note-actions");

    var retryBtn = el("button", "small-btn", "다시 풀기");
    retryBtn.type = "button";
    retryBtn.onclick = function () { retry(box, subject, topic, note, quizTypes); };
    actions.appendChild(retryBtn);

    var deleteBtn = el("button", "small-btn danger-btn", "지우기");
    deleteBtn.type = "button";
    deleteBtn.onclick = function () {
      if (window.confirm("이 문제를 오답노트에서 지울까요?")) {
        StudyStorage.removeWrong(subject.id, topic.id, note.question.id);
        render(box, subject, quizTypes);
      }
    };
    actions.appendChild(deleteBtn);

    item.appendChild(actions);
    return item;
  }

  // 한 문제 다시 풀기
  function retry(box, subject, topic, note, quizTypes) {
    var quiz = quizTypes[topic.type];
    if (!quiz) return;

    box.innerHTML = "";
    window.scrollTo(0, 0);
    var backToList = function () { render(box, subject, quizTypes); };

    var top = el("div", "retry-top");
    var listBtn = el("button", "small-btn", "← 오답노트 목록");
    listBtn.type = "button";
    listBtn.onclick = backToList;
    top.appendChild(listBtn);
    top.appendChild(el("span", "retry-topic", topic.name + " 다시 풀기"));
    box.appendChild(top);

    var quizBox = el("div");
    box.appendChild(quizBox);

    // 원래 문제를 복사해서 푼다 (선택지 섞기 등이 저장된 문제를 바꾸지 않게)
    var question = JSON.parse(JSON.stringify(note.question));

    var options = {};
    options.onAnswer = function (correct) {
      if (correct) {
        askRemove(quizBox, subject, topic, note, backToList);
      } else {
        StudyStorage.addWrong(subject.id, topic.id, note.question);
        var again = el("button", "primary-btn next-btn", "오답노트 목록으로");
        again.type = "button";
        again.onclick = backToList;
        quizBox.appendChild(again);
      }
    };
    quiz.render(quizBox, question, options);
  }

  // 다시 맞혔을 때: 오답노트에서 지울지 묻기
  function askRemove(container, subject, topic, note, backToList) {
    var prompt = el("div", "retry-prompt");
    prompt.appendChild(el("p", "", "🎉 이번엔 맞혔어요! 오답노트에서 지울까요?"));

    var row = el("div", "button-row");
    var yes = el("button", "primary-btn", "지우기");
    yes.type = "button";
    yes.onclick = function () {
      StudyStorage.removeWrong(subject.id, topic.id, note.question.id);
      backToList();
    };
    var no = el("button", "secondary-btn", "남겨 두기");
    no.type = "button";
    no.onclick = backToList;
    row.appendChild(yes);
    row.appendChild(no);
    prompt.appendChild(row);

    container.appendChild(prompt);
    prompt.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  return { render: render };
})();
