
// 위 코드 추가함
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { generateQuestion } = require('./generateQuestion');
const anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4006;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
  const { type, text } = req.body;

  try {
    const question = await generateQuestion(type, text);
    res.json({ question });
  } catch (error) {
    console.error('Error generating question:', error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

// app.use(cors());
// app.use(bodyParser.json());

// const client = new anthropic.Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY, // 환경 변수에서 API 키를 가져옵니다.
// });('/api/generate', async (req, res) => {
//   const { type, text } = req.body;

//   try {
//     const message = await client.messages.create({
//       model: "claude-3-5-sonnet-20240620",
//       max_tokens: 1000,
//       temperature: 0.1,
//       system: "You are an assistant teacher for an English teacher, focusing on students at autonomous private high schools in Korea. Your main task is to create SAT-style English questions. Follow these guidelines:\erate questions based on the given English passage.\nCreate questions that match the requested question type.\nProvide the question, answer choices, correct answer, explanation, and Korean translation of the passage in Korean.\nQuestions should follow the SAT format and be suitable for high school students.\nUse clear and concise language when writing questions.\nBe prepared to provide additional explanations or examples if needed.",
//       messages: [
//         {
//           role: "user",
//           content: `Text: ${text}\n\nProblem Type: ${type}\n\nGenerate a ${type} question based on the above text.`
//         }
//       ]
//     });

//     res.json({ question: message.content });
//   } catch (error) {
//     console.error('Error generating question:', error.message);
//     res.status(500).json({ error: 'Internal Server Error', message: error.message });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

