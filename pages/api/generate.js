import { generateQuestion } from '../../server/generateQuestion';

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*'); // 모든 도메인 허용
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS'); // 허용할 메서드
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // 허용할 헤더

  // OPTIONS 메서드 요청 처리 (CORS 사전 요청)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { type, text } = req.body;

    try {
      const question = await generateQuestion(type, text);
      res.status(200).json({ question });
    } catch (error) {
      console.error('Error generating question:', error.message);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  } else {
    // POST 메서드 외에는 허용하지 않음
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
