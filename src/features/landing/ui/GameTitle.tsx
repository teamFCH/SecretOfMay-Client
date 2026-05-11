export function GameTitle() {
  return (
    <div className="text-center animate-in-1">
      {/* 메인 타이틀 */}
      <h1 className="font-serif font-black text-[clamp(36px,8vw,62px)] leading-tight tracking-[0.02em] text-parchment mb-3">
        오월의 비밀을 풀어라
      </h1>

      {/* 영문 서브타이틀 */}
      <p className="font-mono text-[11px] tracking-[0.6em] uppercase text-parchment-muted mb-7">
        Secret&nbsp;&nbsp;of&nbsp;&nbsp;May&nbsp;&nbsp;1980
      </p>

      {/* 설명 문구 */}
      <div className="font-mono text-[14px] sm:text-[16px] leading-loose sm:leading-[2.2] text-parchment-dim space-y-1">
        <p>
          1980년 5월, 광주. 모든 기록이{" "}
          <span className="text-blood-bright font-mono">[ 삭 제 ]</span>
          되었습니다.
        </p>
        <p>
          흩어진 단어들을 복원하여 <span className="text-blood-bright font-mono">[ 진 실 ]</span>을
          되찾으십시오.
        </p>
      </div>
    </div>
  );
}
