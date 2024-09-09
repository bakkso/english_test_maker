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
  console.log('Raw body:', req.body);
  let { type, text } = req.body;

  if (typeof req.body === 'string') {
    const parsedBody = JSON.parse(req.body);
    type = parsedBody.type;
    text = parsedBody.text;
  }

  console.log('Parsed type:', type);
  console.log('Parsed text:', text);
  
  if (!type || !text) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const client = new anthropic.Anthropic({
    apiKey: apiKey,
  });
  let prompt_question = "";

  if ( type === "Topic Question") {
    prompt_question = "[문제] 다음 글의 주제로 가장 적절한 것은? We argue that the ethical principles of justice provide an essential foundation for policies to protect unborn generations and the poorest countries from climate change. Related issues arise in connection with current and persistently inadequate aid for these nations, in the face of growing threats to agriculture and water supply, and the rules of international trade that mainly benefit rich countries. Increasing aid for the world’s poorest peoples can be an essential part of effective mitigation. With 20 percent of carbon emissions from (mostly tropical) deforestation, carbon credits for forest preservation would combine aid to poorer countries with one of the most cost-effective forms of abatement. Perhaps the most cost-effective but politically complicated policy reform would be the removal of several hundred billions of dollars of direct annual subsidies from the two biggest recipients in the OECD―destructive industrial agriculture and fossil fuels. Even a small amount of this money would accelerate the already rapid rate of technical progress and investment in renewable energy in many areas, as well as encourage the essential switch to conservation agriculture. • mitigation: 완화 ** abatement: 감소 *** subsidy: 보조금 ① reforming diplomatic policies in poor countries ② coping with climate change by reforming aid and policies ③ reasons for restoring economic equality in poor countries ④ increasing global awareness of the environmental crisis ⑤ roles of the OECD in solving international conflicts";
  }
  else if ( type === "Title Question") {
    prompt_question = "[문제] 다음 글의 제목으로 가장 적절한 것은? A defining element of catastrophes is the magnitude of their harmful consequences. To help societies prevent or reduce damage from catastrophes, a huge amount of effort and technological sophistication are often employed to assess and communicate the size and scope of potential or actual losses. This effort assumes that people can understand the resulting numbers and act on them appropriately. However, recent behavioral research casts doubt on this fundamental assumption. Many people do not understand large numbers. Indeed, large numbers have been found to lack meaning and to be underestimated in decisions unless they convey affect (feeling). This creates a paradox that rational models of decision making fail to represent. On the one hand, we respond strongly to aid a single individual in need. On the other hand, we often fail to prevent mass tragedies or take appropriate measures to reduce potential losses from natural disasters. * catastrophe: 큰 재해 ① Be Careful, Numbers Magnify Feelings! ② Preventing Potential Losses Through Technology ③ How to Reach Out a Hand to People in Desperate Need ④ Power of Numbers: A Way of Classifying Natural Disasters ⑤ Insensitivity to Mass Tragedy: We Are Lost in Large Numbers";
  }
  else if ( type === "Inference Question") {
    prompt_question = "[문제] 밑줄 친 “refining ignorance”가 다음 글에서 의미하는 바로 가장 적절한 것은? Although not the explicit goal, the best science can really be seen as refining ignorance. Scientists, especially young ones, can get too obsessed with results. Society helps them along in this mad chase. Big discoveries are covered in the press, show up on the university’s home page, help get grants, and make the case for promotions. But it’s wrong. Great scientists, the pioneers that we admire, are not concerned with results but with the next questions. The highly respected physicist Enrico Fermi told his students that an experiment that successfully proves a hypothesis is a measurement; one that doesn’t is a discovery. A discovery, an uncovering ― of new ignorance. The Nobel Prize, the pinnacle of scientific accomplishment, is awarded, not for a lifetime of scientific achievement, but for a single discovery, a result. Even the Nobel committee realizes in some way that this is not really in the scientific spirit, and their award citations commonly honor the discovery for having “opened a field up,” “transformed a field,” or “taken a field in new and unexpected directions.” • pinnacle: 정점 ① 아직 알려지지 않은 것을 향해 나아가는 것 ② 발견된 것에 대한 궁극적인 설명을 제공하는 것 ③ 기존 지식을 객관적인 시각으로 분석하는 것 ④ 과학자들에게 중요한 발견을 알리도록 영감을 주는 것 ⑤ 학생들에게 새로운 과학 분야를 알리는 것 [정답] ①";
  }
  else if ( type === "Detail Match Question" || type === "Detail Mismatch Question") {
    prompt_question = "[문제] Marjorie Kinnan Rawlings에 관한 다음 글의 내용과 일치 하지 않는 것은? Marjorie Kinnan Rawlings, an American author born in Washington, D.C. in 1896, wrote novels with rural themes and settings. While she was young, one of her stories appeared in The Washington Post. After graduating from university, Rawlings worked as a journalist while simultaneously trying to establish herself as a fiction writer. In 1928, she purchased an orange grove in Cross Creek, Florida. This became the source of inspiration for some of her writings which included The Yearling and her autobiographical book, Cross Creek. In 1939, The Yearling, which was about a boy and an orphaned baby deer, won the Pulitzer Prize for Fiction. Later, in 1946, The Yearling was made into a film of the same name. Rawlings passed away in 1953, and the land she owned at Cross Creek has become a Florida State Park honoring her achievements. * grove: 과수원 ① Washington, D.C.에서 태어난 미국 작가이다. ② 그녀의 이야기 중 하나가 The Washington Post에 실렸다. ③ 대학교를 졸업한 후 저널리스트로 일했다. ④ The Yearling이라는 소설은 다른 제목으로 영화화되었다. ⑤ Cross Creek에 소유했던 땅은 Florida 주립 공원이 되었다.";
  }
  else if ( type === "Vocabulary Question") {
    prompt_question = "[문제] 다음 글의 밑줄 친 부분 중, 어법상 틀린 것은? 'Monumental' is a word that comes very close to (1 expressing) the basic characteristic of Egyptian art. Never before and never since has the quality of monumentality been achieved as fully as it (2 did) in Egypt. The reason for this is not the external size and massiveness of their works, although the Egyptians admittedly achieved some amazing things in this respect. Many modern structures exceed (3 those) of Egypt in terms of purely physical size. But massiveness has nothing to do with monumentality. An Egyptian sculpture no bigger than a person’s hand is more monumental than that gigantic pile of stones (4 that) constitutes the war memorial in Leipzig, for instance. Monumentality is not a matter of external weight, but of 'inner weight.' This inner weight is the quality which Egyptian art possesses to such a degree that everything in it seems to be made of primeval stone, like a mountain range, even if it is only a few inches across or (5 carved) in wood. * gigantic: 거대한 ** primeval: 원시 시대의 ① expressing ② did ③ those ④ that ⑤ carved";
  }
  else if ( type === "Fill-in-the-Blank Question") {
    prompt_question = "[문제] 빈칸에 들어갈 말로 가장 적절한 것은? Finkenauer and Rimé investigated the memory of the unexpected death of Belgium’s King Baudouin in 1993 in a large sample of Belgian citizens. The data revealed that the news of the king’s death had been widely socially shared. By talking about the event, people gradually constructed a social narrative and a collective memory of the emotional event. At the same time, they consolidated their own memory of the personal circumstances in which the event took place, an effect known as 'flashbulb memory.' The more an event is socially shared, the more it will be fixed in people’s minds. Social sharing may in this way help to counteract some natural tendency people may have. Naturally, people should be driven to 'forget' undesirable events. Thus, someone who just heard a piece of bad news often tends initially to deny what happened. The __________ social sharing of the bad news contributes to realism. * consolidate: 공고히 하다 ① repetitive ② illegal ③ biased ④ temporary ⑤ rational";
  }
  else if ( type === "Sequence Question") {
    prompt_question = "[문제] 주어진 글 다음에 이어질 글의 순서로 가장 적절한 것을 고르시오. Researchers in psychology follow the scientific method to perform studies that help explain and may predict human behavior. This is a much more challenging task than studying snails or sound waves. (A) But for all of these difficulties for psychology, the payoff of the scientific method is that the findings are replicable; that is, if you run the same study again following the same procedures, you will be very likely to get the same results. (B) It often requires compromises, such as testing behavior within laboratories rather than natural settings, and asking those readily available (such as introduction to psychology students) to participate rather than collecting data from a true cross-section of the population. It often requires great cleverness to conceive of measures that tap into what people are thinking without altering their thinking, called reactivity. (C) Simply knowing they are being observed may cause people to behave differently (such as more politely!). People may give answers that they feel are more socially desirable than their true feelings. * replicable: 반복 가능한 ① (A)-(C)-(B) ② (B)-(A)-(C) ③ (B)-(C)-(A) ④ (C)-(A)-(B) ⑤ (C)-(B)-(A)";
  }
  else if ( type === "Sentence Insertion Question") {
    prompt_question = "복잡한 지문의 핵심 내용을 간결하게 요약하는 능력 평가,주요 정보와 부가적 정보를 구분하여 핵심만을 추출하는 능력 요구, 요약문의 빈칸에 적절한 단어나 구를 추론하여 완성하는 능력 평가";
  }
  else if ( type === "Summary Fill-in-the-Blank Question") {
    prompt_question = "[문제] 다음 글의 내용을 한 문장으로 요약하고자 한다. 빈칸 (A), (B)에 들어갈 말로 가장 적절한 것은? Biological organisms, including human societies both with and without market systems, discount distant outputs over those available at the present time based on risks associated with an uncertain future. As the timing of inputs and outputs varies greatly depending on the type of energy, there is a strong case to incorporate time when assessing energy alternatives. For example, the energy output from solar panels or wind power engines, where most investment happens before they begin producing, may need to be assessed differently when compared to most fossil fuel extraction technologies, where a large proportion of the energy output comes much sooner, and a larger (relative) proportion of inputs is applied during the extraction process, and not upfront. Thus fossil fuels, particularly oil and natural gas, in addition to having energy quality advantages (cost, storability, transportability, etc.) over many renewable technologies, also have a 'temporal advantage' after accounting for human behavioral preference for current consumption/return. * upfront: 선행 투자의 --> Due to the fact that people tend to favor more (A) outputs, fossil fuels are more (B) than renewable energy alternatives in regards to the distance between inputs and outputs. (A) - (B) ① immediate - competitive ② available - expensive ③ delayed - competitive ④ convenient - expensive ⑤ abundant - competitive";
  }
  else if ( type === "Synonyms and Antonyms") {
    prompt_question = "고급 어휘의 미묘한 의미 차이를 구별하는 능력 평,문맥에 따른 단어의 뉘앙스 변화 이해 요구, 유사한 의미를 가진 단어들 사이의 세밀한 차이 파악 능력 평가";
  }
  else if ( type === "Content Organization") {
    prompt_question = "복잡한 글의 구조와 논리 전개 방식을 분석하는 능력 평가, 글의 전개 방식(비교/대조, 인과관계, 문제/해결 등)을 파악하는 능력 요구, 각 문단의 기능과 전체 글에서의 역할 이해 필요";
  }



  try {
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 3000,
      temperature: 0.1,
      system : `You are an assistant teacher for an English teacher, focusing on students at top-tier autonomous private high schools in Korea. Your main task is to create challenging SAT-style English questions. Follow these guidelines: 1. Generate questions based on the given English passage. 2. Create questions that match the requested question type. 3. Provide the question, answer choices, correct answer, explanation, and Korean translation of the passage in Korean. 4. Adhere to the SAT format appropriate for students aiming to apply to top-tier universities. 5. Maintain the following consistent format for all questions: [문제] 다음 글의 (요구되는 문제 유형에 따른 질문)① (선택지 1) ② (선택지 2) ③ (선택지 3) ④ (선택지 4) ⑤ (선택지 5) [정답] (정답 번호) [해설] (상세하고 심층적인 해설, 오답 선택지에 대한 설명 포함) [보기해석] ① (선택지 1 해석) ② (선택지 2 해석) ③ (선택지 3 해석) ④ (선택지 4 해석) ⑤ (선택지 5 해석) [지문해석] (영문 지문의 한글 번역), 각 문제별 상세 예시는 다음과 같습니다 : ${prompt_question}`,
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