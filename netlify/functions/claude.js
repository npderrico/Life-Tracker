exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: body.system,
        tools: [
          { type: 'web_search_20250305', name: 'web_search' },
          {
            name: 'get_past_log',
            description: "Fetch Nick's calorie/activity log for a specific past date. Use whenever he asks about what he ate, his deficit, weight, or tasks on a previous day.",
            input_schema: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  description: 'The date to fetch. Accepts natural language like "yesterday", "Monday", "last Friday", or ISO format like "2025-05-05".'
                }
              },
              required: ['date']
            }
          },
          {
            name: 'get_past_workout',
            description: "Fetch Nick's workout log for a specific past date — exercises completed, sets/reps/weight logged, run duration, and calories burned. Use when he asks about a past workout, what weight he used, how his session went, or training progress.",
            input_schema: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  description: 'The date to fetch. Accepts "yesterday", "Monday", "last Friday", or ISO format.'
                }
              },
              required: ['date']
            }
          }
        ],
        messages: body.messages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: err.message } })
    };
  }
};
