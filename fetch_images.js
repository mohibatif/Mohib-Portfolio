const https = require('https');

const urls = [
  'https://www.linkedin.com/feed/update/urn:li:activity:7318574161935630336/',
  'https://www.linkedin.com/feed/update/urn:li:activity:7384102314048999424/',
  'https://www.linkedin.com/feed/update/urn:li:activity:7308012683994259458/',
  'https://www.linkedin.com/posts/iamohib_gdg-gdgocumt-google-activity-7309482136120582144-vytU?utm_source=share&utm_medium=member_desktop&rcm=ACoAADC66nkBtWFFeQ9WKzThjnAqmzu4k5ZnLm0'
];

async function fetchOgImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
        if (match) {
          resolve(match[1].replace(/&amp;/g, '&'));
        } else {
          resolve('No og:image found');
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const fs = require('fs');
  const results = [];
  for (const url of urls) {
    const img = await fetchOgImage(url);
    results.push({ url, image: img });
  }
  fs.writeFileSync('images.json', JSON.stringify(results, null, 2));
}

main();
