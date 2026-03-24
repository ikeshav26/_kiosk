const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const MYMEMORY_EMAIL = process.env.MYMEMORY_EMAIL || '';

// Helper: split text into <=500 char chunks, preserving layout as much as possible
function splitText(text, maxLen = 450) {
  // Using 450 to leave room for URI encoding overhead
  const parts = [];
  let current = '';

  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxLen) {
      if (current) {
        parts.push(current);
        current = '';
      }

      const sentences = paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [paragraph];

      for (const sentence of sentences) {
        if (sentence.length > maxLen) {
          let tempSentence = sentence;
          while (tempSentence.length > 0) {
            let slice = tempSentence.substring(0, maxLen);
            parts.push(slice);
            tempSentence = tempSentence.substring(maxLen);
          }
        } else {
          if (current.length + sentence.length + 1 > maxLen) {
            parts.push(current);
            current = sentence;
          } else {
            current += (current ? ' ' : '') + sentence;
          }
        }
      }
    } else {
      if (current.length + paragraph.length + 1 > maxLen) {
        parts.push(current);
        current = paragraph;
      } else {
        current += (current ? '\n' : '') + paragraph;
      }
    }
  }
  if (current) parts.push(current);
  return parts;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateChunkWithRetry(chunk, targetLang, sourceLang) {
  if (!chunk.trim()) return chunk;
  let retries = 5;
  let delayMs = 1000;

  while (retries > 0) {
    try {
      const params = new URLSearchParams({
        q: chunk,
        langpair: `${sourceLang}|${targetLang}`,
        ...(MYMEMORY_EMAIL && { de: MYMEMORY_EMAIL }),
      });

      const response = await fetch(`${MYMEMORY_URL}?${params}`);

      if (response.status === 429) {
        console.warn(
          `[Translate] Rate Limited (429) for ${targetLang}. Retrying in ${delayMs}ms...`
        );
        await delay(delayMs);
        delayMs *= 2;
        retries--;
        continue;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (
        data.responseStatus === 429 ||
        (data.responseDetails && data.responseDetails.toLowerCase().includes('quota'))
      ) {
        console.warn(
          `[Translate] Rate/Quota Limited for ${targetLang}. Retrying in ${delayMs}ms...`
        );
        await delay(delayMs);
        delayMs *= 2;
        retries--;
        continue;
      }

      if (data.responseStatus !== 200) {
        throw new Error(`MyMemory error: ${data.responseDetails}`);
      }

      return data.responseData?.translatedText || chunk;
    } catch (err) {
      console.error(`[Translate] Error translating to ${targetLang}:`, err.message);
      retries--;
      if (retries === 0) return chunk;
      await delay(delayMs);
      delayMs *= 2;
    }
  }
  return chunk;
}

export const translateText = async (text, targetLang, sourceLang = 'en') => {
  if (!text) return '';
  if (targetLang === sourceLang) return text;

  // Split by paragraphs first to preserve structure
  const paragraphs = text.split('\n');
  const translatedParagraphs = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      translatedParagraphs.push(paragraph);
      continue;
    }

    if (paragraph.length <= 450) {
      const trans = await translateChunkWithRetry(paragraph, targetLang, sourceLang);
      translatedParagraphs.push(trans);
    } else {
      // Use splitText helper for long paragraphs only
      // Note: splitText was defined above, reusing it but treating chunks as sentences
      const chunks = splitText(paragraph, 450);
      const transChunks = [];

      for (const chunk of chunks) {
        const tChunk = await translateChunkWithRetry(chunk, targetLang, sourceLang);
        transChunks.push(tChunk);
        await delay(300);
      }
      translatedParagraphs.push(transChunks.join(' '));
    }
    await delay(500);
  }
  return translatedParagraphs.join('\n');
};

export const translateToAllLangs = async (text, sourceLang = 'en') => {
  // Sequential to avoid slamming the API
  const hi = await translateText(text, 'hi', sourceLang);
  await delay(500);
  const pa = await translateText(text, 'pa', sourceLang);

  return { en: text, hi, pa };
};
