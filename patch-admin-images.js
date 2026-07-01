const fs = require('fs');
const path = require('path');

const walk = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
};

const dir = 'g:/Projects/TravelBharat/travelbharat-frontend/src/features/admin';
const files = walk(dir);

let modified = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let orig = content;
    
    content = content.replace(/src={([^}]+?\.(?:images\.thumbnail|images\.hero|profileImage|coverImage|image))}/g, (match, p1) => {
        if (p1.includes('||')) {
            let newP1 = p1.replace(/([\w\.]+?\.(?:images\.thumbnail|images\.hero|profileImage|coverImage|image))/g, '($1?.url || $1)');
            return `src={${newP1}}`;
        }
        return `src={${p1}?.url || ${p1}}`;
    });

    content = content.replace(/<ImageTile\s+src={([^}]+?\.(?:images\.thumbnail|images\.hero|profileImage|coverImage|image))}/g, (match, p1) => {
        if (p1.includes('||')) {
            let newP1 = p1.replace(/([\w\.]+?\.(?:images\.thumbnail|images\.hero|profileImage|coverImage|image))/g, '($1?.url || $1)');
            return `<ImageTile src={${newP1}}`;
        }
        return `<ImageTile src={${p1}?.url || ${p1}}`;
    });

    if (orig !== content) {
        fs.writeFileSync(file, content, 'utf8');
        modified++;
    }
});

console.log('Modified files:', modified);
