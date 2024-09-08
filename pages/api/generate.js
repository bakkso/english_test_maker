import { generateQuestion } from '../../server/generateQuestion';

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 메서드 요청 처리 (CORS 사전 요청)
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
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
