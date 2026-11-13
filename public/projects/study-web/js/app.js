// 화면 전환과 메뉴
// 주소의 # 부분으로 지금 화면을 정한다. (휴대폰 뒤로가기 버튼도 작동)
//   #/                 → 메인 화면 (과목 선택)
//   #/korean           → 주제 선택
//   #/korean/spacing   → 끝없는 문제 풀기
//   #/korean/wrong     → 오답노트

(function () {
  var el = Util.el;
  var app = document.getElementById("app");
  var pageTitle = document.getElementById("page-title");
  var backBtn = document.getElementById("back-btn");

  // 문제 화면 종류. subjects.js의 type 이름과 같아야 한다.
  // 새 type을 만들면 여기에 한 줄 추가한다.
  var QUIZ_TYPES = {
    choice: window.QuizChoice,
    pos: window.QuizPos
  };

  function findById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  // 주제 버튼 아래 작은 글씨: 문제 수 (생성기가 있으면 생성기 수도)
  function describeTopic(topic) {
    var bankCount = QuestionPool.getBank(topic).length;
    var genCount = QuestionPool.getGenerators(topic).length;
    if (genCount === 0) return "문제 " + bankCount + "개";
    return "문제 은행 " + bankCount + "개 · 생성기 " + genCount + "개";
  }

  function go(path) {
    location.hash = "#/" + path;
  }

  function setHeader(title, backPath) {
    pageTitle.textContent = title;
    document.title = title;
    if (backPath === null) {
      backBtn.hidden = true;
      backBtn.onclick = null;
    } else {
      backBtn.hidden = false;
      backBtn.onclick = function () { go(backPath); };
    }
  }

  function clearScreen() {
    app.innerHTML = "";
    window.scrollTo(0, 0);
  }

  function button(className, text, onClick) {
    var btn = el("button", className, text);
    btn.type = "button";
    btn.onclick = onClick;
    return btn;
  }

  // 1. 메인 화면: 과목 카드
  function showHome() {
    setHeader("공부 웹사이트", null);

    var subjects = window.SUBJECTS || [];
    app.appendChild(el("p", "guide", "공부할 과목을 골라 주세요."));

    var grid = el("div", "card-grid");
    subjects.forEach(function (subject) {
      var card = button("card", null, function () { go(subject.id); });
      card.appendChild(el("span", "card-icon", subject.icon || "📚"));
      card.appendChild(el("span", "card-name", subject.name));
      card.appendChild(el("span", "card-sub", subject.topics.length + "개 주제"));
      grid.appendChild(card);
    });
    app.appendChild(grid);
  }

  // 2. 주제 선택 화면
  function showTopics(subject) {
    setHeader(subject.name, "");

    app.appendChild(el("p", "guide", "무엇을 공부할까요?"));

    var list = el("div", "menu-list");
    subject.topics.forEach(function (topic) {
      var best = StudyStorage.getBestStreak(subject.id + "/" + topic.id);
      var sub = describeTopic(topic);
      if (best > 0) sub += " · 최고 연속 " + best + "개";

      var btn = button("menu-btn", null, function () { go(subject.id + "/" + topic.id); });
      btn.appendChild(el("span", "menu-name", topic.name));
      btn.appendChild(el("span", "menu-sub", sub));
      list.appendChild(btn);
    });

    var wrongCount = StudyStorage.countWrong(subject.id);
    var wrongBtn = button("menu-btn menu-btn-wrong", null, function () { go(subject.id + "/wrong"); });
    wrongBtn.appendChild(el("span", "menu-name", "오답노트"));
    wrongBtn.appendChild(el("span", "menu-sub",
      wrongCount > 0 ? "틀린 문제 " + wrongCount + "개" : "틀린 문제가 없어요"));
    list.appendChild(wrongBtn);

    app.appendChild(list);
  }

  // 3. 끝없는 문제 풀기
  function showQuiz(subject, topic) {
    setHeader(subject.name + " · " + topic.name, subject.id);

    var quiz = QUIZ_TYPES[topic.type];
    if (!quiz) {
      app.appendChild(el("div", "notice", "'" + topic.type + "' 문제 화면이 아직 없어요."));
      return;
    }

    var scoreKey = subject.id + "/" + topic.id;
    var stats = {
      solved: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      recordBefore: StudyStorage.getBestStreak(scoreKey)
    };

    // 위쪽: 푼 문제 / 맞은 수 / 연속 정답 + 그만하기
    var bar = el("div", "stats-bar");
    var solvedView = statView(bar, "푼 문제");
    var correctView = statView(bar, "맞은 수");
    var streakView = statView(bar, "연속 정답");
    bar.appendChild(button("secondary-btn stop-btn", "그만하기", function () {
      showResult(subject, topic, stats);
    }));
    app.appendChild(bar);

    var quizBox = el("div");
    app.appendChild(quizBox);

    function updateStats() {
      solvedView.textContent = stats.solved;
      correctView.textContent = stats.correct;
      streakView.textContent = stats.streak + (stats.streak >= 3 ? " 🔥" : "");
    }

    function onAnswer(question, correct) {
      stats.solved += 1;
      if (correct) {
        stats.correct += 1;
        stats.streak += 1;
        stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
        StudyStorage.updateBestStreak(scoreKey, stats.streak);
      } else {
        stats.streak = 0;
        StudyStorage.addWrong(subject.id, topic.id, question);
      }
      updateStats();
      streakView.parentNode.classList.remove("bump");
      void streakView.offsetWidth; // 애니메이션을 다시 시작하기 위한 줄
      if (correct) streakView.parentNode.classList.add("bump");
    }

    function nextQuestion() {
      quizBox.innerHTML = "";
      window.scrollTo(0, 0);

      var question = QuestionPool.getNextQuestion(topic);
      if (!question) {
        quizBox.appendChild(el("div", "notice", "이 주제에는 아직 문제가 없어요."));
        return;
      }

      // 은행과 생성기가 섞여 나오는 주제에서만 어디서 온 문제인지 보여 준다
      if (QuestionPool.getGenerators(topic).length > 0) {
        quizBox.appendChild(el("p", "source-badge",
          question.source === "generator" ? "🎲 자동 생성 문제" : "📚 문제 은행"));
      }

      quiz.render(quizBox, question, {
        onAnswer: function (correct) { onAnswer(question, correct); },
        nextLabel: "다음 문제 →",
        onNext: nextQuestion
      });
    }

    updateStats();
    nextQuestion();
  }

  function statView(bar, label) {
    var box = el("div", "stat");
    var num = el("span", "stat-num", "0");
    box.appendChild(num);
    box.appendChild(el("span", "stat-label", label));
    bar.appendChild(box);
    return num;
  }

  // 4. 결과 화면 (그만하기를 눌렀을 때)
  function showResult(subject, topic, stats) {
    clearScreen();

    var rate = stats.solved ? Math.round(stats.correct / stats.solved * 100) : 0;
    var card = el("div", "result-card");
    card.appendChild(el("p", "result-title", topic.name + " 결과"));
    card.appendChild(el("p", "result-score", stats.correct + " / " + stats.solved));
    card.appendChild(el("p", "result-rate", "정답률 " + rate + "%"));
    card.appendChild(el("p", "result-line", "이번 최고 연속 정답: " + stats.bestStreak + "개"));

    if (stats.bestStreak > stats.recordBefore) {
      card.appendChild(el("p", "result-new", "🎉 새 최고 기록이에요!"));
    } else if (stats.recordBefore > 0) {
      card.appendChild(el("p", "result-line", "최고 기록: " + stats.recordBefore + "개"));
    }

    var wrongInSession = stats.solved - stats.correct;
    if (wrongInSession > 0) {
      card.appendChild(el("p", "result-line", "틀린 " + wrongInSession + "문제는 오답노트에 저장했어요."));
    }

    var row = el("div", "button-row");
    row.appendChild(button("primary-btn", "다시 풀기", function () {
      clearScreen();
      showQuiz(subject, topic);
    }));
    row.appendChild(button("secondary-btn", "오답노트 보기", function () { go(subject.id + "/wrong"); }));
    row.appendChild(button("secondary-btn", "주제 선택", function () { go(subject.id); }));
    card.appendChild(row);

    app.appendChild(card);
  }

  // 5. 오답노트
  function showWrongNote(subject) {
    setHeader(subject.name + " · 오답노트", subject.id);
    WrongNote.render(app, subject, QUIZ_TYPES);
  }

  function showNotFound() {
    setHeader("페이지를 찾을 수 없어요", "");
    app.appendChild(el("div", "notice", "주소가 잘못되었어요. 뒤로 가서 다시 골라 주세요."));
  }

  // 주소를 보고 알맞은 화면을 그린다
  function route() {
    clearScreen();

    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);

    if (parts.length === 0) return showHome();

    var subject = findById(window.SUBJECTS || [], parts[0]);
    if (!subject) return showNotFound();

    if (parts.length === 1) return showTopics(subject);

    if (parts[1] === "wrong") return showWrongNote(subject);

    var topic = findById(subject.topics, parts[1]);
    if (!topic) return showNotFound();
    return showQuiz(subject, topic);
  }

  window.addEventListener("hashchange", route);
  route();
})();
