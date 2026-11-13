// 자동 문제 생성기
// {이름}  → slots 또는 groups에서 고른 값으로 바뀜
// ^       → 띄어쓰기 생성기에서 문제가 되는 자리
//            kind "space": 맞는 답은 띄움 / kind "attach": 맞는 답은 붙임
// (을/를), (이/가), (은/는), (과/와) → 바로 앞 글자 받침을 보고 고름
window.GENERATORS = window.GENERATORS || {};

window.GENERATORS["korean/spacing"] = [
  { id: "gen-sp-su", kind: "space",
    template: "나는 {act}^수 있다.",
    slots: { act: ["수영을 할", "혼자 갈", "피아노를 칠", "이 문제를 풀", "자전거를 탈", "김치를 먹을"] },
    explain: "'수'는 '방법, 능력'을 뜻하는 의존 명사라서 앞의 '{act}'과(와) 띄어 써요." },

  { id: "gen-sp-ji", kind: "space",
    template: "{act}^지 {time}(이/가) 지났다.",
    slots: { act: ["이사 온", "중학교에 입학한", "강아지를 키운", "피아노를 배운"],
             time: ["한 달", "일 년", "삼 년", "두 주일"] },
    explain: "어떤 일이 있고 나서 지난 시간을 뜻하는 '지'는 의존 명사라서 띄어 써요." },

  { id: "gen-sp-unit", kind: "space",
    template: "{item} {num}^{unit}(을/를) {verb}.",
    slots: { num: ["한", "두", "세", "네", "다섯"] },
    groups: [
      { item: "책", unit: "권", verb: "샀다" },
      { item: "사과", unit: "개", verb: "먹었다" },
      { item: "연필", unit: "자루", verb: "샀다" },
      { item: "고양이", unit: "마리", verb: "키운다" },
      { item: "신발", unit: "켤레", verb: "샀다" },
      { item: "종이", unit: "장", verb: "썼다" }
    ],
    explain: "'{unit}'은(는) 단위를 나타내는 의존 명사라서 앞의 수 '{num}'과(와) 띄어 써요." },

  { id: "gen-sp-ppun", kind: "attach",
    template: "남은 것은 {noun}^뿐이다.",
    slots: { noun: ["이 빵", "동전 하나", "연필 두 자루", "이 공책"] },
    explain: "명사 뒤에 오는 '뿐'은 조사라서 앞말에 붙여 써요." },

  { id: "gen-sp-bakke", kind: "attach",
    template: "그 답은 {who}^밖에 모른다.",
    slots: { who: ["너", "선생님", "민지", "형"] },
    explain: "'~말고는'이라는 뜻의 '밖에'는 조사라서 '{who}'에 붙여 써요." },

  { id: "gen-sp-cheoreom", kind: "attach",
    template: "{noun}^처럼 {adj}.",
    groups: [
      { noun: "눈", adj: "하얗다" },
      { noun: "바다", adj: "넓다" },
      { noun: "거북이", adj: "느리다" },
      { noun: "사자", adj: "용감하다" }
    ],
    explain: "'처럼'은 조사라서 '{noun}'에 붙여 써요." },

  { id: "gen-sp-an", kind: "space",
    template: "나는 오늘 {obj}(을/를) 안^{verb}.",
    groups: [
      { obj: "우유", verb: "마셨다" },
      { obj: "숙제", verb: "했다" },
      { obj: "밥", verb: "먹었다" },
      { obj: "책", verb: "읽었다" }
    ],
    explain: "'안'은 '아니'의 준말인 부사라서 뒤의 '{verb}'와(과) 띄어 써요." },

  { id: "gen-sp-ttae", kind: "space",
    template: "나는 {act}^때가 제일 좋다.",
    slots: { act: ["밥을 먹을", "잠을 잘", "친구와 놀", "책을 읽을"] },
    explain: "'때'는 명사라서 앞의 '{act}'과(와) 띄어 써요." },

  { id: "gen-sp-kkaji", kind: "attach",
    template: "{place}^까지 걸어갔다.",
    slots: { place: ["학교", "공원", "도서관", "집"] },
    explain: "'까지'는 조사라서 앞말 '{place}'에 붙여 써요." }
];

