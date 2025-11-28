const fs = require('fs');
const path = require('path');

const JSON_FILE = path.join(__dirname, 'SideNotes.json');
const RULES_FILE = path.join(__dirname, 'src/core/rules.ts');

const jsonData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

// Helper to find data in JSON array
const findData = (key) => {
    const item = jsonData.find(i => i[key]);
    return item ? item[key] : null;
};

const purpose = findData('Purpose');
const vision = findData('Vision');
const mission = findData('Mission');
const strategy = findData('Strategy');
const value = findData('Value');
const principle = findData('Principle');
const behavior = findData('Behavior');
const goals = findData('Goals');

let content = fs.readFileSync(RULES_FILE, 'utf8');

// 1. Update or Insert WIZARD_CONTENT
const wizardContentStart = 'export const WIZARD_CONTENT = {';
const startIndex = content.indexOf(wizardContentStart);

const newWizardContentObj = {
    Purpose: purpose,
    Vision: vision,
    Mission: mission,
    Strategy: strategy,
    Value: value,
    Principle: principle,
    Behavior: behavior,
    Goals: goals
};

const newWizardContentStr = `export const WIZARD_CONTENT = ${JSON.stringify(newWizardContentObj, null, 4)};`;

if (startIndex !== -1) {
    // Find matching closing brace
    let nesting = 0;
    let endIndex = -1;
    for (let j = startIndex + wizardContentStart.length - 1; j < content.length; j++) {
        if (content[j] === '{') nesting++;
        if (content[j] === '}') nesting--;
        if (nesting === 0 && content[j] === '}') {
            endIndex = j + 1;
            if (content[j + 1] === ';') endIndex++;
            break;
        }
    }

    if (endIndex !== -1) {
        content = content.substring(0, startIndex) + newWizardContentStr + content.substring(endIndex);
        console.log('Updated existing WIZARD_CONTENT');
    }
} else {
    // Insert after imports
    const importEnd = content.indexOf(';') + 1;
    content = content.slice(0, importEnd) + '\n\n' + newWizardContentStr + content.slice(importEnd);
    console.log('Inserted new WIZARD_CONTENT');
}

// 2. Helper to replace array content
function replaceArrayInContent(name, newData, isObjectArray = false) {
    if (!newData) {
        console.log(`No data for ${name}, skipping.`);
        return;
    }

    const startMarker = `export const ${name} = [`;
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) {
        console.log(`Could not find array ${name} to replace.`);
        return;
    }

    let nesting = 0;
    let endIndex = -1;
    for (let j = startIndex + startMarker.length - 1; j < content.length; j++) {
        if (content[j] === '[') nesting++;
        if (content[j] === ']') nesting--;
        if (nesting === 0 && content[j] === ']') {
            endIndex = j + 1;
            if (content[j + 1] === ';') endIndex++;
            break;
        }
    }

    if (endIndex === -1) return;

    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex);

    let newArrayStr;
    if (isObjectArray) {
        newArrayStr = `export const ${name} = [\n` +
            newData.map((item, idx) => `    { id: \`val-${idx}\`, label: "${item.replace(/"/g, '\\"')}", description: 'Core value statement', source: 'system', explanation: 'Suggested value' }`).join(',\n') +
            `\n];`;
    } else {
        newArrayStr = `export const ${name} = [\n` +
            newData.map(item => `    "${item.replace(/"/g, '\\"')}"`).join(',\n') +
            `\n];`;
    }

    content = before + newArrayStr + after;
    console.log(`Updated ${name}`);
}

replaceArrayInContent('PURPOSE_TEMPLATES', purpose?.Statements);
replaceArrayInContent('VISION_TEMPLATES', vision?.Statements);
replaceArrayInContent('MISSION_TEMPLATES', mission?.Statements);
replaceArrayInContent('VALUES_LIST', value?.Statements, true);

// Principles now have structured data with Name and Principle fields
// Extract just the Name for PRINCIPLE_TEMPLATES and PRINCIPLE_LIBRARY
const principleNames = principle?.Items?.map(item => item.Name) || [];
replaceArrayInContent('PRINCIPLE_TEMPLATES', principleNames);
replaceArrayInContent('PRINCIPLE_LIBRARY', principleNames);

replaceArrayInContent('BEHAVIOR_TEMPLATES', behavior?.Items);
replaceArrayInContent('BEHAVIOR_LIBRARY', behavior?.Items);
replaceArrayInContent('GOAL_TEMPLATES', goals?.Items);


fs.writeFileSync(RULES_FILE, content);
console.log('Done updating rules.ts');
