const fs = require('fs');
const path = require('path');

class I18n {
    constructor(defaultLang = 'en') {
        this.defaultLang = defaultLang;
        this.translations = {};
        this.loadTranslations();
    }

    loadTranslations() {
   
        const localesPath = path.join(__dirname, '../lang/');
        const files = fs.readdirSync(localesPath);
     
        files.forEach(file => {
            const lang = path.basename(file, '.json');
            const content = fs.readFileSync(path.join(localesPath, file), 'utf-8');
            this.translations[lang] = JSON.parse(content);
        });
      
    }

    t(key, lang = this.defaultLang, variables = {}) {
       
        let translation = this.translations[lang][key] || this.translations[this.defaultLang][key] || key;
        if(!variables) return "translation";
        
        for (const [placeholder, value] of Object.entries(variables)) {
            translation = translation.replace(`{${placeholder}}`, value);
        }

        return translation;
        
    }
}

module.exports = I18n;
