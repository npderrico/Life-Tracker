exports.handler = async () => {
  const config = {
    apiKey:            process.env.FB_API_KEY,
    authDomain:        process.env.FB_AUTH_DOMAIN,
    databaseURL:       process.env.FB_DATABASE_URL,
    projectId:         process.env.FB_PROJECT_ID,
    storageBucket:     process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId:             process.env.FB_APP_ID,
  };

  const missing = Object.entries(config).filter(([,v]) => !v).map(([k]) => k);
  if (missing.length) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing env vars: ' + missing.join(', ') })
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(config)
  };
};
