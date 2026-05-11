export interface HistoricalRecord {
  entryId: string;
  word: string;
  category: string;
  date: string;
  source: string;
  headline: string;
  body: string;
}

/**
 * 낱말 퍼즐 각 entry ID → 역사 기록 문서.
 * 단어 완성 시 오버레이로 표시된다.
 */
export const HISTORICAL_RECORDS: Record<string, HistoricalRecord> = {
  "1-across": {
    entryId: "1-across",
    word: "전두환",
    category: "기밀 문서",
    date: "1979.12.13",
    source: "5·18 민주화운동 진상조사 보고서, 1995",
    headline: "신군부의 집권 모의",
    body: "전두환 소장과 하나회 핵심 멤버들은 12·12 군사반란 직후부터 정권 장악을 치밀하게 준비하였다. 최규하 대통령의 재가 없이 계엄사령관을 연행한 이 반란은, 이후 광주 유혈 진압의 기나긴 출발점이었다.",
  },

  "2-down": {
    entryId: "2-down",
    word: "시민군",
    category: "증언 기록",
    date: "1980.05.21",
    source: "생존 시민군 박형선 증언, 1988",
    headline: '"우리는 스스로를 지켜야 했습니다"',
    body: "공수부대가 총을 쐈습니다. 사람들이 쓰러지는 것을 직접 봤어요. 그 자리에서 우리는 무기를 들기로 결심했습니다. 군인들이 와도 도망가지 말고 도청을 끝까지 지키자고요.",
  },

  "3-across": {
    entryId: "3-across",
    word: "계엄",
    category: "공문서",
    date: "1980.05.17",
    source: "비상계엄 포고령 제10호, 1980.05.17",
    headline: "비상계엄 전국 확대 포고령",
    body: "계엄사령관 이희성은 포고한다. 모든 정치 활동을 즉각 중지한다. 언론·출판·방송은 사전 검열을 받아야 한다. 집회 및 시위는 일절 금한다. 위반자는 계엄법에 의해 처단한다.",
  },

  "4-across": {
    entryId: "4-across",
    word: "민주화",
    category: "선언문",
    date: "1980.05.18",
    source: "광주 시민 민주화 선언문, 1980.05.18",
    headline: "우리의 피와 눈물로",
    body: "우리는 민주주의를 원한다. 군부 독재를 거부한다. 어떠한 탄압도 우리의 의지를 꺾을 수 없다. 자유와 민주주의를 위해 끝까지 싸울 것이다. 역사는 반드시 우리 편임을 믿는다.",
  },

  "5-across": {
    entryId: "5-across",
    word: "금남로",
    category: "현장 기록",
    date: "1980.05.18",
    source: "목격자 현장 기록, 1980.05.18",
    headline: "금남로에서 총성이 울렸다",
    body: "오후 2시경, 금남로 3가 일대. 공수부대가 진압봉으로 시위대를 향해 돌격하기 시작했다. 거리는 순식간에 최루가스와 피의 냄새로 가득 찼다. 시민들은 흩어졌다가 다시 모였다.",
  },

  "6-across": {
    entryId: "6-across",
    word: "저항",
    category: "유인물",
    date: "1980.05.20",
    source: "5·18 당시 배포된 시민 유인물, 1980.05.20",
    headline: "굴복하지 않는다",
    body: "부당한 권력에 굴복하는 것은 역사에 죄를 짓는 것이다. 우리 광주 시민들은 조국의 민주화를 위해 끝까지 싸울 것임을 선언한다. 두려움이 우리를 지배하게 두지 않겠다.",
  },

  "7-down": {
    entryId: "7-down",
    word: "항쟁",
    category: "결정문",
    date: "2011.05.25",
    source: "UNESCO 세계기록유산 등재 결정문, 2011",
    headline: "인류의 기억이 되다",
    body: "5·18민주화운동 기록물은 인류 보편적 가치인 민주주의·인권·평화를 향한 투쟁의 역사적 증거로, 그 진정성과 세계적 중요성이 탁월하게 인정된다.",
  },

  "8-across": {
    entryId: "8-across",
    word: "광주",
    category: "방송 원고",
    date: "1980.05.20",
    source: "광주MBC 긴급 방송 원고, 1980.05.20",
    headline: "광주를 구해주십시오",
    body: "지금 우리 광주에서는 이유도 모른 채 많은 시민들이 죽어가고 있습니다. 우리를 도와주십시오. 대한민국이 광주를 외면하지 말아주십시오. 광주 시민들은 지금도 싸우고 있습니다.",
  },

  "9-across": {
    entryId: "9-across",
    word: "도청",
    category: "최후 증언",
    date: "1980.05.27",
    source: "도청 최후 항전 생존자 이지양 증언, 1988",
    headline: "새벽, 마지막 방송",
    body: '"지금 계엄군이 쳐들어오고 있습니다. 사랑하는 광주 시민 여러분, 우리들의 핏값을 잊지 말아주십시오." 방송이 끊긴 뒤 총성이 들려왔다. 5월 27일 새벽 4시, 도청은 함락되었다.',
  },
};
