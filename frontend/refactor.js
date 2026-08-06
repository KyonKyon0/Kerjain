const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = content.replace(/import\s+\{([^}]+)\}\s+from\s+["']@\/mock\/[^"']+["'];?/g, function(match, importsStr) {
      const imports = importsStr.split(',').map(i => i.trim());
      
      const typeImports = [];
      const dataImports = [];
      
      imports.forEach(imp => {
        if (imp.includes('Mock') || imp.includes('MockDB') || imp.includes('MockData') || imp.includes('Mock') || imp.startsWith('mock') || imp.endsWith('Mock')) {
          dataImports.push(imp);
        } else {
          typeImports.push(imp);
        }
      });
      
      let res = '';
      if (typeImports.length > 0) {
        res += `import { ${typeImports.join(', ')} } from "@/types";\n`;
      }
      if (dataImports.length > 0) {
        const originalPath = match.match(/["'](.*?)["']/)[1];
        res += `import { ${dataImports.join(', ')} } from "${originalPath}";`;
      }
      return res.trim();
    });
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated);
      console.log('Updated ' + filePath);
    }
  }
});
