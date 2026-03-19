const fetch = require('node-fetch');
const fs = require('fs');

async function testChat() {
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'test' })
        });
        const data = await response.json();
        fs.writeFileSync('out.json', JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        fs.writeFileSync('out.json', JSON.stringify({error: e.message}), 'utf-8');
    }
}

testChat();
