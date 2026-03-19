const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testNvidia() {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey || apiKey === 'your_nvidia_api_key_here') {
        console.error('Please set NVIDIA_API_KEY in .env.local');
        return;
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'nvidia/llama-3.3-nemotron-super-49b-v1.5',
            messages: [{ role: 'user', content: 'Hello, who are you?' }],
            temperature: 0.7,
            top_p: 1,
            max_tokens: 1024,
            stream: false
        })
    });

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
}

testNvidia();
