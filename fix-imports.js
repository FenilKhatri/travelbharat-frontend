import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToProcess = [
  path.join(__dirname, 'src')
];

function getFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

let files = [];
for (const d of dirsToProcess) {
  files = files.concat(getFiles(d));
}

let totalFixed = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const replacePath = (match, importPath) => {
    const dir = path.dirname(file);
    let resolved = path.resolve(dir, importPath);
    
    const exists = (p) => {
      if (fs.existsSync(p)) {
        // if it's a directory without index.js it's probably not right, but typically resolve logic handles it.
        // wait, let's assume if it exists and is file, it's good.
        if (fs.statSync(p).isFile()) return true;
        if (fs.existsSync(path.join(p, 'index.js'))) return true;
        if (fs.existsSync(path.join(p, 'index.jsx'))) return true;
      }
      if (fs.existsSync(p + '.js')) return true;
      if (fs.existsSync(p + '.jsx')) return true;
      return false;
    };
    
    if (exists(resolved)) return match;
    
    let found = false;
    let fixedPath = importPath;
    
    // Try adding ../
    for (let i = 0; i < 5; i++) {
      fixedPath = '../' + fixedPath;
      if (exists(path.resolve(dir, fixedPath))) { found = true; break; }
    }
    
    if (!found) {
      // Try removing ../
      fixedPath = importPath;
      for (let i = 0; i < 5; i++) {
        if (fixedPath.startsWith('../')) {
          fixedPath = fixedPath.substring(3);
          let testPath = fixedPath;
          if (!testPath.startsWith('.')) testPath = './' + testPath;
          if (exists(path.resolve(dir, testPath))) {
            fixedPath = testPath;
            found = true;
            break;
          }
        }
      }
    }
    
    if (found) {
      console.log(`Fixed in ${path.relative(__dirname, file)}: ${importPath} -> ${fixedPath}`);
      changed = true;
      return match.replace(importPath, fixedPath);
    } else {
      console.log(`Could NOT fix in ${path.relative(__dirname, file)}: ${importPath}`);
      return match;
    }
  };

  content = content.replace(/from\s+["'](\.[^"']+)["']/g, replacePath);
  content = content.replace(/import\s*\(\s*["'](\.[^"']+)["']\s*\)/g, replacePath);
  
  // also handle standard import "..." without from
  content = content.replace(/import\s+["'](\.[^"']+)["']/g, replacePath);

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    totalFixed++;
  }
}

console.log(`Fixed imports in ${totalFixed} files.`);
