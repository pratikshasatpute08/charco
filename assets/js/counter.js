/**
 * Charco - Pure Text & Character Calculation Engine
 * Handles character counts, word counts, sentence counts, reading times, and keyword density.
 */

// Grapheme-aware character count (handles emojis, surrogate pairs properly)
export function countCharacters(text) {
  if (!text) return 0;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
    return [...segmenter.segment(text)].length;
  }
  return [...text].length;
}

// Character count excluding all whitespace characters
export function countCharactersNoSpaces(text) {
  if (!text) return 0;
  const noSpaces = text.replace(/\s+/g, '');
  return countCharacters(noSpaces);
}

// Accurate word count handling hyphenated words, punctuation, and unicode words
export function countWords(text) {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  
  // Match word characters, including international letters and contractions/hyphens
  const words = trimmed.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  return words ? words.length : 0;
}

// Sentence count
export function countSentences(text) {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  
  // Matches sentence terminators (. ! ?) followed by whitespace or end of string
  const sentences = trimmed.match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g);
  if (!sentences) return 0;
  
  // Filter out any purely empty or whitespace fragments
  return sentences.filter(s => s.trim().length > 0).length;
}

// Paragraph count
export function countParagraphs(text) {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  
  // Split on one or more newlines
  return trimmed.split(/\r?\n+/).filter(p => p.trim().length > 0).length;
}

// Line count
export function countLines(text) {
  if (!text) return 0;
  return text.split(/\r?\n/).length;
}

// Reading time formatted in human readable string (avg 225 wpm)
export function getReadingTime(wordsCount) {
  if (!wordsCount || wordsCount === 0) return '0 sec';
  const totalSeconds = Math.round((wordsCount / 225) * 60);
  if (totalSeconds < 60) {
    return `${Math.max(1, totalSeconds)} sec`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
}

// Speaking time formatted in human readable string (avg 130 wpm)
export function getSpeakingTime(wordsCount) {
  if (!wordsCount || wordsCount === 0) return '0 sec';
  const totalSeconds = Math.round((wordsCount / 130) * 60);
  if (totalSeconds < 60) {
    return `${Math.max(1, totalSeconds)} sec`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
}

// Average word length
export function getAverageWordLength(charactersNoSpaces, wordsCount) {
  if (!wordsCount || wordsCount === 0) return 0;
  return Number((charactersNoSpaces / wordsCount).toFixed(1));
}

// Keyword Density Analysis
export function getKeywordDensity(text, limit = 8) {
  if (!text) return [];
  const trimmed = text.trim().toLowerCase();
  if (!trimmed) return [];

  const words = trimmed.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  if (!words || words.length === 0) return [];

  // Common stop words to deprioritize unless no other words exist
  const stopWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'is', 'are', 'was', 'were', 'am', 'been', 'has', 'had'
  ]);

  const freqMap = new Map();
  let totalValidWords = 0;

  for (const word of words) {
    if (word.length < 2) continue; // Ignore single letter words
    totalValidWords++;
    freqMap.set(word, (freqMap.get(word) || 0) + 1);
  }

  if (totalValidWords === 0) return [];

  // Filter and sort keywords
  const sorted = Array.from(freqMap.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: Number(((count / totalValidWords) * 100).toFixed(1)),
      isStopWord: stopWords.has(word)
    }))
    .sort((a, b) => {
      // Prioritize non-stop words if counts are close
      if (a.isStopWord !== b.isStopWord) {
        return a.isStopWord ? 1 : -1;
      }
      return b.count - a.count;
    });

  return sorted.slice(0, limit);
}

// Full text analysis payload
export function analyzeText(text) {
  const characters = countCharacters(text);
  const charactersNoSpaces = countCharactersNoSpaces(text);
  const words = countWords(text);
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const lines = countLines(text);
  const readingTime = getReadingTime(words);
  const speakingTime = getSpeakingTime(words);
  const avgWordLength = getAverageWordLength(charactersNoSpaces, words);
  const keywordDensity = getKeywordDensity(text);

  return {
    characters,
    charactersNoSpaces,
    words,
    sentences,
    paragraphs,
    lines,
    readingTime,
    speakingTime,
    avgWordLength,
    keywordDensity
  };
}
