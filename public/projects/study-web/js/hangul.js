// 받침 확인, 조사 고르기
//   (을/를) 표시 → 바로 앞 글자에 받침이 있으면 앞의 것, 없으면 뒤의 것
//   을(를) 표시  → 해설에 쓰인 모양. 받침에 맞는 쪽 하나만 남긴다
window.Hangul = (function () {
  // [받침 있을 때, 받침 없을 때]
  var PAIRS = [["은", "는"], ["이", "가"], ["을", "를"], ["과", "와"]];

  // "(을/를)" 모양
  var MARK = /\(([가-힣]+)\/([가-힣]+)\)/g;
  // "을(를)", "와(과)" 모양 (앞에 따옴표가 있어도 됨)
  var ALT = /([가-힣])(['"]?)(은|는|이|가|을|를|과|와)\((은|는|이|가|을|를|과|와)\)/g;

  // 낱말의 마지막 글자에 받침이 있는지
  function hasBatchim(word) {
    if (!word) return false;
    var code = word.charCodeAt(word.length - 1);
    if (code < 0xAC00 || code > 0xD7A3) return false; // 한글 글자가 아님
    return (code - 0xAC00) % 28 !== 0;
  }

  function findPair(a, b) {
    for (var i = 0; i < PAIRS.length; i++) {
      var p = PAIRS[i];
      if ((p[0] === a && p[1] === b) || (p[0] === b && p[1] === a)) return p;
    }
    return null;
  }

  // 글 안의 (을/를) 표시를 모두 고른다.
  // before: 이 글 바로 앞에 오는 말 (품사 문제에서 앞 단어)
  function resolveMarks(text, before) {
    before = before || "";
    return text.replace(MARK, function (match, withBatchim, withoutBatchim, offset) {
      var prev = (before + text.slice(0, offset)).replace(/['"]+$/, "");
      return hasBatchim(prev) ? withBatchim : withoutBatchim;
    });
  }

  // 해설의 은(는), 을(를) 같은 표시를 고른다
  function resolveAlternatives(text) {
    return text.replace(ALT, function (match, last, quote, a, b) {
      var pair = findPair(a, b);
      if (!pair) return match;
      return last + quote + (hasBatchim(last) ? pair[0] : pair[1]);
    });
  }

  // 두 가지를 모두 처리한다
  function resolve(text, before) {
    return resolveAlternatives(resolveMarks(text, before));
  }

  return {
    hasBatchim: hasBatchim,
    resolveMarks: resolveMarks,
    resolve: resolve
  };
})();
