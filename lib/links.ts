/**
 * 작품 링크로 써도 되는 주소인지 검사
 *  - 사이트 안 주소: '/'로 시작 (단 '//'는 다른 사이트로 가는 주소라 막음)
 *  - 바깥 주소: 'https://'로 시작
 *  - 'javascript:' 같은 위험한 주소는 모두 막음
 * (DB의 check 제약과 같은 규칙)
 */
export function isSafeLink(url: string): boolean {
  return /^\/[^/\\]/.test(url) || /^https:\/\//.test(url);
}
