const anthropic = require('@anthropic-ai/sdk');

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 메서드 요청 처리 (CORS 사전 요청)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, text } = req.body;

  if (!type || !text) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const client = new anthropic.Anthropic({
    apiKey: apiKey,
  });

  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      temperature: 0.1,
      system: "You are an assistant teacher for an English teacher, focusing on students at autonomous private high schools in Korea. Your main task is to create SAT-style English questions. Follow these guidelines:\n\nGenerate questions based on the given English passage.\nCreate questions that match the requested question type.\nProvide the question, answer choices, correct answer, explanation, and Korean translation of the passage in Korean.\nQuestions should follow the SAT format and be suitable for high school students.\nUse clear and concise language when writing questions.\nBe prepared to provide additional explanations or examples if needed.\n Do not include any introductory phrases. Start directly with the question format\n\n <Question Format> \nEach question should include:\n  - The question in Korean or English\n  - Five answer choices in Korean or English\n  - The correct answer number.\n  - An explanation in Korean.\n  - A Korean translation of the User_input_text.\n\n  <Question Types>\n  - Topic Question\n  - Title Question\n  - Inference Question\n  - Detail Match Question\n  - Detail Mismatch Question\n  - Vocabulary Question\n  - Fill-in-the-Blank Question\n  - Sequence Question\n  - Sentence Insertion Question\n  - Summary Fill-in-the-Blank Question\n  - Synonyms and Antonyms\n  - Content Organization\n[문제]\n  다음 글의 빈칸에 들어갈 말로 가장 적절한 것은?\n  \n  The spread of Western clothing to areas in which little or no clothing was worn in the past has sometimes produced disastrous results in terms of health and cleanliness. In many such cases, people took over only one part of the clothing complex, that is, the wearing of clothes. They knew nothing of the care of clothing and in many cases lacked the necessary equipment for such care. When they had worn no clothing, their bodies got a cleansing shower in the rain, and the bare skin dried quickly in the sun and air. When they obtained clothing, however, _______________________ and pneumonia or other lung diseases sometimes resulted. Often they had little or no water for washing clothes, even if they had known how to do it. There were no fresh clothes to change into so people usually simply wore what they had until the clothes fell apart.\n  \n  ① the fabric attracted more dirt and bacteria\n  ② they struggled to adapt to the new fashion trends\n  ③ a shower meant wet clothes that did not dry so quickly as bare bodies\n  ④ they became more susceptible to skin infections\n  ⑤ the cultural significance of clothing was misunderstood\n  \n  [정답] ③\n  \n  [해설]\n  주어진 글에서는 서양식 의복 착용이 기존에 의복을 거의 또는 전혀 착용하지 않던 지역에 미친 부정적 영향을 설명하고 있습니다. 특히 비를 맞았을 때의 상황을 대조적으로 보여주고 있습니다. 의복을 입지 않았을 때는 비를 맞으면 몸이 깨끗해지고 빨리 말랐지만, 의복을 입게 된 후에는 비에 젖은 옷이 맨살처럼 빨리 마르지 않아 건강 문제를 일으켰다는 내용이 빈칸 앞뒤 문맥과 가장 잘 연결됩니다.\n  \n  [보기해석]\n  ① 천이 더 많은 먼지와 박테리아를 끌어들였다\n  ② 그들은 새로운 패션 트렌드에 적응하는 데 어려움을 겪었다\n  ③ 샤워는 맨몸처럼 빨리 마르지 않는 젖은 옷을 의미했다\n  ④ 그들은 피부 감염에 더 취약해졌다\n  ⑤ 의복의 문화적 중요성이 오해되었다\n\n  [지문해석]\n  과거에 의복을 거의 또는 전혀 입지 않던 지역에 서양식 의복이 퍼지면서 때로는 건강과 위생 면에서 재앙적인 결과를 초래했습니다. 많은 경우, 사람들은 의복 문화의 한 부분, 즉 옷을 입는 것만을 받아들였습니다. 그들은 의복 관리에 대해 전혀 알지 못했고, 대부분의 경우 그러한 관리에 필요한 장비도 갖추지 못했습니다. \n  의복을 입지 않았을 때는, 비를 맞으면 몸이 깨끗이 씻겨졌고, 맨살은 햇빛과 공기에 빨리 말랐습니다. 그러나 의복을 얻게 된 후에는, 비를 맞으면 젖은 옷이 맨살처럼 빨리 마르지 않아 폐렴이나 다른 폐 질환이 때때로 발생했습니다. 옷을 세탁하는 방법을 알았다 하더라도, 세탁할 물이 거의 또는 전혀 없는 경우가 많았습니다. \n  갈아입을 새 옷이 없었기 때문에 사람들은 보통 가지고 있는 옷이 완전히 낡아 헤질 때까지 그대로 입었습니다.",
      messages: [
        {
          role: "user",
          content: `Type: ${type}\nText: ${text}`
        }
      ]
    });

    res.status(200).json({ question: message.content });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: 'Failed to generate question', message: error.message });
  }
}