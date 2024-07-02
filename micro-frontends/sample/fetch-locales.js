const axios = require('axios');
const fs = require('fs');
const path = require('path');

const locales = [
  { lang: 'en', url: 'https://api.example.com/locales/en' },
  { lang: 'fr', url: 'https://api.example.com/locales/fr' },
  { lang: 'de', url: 'https://api.example.com/locales/de' }
];

const fetchLocales = async () => {
  for (const locale of locales) {
    try {
      const response = await axios.get(locale.url);
      const dir = path.join(__dirname, 'public', 'locales', locale.lang);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, 'translation.json'), JSON.stringify(response.data, null, 2));
      console.log(`Locale ${locale.lang} saved.`);
    } catch (error) {
      console.error(`Error fetching locale ${locale.lang}:`, error);
    }
  }
};

fetchLocales();
