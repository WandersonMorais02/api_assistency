function randomItem(array = []) {
  if (!array.length) {
    return "";
  }

  return array[Math.floor(Math.random() * array.length)];
}

function removeFinalPunctuation(text = "") {
  return text.replace(/[.!?]+$/g, "").trim();
}

function capitalize(text = "") {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeSentence(text = "") {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,+/g, ",")
    .replace(/\s+\?/g, "?")
    .replace(/\s+\./g, ".")
    .trim();
}

const defaultAffirmations = [
  "Certo",
  "Entendi",
  "Perfeito",
];

const defaultConnectors = [
  "para eu te orientar melhor",
  "pra eu entender melhor",
  "antes de continuar",
];

const defaultQuestionPatterns = [
  "poderia me informar",
  "consegue me informar",
  "pode me dizer",
];

const defaultClosings = [
  "Fico à disposição para continuar te ajudando.",
];

const fieldLabels = {
  brand: "a marca do aparelho",
  model: "o modelo do aparelho",
  powerState: "se o aparelho ainda liga",
  systemVersion: "a versão do sistema instalada",
  deviceType: "o tipo do dispositivo",
};

const technicalFieldLabels = {
  brand: "a marca",
  model: "o modelo exato",
  powerState: "o estado de alimentação",
  systemVersion: "a versão do sistema",
  deviceType: "o tipo do equipamento",
};

function getPatterns(profile) {
  return {
    affirmations:
      profile?.affirmationPatterns?.length
        ? profile.affirmationPatterns
        : defaultAffirmations,

    connectors:
      profile?.connectorPatterns?.length
        ? profile.connectorPatterns
        : defaultConnectors,

    questionPatterns:
      profile?.questionPatterns?.length
        ? profile.questionPatterns
        : defaultQuestionPatterns,

    closings:
      profile?.closingPatterns?.length
        ? profile.closingPatterns
        : defaultClosings,
  };
}

function getFieldLabel(field, profile) {
  if (profile?.responseLevel === "ADVANCED") {
    return technicalFieldLabels[field] || field;
  }

  return fieldLabels[field] || field;
}

function buildQuestion({ field, profile }) {
  const patterns = getPatterns(profile);

  const connector = randomItem(patterns.connectors);
  const questionPattern = randomItem(patterns.questionPatterns);
  const fieldLabel = getFieldLabel(field, profile);

  if (!questionPattern || !fieldLabel) {
    return "";
  }

  if (connector) {
    return `${connector}, ${questionPattern} ${fieldLabel}?`;
  }

  return `${questionPattern} ${fieldLabel}?`;
}

function buildIntro(profile) {
  const patterns = getPatterns(profile);

  const affirmation = randomItem(patterns.affirmations);

  if (!affirmation) {
    return "";
  }

  return `${affirmation}.`;
}

function buildClosing(profile) {
  const patterns = getPatterns(profile);

  return randomItem(patterns.closings);
}

export function buildDynamicSentence({
  profile,
  missingFields = [],
  context = {},
  response = null,
}) {
  const parts = [];

  const intro = buildIntro(profile);

  if (intro) {
    parts.push(intro);
  }

  if (response) {
    parts.push(
      `${removeFinalPunctuation(response)}.`
    );
  }

  if (missingFields.length) {
    const question = buildQuestion({
      field: missingFields[0],
      profile,
      context,
    });

    if (question) {
      parts.push(question);
    }
  }

  if (!missingFields.length) {
    const closing = buildClosing(profile);

    if (closing) {
      parts.push(
        `${removeFinalPunctuation(closing)}.`
      );
    }
  }

  return capitalize(
    normalizeSentence(
      parts.join(" ")
    )
  );
}
