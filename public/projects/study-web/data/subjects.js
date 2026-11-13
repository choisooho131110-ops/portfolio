// 과목 목록
// 새 과목을 추가하려면 이 배열에 항목을 하나 더 적으면 된다.
//   type       : 문제 화면 종류 ("pos" = 품사 분류, "choice" = 객관식)
//   bank       : window.QUESTION_BANK 에서 쓸 이름 (배열이면 여러 은행을 합침)
//   generators : window.GENERATORS 에서 쓸 이름 (없으면 은행 문제만)
window.SUBJECTS = [
  {
    id: "korean",
    name: "국어",
    icon: "📖",
    topics: [
      { id: "pos",     name: "품사",     type: "pos",    bank: "korean/pos",     generators: "korean/pos" },
      { id: "spacing", name: "띄어쓰기", type: "choice", bank: "korean/spacing", generators: "korean/spacing" }
    ]
  },
  {
    id: "social",
    name: "사회",
    icon: "🌏",
    topics: [
      { id: "culture",       name: "다양한 문화의 이해",   type: "choice", bank: "social/culture" },
      { id: "democracy",     name: "민주주의와 시민",     type: "choice", bank: "social/democracy" },
      { id: "participation", name: "정치 과정과 시민 참여", type: "choice", bank: "social/participation" },
      { id: "all",           name: "전체 섞어 풀기",      type: "choice", bank: ["social/culture", "social/democracy", "social/participation"] }
    ]
  },
  {
    id: "science",
    name: "과학",
    icon: "🔬",
    topics: [
      { id: "gas-state", name: "기체의 성질과 상태 변화", type: "choice", bank: "science/gas-state" },
      { id: "solar",     name: "태양계",                 type: "choice", bank: "science/solar-system" },
      { id: "all",       name: "전체 섞어 풀기",          type: "choice", bank: ["science/gas-state", "science/solar-system"] }
    ]
  },
  {
    id: "english",
    name: "영어",
    icon: "🔤",
    topics: [
      { id: "to-infinitive",      name: "to부정사의 부사적 용법",        type: "choice", bank: "english/to-infinitive" },
      { id: "to-infinitive-hard", name: "to부정사의 부사적 용법 · 심화", type: "choice", bank: "english/to-infinitive-hard" },
      { id: "time-clause",        name: "시간 부사절",                  type: "choice", bank: "english/time-clause" },
      { id: "time-clause-hard",   name: "시간 부사절 · 심화",           type: "choice", bank: "english/time-clause-hard" },
      { id: "dative-verb",        name: "수여동사",                     type: "choice", bank: "english/dative-verb" },
      { id: "dative-verb-hard",   name: "수여동사 · 심화",              type: "choice", bank: "english/dative-verb-hard" },
      { id: "all",                name: "전체 섞어 풀기",                type: "choice",
        bank: ["english/to-infinitive", "english/to-infinitive-hard", "english/time-clause", "english/time-clause-hard", "english/dative-verb", "english/dative-verb-hard"] },
      { id: "hard-all",           name: "심화만 섞어 풀기",              type: "choice",
        bank: ["english/to-infinitive-hard", "english/time-clause-hard", "english/dative-verb-hard"] }
    ]
  }
  // 나중에: { id: "math", name: "수학", icon: "📐", topics: [...] }
];
