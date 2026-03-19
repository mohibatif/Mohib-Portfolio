const https = require('https');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const keyMatch = env.match(/GEMINI_API_KEY=(.*)/);
const key = keyMatch ? keyMatch[1].trim() : '';

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            if (parsedData.models) {
                fs.writeFileSync('models.json', JSON.stringify(parsedData.models.map(m => m.name), null, 2));
                console.log('Saved to models.json');
            } else {
                console.error(parsedData);
            }
        } catch (e) {
            console.error(e.message);
        }
    });
});
