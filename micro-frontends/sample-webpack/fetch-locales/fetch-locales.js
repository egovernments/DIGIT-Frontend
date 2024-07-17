import axios from 'axios';
import fs from 'fs';
import path from 'path';

const locales = [
  { lang: 'en', url: process.env.LOCALE_API_URL_EN },
  { lang: 'fr', url: process.env.LOCALE_API_URL_FR },
  { lang: 'de', url: process.env.LOCALE_API_URL_DE }
];

const fetchLocales = async () => {
  for (const locale of locales) {
    try {
      const response = await axios.get(locale.url);
      const dir = path.join('/locales', locale.lang);
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
