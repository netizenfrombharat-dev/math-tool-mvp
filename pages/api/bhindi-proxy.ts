import type { NextApiRequest, NextApiResponse } from 'next'

type BhindiRequest = {
  prompt: string
  sessionId: string
}

type BhindiResponse = {
  plan: string
  code: string
  explanation: string
  engine: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BhindiResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { prompt, sessionId } = req.body as BhindiRequest

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' })
  }

  // TODO: Replace with actual Bhindi API call
  // const bhindiApiKey = process.env.BHINDI_API_KEY
  // const response = await fetch('https://api.bhindi.io/v1/chat', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${bhindiApiKey}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ prompt, sessionId }),
  // })
  // const data = await response.json()

  // MOCK RESPONSE for immediate UI testing
  const mockResponse: BhindiResponse = {
    plan: `A) Computation Plan
task_type: symbolic
preferred_engine: JS-CAS
steps:
- parse expression
- compute derivative symbolically
- return LaTeX`,
    code: `// engine: Algebrite
const expr = "sin(x)*exp(x)";
const derivative = Algebrite.run("d(" + expr + ", x)");
derivative; // returns expression in Algebrite format`,
    explanation: `C) Plain Explanation
The derivative of sin(x)*e^x is computed using the product rule. The result combines trigonometric and exponential functions. This is a symbolic computation performed entirely in your browser using Algebrite.`,
    engine: 'Algebrite'
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  res.status(200).json(mockResponse)
}