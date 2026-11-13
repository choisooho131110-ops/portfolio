// 품사 분류 문제 화면 (type: "pos")
// QuizPos.render(box, question, options)
//   options.onAnswer(correct) : 채점한 뒤 불린다 (모든 단어를 맞혀야 정답)
//   options.onNext, options.nextLabel : 해설 아래 버튼
window.QuizPos = (function () {
  var el = Util.el;
  var POS_LIST = ["명사", "대명사", "수사", "동사", "형용사", "관형사", "부사", "조사", "감탄사"];

  function render(box, question, options) {
    options = options || {};
    var tokens = question.tokens;
    var picks = {};      // 단어 번호 → 고른 품사
    var targets = [];    // 문제로 낼 단어 번호 (문장부호 제외)
    var graded = false;

    tokens.forEach(function (t, i) {
      if (t.pos) targets.push(i);
    });
    var current = targets[0];

    var card = el("div", "quiz-card");
    card.appendChild(el("p", "quiz-question", "각 단어의 품사를 골라 보세요."));

    // 문장: 띄어 쓰는 단위(어절)로 묶고, 그 안에서 단어마다 따로 누를 수 있게
    var sentence = el("div", "pos-sentence");
    var tokenViews = {};
    var word = null;
    tokens.forEach(function (t, i) {
      if (!t.attach || !word) {
        word = el("span", "pos-word");
        sentence.appendChild(word);
      }
      if (!t.pos) {
        word.appendChild(el("span", "pos-punct", t.text));
        return;
      }
      var btn = el("button", "pos-token");
      btn.type = "button";
      btn.appendChild(el("span", "pos-token-text", t.text));
      var label = el("span", "pos-token-label", "?");
      btn.appendChild(label);
      btn.onclick = function () {
        if (graded) return;
        current = i;
        refresh();
      };
      tokenViews[i] = { btn: btn, label: label };
      word.appendChild(btn);
    });
    card.appendChild(sentence);

    // 9품사 버튼
    var palette = el("div", "pos-palette");
    var paletteTitle = el("p", "pos-palette-title");
    palette.appendChild(paletteTitle);
    var grid = el("div", "pos-grid");
    var choiceButtons = {};
    POS_LIST.forEach(function (pos) {
      var b = el("button", "pos-choice", pos);
      b.type = "button";
      b.onclick = function () { choose(pos); };
      choiceButtons[pos] = b;
      grid.appendChild(b);
    });
    palette.appendChild(grid);
    card.appendChild(palette);

    var actions = el("div", "pos-actions");
    var progress = el("span", "pos-progress");
    var gradeBtn = el("button", "primary-btn", "채점하기");
    gradeBtn.type = "button";
    gradeBtn.onclick = grade;
    actions.appendChild(progress);
    actions.appendChild(gradeBtn);
    card.appendChild(actions);

    var result = el("div", "quiz-result");
    card.appendChild(result);
    box.appendChild(card);

    refresh();

    function countPicked() {
      return targets.filter(function (i) { return picks[i]; }).length;
    }

    // from 다음에 오는 아직 안 고른 단어 (끝까지 가면 처음부터), 없으면 null
    function nextUnpicked(from) {
      var start = targets.indexOf(from);
      for (var step = 1; step <= targets.length; step++) {
        var i = targets[(start + step) % targets.length];
        if (!picks[i]) return i;
      }
      return null;
    }

    function choose(pos) {
      if (graded || current === null) return;
      picks[current] = pos;
      current = nextUnpicked(current);
      refresh();
    }

    function refresh() {
      targets.forEach(function (i) {
        var view = tokenViews[i];
        view.label.textContent = picks[i] || "?";
        view.btn.classList.toggle("is-selected", i === current);
        view.btn.classList.toggle("is-picked", !!picks[i]);
      });

      if (current === null) {
        paletteTitle.textContent = "다 골랐어요! 바꾸고 싶으면 단어를 눌러요.";
      } else {
        paletteTitle.textContent = "'" + tokens[current].text + "'의 품사는?";
      }
      POS_LIST.forEach(function (pos) {
        choiceButtons[pos].disabled = current === null;
        choiceButtons[pos].classList.toggle("is-active", current !== null && picks[current] === pos);
      });

      var done = countPicked();
      progress.textContent = done + " / " + targets.length + "개 골랐어요";
      gradeBtn.disabled = done < targets.length;
    }

    function grade() {
      if (graded || countPicked() < targets.length) return;
      graded = true;
      card.removeChild(palette);
      card.removeChild(actions);

      var wrongItems = [];
      targets.forEach(function (i) {
        var t = tokens[i];
        var view = tokenViews[i];
        view.btn.classList.remove("is-selected");
        view.btn.disabled = true;
        view.label.textContent = "";
        if (picks[i] === t.pos) {
          view.btn.classList.add("is-correct");
          view.label.textContent = t.pos;
        } else {
          view.btn.classList.add("is-wrong");
          view.label.appendChild(el("s", "label-picked", picks[i]));
          view.label.appendChild(el("span", "label-answer", t.pos));
          wrongItems.push(hintItem(t));
        }
      });

      var correct = wrongItems.length === 0;
      var explainItems = [question.explain];
      if (!correct) {
        explainItems.push(el("p", "explain-subtitle", "틀린 단어 다시 보기"));
        explainItems = explainItems.concat(wrongItems);
      }

      Util.renderFeedback(result, correct,
        correct ? "✅ 모두 맞았어요!" : "❌ " + wrongItems.length + "개 틀렸어요. 빨간 단어를 확인해 봐요.",
        explainItems, options);

      if (options.onAnswer) options.onAnswer(correct);
    }
  }

  // 틀린 단어 하나: "'파랗다' → 형용사" + 품사 설명
  function hintItem(token) {
    var item = el("div", "hint-item");
    item.appendChild(el("p", "hint-word", "'" + token.text + "' → " + token.pos));
    var hint = (window.POS_HINTS || {})[token.pos];
    if (hint) item.appendChild(el("p", "hint-text", hint));
    return item;
  }

  return { render: render };
})();
