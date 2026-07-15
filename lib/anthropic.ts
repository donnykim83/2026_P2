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
