import { normalizeText }
from "./normalizer.js";

const stopWords = [
  "a",
  "o",
  "e",
  "de",
  "do",
  "da",
  "dos",
  "das",
  "para",
  "por",
  "com",
  "sem",
  "um",
  "uma",

  "meu",
  "minha",
  "meus",
  "minhas",

  "teu",
  "tua",
  "seu",
  "sua",

  "que",
  "na",
  "no",
  "nas",
  "nos",

  "em",
  "ao",
  "aos",

  "pra",
  "pro",

  "eu",
  "tu",
  "ele",
  "ela",

  "eles",
  "elas",

  "isso",
  "isto",
  "aquilo",

  "tem",
  "tenho",
  "tinha",

  "ser",
  "estar",

  "foi",
  "era",

  "devo",
  "fazer",

  "preciso",
  "quero",

  "pode",
  "poderia",

  "como",
  "qual",
  "quais",

  "porque",
  "porquê",

  "muito",
  "mais",

  "ja",
  "já",
];

function sanitizeText(
  text
) {
  return text
    .replace(
      /[^\p{L}\p{N}\s]/gu,
      " "
    )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
}

function isUsefulToken(
  token
) {
  /**
   * SMALL TOKENS
   */

  if (token.length <= 1) {
    return false;
  }

  /**
   * NUMBERS ONLY
   */

  if (/^\d+$/.test(token)) {
    return false;
  }

  /**
   * STOP WORDS
   */

  if (
    stopWords.includes(token)
  ) {
    return false;
  }

  return true;
}

export function tokenize(
  text = ""
) {
  const normalized =
    normalizeText(text);

  const sanitized =
    sanitizeText(
      normalized
    );

  const rawTokens =
    sanitized.split(" ");

  /**
   * REMOVE INVALID TOKENS
   */

  const filtered =
    rawTokens.filter(
      isUsefulToken
    );

  /**
   * REMOVE DUPLICATES
   */

  return [
    ...new Set(filtered),
  ];
}
