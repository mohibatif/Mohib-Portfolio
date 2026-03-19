const fetch = require('node-fetch');

async function testChat() {
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: 'Hello again!',
                history: [
                    { role: 'assistant', content: 'Hi! How can I help?' } // This should be dropped/sanitized
                ]
            })
        });
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

testChat();
