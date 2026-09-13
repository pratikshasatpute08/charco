import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  countCharacters,
  countCharactersNoSpaces,
  countWords,
  countSentences,
  countParagraphs,
  countLines,
  getReadingTime,
  getSpeakingTime,
  getAverageWordLength,
  getKeywordDensity,
  analyzeText
} from './assets/js/counter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('==============================================');
console.log('🧪 RUNNING CHARCO COMPREHENSIVE TEST SUITE');
console.log('==============================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// 1. Text Counter Unit Tests
console.log('1. Testing Counter Logic (Edge Cases & Calculations):');

// Empty text
const emptyStats = analyzeText('');
assert(emptyStats.characters === 0, 'Empty string has 0 characters');
assert(emptyStats.charactersNoSpaces === 0, 'Empty string has 0 characters without spaces');
assert(emptyStats.words === 0, 'Empty string has 0 words');
assert(emptyStats.sentences === 0, 'Empty string has 0 sentences');
assert(emptyStats.paragraphs === 0, 'Empty string has 0 paragraphs');
assert(emptyStats.readingTime === '0 sec', 'Empty string reading time is 0 sec');
assert(emptyStats.speakingTime === '0 sec', 'Empty string speaking time is 0 sec');

// Simple sentence
const simpleText = 'Hello world! Welcome to Charco.';
assert(countCharacters(simpleText) === 31, 'Accurate character count for simple sentence');
assert(countCharactersNoSpaces(simpleText) === 27, 'Accurate no-spaces character count');
assert(countWords(simpleText) === 5, 'Accurate word count (5 words)');
assert(countSentences(simpleText) === 2, 'Accurate sentence count (2 sentences)');
assert(countParagraphs(simpleText) === 1, 'Accurate paragraph count (1 paragraph)');

// Multi-paragraph and line breaks
const multiPara = 'First paragraph.\n\nSecond paragraph has two sentences. Yes it does!\n\nThird paragraph.';
assert(countParagraphs(multiPara) === 3, 'Accurate paragraph count with blank lines');
assert(countSentences(multiPara) === 4, 'Accurate sentence count across paragraphs');
assert(countLines(multiPara) === 5, 'Accurate line count');

// Emoji and surrogate pairs
const emojiText = 'Cloud 🚀 DevOps ⚡ AWS ☁️';
assert(countCharacters(emojiText) > 0, 'Handles Unicode emojis properly');
assert(countWords(emojiText) === 3, 'Word count correctly extracts 3 word tokens');

// Contractions and hyphenated words
const hyphens = "state-of-the-art modern tool don't give up";
assert(countWords(hyphens) === 6, 'Handles hyphenated words and contractions accurately');

// Reading and speaking time calculation
const twoHundredWords = Array(225).fill('word').join(' ');
assert(getReadingTime(225) === '1 min', '225 words evaluates to 1 min reading time');
assert(getSpeakingTime(130) === '1 min', '130 words evaluates to 1 min speaking time');

// Keyword density
const keywordSample = 'DevOps automation with AWS. Cloud DevOps engineers love automation and AWS cloud.';
const density = getKeywordDensity(keywordSample);
assert(density.length > 0, 'Keyword density returns valid list');
const topWord = density[0];
assert(['devops', 'automation', 'aws', 'cloud'].includes(topWord.word), `Top keyword detected: ${topWord.word}`);

console.log('\n2. Testing Local Asset Integrity & Self-Hosted Zero-CDN Policy:');

// Check index.html exists
const indexPath = path.join(__dirname, 'index.html');
assert(fs.existsSync(indexPath), 'index.html exists');

const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Ensure no external scripts or stylesheets are loaded via CDN
const hasExternalCss = /<link[^>]+href=["']https?:\/\//i.test(indexHtml);
assert(!hasExternalCss, 'Zero external CDN stylesheets in index.html');

const hasExternalScripts = /<script[^>]+src=["']https?:\/\//i.test(indexHtml);
assert(!hasExternalScripts, 'Zero external CDN script tags in index.html');

// Check referenced files in index.html exist on disk
const localLinks = [
  'assets/icons/favicon.svg',
  'assets/icons/logo.svg',
  'assets/icons/sun.svg',
  'assets/icons/info.svg',
  'assets/icons/star.svg',
  'assets/icons/github.svg',
  'assets/icons/sparkles.svg',
  'assets/icons/chart.svg',
  'assets/icons/sliders.svg',
  'assets/icons/clock.svg',
  'assets/icons/mic.svg',
  'assets/icons/copy.svg',
  'assets/icons/trash.svg',
  'assets/icons/close.svg',
  'assets/icons/external.svg',
  'assets/css/style.css',
  'assets/js/app.js',
  'assets/fonts/inter.woff2',
  'assets/fonts/fonts.css',
  'manifest.json',
  'LICENSE',
  'README.md'
];

for (const relPath of localLinks) {
  const fullPath = path.join(__dirname, relPath);
  assert(fs.existsSync(fullPath), `Local file exists: ${relPath}`);
}

// Check CSS files for external CDN imports
const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');
const hasExternalCssImports = /@import\s+url\(["']?https?:\/\//i.test(cssContent);
assert(!hasExternalCssImports, 'Zero external CDN imports in CSS files');

// Check font size
const fontPath = path.join(__dirname, 'assets', 'fonts', 'inter.woff2');
const fontStats = fs.statSync(fontPath);
assert(fontStats.size > 20000, `Inter variable font is healthy (${fontStats.size} bytes)`);

// Check WCAG / Accessibility anchors & roles in index.html
assert(indexHtml.includes('role="dialog"'), 'Accessible dialog role present');
assert(indexHtml.includes('aria-modal="true"'), 'aria-modal attribute present');
assert(indexHtml.includes('aria-live="polite"'), 'aria-live polite region present');
assert(indexHtml.includes('role="main"'), 'role="main" landmark present');
assert(indexHtml.includes('Skip to main content'), 'Skip to content link present for accessibility');
assert(indexHtml.includes('https://github.com/pratikshasatpute08/charco'), 'GitHub stars repo link present');
assert(indexHtml.includes('https://github.com/pratikshasatpute08'), 'Creator profile link present');

console.log('\n==============================================');
console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
console.log('==============================================\n');
