// "무엇을 쓰면 되는지" 안내 문구 — supabase/schema.sql 의 seed 와 같은 문장
// 입력창 placeholder, 새 카드의 처음 내용, 빈 칸 표시에 함께 써요.

/**
 * 보는 화면에 보여줄 값.
 * 이미 고친 카드(예시가 아닌 카드)에 안내 문구가 그대로 남은 칸은 빈 칸으로 취급해요.
 * (예시 카드는 처음 안내를 위해 그대로 보여줘요)
 */
export function shown(value: string, guide: string, isSample: boolean): string {
  return !isSample && value === guide ? "" : value;
}

export const PROFILE_GUIDE = {
  name: "여기에 이름이나 닉네임을 적어요",
  tagline: "나를 한 줄로 소개해요",
  keyword: "예: 게임, 코딩",
  avatar: "내 사진이나 좋아하는 그림을 올려요 (얼굴이 꼭 아니어도 돼요)",
};

export const AWARD_GUIDE = {
  title: "대회나 행사 이름을 적어요 (예: ○○시 학생 코딩 대회)",
  prize: "받은 상을 적어요 (예: 금상, 우수상, 2등)",
  organizer: "상을 준 곳을 적어요 (예: ○○교육청, ○○학교)",
  awarded_on: "상 받은 날짜를 골라요",
  description: "어떤 활동을 했고 무엇을 배웠는지 1~2문장으로 적어요",
  image: "상장이나 활동 사진을 올려요 (개인정보는 가리고!)",
};

export const CERTIFICATE_GUIDE = {
  name: "자격증 이름을 적어요 (예: 컴퓨터활용능력 2급, 한국사능력검정 3급)",
  issuer: "자격증을 준 곳을 적어요 (예: 대한상공회의소)",
  acquired_on: "합격한 날짜를 골라요",
  memo: "준비하면서 느낀 점이나 점수를 적어도 좋아요 (선택)",
  image: "자격증 사진을 올려요 (자격증 번호·생년월일은 가리기!)",
};

export const INTEREST_GUIDE = {
  emoji: "관심사를 나타내는 이모지를 골라요 (예: 🎮 📚 ⚽ 💻)",
  title: "관심 있는 것을 짧게 적어요 (예: 닌텐도 게임, 코딩, 축구)",
  description: "왜 좋아하는지, 요즘 무엇을 하고 있는지 적어요",
  image: "관련 사진을 올려요 (선택)",
};

export const PROJECT_GUIDE = {
  title: "작품 이름을 적어요 (예: 미니 도감, 타자 연습 게임)",
  summary: "무엇을 하는 작품인지 한 문장으로 적어요",
  tag: "사용한 기술이나 도구를 적어요 (예: HTML, 스크래치, 파이썬)",
  link_url: "작품 주소를 적어요 (예: /projects/파일이름.html 또는 https://...)",
  image: "작품 화면을 캡처해서 올려요",
};
