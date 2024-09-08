import { generateQuestion } from '../../server/generateQuestion';

export default async function handler(req, res) {
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