window.GENERATORS["korean/pos"] = [
  { id: "gen-pos-det",
    tokens: [
      { text: "나", pos: "대명사" }, { text: "는", pos: "조사", attach: true },
      { slot: "det", pos: "관형사" }, { slot: "noun", pos: "명사" },
      { text: "(을/를)", pos: "조사", attach: true },
      { slot: "verb", pos: "동사" } ],
    slots: { det: ["새", "이", "그", "저"],
             noun: ["옷", "가방", "모자", "자전거"],
             verb: ["샀다", "좋아한다"] },
    explain: "'{det}'은(는) 뒤의 명사 '{noun}'을(를) 꾸며 주고 모양이 바뀌지 않으니까 관형사예요." },

  { id: "gen-pos-adj",
    tokens: [
      { slot: "noun", pos: "명사" }, { text: "(이/가)", pos: "조사", attach: true },
      { slot: "adv", pos: "부사" }, { slot: "adj", pos: "형용사" } ],
    slots: { adv: ["매우", "정말", "아주", "무척"] },
    groups: [
      { noun: "하늘", adj: "파랗다" },
      { noun: "꽃", adj: "예쁘다" },
      { noun: "바람", adj: "차갑다" },
      { noun: "강아지", adj: "귀엽다" },
      { noun: "방", adj: "깨끗하다" }
    ],
    explain: "'{adj}'는 상태를 나타내니까 형용사예요. '{adv}'는 '{adj}'를 꾸며 주는 부사예요." },

  { id: "gen-pos-verb",
    tokens: [
      { slot: "who", pos: "명사" }, { text: "(이/가)", pos: "조사", attach: true },
      { slot: "adv", pos: "부사" }, { slot: "verb", pos: "동사" } ],
    slots: { who: ["동생", "친구", "고양이", "민수"],
             adv: ["빨리", "천천히"],
             verb: ["달린다", "걷는다", "뛴다"] },
    explain: "'{verb}'는 움직임을 나타내니까 동사예요. '{adv}'는 '{verb}'를 꾸며 주는 부사예요." },

  { id: "gen-pos-num",
    tokens: [
      { slot: "a", pos: "수사" }, { text: "에", pos: "조사", attach: true },
      { slot: "b", pos: "수사" }, { text: "(을/를)", pos: "조사", attach: true },
      { text: "더하면", pos: "동사" },
      { slot: "c", pos: "수사" }, { text: "이다", pos: "조사", attach: true } ],
    groups: [
      { a: "하나", b: "둘", c: "셋" },
      { a: "둘", b: "셋", c: "다섯" },
      { a: "셋", b: "넷", c: "일곱" },
      { a: "넷", b: "다섯", c: "아홉" },
      { a: "둘", b: "둘", c: "넷" }
    ],
    explain: "'{a}', '{b}', '{c}'은(는) 뒤에 조사가 붙어 수량을 나타내니까 수사예요. '이다'는 서술격 조사예요." },

  { id: "gen-pos-intj",
    tokens: [
      { slot: "intj", pos: "감탄사" }, { text: ",", pos: null, attach: true },
      { slot: "noun", pos: "명사" }, { text: "(이/가)", pos: "조사", attach: true },
      { slot: "verb", pos: "동사" } ],
    slots: { intj: ["와", "앗", "어머"] },
    groups: [
      { noun: "비", verb: "온다" },
      { noun: "눈", verb: "온다" },
      { noun: "버스", verb: "온다" },
      { noun: "꽃", verb: "피었다" }
    ],
    explain: "'{intj}'는 놀람이나 느낌을 나타내는 감탄사예요. '{verb}'는 움직임을 나타내는 동사예요." },

  { id: "gen-pos-pron",
    tokens: [
      { slot: "pron", pos: "대명사" }, { text: "(은/는)", pos: "조사", attach: true },
      { slot: "noun", pos: "명사" }, { text: "이다", pos: "조사", attach: true } ],
    slots: { pron: ["나", "너", "그", "우리"],
             noun: ["학생", "중학생", "반장"] },
    explain: "'{pron}'은(는) 사람을 가리키는 대명사예요. '이다'는 명사에 붙는 서술격 조사예요." }
];
