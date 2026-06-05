const fs = require('fs');
const path = require('path');

const directory = 'g:/Projects/TravelBharat/travelbharat-frontend/src';

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We want to replace <div className="max-w-7xl mx-auto px-4 ..."> with <PageContainer className="...">
    // Or just replace max-w-7xl with max-w-[1600px] to be simple and not mess up imports?
    // The user said: "Take the width of navbar for all the pages. doesn't change the width of navbar keep it as it is."
    // Navbar width is max-w-[1600px] w-full mx-auto px-4.
    // Easiest is to just replace max-w-7xl with max-w-[1600px] everywhere.

    content = content.replace(/max-w-7xl/g, 'max-w-[1600px] w-full');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
};

const walkSync = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walkSync(filePath);
        } else if (filePath.endsWith('.jsx')) {
            replaceInFile(filePath);
        }
    }
};

walkSync(directory);
