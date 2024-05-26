const fs = require('fs');
const path = require('path');

function loadSlashCommand(client, dir = path.join(__dirname, '../slashCommands')) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
     
        const stat = fs.lstatSync(fullPath);

        if (stat.isDirectory()) {
            loadSlashCommand(client,fullPath);
        } else if (file.endsWith('.js')) {

            try {
                const command = require(fullPath);
               
                if(!command.name || !command.run || !command.description) {
    
                    console.warn(`Command file '${fullPath}' is missing a name or execute function.`);
                    continue;
                }
               
                client.slashCommands.set(`${command.name}`.trim().toLowerCase(), command);
            
            } catch (error) {
                if(!error.message.includes('Cannot find module'))  throw new Error(error);
                let fileContent =  fs.readFileSync(fullPath, 'utf-8');
                console.log( extractDependencies(fileContent))
                extractDependencies(fileContent)?.forEach(d => !client?.dependencies.includes(d) && client?.dependencies.push(d));
                console.log(`Command file '${fullPath}' failed to load. ${error}`);
               
               }


            

           
           
        }

    }
    
}

module.exports = { loadSlashCommand };


/**
 * Extracts the dependencies array from a given JavaScript module code string.
 * @param {string} moduleCode - The JavaScript module code as a string.
 * @returns {Array} The dependencies array if found, otherwise null.
 */
function extractDependencies(moduleCode) {
    const dependenciesRegex = /dependencies\s*:\s*(\[[^\]]*\])/;
    const match = moduleCode.match(dependenciesRegex);

    if (match && match[1]) {
        try {
            
            return eval(match[1]);
        } catch (error) {
          
            return null;
        }
    } else {
       
        return null;
    }
}