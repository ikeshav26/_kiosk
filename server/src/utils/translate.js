const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL || '';

// Helper: split text into <=500 char chunks, preserving paragraphs
function splitText(text, maxLen = 500) {
  const parts = [];
  let current = '';
  for (const paragraph of text.split('\n')) {
    if (current.length + paragraph.length + 1 > maxLen) {
      if (current) parts.push(current);
      current = paragraph;
    } else {
      current += (current ? '\n' : '') + paragraph;
    }
  }
  if (current) parts.push(current);
  return parts;
}

export const translateText = async (text, targetLang, sourceLang = 'en') => {
  if (!text) return '';
  if (targetLang === sourceLang) return text;

  const chunks = splitText(text, 500);
  const translatedChunks = [];
  for (const chunk of chunks) {
    try {
      const params = new URLSearchParams({
        q: chunk,
        langpair: `${sourceLang}|${targetLang}`,
        ...(MYMEMORY_EMAIL && { de: MYMEMORY_EMAIL }),
      });

      const response = await fetch(`${MYMEMORY_URL}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.responseStatus !== 200) {
        throw new Error(`MyMemory error: ${data.responseDetails}`);
      }

      translatedChunks.push(data.responseData?.translatedText || chunk);
    } catch (err) {
      console.error(`[Translate] Failed to translate to '${targetLang}':`, err.message);
      translatedChunks.push(chunk); // fallback to original chunk
    }
  }
  return translatedChunks.join('\n');
};

export const translateToAllLangs = async (text, sourceLang = 'en') => {
  const [hi, pa] = await Promise.all([
    translateText(text, 'hi', sourceLang),
    translateText(text, 'pa', sourceLang),
  ]);

  return { en: text, hi, pa };
};
