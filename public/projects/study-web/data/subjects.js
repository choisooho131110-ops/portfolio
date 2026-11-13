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
  }
  // 나중에: { id: "math", name: "수학", icon: "📐", topics: [...] }
];
