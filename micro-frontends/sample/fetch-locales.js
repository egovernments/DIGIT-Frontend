import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __filename and __dirname are not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
