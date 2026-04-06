import type { PocRecipe } from "./types";

export interface PocRecipeEntry {
  recipe: PocRecipe;
  videoId: string;
}

const AGLIO_OLIO: PocRecipeEntry = {
  videoId: "eUkwkkRKdfY",
  recipe: {
    title: "알리오 올리오",
    description:
      "가격은 초저렴하고 맛은 고급스러운, 누구나 쉽게 따라 할 수 있는 강레오 셰프의 알리오 올리오 레시피입니다.",
    servings: null,
    cookingTimeMinutes: null,
    difficulty: "쉬움",
    category: "양식",
    ingredients: [
      {
        name: "스파게티 면",
        amount: { value: null, unit: null },
        substitute: null,
        selectionTip: "오늘좋은 3분 완성 스파게티",
      },
      {
        name: "엑스트라 버진 올리브유",
        amount: { value: null, unit: null },
        substitute: null,
        selectionTip: "스페인산 오늘좋은 엑스트라버진 올리브유",
      },
      {
        name: "통마늘",
        amount: { value: null, unit: null },
        substitute: null,
        selectionTip: null,
      },
      {
        name: "페페론치노 고추",
        amount: { value: null, unit: null },
        substitute: null,
        selectionTip: null,
      },
      {
        name: "가염 버터",
        amount: { value: null, unit: null },
        substitute: null,
        selectionTip: null,
      },
      {
        name: "파슬리",
        amount: { value: null, unit: null },
        substitute: null,
        selectionTip: null,
      },
      {
        name: "소금",
        amount: { value: null, unit: null },
        substitute: null,
        selectionTip: null,
      },
      {
        name: "후추",
        amount: { value: null, unit: null },
        substitute: null,
        selectionTip: null,
      },
    ],
    tools: [
      { name: "프라이팬" },
      { name: "도마" },
      { name: "칼" },
      { name: "가스레인지" },
      { name: "냄비" },
      { name: "집게" },
      { name: "조리용 주걱" },
      { name: "채망" },
      { name: "믹서기" },
      { name: "국자" },
    ],
    steps: [
      {
        order: 1,
        title: "프라이팬에 올리브유와 다진 재료 넣기",
        description: [
          { content: "프라이팬에 올리브유를 부어주세요.", start: "00:04:53" },
          {
            content: "페페론치노 고추를 칼로 잘게 썰어주세요.",
            start: "00:04:59",
          },
          {
            content: "통마늘을 칼로 편 썬 후 다시 잘게 다져주세요.",
            start: "00:05:01",
          },
          {
            content: "다진 마늘과 썬 고추를 프라이팬에 넣어주세요.",
            start: "00:05:30",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "프라이팬에 올리브유 붓기", start: "00:04:53", end: "00:04:59" },
          { label: "페페론치노 고추 잘게 썰기", start: "00:04:59", end: "00:05:01" },
          { label: "통마늘 편 썰기", start: "00:05:01", end: "00:05:12" },
          { label: "썬 마늘 잘게 다지기", start: "00:05:12", end: "00:05:30" },
          { label: "팬에 다진 마늘과 고추 넣기", start: "00:05:30", end: "00:05:38" },
        ],
        timerSeconds: null,
      },
      {
        order: 2,
        title: "저온에서 마늘 볶고 버터 녹이기",
        description: [
          {
            content: "프라이팬을 가스레인지 위에 올려 저온에서 마늘을 볶아주세요.",
            start: "00:05:50",
          },
          {
            content: "버터를 칼로 썰어 팬에 넣고 녹여주세요.",
            start: "00:06:00",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "저온에서 마늘 볶기", start: "00:05:50", end: "00:06:00" },
          { label: "버터 썰기", start: "00:06:00", end: "00:06:04" },
          { label: "팬에 썬 버터 넣고 녹이기", start: "00:06:04", end: "00:06:08" },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "끓는 물에 파슬리, 으깬 마늘, 면 넣고 삶기",
        description: [
          {
            content: "파슬리의 줄기 부분만 따로 떼어내어 끓는 물이 든 냄비에 넣어주세요.",
            start: "00:06:12",
          },
          { content: "통마늘을 칼등으로 으깨어 냄비에 넣어주세요.", start: "00:06:30" },
          { content: "냄비에 스파게티 면을 넣고 삶아주세요.", start: "00:06:36" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "파슬리 줄기 떼어내기", start: "00:06:12", end: "00:06:22" },
          { label: "끓는 물에 파슬리 줄기 넣기", start: "00:06:22", end: "00:06:30" },
          { label: "통마늘 으깨기", start: "00:06:30", end: "00:06:35" },
          { label: "냄비에 으깬 마늘 넣기", start: "00:06:35", end: "00:06:36" },
          { label: "냄비에 스파게티 면 넣기", start: "00:06:36", end: "00:06:40" },
        ],
        timerSeconds: null,
      },
      {
        order: 4,
        title: "프라이팬에 삶은 면과 파슬리 넣고 섞어 접시에 담기",
        description: [
          {
            content: "집게를 사용하여 냄비에서 삶아진 면을 건져내어 프라이팬에 넣어주세요.",
            start: "00:07:39",
          },
          {
            content: "집게와 주걱을 사용해 팬 안의 면과 소스를 섞어주세요.",
            start: "00:07:47",
          },
          {
            content: "팬에 다진 파슬리 잎을 넣고 면과 함께 고루 섞어주세요.",
            start: "00:07:50",
          },
          {
            content: "주걱을 사용해 완성된 파스타를 접시에 옮겨 담고, 추가로 다진 마늘을 올려 섞어주세요.",
            start: "00:08:00",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "삶아진 면 건져내기", start: "00:07:39", end: "00:07:44" },
          { label: "프라이팬에 삶은 면 넣기", start: "00:07:44", end: "00:07:47" },
          { label: "팬 안의 면과 소스 섞기", start: "00:07:47", end: "00:07:50" },
          { label: "팬에 다진 파슬리 잎 넣기", start: "00:07:50", end: "00:07:52" },
          { label: "면과 파슬리 고루 섞어주기", start: "00:07:52", end: "00:08:00" },
          { label: "완성된 파스타 접시에 담기", start: "00:08:00", end: "00:08:14" },
          { label: "접시에 다진 마늘 올리고 섞기", start: "00:08:14", end: "00:08:24" },
        ],
        timerSeconds: null,
      },
      {
        order: 5,
        title: "마늘 데친 후 믹서기에 올리브유와 함께 갈아주기 (심화 소스)",
        description: [
          {
            content: "통마늘을 반으로 자른 후 손으로 마늘의 싹 부분을 제거해주세요.",
            start: "00:09:41",
          },
          { content: "채망에 담긴 마늘을 끓는 물에 넣어 데쳐주세요.", start: "00:10:01" },
          {
            content: "데친 마늘을 믹서기에 넣고 올리브유, 소금, 후추를 추가하여 갈아주세요.",
            start: "00:10:12",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "마늘 반으로 자르기", start: "00:09:41", end: "00:09:52" },
          { label: "마늘 싹 제거하기", start: "00:09:52", end: "00:10:00" },
          { label: "끓는 물에 마늘 데치기", start: "00:10:01", end: "00:10:06" },
          { label: "데친 마늘 믹서기에 넣기", start: "00:10:12", end: "00:10:17" },
          { label: "믹서기에 재료 넣고 갈아주기", start: "00:10:17", end: "00:10:30" },
        ],
        timerSeconds: null,
      },
      {
        order: 6,
        title: "갈아둔 마늘 소스에 면수 추가 후 면과 볶기 (심화 완성)",
        description: [
          {
            content: "냄비에서 면수를 떠서 믹서기에 추가하고 다시 한번 갈아주세요.",
            start: "00:10:52",
          },
          {
            content: "프라이팬에 스파게티 면과 갈아놓은 마늘 소스를 넣고 섞으며 볶아주세요.",
            start: "00:11:15",
          },
          { content: "완성된 파스타를 접시에 담아주세요.", start: "00:11:58" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "믹서기에 면수 추가하고 갈아주기", start: "00:10:52", end: "00:11:15" },
          { label: "팬에 면과 마늘 소스 섞으며 볶기", start: "00:11:15", end: "00:11:58" },
          { label: "완성된 파스타 접시에 담기", start: "00:11:58", end: "00:12:30" },
        ],
        timerSeconds: null,
      },
    ],
    servingTip: null,
  },
};

const CHADOL_DOENJANG: PocRecipeEntry = {
  videoId: "klFhbUssB60",
  recipe: {
    title: "차돌 된장 술밥",
    description:
      "따뜻한 국물이 생각나는 요즘 날씨에 먹기 딱 좋은 차돌 된장 술밥입니다. 밥과 함께 먹어도, 술과 함께 먹어도 훌륭합니다.",
    servings: null,
    cookingTimeMinutes: null,
    difficulty: "쉬움",
    category: "한식",
    ingredients: [
      { name: "차돌박이", amount: { value: 200, unit: "g" }, substitute: null, selectionTip: null },
      { name: "두부", amount: { value: 0.5, unit: "모" }, substitute: null, selectionTip: null },
      { name: "애호박", amount: { value: 0.33, unit: "개" }, substitute: null, selectionTip: null },
      { name: "양파", amount: { value: 0.5, unit: "개" }, substitute: null, selectionTip: null },
      { name: "대파", amount: { value: 1, unit: "대" }, substitute: null, selectionTip: null },
      { name: "마늘", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "된장", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고추장", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고춧가루", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "물", amount: { value: 500, unit: "ml" }, substitute: null, selectionTip: null },
      { name: "굴소스", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "참치액젓", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "공기밥", amount: { value: 1, unit: "공기" }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "프라이팬" },
      { name: "가스레인지" },
      { name: "칼" },
      { name: "도마" },
      { name: "나무 주걱" },
      { name: "뚝배기" },
      { name: "국자" },
    ],
    steps: [
      {
        order: 1,
        title: "채소 썰고 차돌박이 볶기",
        description: [
          { content: "프라이팬에 차돌박이를 한 점씩 올려주세요.", start: "00:00:20" },
          { content: "도마 위에서 두부를 깍둑썰기로 썰어주세요.", start: "00:00:30" },
          { content: "도마 위에서 애호박을 썰어주세요.", start: "00:00:40" },
          { content: "도마 위에서 양파를 썰어주세요.", start: "00:00:44" },
          { content: "도마 위에서 대파를 썰어주세요.", start: "00:00:46" },
          { content: "프라이팬에서 나무 주걱으로 차돌박이를 볶아주세요.", start: "00:00:48" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "차돌박이 올리기", start: "00:00:20", end: "00:00:30" },
          { label: "두부 썰기", start: "00:00:30", end: "00:00:40" },
          { label: "애호박 썰기", start: "00:00:40", end: "00:00:44" },
          { label: "양파 썰기", start: "00:00:44", end: "00:00:46" },
          { label: "대파 썰기", start: "00:00:46", end: "00:00:48" },
          { label: "차돌박이 볶기", start: "00:00:48", end: "00:00:52" },
        ],
        timerSeconds: null,
      },
      {
        order: 2,
        title: "차돌박이에 양념 넣고 볶기",
        description: [
          { content: "볶던 차돌박이에 마늘을 넣어주세요.", start: "00:00:52" },
          { content: "된장을 넣고 섞으며 볶아주세요.", start: "00:00:56" },
          { content: "고추장을 넣어주세요.", start: "00:01:03" },
          { content: "재료들을 고루 섞어 볶아주세요.", start: "00:01:08" },
          { content: "차돌박이 기름이 올라오면 고춧가루를 넣고 볶아주세요.", start: "00:01:14" },
        ],
        tip: "고춧가루를 넣고 볶을 때는 약불로 볶아주세요.",
        knowledge: null,
        scenes: [
          { label: "마늘 넣기", start: "00:00:52", end: "00:00:56" },
          { label: "된장 넣고 볶기", start: "00:00:56", end: "00:01:03" },
          { label: "고추장 넣기", start: "00:01:03", end: "00:01:08" },
          { label: "재료 섞어 볶기", start: "00:01:08", end: "00:01:14" },
          { label: "고춧가루 넣고 볶기", start: "00:01:14", end: "00:01:25" },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "물과 채소 넣고 찌개 끓이기",
        description: [
          { content: "프라이팬에 물을 부어주세요.", start: "00:01:25" },
          { content: "굴소스를 넣어 간을 맞춰주세요.", start: "00:01:30" },
          { content: "참치액을 넣어 간을 맞춰주세요.", start: "00:01:33" },
          { content: "썰어둔 양파, 애호박, 대파를 프라이팬에 모두 넣어주세요.", start: "00:01:38" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "물 붓기", start: "00:01:25", end: "00:01:30" },
          { label: "굴소스 넣기", start: "00:01:30", end: "00:01:33" },
          { label: "참치액 넣기", start: "00:01:33", end: "00:01:38" },
          { label: "양파, 애호박, 대파 넣기", start: "00:01:38", end: "00:01:44" },
        ],
        timerSeconds: null,
      },
      {
        order: 4,
        title: "두부 넣고 끓이기",
        description: [
          { content: "된장찌개가 끓어오르면 썰어둔 두부를 넣어주세요.", start: "00:02:13" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "두부 넣기", start: "00:02:13", end: "00:02:16" },
        ],
        timerSeconds: null,
      },
      {
        order: 5,
        title: "뚝배기에 밥과 찌개 넣고 끓이기",
        description: [
          { content: "뚝배기를 가스레인지 위에 올려주세요.", start: "00:02:30" },
          { content: "뚝배기에 밥을 넣어주세요.", start: "00:02:33" },
          { content: "국자로 프라이팬의 된장찌개를 뚝배기로 옮겨 담아주세요.", start: "00:02:35" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "뚝배기 올리기", start: "00:02:30", end: "00:02:33" },
          { label: "공기밥 넣기", start: "00:02:33", end: "00:02:35" },
          { label: "찌개 옮겨 담기", start: "00:02:35", end: "00:02:44" },
        ],
        timerSeconds: null,
      },
    ],
    servingTip:
      "뚝배기에 밥을 넣고 차돌 된장찌개를 부어 바글바글 끓이면서 드시면 더욱 맛있습니다.",
  },
};

const CHADOL_DOENJANG_V2: PocRecipeEntry = {
  videoId: "klFhbUssB60",
  recipe: {
    title: "차돌 된장 술밥 v2",
    description:
      "따뜻한 국물이 생각나는 요즘 날씨에 먹기 딱 좋은 '차돌 된장 술밥'!! 밥과 함께 먹어도, 술과 함께 먹어도 너무 훌륭하죠~",
    servings: null,
    cookingTimeMinutes: null,
    difficulty: "쉬움",
    category: "한식",
    ingredients: [
      { name: "차돌박이", amount: { value: 200, unit: "g" }, substitute: null, selectionTip: null },
      { name: "두부", amount: { value: 0.5, unit: "모" }, substitute: null, selectionTip: null },
      { name: "애호박", amount: { value: 0.33, unit: "개" }, substitute: null, selectionTip: null },
      { name: "양파", amount: { value: 0.5, unit: "개" }, substitute: null, selectionTip: null },
      { name: "대파", amount: { value: 1, unit: "대" }, substitute: null, selectionTip: null },
      { name: "마늘", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "된장", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고추장", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고춧가루", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "물", amount: { value: 500, unit: "ml" }, substitute: null, selectionTip: null },
      { name: "굴소스", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "참치액젓", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "밥", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "프라이팬" },
      { name: "도마" },
      { name: "칼" },
      { name: "나무 주걱" },
      { name: "국자" },
      { name: "뚝배기" },
    ],
    steps: [
      {
        order: 1,
        title: "프라이팬에 차돌박이 볶기",
        description: [
          {
            content: "프라이팬을 가스레인지 위에 올리고 중불에서 차돌박이를 넣어 구워주세요.",
            start: "00:00:20",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 2,
        title: "두부와 채소 썰기",
        description: [
          { content: "두부를 사방 1.5cm 정도의 한 입 크기로 깍둑썰기 해주세요.", start: "00:00:30" },
          {
            content: "애호박을 두부와 비슷한 크기로 작게 깍둑썰기(또는 부채꼴 썰기) 해주세요.",
            start: "00:00:40",
          },
          {
            content: "양파도 애호박, 두부와 비슷한 크기로 네모나게 썰어주세요.",
            start: "00:00:44",
          },
          { content: "대파를 0.5cm 두께로 송송(또는 어슷하게) 썰어주세요.", start: "00:00:46" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "두부 깍둑썰기",
            start: "00:00:30",
            end: "00:00:40",
          },
          {
            label: "애호박 썰기",
            start: "00:00:40",
            end: "00:00:44",
          },
          {
            label: "양파 썰기",
            start: "00:00:44",
            end: "00:00:46",
          },
          {
            label: "대파 썰기",
            start: "00:00:46",
            end: "00:00:49",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "차돌박이에 마늘과 양념 넣고 볶기",
        description: [
          {
            content: "프라이팬에서 굽고 있는 차돌박이를 나무 주걱으로 섞어주세요.",
            start: "00:00:49",
          },
          { content: "다진 마늘을 넣어주세요.", start: "00:00:52" },
          {
            content: "된장과 고추장을 차례로 넣고 재료들과 함께 볶아주세요.",
            start: "00:00:56",
          },
          {
            content:
              "차돌박이 기름이 올라오면 고춧가루를 넣고 약불에서 타지 않게 1분 정도 볶아 고추기름을 내주세요.",
            start: "00:01:10",
          },
        ],
        tip: "고춧가루를 넣고 볶을 때는 꼭 약불로 조절해 주세요.",
        knowledge: null,
        scenes: [
          {
            label: "고춧가루 넣고 볶기",
            start: "00:01:10",
            end: "00:01:25",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 4,
        title: "물 붓고 채소와 두부 넣어 끓이기",
        description: [
          { content: "프라이팬에 물을 부어주세요.", start: "00:01:25" },
          { content: "굴소스와 참치액젓을 넣어 간을 맞춰주세요.", start: "00:01:30" },
          {
            content:
              "썰어둔 양파, 애호박, 대파를 모두 넣고 중불에서 애호박이 반투명하게 익을 때까지 끓여주세요.",
            start: "00:01:38",
          },
          {
            content:
              "된장찌개가 끓어오르면 두부를 넣고 2~3분간 더 끓여 두부에 간이 배게 해주세요.",
            start: "00:02:13",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "채소 넣고 끓이기",
            start: "00:01:44",
            end: "00:02:13",
          },
          {
            label: "두부 넣고 끓이기",
            start: "00:02:13",
            end: "00:02:24",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 5,
        title: "뚝배기에 밥과 된장찌개 담기",
        description: [
          {
            content: "뚝배기에 밥을 넣고 끓인 된장찌개를 국자로 떠서 담아주세요.",
            start: "00:02:33",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
    ],
    servingTip:
      "뚝배기에 밥과 차돌 된장찌개를 넣고 바글바글 끓이면서 드시면 더욱 맛있습니다.",
  },
};

const CHADOL_DOENJANG_V3: PocRecipeEntry = {
  videoId: "klFhbUssB60",
  recipe: {
    title: "차돌 된장 술밥 v3",
    description:
      "따뜻한 국물이 생각나는 요즘 날씨에 먹기 딱 좋은 차돌 된장 술밥",
    servings: null,
    cookingTimeMinutes: null,
    difficulty: "쉬움",
    category: "찌개",
    ingredients: [
      { name: "차돌박이", amount: { value: 200, unit: "g" }, substitute: null, selectionTip: null },
      { name: "두부", amount: { value: 0.5, unit: "모" }, substitute: null, selectionTip: null },
      { name: "애호박", amount: { value: 0.33, unit: "개" }, substitute: null, selectionTip: null },
      { name: "양파", amount: { value: 0.5, unit: "개" }, substitute: null, selectionTip: null },
      { name: "대파", amount: { value: 1, unit: "대" }, substitute: null, selectionTip: null },
      { name: "마늘", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "된장", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고추장", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고춧가루", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "물", amount: { value: 500, unit: "ml" }, substitute: null, selectionTip: null },
      { name: "굴소스", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "참치액", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "밥", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "프라이팬" },
      { name: "칼" },
      { name: "도마" },
      { name: "나무 주걱" },
      { name: "뚝배기" },
      { name: "국자" },
      { name: "휴대용 가스레인지" },
    ],
    steps: [
      {
        order: 1,
        title: "프라이팬에 차돌박이 볶기",
        description: [
          { content: "달궈진 팬에 차돌박이를 넣어주세요.", start: "00:00:20" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 2,
        title: "채소 썰기",
        description: [
          {
            content: "두부를 사방 1.5cm~2cm 정도의 한 입 크기(큐브 모양)로 썰어주세요.",
            start: "00:00:30",
          },
          { content: "애호박을 큐브 모양으로 썰어주세요.", start: "00:00:39" },
          { content: "양파를 큐브 모양으로 썰어주세요.", start: "00:00:43" },
          {
            content: "대파를 0.5cm 두께로 송송 썰어주세요. (또는 어슷하게 썰어주세요.)",
            start: "00:00:46",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "두부와 채소 썰기",
            start: "00:00:30",
            end: "00:00:46",
          },
          {
            label: "대파 썰기",
            start: "00:00:46",
            end: "00:00:49",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "차돌박이에 양념 넣고 볶기",
        description: [
          { content: "차돌박이를 나무 주걱으로 볶아주세요.", start: "00:00:49" },
          { content: "다진 마늘을 넣어주세요.", start: "00:00:52" },
          { content: "된장을 넣고 같이 볶아주세요.", start: "00:00:56" },
          { content: "고추장을 넣고 같이 볶아주세요.", start: "00:01:03" },
          { content: "고춧가루를 넣어주세요.", start: "00:01:09" },
          {
            content:
              "재료에 양념이 골고루 배어 고추기름이 살짝 돌 때까지 약 1~2분간 약불에서 타지 않게 볶아주세요.",
            start: "00:01:19",
          },
        ],
        tip: "차돌박이 기름이 올라오면 고춧가루를 넣고 약불로 볶아주세요.",
        knowledge: null,
        scenes: [
          {
            label: "고추기름 내며 볶기",
            start: "00:01:19",
            end: "00:01:27",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 4,
        title: "물과 채소 넣고 끓이기",
        description: [
          { content: "팬에 물을 부어주세요.", start: "00:01:27" },
          { content: "굴소스를 넣어주세요.", start: "00:01:30" },
          { content: "참치액을 넣어주세요.", start: "00:01:34" },
          { content: "썰어둔 양파, 애호박, 대파를 넣어주세요.", start: "00:01:38" },
          { content: "재료들을 국물과 함께 섞어주세요.", start: "00:01:44" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 5,
        title: "두부 넣고 끓이기",
        description: [
          {
            content:
              "손질된 두부를 팬에 넣고 국물이 재료들에 베어들도록 중간불에서 약 3~4분간 끓여주세요.",
            start: "00:02:13",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "두부 넣고 끓이기",
            start: "00:02:13",
            end: "00:02:30",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 6,
        title: "뚝배기에 밥과 찌개 담아 끓이기",
        description: [
          { content: "뚝배기에 밥을 넣어주세요.", start: "00:02:30" },
          {
            content: "팬에서 조리한 된장찌개를 뚝배기 안의 밥 위로 옮겨 담아주세요.",
            start: "00:02:34",
          },
          {
            content:
              "뚝배기를 가열해 국물이 바글바글 끓어오르면, 밥알이 국물을 살짝 머금어 걸쭉해질 때까지 1~2분간 더 끓여주세요.",
            start: "00:02:46",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "술밥 완성",
            start: "00:02:46",
            end: "00:02:51",
          },
        ],
        timerSeconds: null,
      },
    ],
    servingTip:
      "밥과 함께 먹어도, 술과 함께 먹어도 너무 훌륭합니다.",
  },
};

const AGLIO_OLIO_V2: PocRecipeEntry = {
  videoId: "eUkwkkRKdfY",
  recipe: {
    title: "알리오 올리오 v2",
    description:
      "강레오 셰프가 알려주는 유튜브 최초 공개 알리오 올리오 레시피입니다. 두 가지 버전의 마늘 소스를 활용해 고급스러운 맛을 냅니다.",
    servings: null,
    cookingTimeMinutes: null,
    difficulty: "보통",
    category: "양식",
    ingredients: [
      { name: "스파게티면", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "올리브유", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "마늘", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "고추", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "버터", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "파슬리", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "소금", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "후추", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "도마" },
      { name: "칼" },
      { name: "프라이팬" },
      { name: "뒤집개" },
      { name: "냄비" },
      { name: "채반" },
      { name: "집게" },
      { name: "그릇" },
      { name: "믹서기" },
      { name: "국자" },
    ],
    steps: [
      {
        order: 1,
        title: "프라이팬에 마늘과 고추 볶기",
        description: [
          { content: "다진 마늘을 프라이팬에 담아주세요.", start: "00:05:30" },
          {
            content: "프라이팬에 고추를 어슷썰어(또는 손으로 반쯤 부숴서) 넣어주세요.",
            start: "00:05:37",
          },
          {
            content: "프라이팬의 마늘과 고추를 약불에서 마늘이 노릇해질 때까지 볶아주세요.",
            start: "00:05:40",
          },
          {
            content:
              "버터를 잘라 프라이팬에 넣고 소스를 저으며 기름과 수분이 섞여 뽀얗고 걸쭉해질 때까지 섞어주세요.",
            start: "00:06:00",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "고추 손질하여 팬에 넣기",
            start: "00:05:37",
            end: "00:05:40",
          },
          {
            label: "마늘 노릇하게 볶기",
            start: "00:05:40",
            end: "00:06:00",
          },
          {
            label: "버터 녹여 소스 만들기",
            start: "00:06:00",
            end: "00:06:12",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 2,
        title: "냄비에 파스타 면 삶기",
        description: [
          {
            content: "파슬리의 잎과 줄기를 손으로 뜯어 분리해 주세요.",
            start: "00:06:12",
          },
          {
            content: "파슬리 줄기와 마늘을 냄비에 넣어주세요.",
            start: "00:06:22",
          },
          {
            content: "끓는 물에 파스타 면을 넣고 포장지 지시 시간보다 1~2분 덜 삶아주세요.",
            start: "00:06:30",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "파슬리 잎과 줄기 분리하기",
            start: "00:06:12",
            end: "00:06:22",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "프라이팬에서 면과 소스 섞기",
        description: [
          { content: "익은 파스타 면을 채반으로 건져내 주세요.", start: "00:07:41" },
          { content: "건져낸 면을 프라이팬 소스에 넣고 섞어주세요.", start: "00:07:44" },
          { content: "프라이팬에 다진 파슬리를 넣고 섞어주세요.", start: "00:07:50" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 4,
        title: "그릇에 파스타 담기",
        description: [
          { content: "완성된 파스타를 그릇에 담아주세요.", start: "00:08:00" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 5,
        title: "마늘 심 제거하고 끓는 물에 데치기",
        description: [
          {
            content:
              "마늘을 세로로 반으로 자른 뒤, 가운데에 있는 녹색 심을 칼끝으로 파내어 제거해 주세요.",
            start: "00:09:41",
          },
          {
            content:
              "손질한 마늘을 채반에 넣고 끓는 물에 마늘이 살짝 투명해질 때까지 데쳐주세요.",
            start: "00:10:00",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "마늘 심 제거하기",
            start: "00:09:41",
            end: "00:10:00",
          },
          {
            label: "마늘 데치기",
            start: "00:10:00",
            end: "00:10:05",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 6,
        title: "믹서기로 마늘 소스 갈기",
        description: [
          { content: "데친 마늘을 믹서기에 넣어주세요.", start: "00:10:05" },
          {
            content: "믹서기에 올리브유, 소금, 후추를 넣고 갈아주세요.",
            start: "00:10:15",
          },
          {
            content:
              "만든 마늘 소스에 면수를 약간(예: 1국자) 추가하여 원하는 농도가 되도록 섞어주세요.",
            start: "00:10:30",
          },
          {
            content: "다시 믹서기로 소스를 부드러운 크림 질감이 될 때까지 고르게 갈아주세요.",
            start: "00:11:00",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "면수 넣고 농도 조절하기",
            start: "00:10:30",
            end: "00:11:00",
          },
          {
            label: "소스 최종 질감 확인하기",
            start: "00:11:00",
            end: "00:11:15",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 7,
        title: "프라이팬에서 면과 마늘 소스 섞기",
        description: [
          { content: "팬에 면과 마늘 소스를 넣고 섞어주세요.", start: "00:11:15" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
    ],
    servingTip: null,
  },
};

const AGLIO_OLIO_V4: PocRecipeEntry = {
  videoId: "eUkwkkRKdfY",
  recipe: {
    title: "알리오 올리오 v4",
    description:
      "강레오 셰프가 제안하는 고급스러운 맛의 초저렴 알리오 올리오 파스타 레시피입니다.",
    servings: null,
    cookingTimeMinutes: null,
    difficulty: "쉬움",
    category: "양식",
    ingredients: [
      { name: "스파게티면", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "올리브유", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "마늘", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "페페론치노", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "파슬리", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "가염 버터", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "소금", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "후추", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "팬" },
      { name: "칼" },
      { name: "도마" },
      { name: "냄비" },
      { name: "집게" },
      { name: "실리콘 주걱" },
      { name: "건지개" },
      { name: "믹서기" },
      { name: "국자" },
    ],
    steps: [
      {
        order: 1,
        title: "팬에 올리브유 두르고 마늘과 페페론치노 다지기",
        description: [
          { content: "팬에 올리브유를 부어주세요.", start: "00:04:53" },
          {
            content: "도마 위에서 페페론치노를 2~3등분 하거나 취향에 맞게 잘게 썰어주세요.",
            start: "00:04:58",
          },
          { content: "마늘을 잘게 다져주세요.", start: "00:05:13" },
          { content: "다진 마늘과 페페론치노를 팬에 넣어주세요.", start: "00:05:37" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "페페론치노 써는 크기와 모양", start: "00:04:58", end: "00:05:00" },
        ],
        timerSeconds: null,
      },
      {
        order: 2,
        title: "마늘과 페페론치노 볶다가 버터 넣기",
        description: [
          { content: "마늘을 얇게 편 썰어주세요.", start: "00:05:40" },
          {
            content: "약불을 켜고 마늘이 타지 않게 은은한 갈색(노릇한 색)이 날 때까지 가열해주세요.",
            start: "00:05:49",
          },
          { content: "가염 버터를 칼로 썰어주세요.", start: "00:06:00" },
          {
            content: "썰어둔 가염 버터를 팬에 넣고 마늘, 페페론치노와 함께 끓여주세요.",
            start: "00:06:02",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "마늘 편 썰기", start: "00:05:40", end: "00:05:49" },
          { label: "마늘 노릇하게 볶기", start: "00:05:49", end: "00:06:00" },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "끓는 물에 파슬리, 마늘, 면 넣고 삶기",
        description: [
          { content: "냄비에 올리브유를 부어주세요.", start: "00:06:08" },
          { content: "파슬리의 줄기 부분을 손으로 떼어내주세요.", start: "00:06:12" },
          { content: "떼어낸 파슬리 줄기를 냄비 안의 물에 넣어주세요.", start: "00:06:22" },
          { content: "마늘 한 알을 손으로 으깨서 냄비에 넣어주세요.", start: "00:06:30" },
          {
            content:
              "스파게티면을 냄비에 넣고 포장지에 적힌 시간보다 1~2분 덜 삶아 알단테 상태로 익혀주세요.",
            start: "00:06:36",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 4,
        title: "삶은 면을 팬에 옮겨 파슬리 잎과 함께 볶기",
        description: [
          { content: "다 삶아진 스파게티면을 건져내주세요.", start: "00:07:37" },
          { content: "건져낸 스파게티면을 조리 중인 팬에 넣어주세요.", start: "00:07:41" },
          { content: "집게를 사용하여 면과 소스를 섞어주세요.", start: "00:07:43" },
          { content: "미리 잘게 다져둔 파슬리 잎을 팬에 넣어주세요.", start: "00:07:47" },
          {
            content:
              "면과 오일 소스가 잘 섞여 소스가 약간 걸쭉해지고 면에 윤기가 돌 때까지 볶아주세요.",
            start: "00:07:51",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "파슬리 잎 다진 크기와 상태", start: "00:07:47", end: "00:07:51" },
          { label: "유화 상태 확인", start: "00:07:51", end: "00:07:59" },
        ],
        timerSeconds: null,
      },
      {
        order: 5,
        title: "접시에 파스타 담고 다진 마늘 곁들이기",
        description: [
          { content: "조리된 파스타를 접시에 옮겨 담아주세요.", start: "00:07:59" },
          { content: "팬에 남은 소스를 긁어 접시에 담아주세요.", start: "00:08:06" },
          { content: "접시에 담긴 파스타 위에 다진 마늘을 추가로 올려주세요.", start: "00:08:12" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 6,
        title: "마늘 심 제거하고 데쳐서 믹서기용 재료 준비하기",
        description: [
          {
            content:
              "마늘을 세로로 반으로 썰어, 가운데에 있는 초록색 또는 흰색 싹(심)을 칼끝으로 파내어 제거해주세요.",
            start: "00:09:41",
          },
          {
            content: "손질한 마늘을 건지개에 담아 끓는 물에 1~2분간 살짝 데쳐 매운맛을 빼주세요.",
            start: "00:10:05",
          },
          { content: "데친 마늘을 믹서기에 넣어주세요.", start: "00:10:11" },
          { content: "믹서기에 올리브유, 소금, 후추를 추가로 넣어주세요.", start: "00:10:16" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "마늘 심 제거하기", start: "00:09:41", end: "00:09:59" },
          { label: "마늘 데치기 완료 시점", start: "00:10:05", end: "00:10:11" },
        ],
        timerSeconds: null,
      },
      {
        order: 7,
        title: "믹서기에 마늘과 면수 넣고 갈아 특제 소스 만들기",
        description: [
          { content: "믹서기를 이용해 재료들을 갈아주세요.", start: "00:10:20" },
          { content: "갈아둔 소스에 면수를 추가로 넣어주세요.", start: "00:10:52" },
          {
            content:
              "면수를 추가한 소스를 다시 믹서기로 갈아 마요네즈처럼 부드럽고 걸쭉한 농도의 소스로 완성해주세요.",
            start: "00:11:00",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "마늘 소스 최종 질감", start: "00:11:00", end: "00:11:19" },
        ],
        timerSeconds: null,
      },
      {
        order: 8,
        title: "팬에 삶은 면과 마늘 소스 넣고 버무리기",
        description: [
          { content: "팬에 삶아둔 면을 넣어주세요.", start: "00:11:19" },
          { content: "팬에 믹서기로 갈아둔 마늘 소스를 부어주세요.", start: "00:11:24" },
          { content: "집게를 사용해 면과 소스를 골고루 섞어주세요.", start: "00:11:27" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 9,
        title: "면수와 소스 추가하며 파스타 볶기",
        description: [
          { content: "팬에 면수를 국자로 퍼서 넣어주세요.", start: "00:11:34" },
          { content: "파스타 소스를 팬에 추가로 더 넣어주세요.", start: "00:11:43" },
          {
            content:
              "소스가 면에 충분히 흡수되어 국물이 자작해지고 면에 윤기가 흐를 때까지 볶아주세요.",
            start: "00:11:49",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "면에 소스 코팅 완성 상태", start: "00:11:49", end: "00:11:58" },
        ],
        timerSeconds: null,
      },
      {
        order: 10,
        title: "완성된 파스타 접시에 담기",
        description: [
          { content: "조리된 파스타를 집게를 사용해 접시에 담아주세요.", start: "00:11:58" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
    ],
    servingTip: null,
  },
};

const CHADOL_DOENJANG_V4: PocRecipeEntry = {
  videoId: "klFhbUssB60",
  recipe: {
    title: "차돌 된장 술밥 v4",
    description:
      "따뜻한 국물이 생각나는 날씨에 먹기 딱 좋은 차돌 된장 술밥입니다. 밥이나 술과 함께 먹기 훌륭한 레시피입니다.",
    servings: null,
    cookingTimeMinutes: null,
    difficulty: "쉬움",
    category: "국/찌개",
    ingredients: [
      { name: "차돌박이", amount: { value: 200, unit: "g" }, substitute: null, selectionTip: null },
      { name: "두부", amount: { value: 0.5, unit: "모" }, substitute: null, selectionTip: null },
      { name: "애호박", amount: { value: 0.33, unit: "개" }, substitute: null, selectionTip: null },
      { name: "양파", amount: { value: 0.5, unit: "개" }, substitute: null, selectionTip: null },
      { name: "대파", amount: { value: 1, unit: "대" }, substitute: null, selectionTip: null },
      { name: "마늘", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "된장", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고추장", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고춧가루", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "물", amount: { value: 500, unit: "ml" }, substitute: null, selectionTip: null },
      { name: "굴소스", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "참치액", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "밥", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "프라이팬" },
      { name: "도마" },
      { name: "식칼" },
      { name: "나무 주걱" },
      { name: "뚝배기" },
      { name: "국자" },
    ],
    steps: [
      {
        order: 1,
        title: "프라이팬에 차돌박이 굽고 채소 썰기",
        description: [
          { content: "가열한 프라이팬에 차돌박이를 넣어 구워주세요.", start: "00:00:20" },
          {
            content: "두부를 사방 1.5cm 정도의 한입 크기 큐브 모양으로 깍둑썰어주세요.",
            start: "00:00:30",
          },
          { content: "애호박을 큐브 모양으로 깍둑썰어주세요.", start: "00:00:38" },
          { content: "양파를 큐브 모양으로 깍둑썰어주세요.", start: "00:00:43" },
          { content: "대파를 송송 썰어 준비해주세요.", start: "00:00:46" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "채소 깍둑썰기 크기 확인",
            start: "00:00:30",
            end: "00:00:38",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 2,
        title: "차돌박이에 양념 넣고 볶기",
        description: [
          { content: "차돌박이를 나무 주걱으로 뒤적이며 볶아주세요.", start: "00:00:49" },
          {
            content:
              "차돌박이의 붉은 기가 반 정도 사라지고 겉면이 살짝 익으면 다진 마늘을 넣어주세요.",
            start: "00:00:52",
          },
          { content: "된장을 넣고 함께 볶아주세요.", start: "00:00:56" },
          { content: "고추장을 넣고 함께 볶아주세요.", start: "00:01:03" },
          {
            content:
              "차돌박이에서 기름이 충분히 나와 팬 바닥에 자글자글하게 고이면 고춧가루를 넣고 볶아주세요.",
            start: "00:01:15",
          },
        ],
        tip: "고춧가루를 넣고 볶을 때는 타지 않도록 약불로 볶아주세요.",
        knowledge: null,
        scenes: [
          {
            label: "차돌박이 익힘 정도 확인",
            start: "00:00:49",
            end: "00:00:56",
          },
          {
            label: "고춧가루 넣기 전 기름 상태",
            start: "00:01:15",
            end: "00:01:28",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "물 붓고 국물 간하기",
        description: [
          { content: "프라이팬에 물을 부어주세요.", start: "00:01:28" },
          { content: "굴소스를 넣어 간을 해주세요.", start: "00:01:31" },
          { content: "참치액을 넣어 간을 맞춰주세요.", start: "00:01:34" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 4,
        title: "채소와 두부 넣고 끓이기",
        description: [
          {
            content: "썰어둔 양파, 애호박, 대파를 프라이팬에 넣어주세요.",
            start: "00:01:38",
          },
          {
            content:
              "된장찌개가 끓어오르면 손질한 두부를 넣고 국물이 처음 양의 2/3 정도로 졸아들어 건더기와 국물 높이가 비슷해질 때까지 끓여주세요.",
            start: "00:02:13",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "자작하게 졸아든 찌개 상태",
            start: "00:02:13",
            end: "00:02:22",
          },
        ],
        timerSeconds: null,
      },
      {
        order: 5,
        title: "뚝배기에 밥과 찌개 담아 끓이기",
        description: [
          { content: "뚝배기에 밥을 담아주세요.", start: "00:02:33" },
          { content: "끓여놓은 차돌 된장찌개를 뚝배기에 부어주세요.", start: "00:02:33" },
          {
            content:
              "뚝배기가 바글바글 끓어오르고, 밥알이 국물을 살짝 머금어 부드러워질 때까지 약 1~2분간 더 끓여 완성해주세요.",
            start: "00:02:33",
          },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          {
            label: "술밥 완성 농도 확인",
            start: "00:02:33",
            end: "00:02:40",
          },
        ],
        timerSeconds: null,
      },
    ],
    servingTip:
      "밥과 함께 식사로 먹어도 좋고, 술과 함께 안주로 곁들여도 아주 훌륭합니다.",
  },
};

const CHADOL_DOENJANG_V5: PocRecipeEntry = {
  videoId: "klFhbUssB60",
  recipe: {
    title: "차돌 된장 술밥 v5",
    description:
      "따뜻한 국물이 생각나는 날씨에 먹기 딱 좋은 차돌 된장 술밥입니다. 밥이나 술과 함께 먹기 훌륭한 초간단 레시피입니다.",
    servings: 2,
    cookingTimeMinutes: 15,
    difficulty: "쉬움",
    category: "한식",
    ingredients: [
      { name: "차돌박이", amount: { value: 200, unit: "g" }, substitute: null, selectionTip: null },
      { name: "두부", amount: { value: 0.5, unit: "모" }, substitute: null, selectionTip: null },
      { name: "애호박", amount: { value: 0.33, unit: "개" }, substitute: null, selectionTip: null },
      { name: "양파", amount: { value: 0.5, unit: "개" }, substitute: null, selectionTip: null },
      { name: "대파", amount: { value: 1, unit: "대" }, substitute: null, selectionTip: null },
      { name: "마늘", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "된장", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고추장", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "고춧가루", amount: { value: 2, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "물", amount: { value: 500, unit: "ml" }, substitute: null, selectionTip: null },
      { name: "굴소스", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "참치액", amount: { value: 1, unit: "큰술" }, substitute: null, selectionTip: null },
      { name: "공깃밥", amount: { value: 1, unit: "인분" }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "프라이팬" },
      { name: "가스레인지" },
      { name: "도마" },
      { name: "식칼" },
      { name: "나무 주걱" },
      { name: "뚝배기" },
      { name: "국자" },
    ],
    steps: [
      {
        order: 1,
        title: "차돌박이 굽기 및 채소 썰기",
        description: [
          { content: "프라이팬을 가열하고 차돌박이 200g을 넣어 구워주세요.", start: "00:00:20" },
          { content: "두부 1/2모를 사방 1~1.5cm 크기로 깍둑썰기해주세요.", start: "00:00:30" },
          { content: "애호박 1/3개를 두부와 비슷한 사방 1.5cm 크기로 깍둑썰기해주세요.", start: "00:00:39" },
          { content: "양파 1/2개를 사방 0.5cm 크기로 잘게 썰고, 대파 1대는 얇게 송송 썰어 준비해주세요.", start: "00:00:43" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "애호박을 자르는 칼질 방향과 완성된 애호박 조각의 모양 및 두께가 잘 보이는 장면", start: "00:00:39", end: "00:00:43" },
          { label: "양파를 다지는 크기와 대파를 써는 모양(송송 썰기인지 어슷썰기인지)을 보여주는 장면", start: "00:00:43", end: "00:00:48" },
        ],
        timerSeconds: null,
      },
      {
        order: 2,
        title: "차돌박이에 마늘과 장류 넣고 볶기",
        description: [
          { content: "프라이팬에서 차돌박이를 나무 주걱으로 계속 볶아주세요.", start: "00:00:48" },
          { content: "차돌박이의 겉면 핏기가 반 정도 가시면 다진 마늘 1큰술과 된장 2큰술을 넣고 섞으며 볶아주세요.", start: "00:00:53" },
          { content: "고추장 1큰술을 넣고 섞으며 볶아주세요.", start: "00:01:03" },
          { content: "차돌박이에서 기름이 충분히 나와 팬 바닥에 지글지글 고이면 약불로 줄이고 고춧가루 2큰술을 넣어 고기와 함께 볶아주세요.", start: "00:01:15" },
        ],
        tip: "고춧가루를 넣고 볶을 때는 타지 않도록 반드시 약불로 볶아주세요.",
        knowledge: null,
        scenes: [
          { label: "마늘과 된장을 넣기 직전 차돌박이의 붉은색이 얼마나 가신 상태인지 보여주는 색깔 변화 장면", start: "00:00:48", end: "00:00:53" },
          { label: "고기를 볶으면서 팬 바닥에 차돌박이 기름이 지글지글 고여 있는 상태를 확대해서 보여주는 장면", start: "00:01:15", end: "00:01:27" },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "물과 양념, 채소 넣고 끓이기",
        description: [
          { content: "프라이팬에 물 500ml를 부어주세요.", start: "00:01:27" },
          { content: "굴소스 1큰술과 참치액 1큰술을 넣어 간을 맞춰주세요.", start: "00:01:30" },
          { content: "썰어둔 양파, 애호박, 대파를 프라이팬에 모두 넣어주세요.", start: "00:01:38" },
          { content: "된장찌개가 끓어오르면 썰어둔 두부를 넣고 국물과 재료가 어우러지도록 2~3분간 한 번 더 끓여주세요.", start: "00:02:13" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 4,
        title: "뚝배기에 밥과 찌개 담기",
        description: [
          { content: "뚝배기에 공깃밥을 넣어주세요.", start: "00:02:30" },
          { content: "조리된 된장찌개를 국자로 떠서 뚝배기에 붓고, 전체적으로 한소끔 바글바글 끓어오를 때까지 1~2분간 끓여주세요.", start: "00:02:35" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
    ],
    servingTip:
      "뚝배기에 밥과 찌개를 함께 넣고 바글바글 끓이면서 드시면 더욱 맛있습니다. 술안주로도 아주 훌륭합니다.",
  },
};

// ---------------------------------------------------------------------------
// 척아이롤 순살 소갈비찜 (v6)
// ---------------------------------------------------------------------------
const CHADOL_DOENJANG_V6: PocRecipeEntry = {
  videoId: "PH427TCx9iU",
  recipe: {
    title: "척아이롤 순살 소갈비찜",
    description:
      "척아이롤을 활용하여 쉽고 간단하게 만드는 부드러운 순살 갈비찜 레시피입니다.",
    servings: null,
    cookingTimeMinutes: null,
    difficulty: "쉬움",
    category: "고기요리",
    ingredients: [
      { name: "소고기", amount: { value: null, unit: null }, substitute: null, selectionTip: "척아이롤 부위를 사용하면 좋습니다." },
      { name: "양파", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "갈아 만든 배", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "진간장", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "미림", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "마늘", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "설탕", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "생강", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "참기름", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "후추", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "노추", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "무", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "당근", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "표고버섯", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "청양고추", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "홍고추", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "떡", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "물엿", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "깨", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "밥", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "도마" },
      { name: "식칼" },
      { name: "믹싱볼" },
      { name: "종이컵" },
      { name: "계량컵" },
      { name: "숟가락" },
      { name: "위생 장갑" },
      { name: "프라이팬" },
      { name: "실리콘 주걱" },
      { name: "프라이팬 뚜껑" },
      { name: "밥그릇" },
    ],
    steps: [
      {
        order: 1,
        title: "소고기와 양파 썰어 믹싱볼에 담기",
        description: [
          { content: "도마 위에서 소고기를 사방 3~4cm 정도의 한입 크기로 일정하게 썰어주세요.", start: "00:00:07" },
          { content: "썬 소고기를 믹싱볼에 담아주세요.", start: "00:00:13" },
          { content: "양파를 볶음밥에 들어가는 크기(약 0.5cm) 정도로 잘게 다져주세요.", start: "00:00:14" },
          { content: "다진 양파를 소고기가 담긴 믹싱볼에 넣어주세요.", start: "00:00:16" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "소고기 써는 크기와 모양", start: "00:00:07", end: "00:00:13" },
          { label: "양파 다지는 과정과 크기", start: "00:00:14", end: "00:00:16" },
        ],
        timerSeconds: null,
      },
      {
        order: 2,
        title: "배 음료와 간장 양념 넣기",
        description: [
          { content: "배 음료를 믹싱볼에 부어주세요.", start: "00:00:17" },
          { content: "진간장을 믹싱볼에 부어주세요.", start: "00:00:20" },
          { content: "미림을 믹싱볼에 부어주세요.", start: "00:00:21" },
          { content: "다진 마늘과 설탕을 믹싱볼에 넣어주세요.", start: "00:00:23" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 3,
        title: "생강, 참기름, 노추 넣기",
        description: [
          { content: "다진 생강을 믹싱볼에 넣어주세요.", start: "00:00:25" },
          { content: "참기름을 믹싱볼에 넣어주세요.", start: "00:00:26" },
          { content: "후추를 믹싱볼에 뿌려주세요.", start: "00:00:27" },
          { content: "노추를 믹싱볼에 넣어주세요.", start: "00:00:29" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 4,
        title: "고기 버무려 프라이팬에 담기",
        description: [
          { content: "위생 장갑을 끼고 믹싱볼 안의 재료들을 골고루 버무려주세요.", start: "00:00:30" },
          { content: "양념한 고기를 넓은 프라이팬에 옮겨 담아주세요.", start: "00:00:36" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 5,
        title: "채소 넣고 뚜껑 덮어 익히기",
        description: [
          { content: "무와 당근은 고기와 비슷한 크기로 썰어 모서리를 둥글게 깎고, 표고버섯은 적당한 크기로 자르며, 고추는 어슷 썰어서 프라이팬 속 고기 위에 차례로 넣어주세요.", start: "00:00:38" },
          { content: "프라이팬 뚜껑을 덮어주세요.", start: "00:00:44" },
          { content: "강불에서 끓기 시작하면 중약불로 줄이고, 고기와 무가 푹 익어 젓가락이 부드럽게 들어갈 때까지 끓여주세요.", start: "00:00:47" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "무, 당근, 버섯, 고추의 손질된 모양과 크기", start: "00:00:38", end: "00:00:44" },
          { label: "국물이 졸아들고 끓는 상태 확인", start: "00:00:47", end: "00:00:49" },
        ],
        timerSeconds: null,
      },
      {
        order: 6,
        title: "마늘과 떡 추가하여 끓이고 통깨 뿌리기",
        description: [
          { content: "통마늘과 떡을 프라이팬에 추가로 넣어주세요.", start: "00:00:49" },
          { content: "물엿을 프라이팬에 넣어주세요.", start: "00:00:53" },
          { content: "떡이 말랑해지고 물엿으로 인해 국물에 윤기가 돌며 살짝 걸쭉해질 때까지 가볍게 볶듯이 한 번 더 끓여주세요.", start: "00:00:55" },
          { content: "완성된 요리 위에 통깨를 뿌려주세요.", start: "00:00:56" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "떡이 익고 걸쭉해진 완성 직전의 상태", start: "00:00:55", end: "00:00:56" },
        ],
        timerSeconds: null,
      },
      {
        order: 7,
        title: "밥 위에 갈비찜 올려 담기",
        description: [
          { content: "밥이 담긴 그릇 위에 완성된 갈비찜을 올려주세요.", start: "00:00:58" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
    ],
    servingTip: null,
  },
};

// ---------------------------------------------------------------------------
// 이연복 황금볶음밥
// ---------------------------------------------------------------------------
const YEONBOK_BOKKEUMBAP: PocRecipeEntry = {
  videoId: "BNzRdMc7Qf4",
  recipe: {
    title: "황금볶음밥",
    description:
      "계란물에 밥과 각종 재료를 미리 섞어 볶아내어 밥알이 고슬고슬하고 맛이 한층 깊어진 이연복 셰프의 볶음밥입니다.",
    servings: 2,
    cookingTimeMinutes: 15,
    difficulty: "쉬움",
    category: "밥요리",
    ingredients: [
      { name: "즉석밥", amount: { value: 2, unit: "개" }, substitute: null, selectionTip: null },
      { name: "계란", amount: { value: 3, unit: "개" }, substitute: null, selectionTip: null },
      { name: "통조림 햄", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "치킨스톡", amount: { value: 0.67, unit: "스푼" }, substitute: null, selectionTip: null },
      { name: "식용유", amount: { value: 2.5, unit: "스푼" }, substitute: null, selectionTip: null },
      { name: "당근", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "대파", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
      { name: "물", amount: { value: null, unit: null }, substitute: null, selectionTip: null },
    ],
    tools: [
      { name: "전자레인지" },
      { name: "볼" },
      { name: "팬" },
      { name: "도마" },
      { name: "칼" },
      { name: "체" },
    ],
    steps: [
      {
        order: 1,
        title: "즉석밥 데우고 계란 풀기",
        description: [
          { content: "즉석밥 2개를 전자레인지에 30초간 돌려주세요.", start: "00:00:50" },
          { content: "볼에 계란 3개를 깨서 풀어주세요.", start: "00:01:02" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: 30,
      },
      {
        order: 2,
        title: "통조림 햄 다져서 데치기",
        description: [
          { content: "팬에 통조림 햄이 충분히 잠길 만큼의 물(약 2~3컵)을 붓고 끓여주세요.", start: "00:01:23" },
          { content: "통조림 햄을 사방 0.5cm 이하 크기로 잘게 다져주세요.", start: "00:01:29" },
          { content: "다진 햄을 끓는 물에 약 30초에서 1분간 가볍게 데쳐주세요.", start: "00:01:50" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "통조림 햄 다지기", start: "00:01:29", end: "00:01:50" },
        ],
        timerSeconds: null,
      },
      {
        order: 3,
        title: "계란물 밥에 당근과 치킨스톡 섞기",
        description: [
          { content: "데운 즉석밥을 계란이 든 볼에 넣고, 밥알이 뭉치지 않게 풀어가며 계란물이 밥알 전체에 고루 코팅되도록 섞어주세요.", start: "00:01:54" },
          { content: "당근을 잘게 다져서 볼에 넣어주세요.", start: "00:02:12" },
          { content: "치킨스톡 2/3스푼을 볼에 넣고 섞어주세요.", start: "00:02:26" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "밥알과 계란물 고루 섞기", start: "00:01:54", end: "00:02:12" },
        ],
        timerSeconds: null,
      },
      {
        order: 4,
        title: "데친 햄과 대파 넣고 섞기",
        description: [
          { content: "데친 햄은 체에 밭쳐 물기를 뺀 후 볼에 넣어주세요.", start: "00:02:56" },
          { content: "대파를 잘게 다져서 볼에 넣고 고루 섞어주세요.", start: "00:03:00" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 5,
        title: "프라이팬에 볶음밥 볶기",
        description: [
          { content: "팬에 식용유 2~3스푼을 두르고 강불(또는 중불)로 달궈주세요.", start: "00:03:15" },
          { content: "준비한 재료를 팬에 모두 넣고 주걱으로 밥을 가르듯이 볶아주세요. 계란 수분이 날아가면서 뭉쳐있던 밥알이 한 알씩 흩어지고 고슬고슬해질 때까지 충분히 볶아주세요.", start: "00:03:32" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "밥알이 흩어지게 볶기", start: "00:03:32", end: "00:04:35" },
        ],
        timerSeconds: null,
      },
      {
        order: 6,
        title: "완성된 볶음밥 그릇에 담기",
        description: [
          { content: "완성된 볶음밥을 그릇에 담아주세요.", start: "00:04:35" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
    ],
    servingTip: null,
  },
};

// ---------------------------------------------------------------------------
// 연매출 75억 파는 맛 떡볶이
// ---------------------------------------------------------------------------
const TTEOKBOKKI: PocRecipeEntry = {
  videoId: "KIug18AbvIA",
  recipe: {
    title: "연매출 75억 파는 맛 떡볶이",
    description:
      "실제 매장에서 연매출 75억을 달성했던 황금비율 떡볶이 소스와 조리법입니다. 이 소스 하나면 집에서도 완벽한 파는 맛을 낼 수 있습니다.",
    servings: 2,
    cookingTimeMinutes: 20,
    difficulty: "보통",
    category: "분식",
    ingredients: [
      { name: "고운 고춧가루", amount: { value: 80, unit: "g" }, substitute: null, selectionTip: null },
      { name: "조청", amount: { value: 120, unit: "g" }, substitute: "황물엿", selectionTip: null },
      { name: "흰설탕", amount: { value: 20, unit: "g" }, substitute: null, selectionTip: null },
      { name: "황설탕", amount: { value: 120, unit: "g" }, substitute: null, selectionTip: null },
      { name: "소고기 다시다", amount: { value: 16, unit: "g" }, substitute: null, selectionTip: null },
      { name: "미원", amount: { value: 10, unit: "g" }, substitute: null, selectionTip: null },
      { name: "후르츠 칵테일 과육", amount: { value: 20, unit: "g" }, substitute: null, selectionTip: null },
      { name: "물", amount: { value: 150, unit: "ml" }, substitute: null, selectionTip: "믹서용" },
      { name: "소불고기 양념장", amount: { value: 16, unit: "g" }, substitute: null, selectionTip: null },
      { name: "소금", amount: { value: 10, unit: "g" }, substitute: null, selectionTip: null },
      { name: "양파", amount: { value: 0.25, unit: "개" }, substitute: null, selectionTip: null },
      { name: "마늘분", amount: { value: 5, unit: "g" }, substitute: "다진 마늘", selectionTip: "대용량 조리 시 다진 마늘 사용" },
      { name: "밀떡", amount: { value: 200, unit: "g" }, substitute: null, selectionTip: "별대 밀떡 추천" },
      { name: "물", amount: { value: 450, unit: "ml" }, substitute: null, selectionTip: "조리용" },
      { name: "설탕", amount: { value: 0.5, unit: "큰술" }, substitute: null, selectionTip: "떡 끓일 때 사용" },
      { name: "어묵", amount: { value: null, unit: "적당량" }, substitute: null, selectionTip: null },
      { name: "대파", amount: { value: null, unit: "적당량" }, substitute: null, selectionTip: null },
      { name: "달걀 프라이", amount: { value: 1, unit: "개" }, substitute: null, selectionTip: "토핑용" },
    ],
    tools: [
      { name: "프라이팬" },
      { name: "스테인리스 용기" },
      { name: "믹서기" },
      { name: "주걱" },
      { name: "플라스틱 용기" },
      { name: "랩" },
      { name: "도마" },
      { name: "칼" },
      { name: "볼" },
    ],
    steps: [
      {
        order: 1,
        title: "프라이팬에 고춧가루와 설탕 넣기",
        description: [
          { content: "프라이팬을 가스레인지 위에 올려주세요.", start: "00:01:12" },
          { content: "프라이팬에 고춧가루 80g을 부어주세요.", start: "00:01:21" },
          { content: "고춧가루 위에 황설탕 120g을 부어주세요.", start: "00:01:27" },
          { content: "황설탕 위에 흰설탕 20g을 부어주세요.", start: "00:01:34" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 2,
        title: "프라이팬에 나머지 소스 가루와 조청 넣기",
        description: [
          { content: "프라이팬에 조청 120g을 부어주세요.", start: "00:01:47" },
          { content: "미원 10g을 부어주세요.", start: "00:02:10" },
          { content: "마늘분 5g을 부어주세요.", start: "00:02:24" },
          { content: "다시다 16g을 부어주세요.", start: "00:02:37" },
        ],
        tip: "대용량으로 만들 때는 고춧가루가 많아 마늘분 대신 푸드프로세서에 간 마늘을 다져서 사용하세요. 시판 간마늘은 향이 좋지 않아 피하는 것이 좋습니다.",
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 3,
        title: "믹서기에 과일과 양념 갈기",
        description: [
          { content: "믹서기에 후르츠 칵테일 과육 20g과 양파 1/4개를 넣어주세요.", start: "00:02:52" },
          { content: "소불고기 양념장 16g과 물 150ml를 넣고 건더기가 보이지 않을 정도로 곱게 갈아주세요.", start: "00:03:00" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 4,
        title: "소스 끓여서 보관하기",
        description: [
          { content: "믹서기에 간 재료를 프라이팬에 모두 부어주세요.", start: "00:03:10" },
          { content: "중약불에서 주걱으로 바닥을 긁듯이 계속 저어주세요. 소스가 전체적으로 보글보글 끓어오르고 되직한 고추장 농도가 되면 불을 꺼주세요.", start: "00:03:13" },
          { content: "완성된 소스를 용기에 담고 랩으로 덮은 뒤 뚜껑을 닫아 냉장 보관해주세요.", start: "00:03:24" },
        ],
        tip: [
          "되직한 고추장 농도로 섞어 한 번 끓여 식힌 뒤 냉장 보관하면 필요할 때 바로 사용할 수 있습니다.",
          "생마늘을 사용했다면 마늘 풋내가 날아가도록 충분히 끓여주세요. 단, 바닥이 타면 탄 냄새를 돌이킬 수 없으니 계속 바닥을 긁듯이 저어야 합니다.",
        ],
        knowledge: null,
        scenes: [
          { label: "소스가 끓어오르는 정도와 되직한 고추장 농도 확인", start: "00:03:13", end: "00:03:24" },
        ],
        timerSeconds: null,
      },
      {
        order: 5,
        title: "부재료와 떡 손질하기",
        description: [
          { content: "도마 위에서 대파는 손가락 두께로 어슷하게 썰고, 어묵은 한 입 크기의 삼각형 모양으로 썰어주세요.", start: "00:03:39" },
          { content: "떡 200g을 낱개로 떼어내고, 먹기 좋은 길이가 되도록 가로로 반을 썰어주세요.", start: "00:03:55" },
          { content: "썬 떡을 그릇에 담고 물에 담가 헹궈주세요.", start: "00:04:42" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "대파 어슷썰기와 어묵을 삼각형 모양으로 써는 모습", start: "00:03:39", end: "00:03:55" },
          { label: "밀떡을 가로로 반 써는 방향과 잘린 떡의 길이 확인", start: "00:03:55", end: "00:04:42" },
        ],
        timerSeconds: null,
      },
      {
        order: 6,
        title: "냄비에 떡과 설탕 끓이기",
        description: [
          { content: "냄비에 물 450ml를 붓고 떡을 넣은 뒤 강불에서 끓여주세요.", start: "00:04:56" },
          { content: "물이 끓기 전 떡을 삶기 시작할 때 설탕 반 큰술을 냄비에 바로 넣고 저어주세요.", start: "00:05:04" },
        ],
        tip: "떡을 먼저 삶으면서 설탕을 넣어주면 떡에 간이 쏙 배어들어 더욱 맛있습니다.",
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
      {
        order: 7,
        title: "어묵과 대파, 소스 넣고 끓이기",
        description: [
          { content: "냄비에 썰어둔 어묵과 대파를 차례로 넣어주세요.", start: "00:05:25" },
          { content: "소스 150g을 풀고 중불에서 끓여주세요. 국물이 졸아들기 시작하면 약불로 줄이고, 떡에 양념이 걸쭉하게 배어들 때까지 총 5분 정도 끓여 농도를 맞춰주세요.", start: "00:05:38" },
        ],
        tip: null,
        knowledge: null,
        scenes: [
          { label: "국물이 졸아들어 떡에 소스가 걸쭉하게 묻어나는 농도 확인", start: "00:05:38", end: "00:05:51" },
        ],
        timerSeconds: 300,
      },
      {
        order: 8,
        title: "그릇에 떡볶이 담아 완성하기",
        description: [
          { content: "완성된 떡볶이를 접시에 담아주세요.", start: "00:05:51" },
        ],
        tip: null,
        knowledge: null,
        scenes: null,
        timerSeconds: null,
      },
    ],
    servingTip:
      "접시에 담은 떡볶이 위에 달걀 프라이를 얹어, 떡을 노른자에 찍어 먹으면 더욱 고소하고 맛있습니다.",
  },
};

/** 레시피 ID → 데이터 맵 */
export const RECIPE_MAP: Record<string, PocRecipeEntry> = {
  "aglio-olio": AGLIO_OLIO,
  "aglio-olio-v2": AGLIO_OLIO_V2,
  "aglio-olio-v4": AGLIO_OLIO_V4,
  "chadol-doenjang": CHADOL_DOENJANG,
  "chadol-doenjang-v2": CHADOL_DOENJANG_V2,
  "chadol-doenjang-v3": CHADOL_DOENJANG_V3,
  "chadol-doenjang-v4": CHADOL_DOENJANG_V4,
  "chadol-doenjang-v5": CHADOL_DOENJANG_V5,
  "chadol-doenjang-v6": CHADOL_DOENJANG_V6,
  "yeonbok-bokkeumbap": YEONBOK_BOKKEUMBAP,
  tteokbokki: TTEOKBOKKI,
};

export const DEFAULT_RECIPE_ID = "aglio-olio";

/** 하위 호환 — 기존 코드에서 MOCK_RECIPE / MOCK_VIDEO_ID로 참조하는 곳 대응 */
export function getRecipeEntry(recipeId?: string | null): PocRecipeEntry {
  return RECIPE_MAP[recipeId ?? DEFAULT_RECIPE_ID] ?? RECIPE_MAP[DEFAULT_RECIPE_ID];
}

export const MOCK_RECIPE = AGLIO_OLIO.recipe;
export const MOCK_VIDEO_ID = AGLIO_OLIO.videoId;
