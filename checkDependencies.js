

const fs = require('fs');
const { execSync } = require('child_process');

function checkDependencies() {
    
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

    
    const requiredDependencies = packageJson.dependencies || {};

    
    const missingDependencies = Object.keys(requiredDependencies).filter(dependency => {
        try {
            require.resolve(dependency);
            return false; 
        } catch (error) {
            return true; 
        }
    });

    return missingDependencies;
}

const missingDependencies = checkDependencies();

if (missingDependencies.length > 0) {
    console.log('Dependencies are not installed. Installing all dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('All dependencies installed.');
};
