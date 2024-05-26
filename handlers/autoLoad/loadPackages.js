const fs = require('fs');
const path = require('path');
const { exec, } = require('child_process');
const client = require("../../index")
const packageJsonPath = path.resolve('./package.json');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
delay(1500).then(async() => {
   await managePackages(client.dependencies);
})




































const clearRequireCache = (modulePath) => {
    delete require.cache[require.resolve(modulePath)];
};


const getPackageJson = () => {
    clearRequireCache(packageJsonPath);
    return require(packageJsonPath);
};


const isPackageListed = (packageName, packageJson) => {
    return  Object.keys(packageJson.dependencies).includes(packageName)
};

const addPackagesToPackageJson = (packages) => {
    const packageJson = getPackageJson();
    const cachePackageJson = getPackageJson();
    let packagesAdded = false;

    packages.forEach(pkg => {
     
   
        const extartedPackages = extractPackage(pkg);
       
        const packageName = extartedPackages?.packageName
        const version = extartedPackages?.version;
       
        console.log(isPackageListed(packageName,packageJson))
       
        if (!isPackageListed(packageName, packageJson)) {
            console.log("test")
            packageJson.dependencies = packageJson.dependencies || {};
            packageJson.dependencies[packageName] =  version ? `^${version}` : '*';
            
            packagesAdded = true;
            console.log(`Package '${packageName}@^${version || '*'}' added to package.json.`);
        } else {
            if(version && packageJson.dependencies && packageJson.dependencies[packageName]  && packageJson.dependencies[packageName] !== `^${version}`) {
                console.warn(`Package '${packageName}' is already listed in package.json with a different version.`);
                packageJson.dependencies[packageName] = `${version ? `^${version}` :  "*"}`
                packagesAdded = true;

            }
            
        }
    });
    if(packageJson.name !== "euiz-dev") {
        packageJson.name = "euiz-dev";
         packagesAdded = true;
    }

    if (JSON.stringify(packageJson) !== JSON.stringify(cachePackageJson)) {
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    }
    return JSON.stringify(packageJson) !== JSON.stringify(cachePackageJson);

};


const installPackages = () => {
    return new Promise((resolve, reject) => {
        exec('npm install', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error installing packages: ${stderr}`);
                reject(error);
            } else {
                console.log(`Packages installed: ${stdout}`);
                resolve(stdout);
            }
        });
    });
};


const managePackages = async (packages) => {

    let newPackage = addPackagesToPackageJson(packages);
    


    try {
        if (newPackage) {
            console.log("Installing packages...");
            console.log('Restarting the main process...');
            process.exit();

            

        }
      
        
    } catch (error) {
        console.error('Error installing packages:', error);
    }
};





/**
 * Extracts package name and version from a package string.
 * @param {string} packageStr - A string containing a package name and version.
 * @returns {Object} An object containing the name and version of the package.
 */
function extractPackage(packageStr) {
    const packageRegex = /(@?[a-zA-Z0-9_.\/-]+)(?:@([a-zA-Z0-9_.^*^.-]+))?/;
    const match = packageStr.match(packageRegex);

    if (match) {
        const packageName = match[1];
        const version = match[2] || null; // Set version to null if not specified
        return { packageName, version };
    } else {
        return null;
    }
}