const fs = require('fs');
const path = require('path');

function deleteMapFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      deleteMapFiles(fullPath);
    } else if (file.name.endsWith('.map')) {
      fs.unlinkSync(fullPath);
      console.log(`✓ Deleted: ${fullPath}`);
    }
  }
}

function deleteDirectory(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`✓ Deleted directory: ${dir}`);
  }
}

console.log('Starting cleanup...\n');

// Delete all .map files in lib directory
console.log('Removing source map files...');
deleteMapFiles('./lib');

// Delete duplicate TypeScript definitions
console.log('\nRemoving duplicate TypeScript definitions...');
deleteDirectory('./lib/typescript/module');

console.log('\n✅ Cleanup complete!');