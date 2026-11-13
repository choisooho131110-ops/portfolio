// 여러 파일에서 같이 쓰는 작은 도우미 함수들
window.Util = (function () {
  // 태그와 글자로 요소를 만든다
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  // 목록에서 하나를 랜덤으로 고른다
  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  // 목록을 섞은 새 목록을 돌려준다 (원래 목록은 그대로)
  function shuffle(list) {
    var copy = list.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  // 품사 문제의 단어들을 한 문장으로 잇는다 (attach 단어는 앞에 붙임)
  function joinTokens(tokens) {
    var text = "";
    tokens.forEach(function (token, i) {
      if (i > 0 && !token.attach) text += " ";
      text += token.text;
    });
    return text;
  }

  function formatDate(time) {
    var d = new Date(time);
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일";
  }

  // 정답/오답 표시 + 해설 상자 + 다음 버튼 (두 문제 화면이 같이 씀)
  //   explainItems: 글자 또는 요소의 목록
  //   options.onNext, options.nextLabel: 해설 아래 버튼
  function renderFeedback(box, correct, verdictText, explainItems, options) {
    box.innerHTML = "";
    box.appendChild(el("p", "verdict " + (correct ? "verdict-correct" : "verdict-wrong"), verdictText));

    var explain = el("div", "explain-box");
    explain.appendChild(el("p", "explain-title", "💡 해설"));
    explainItems.forEach(function (item) {
      explain.appendChild(typeof item === "string" ? el("p", "explain-text", item) : item);
    });
    box.appendChild(explain);

    if (options && options.onNext) {
      var next = el("button", "primary-btn next-btn", options.nextLabel || "다음 문제 →");
      next.type = "button";
      next.onclick = options.onNext;
      box.appendChild(next);
    }

    // 해설이 화면 아래에 가려져 있으면 보이게 스크롤
    if (box.scrollIntoView) box.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  return {
    el: el,
    pick: pick,
    shuffle: shuffle,
    joinTokens: joinTokens,
    formatDate: formatDate,
    renderFeedback: renderFeedback
  };
})();
