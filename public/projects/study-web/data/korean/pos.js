// 품사 문제 은행 (23문제)
// attach: true → 화면에서 앞 단어에 붙여 보여 줌 (조사, 문장부호)
// pos: null → 문장부호, 문제에서 제외
window.QUESTION_BANK = window.QUESTION_BANK || {};
window.QUESTION_BANK["korean/pos"] = [
  { id: "pos-001", tokens: [
      { text: "나", pos: "대명사" }, { text: "는", pos: "조사", attach: true },
      { text: "새", pos: "관형사" }, { text: "책", pos: "명사" }, { text: "을", pos: "조사", attach: true },
      { text: "읽었다", pos: "동사" } ],
    explain: "'새'는 뒤의 명사 '책'을 꾸며 주고 모양이 바뀌지 않는 관형사예요. '읽었다'는 행동이라서 동사예요." },
  { id: "pos-002", tokens: [
      { text: "와", pos: "감탄사" }, { text: ",", pos: null, attach: true },
      { text: "하늘", pos: "명사" }, { text: "이", pos: "조사", attach: true },
      { text: "정말", pos: "부사" }, { text: "파랗다", pos: "형용사" } ],
    explain: "'와'는 놀람을 나타내는 감탄사, '정말'은 '파랗다'를 꾸미는 부사, '파랗다'는 상태를 나타내는 형용사예요." },
  { id: "pos-003", tokens: [
      { text: "둘", pos: "수사" }, { text: "이", pos: "조사", attach: true },
      { text: "함께", pos: "부사" }, { text: "왔다", pos: "동사" } ],
    explain: "'둘'은 뒤에 조사 '이'가 붙어 있어서 수량을 나타내는 수사예요. '두 명'의 '두'처럼 명사를 꾸미면 관형사예요." },
  { id: "pos-004", tokens: [
      { text: "동생", pos: "명사" }, { text: "이", pos: "조사", attach: true },
      { text: "밥", pos: "명사" }, { text: "을", pos: "조사", attach: true },
      { text: "먹는다", pos: "동사" } ],
    explain: "'먹는다'는 움직임을 나타내고 '-는다'가 자연스럽게 붙으니까 동사예요." },
  { id: "pos-005", tokens: [
      { text: "우리", pos: "대명사" }, { text: "는", pos: "조사", attach: true },
      { text: "저", pos: "관형사" }, { text: "집", pos: "명사" }, { text: "에", pos: "조사", attach: true },
      { text: "산다", pos: "동사" } ],
    explain: "'저'가 뒤의 명사 '집'을 꾸며 주면 관형사예요. '저는 학생이에요'처럼 자기를 가리키면 대명사예요." },
  { id: "pos-006", tokens: [
      { text: "꽃", pos: "명사" }, { text: "이", pos: "조사", attach: true },
      { text: "매우", pos: "부사" }, { text: "예쁘다", pos: "형용사" } ],
    explain: "'예쁘다'는 상태를 나타내고 '예쁜다'라고 하면 어색하니까 형용사예요. '매우'는 '예쁘다'를 꾸미는 부사예요." },
  { id: "pos-007", tokens: [
      { text: "그", pos: "대명사" }, { text: "는", pos: "조사", attach: true },
      { text: "학생", pos: "명사" }, { text: "이다", pos: "조사", attach: true } ],
    explain: "'그'는 사람을 가리키고 조사 '는'이 붙었으니 대명사예요. '이다'는 서술격 조사예요." },
  { id: "pos-008", tokens: [
      { text: "이", pos: "관형사" }, { text: "책", pos: "명사" }, { text: "은", pos: "조사", attach: true },
      { text: "재미있다", pos: "형용사" } ],
    explain: "'이'가 뒤의 명사 '책'을 꾸며 주니까 관형사예요. '재미있다'는 상태를 나타내는 형용사예요." },
  { id: "pos-009", tokens: [
      { text: "사과", pos: "명사" }, { text: "세", pos: "관형사" },
      { text: "개", pos: "명사" }, { text: "를", pos: "조사", attach: true },
      { text: "샀다", pos: "동사" } ],
    explain: "'세'는 뒤의 '개'를 꾸며 주는 관형사예요. 조사가 붙는 '셋'이었다면 수사예요. '개'는 단위를 나타내는 의존 명사예요." },
  { id: "pos-010", tokens: [
      { text: "셋", pos: "수사" }, { text: "에", pos: "조사", attach: true },
      { text: "하나", pos: "수사" }, { text: "를", pos: "조사", attach: true },
      { text: "더하면", pos: "동사" },
      { text: "넷", pos: "수사" }, { text: "이다", pos: "조사", attach: true } ],
    explain: "'셋', '하나', '넷'은 모두 뒤에 조사가 붙어 수량을 나타내니까 수사예요. '더하면'은 '더하다'라는 동사예요." },
  { id: "pos-011", tokens: [
      { text: "아", pos: "감탄사" }, { text: ",", pos: null, attach: true },
      { text: "너무", pos: "부사" }, { text: "춥다", pos: "형용사" } ],
    explain: "'아'는 느낌을 나타내는 감탄사, '너무'는 '춥다'를 꾸미는 부사, '춥다'는 상태를 나타내는 형용사예요." },
  { id: "pos-012", tokens: [
      { text: "친구", pos: "명사" }, { text: "가", pos: "조사", attach: true },
      { text: "빨리", pos: "부사" }, { text: "달린다", pos: "동사" } ],
    explain: "'빨리'는 '달린다'를 꾸며 주는 부사예요. '달린다'는 움직임이라서 동사예요." },
  { id: "pos-013", tokens: [
      { text: "여기", pos: "대명사" }, { text: "는", pos: "조사", attach: true },
      { text: "조용하다", pos: "형용사" } ],
    explain: "'여기'는 장소를 가리키는 대명사예요. '조용하다'는 상태를 나타내는 형용사예요." },
  { id: "pos-014", tokens: [
      { text: "어머나", pos: "감탄사" }, { text: ",", pos: null, attach: true },
      { text: "비", pos: "명사" }, { text: "가", pos: "조사", attach: true },
      { text: "온다", pos: "동사" } ],
    explain: "'어머나'는 놀람을 나타내는 감탄사예요. '온다'는 움직임을 나타내는 동사예요." },
  { id: "pos-015", tokens: [
      { text: "그", pos: "관형사" }, { text: "사람", pos: "명사" }, { text: "은", pos: "조사", attach: true },
      { text: "키", pos: "명사" }, { text: "가", pos: "조사", attach: true },
      { text: "크다", pos: "형용사" } ],
    explain: "여기서 '그'는 뒤의 '사람'을 꾸며 주니까 관형사예요. '그는'처럼 조사가 붙으면 대명사예요. '크다'는 상태라서 형용사예요." },
  { id: "pos-016", tokens: [
      { text: "첫째", pos: "수사" }, { text: "는", pos: "조사", attach: true },
      { text: "언니", pos: "명사" }, { text: "이다", pos: "조사", attach: true } ],
    explain: "'첫째'는 순서를 나타내고 조사 '는'이 붙었으니 수사예요." },
  { id: "pos-017", tokens: [
      { text: "오늘", pos: "명사" }, { text: "은", pos: "조사", attach: true },
      { text: "날씨", pos: "명사" }, { text: "가", pos: "조사", attach: true },
      { text: "맑다", pos: "형용사" } ],
    explain: "'오늘'에 조사 '은'이 붙었으니 명사예요. '맑다'는 상태를 나타내는 형용사예요." },
  { id: "pos-018", tokens: [
      { text: "나", pos: "대명사" }, { text: "는", pos: "조사", attach: true },
      { text: "오늘", pos: "부사" },
      { text: "학교", pos: "명사" }, { text: "에", pos: "조사", attach: true },
      { text: "갔다", pos: "동사" } ],
    explain: "여기서 '오늘'은 조사 없이 '갔다'를 꾸며 주니까 부사예요. '오늘은'처럼 조사가 붙으면 명사예요." },
  { id: "pos-019", tokens: [
      { text: "모든", pos: "관형사" }, { text: "학생", pos: "명사" }, { text: "이", pos: "조사", attach: true },
      { text: "열심히", pos: "부사" }, { text: "공부한다", pos: "동사" } ],
    explain: "'모든'은 뒤의 '학생'을 꾸미는 관형사, '열심히'는 '공부한다'를 꾸미는 부사예요." },
  { id: "pos-020", tokens: [
      { text: "우리", pos: "대명사" }, { text: "는", pos: "조사", attach: true },
      { text: "작은", pos: "형용사" },
      { text: "집", pos: "명사" }, { text: "에", pos: "조사", attach: true },
      { text: "산다", pos: "동사" } ],
    explain: "'작은'은 명사를 꾸미지만 '작다'의 모양이 바뀐 것이라서 형용사예요. 관형사는 모양이 바뀌지 않아요." },
  { id: "pos-021", tokens: [
      { text: "응", pos: "감탄사" }, { text: ",", pos: null, attach: true },
      { text: "나", pos: "대명사" }, { text: "도", pos: "조사", attach: true },
      { text: "갈래", pos: "동사" } ],
    explain: "'응'은 대답을 나타내는 감탄사예요. '도'는 뜻을 더해 주는 조사예요." },
  { id: "pos-022", tokens: [
      { text: "고양이", pos: "명사" }, { text: "가", pos: "조사", attach: true },
      { text: "천천히", pos: "부사" }, { text: "걷는다", pos: "동사" } ],
    explain: "'천천히'는 '걷는다'를 꾸미는 부사예요. '걷는다'는 움직임을 나타내는 동사예요." },
  { id: "pos-023", tokens: [
      { text: "동생", pos: "명사" }, { text: "과", pos: "조사", attach: true },
      { text: "나", pos: "대명사" }, { text: "는", pos: "조사", attach: true },
      { text: "둘", pos: "수사" }, { text: "이다", pos: "조사", attach: true } ],
    explain: "'둘'에 서술격 조사 '이다'가 붙었으니 수사예요. '과'는 두 말을 이어 주는 조사예요." }
];
