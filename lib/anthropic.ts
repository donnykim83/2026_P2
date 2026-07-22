import Anthropic from "@anthropic-ai/sdk";

export type Tone = "fun" | "traditional";

const DISCLAIMER =
  "이 해석은 전통 관상학 문헌을 참고한 오락 콘텐츠이며, 과학적으로 검증된 사실이 아닙니다. 개인의 성격이나 운명은 얼굴만으로 판단할 수 없습니다.";

const SYSTEM_PROMPTS: Record<Tone, string> = {
  fun: `당신은 유쾌하고 재치있는 관상 해설가입니다. 업로드된 인물 사진을 보고, 전통 관상학 용어(이마, 눈썹, 눈, 코, 입, 턱 등)를 가볍게 인용하면서 재미있고 긍정적인 톤으로 성격과 운세를 풀이해주세요.
규칙:
- 외모를 비하하거나 부정적으로 단정짓는 표현은 절대 사용하지 마세요.
- 인종, 성별, 나이 등에 대한 편견이 담긴 해석은 하지 마세요.
- 유머러스하고 따뜻한 톤을 유지하되, 구체적인 얼굴 특징(예: "이마가 넓으시네요")을 언급하며 해석해주세요.
- 답변 마지막에 반드시 아래 문구를 그대로 포함하세요:
"${DISCLAIMER}"`,
  traditional: `당신은 전통 관상학(면상학) 이론에 정통한 해설가입니다. 업로드된 인물 사진을 보고 삼정(三停), 오악(五嶽), 오관(五官) 등 전통 관상학 이론 체계를 인용하며 비교적 진지하고 학술적인 어조로 해석해주세요.
규칙:
- 전통 이론을 인용할 때는 어떤 개념(예: "삼정 중 중정")을 근거로 하는지 명시하세요.
- 외모를 비하하거나 부정적으로 단정짓는 표현은 절대 사용하지 마세요.
- 인종, 성별, 나이 등에 대한 편견이 담긴 해석은 하지 마세요.
- 학술적 어조를 유지하되, 이것이 현대 과학으로 검증된 이론이 아니라 전통적으로 전해 내려오는 해석 체계임을 분명히 하세요.
- 답변 마지막 부분(면책 문구 바로 앞)에 "### 조심해야 할 부분" 섹션을 추가하세요. 이 섹션에는 전통 관상학 이론에 근거한 성향·행동상의 주의사항 1~2가지를 건설적으로 제시하세요 (예: "급한 성정을 다스리는 노력이 필요합니다"). 외모 자체를 지적하거나 부정적으로 평가하는 표현은 절대 사용하지 마세요.
- 답변 마지막에 반드시 아래 문구를 그대로 포함하세요:
"${DISCLAIMER}"`,
};

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY 환경변수가 설정되어 있지 않습니다.");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export async function analyzePhoto(
  imageBase64: string,
  mediaType: string,
  tone: Tone
): Promise<string> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    system: SYSTEM_PROMPTS[tone],
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as
                | "image/jpeg"
                | "image/png"
                | "image/gif"
                | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: "이 사진 속 인물의 관상을 풀이해주세요.",
          },
        ],
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude로부터 텍스트 응답을 받지 못했습니다.");
  }
  return textBlock.text;
}

export type ActorMatch = {
  subjectGender: "male" | "female";
  actorName: string;
  actorNameEn?: string;
  reason: string;
};

const MATCH_SYSTEM_PROMPT = `당신은 관상학적 궁합을 재미있게 짚어주는 해설가입니다. 업로드된 인물 사진을 보고, 관상학적으로 잘 어울리는 "이상적인 배우자상"을 실존 배우의 이미지로 표현해서 추천하세요.

규칙:
- 먼저 사진 속 인물의 성별을 판단하고, 반드시 반대 성별의 배우를 추천하세요 (사진 속 인물이 남성이면 여성 배우를, 여성이면 남성 배우를 추천).
- 실존하는, 폭넓게 알려진 배우만 추천하세요. 무명이거나 위키피디아에서 찾기 어려운 인물은 피하세요.
- 미성년자이거나 심각한 사회적 논란의 중심에 있는 인물은 추천하지 마세요.
- 국내외 구분 없이 자유롭게 선택하되, 위키피디아 검색에 쓸 수 있는 정식 이름(actorName)과, 가능하다면 영문/로마자 이름(actorNameEn)도 함께 알려주세요.
- 외모를 비하하거나 부정적으로 단정짓는 표현은 사용하지 마세요.
- 추천 이유는 2~3문장으로, 관상학적 특징(이목구비의 분위기, 인상 등)을 근거로 가볍고 유쾌하게 설명하세요.
- 이것은 오락 목적의 콘텐츠이며 추천된 배우 개인과는 무관하고, 실제 인연이나 결혼을 의미하지 않는다는 것을 감안한 가벼운 톤을 유지하세요.`;

const MATCH_TOOL_NAME = "report_actor_match";

export async function matchActor(imageBase64: string, mediaType: string): Promise<ActorMatch> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    system: MATCH_SYSTEM_PROMPT,
    tools: [
      {
        name: MATCH_TOOL_NAME,
        description: "관상 궁합상 어울리는 배우 추천 결과를 구조화된 형태로 보고합니다.",
        input_schema: {
          type: "object",
          properties: {
            subjectGender: {
              type: "string",
              enum: ["male", "female"],
              description: "사진 속 인물의 성별 추정치",
            },
            actorName: {
              type: "string",
              description: "추천 배우의 정식 이름 (한국 배우라면 한글 이름)",
            },
            actorNameEn: {
              type: "string",
              description: "위키피디아 검색용 영문/로마자 이름 (모르면 생략 가능)",
            },
            reason: {
              type: "string",
              description: "관상학적으로 어울리는 이유 (2~3문장, 오락 목적의 가벼운 톤)",
            },
          },
          required: ["subjectGender", "actorName", "reason"],
        },
      },
    ],
    tool_choice: { type: "tool", name: MATCH_TOOL_NAME },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as
                | "image/jpeg"
                | "image/png"
                | "image/gif"
                | "image/webp",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: "이 사진 속 인물과 관상학적으로 어울리는 반대 성별의 유명 배우를 한 명 추천해주세요.",
          },
        ],
      },
    ],
  });

  const toolBlock = message.content.find((block) => block.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("Claude로부터 추천 결과를 받지 못했습니다.");
  }
  return toolBlock.input as ActorMatch;
}
