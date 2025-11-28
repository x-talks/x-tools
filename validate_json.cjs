const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, 'SideNotes.json');

try {
    const rawData = fs.readFileSync(JSON_FILE, 'utf8');
    const data = JSON.parse(rawData);
    console.log('JSON is valid.');

    // Check structure
    data.forEach(item => {
        const key = Object.keys(item)[0];
        console.log(`Found key: ${key}`);
        const content = item[key];
        if (content.Statements) console.log(` - Has ${content.Statements.length} statements`);
        if (content.Items) console.log(` - Has ${content.Items.length} items`);
        if (content.Description) console.log(` - Has Description`);
        if (content.Formula) console.log(` - Has Formula`);
    });

} catch (e) {
    console.error('JSON Error:', e.message);
    process.exit(1);
}
