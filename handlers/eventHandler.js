const fs = require('fs');
const path = require('path');

function loadEvents(dir = path.join(__dirname, '../events')) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
        
            loadEvents(fullPath);
        } else if (file.endsWith('.js')) {
             require(fullPath);
           
          
        }
    }
}

module.exports = { loadEvents };
