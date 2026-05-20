const SYSTEM_PROMPT = `You are ContractShield AI, an expert legal contract analyst. Analyze the provided contract text and return a structured JSON response.

Your analysis must include:
1. Contract type identification
2. Key parties involved
3. Overall risk score (0-100)
4. Overall risk level (low/medium/high)
5. Specific risks found (each with: title, level, description, and the problematic clause if applicable)
6. Actionable recommendations
7. A plain-language summary of the contract

Focus on identifying:
- One-sided termination clauses
- Overly broad non-compete/NDA terms
- Unlimited liability exposure
- Auto-renewal traps
- Ambiguous payment terms
- Missing key protections (IP ownership, dispute resolution)
- Penalty clauses that are disproportionate
- Waiver of important rights

Return ONLY valid JSON in this exact format:
{
  "contractType": "string",
  "parties": "string",
  "riskScore": number,
  "overallRisk": "low|medium|high",
  "risks": [
    {
      "title": "string",
      "level": "low|medium|high",
      "description": "string",
      "clause": "string or null"
    }
  ],
  "recommendations": ["string"],
  "summary": "string"
}`

export async function analyzeContract(contractText, apiKey) {
  // Using MiMo-compatible OpenAI API format
  const response = await fetch('https://api.xiaomimimo.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'MiMo-7B-RL',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Please analyze the following contract:\n\n${contractText}` }
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API Error (${response.status}): ${err}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Failed to parse analysis response')
  }

  return JSON.parse(jsonMatch[0])
}
