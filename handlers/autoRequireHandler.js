const fs = require('fs');
const path = require('path');

function autoLoad(dir = path.join(__dirname, '../handlers/autoLoad/')) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
        
            autoLoad(fullPath);
        } else if (file.endsWith('.js')) {
             require(fullPath);
           
          
        }
    }
}

module.exports = { autoLoad };
