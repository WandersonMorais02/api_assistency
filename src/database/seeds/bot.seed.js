import { BotProfile } from "../../modules/bot/bot-profile.model.js";
import { BotIntent } from "../../modules/bot/bot-intent.model.js";
import { BotAnswer } from "../../modules/bot/bot-answer.model.js";
import { BotToken } from "../../modules/bot/bot-token.model.js";

import { normalizeText } from "../../core/bot/normalizer.js";

const profiles = [
  {
    name: "CLIENT_SUPPORT",
    targetRoles: ["CLIENT"],
    tone: "FRIENDLY",
    responseLevel: "BASIC",
    canShowTechnicalDetails: false,
    canAskTechnicalQuestions: false,
    affirmationPatterns: ["Certo", "Entendi", "Perfeito"],
    connectorPatterns: [
      "para eu te orientar melhor",
      "pra eu entender melhor",
      "antes de continuar",
    ],
    questionPatterns: [
      "poderia me informar",
      "consegue me informar",
      "pode me dizer",
    ],
    closingPatterns: [
      "Fico à disposição para continuar te ajudando",
      "Se precisar, posso te orientar no próximo passo",
    ],
  },
  {
    name: "TECHNICAL_ASSISTANT",
    targetRoles: ["TECHNICIAN"],
    tone: "TECHNICAL",
    responseLevel: "ADVANCED",
    canShowTechnicalDetails: true,
    canAskTechnicalQuestions: true,
    affirmationPatterns: ["Entendido", "Analisando o caso", "Certo"],
    connectorPatterns: [
      "com base no sintoma informado",
      "pela descrição",
      "antes de avançar no diagnóstico",
    ],
    questionPatterns: [
      "confirme",
      "verifique",
      "informe",
    ],
    closingPatterns: [
      "Registre o resultado da análise para melhorar o histórico técnico",
    ],
  },
  {
    name: "ADMIN_ASSISTANT",
    targetRoles: ["ADMIN", "ATTENDANT"],
    tone: "PROFESSIONAL",
    responseLevel: "INTERMEDIATE",
    canShowTechnicalDetails: true,
    canAskTechnicalQuestions: true,
    affirmationPatterns: ["Certo", "Entendi", "Perfeito"],
    connectorPatterns: [
      "para direcionarmos corretamente",
      "para organizar o atendimento",
      "antes de prosseguir",
    ],
    questionPatterns: [
      "poderia informar",
      "consegue informar",
      "confirme",
    ],
    closingPatterns: [
      "Esse atendimento pode ser acompanhado pelo painel interno",
    ],
  },
  {
    name: "DEFAULT",
    targetRoles: [],
    tone: "PROFESSIONAL",
    responseLevel: "BASIC",
    canShowTechnicalDetails: false,
    canAskTechnicalQuestions: false,
    affirmationPatterns: ["Certo", "Entendi"],
    connectorPatterns: ["para eu entender melhor"],
    questionPatterns: ["poderia me informar"],
    closingPatterns: ["Fico à disposição para continuar ajudando"],
  },
];

const intents = [
  {
    name: "WATER_DAMAGE",
    description: "Contato com água, líquido ou possível oxidação",
    confidenceThreshold: 0.3,
    tokens: [
      "agua",
      "molhou",
      "liquido",
      "oxidacao",
      "umidade",
      "caiu",
    ],
    answer:
      "Em casos de contato com líquido, desligue o aparelho imediatamente e não tente carregar. O ideal é trazer para avaliação técnica.",
  },
  {
    name: "SCREEN_DAMAGE",
    description: "Problemas relacionados à tela, display ou touch",
    confidenceThreshold: 0.3,
    tokens: [
      "tela",
      "display",
      "touch",
      "trincou",
      "rachou",
      "quebrou",
      "oled",
      "lcd",
    ],
    answer:
      "Problemas na tela podem envolver display, touch ou conexão interna. O ideal é avaliar o modelo e o estado físico do aparelho.",
  },
  {
    name: "BATTERY_ISSUE",
    description: "Problemas relacionados à bateria, carga ou energia",
    confidenceThreshold: 0.3,
    tokens: [
      "bateria",
      "carga",
      "carregador",
      "carregando",
      "desliga",
      "energia",
    ],
    answer:
      "Problemas de bateria podem estar ligados à bateria, conector de carga, carregador ou consumo anormal do aparelho.",
  },
  {
    name: "SOFTWARE_ISSUE",
    description: "Problemas de sistema, travamentos ou formatação",
    confidenceThreshold: 0.3,
    tokens: [
      "travando",
      "formatar",
      "sistema",
      "android",
      "ios",
      "windows",
      "lento",
      "atualizacao",
    ],
    answer:
      "Problemas de sistema podem exigir atualização, limpeza, backup ou formatação, dependendo do estado do aparelho.",
  },
];

async function seedProfiles() {
  for (const profile of profiles) {
    const exists = await BotProfile.findOne({
      name: profile.name,
    });

    if (exists) {
      continue;
    }

    await BotProfile.create(profile);
  }
}

async function seedIntentWithTokensAndAnswer(intentData) {
  let intent = await BotIntent.findOne({
    name: intentData.name,
  });

  if (!intent) {
    intent = await BotIntent.create({
      name: intentData.name,
      description: intentData.description,
      confidenceThreshold: intentData.confidenceThreshold,
    });
  }

  let answer = await BotAnswer.findOne({
    intent: intent._id,
    content: intentData.answer,
  });

  if (!answer) {
    answer = await BotAnswer.create({
      intent: intent._id,
      content: intentData.answer,
      priority: 1,
      learned: true,
    });
  }

  intent.responses.addToSet(answer._id);
  await intent.save();

  for (const token of intentData.tokens) {
    const normalized = normalizeText(token);

    let tokenDoc = await BotToken.findOne({
      normalized,
    });

    if (!tokenDoc) {
      await BotToken.create({
        token,
        normalized,
        intents: [intent._id],
        weight: 1,
        occurrences: 1,
        learned: true,
        autoLearned: false,
      });

      continue;
    }

    tokenDoc.intents.addToSet(intent._id);
    tokenDoc.learned = true;
    tokenDoc.autoLearned = false;
    tokenDoc.isActive = true;

    await tokenDoc.save();
  }
}

export async function seedBot() {
  const [
    profilesCount,
    intentsCount,
    tokensCount,
    answersCount,
  ] = await Promise.all([
    BotProfile.countDocuments(),
    BotIntent.countDocuments(),
    BotToken.countDocuments(),
    BotAnswer.countDocuments(),
  ]);

  if (
    profilesCount > 0 &&
    intentsCount > 0 &&
    tokensCount > 0 &&
    answersCount > 0
  ) {
    console.log("✔ Bot já populado");
    return;
  }

  await seedProfiles();

  for (const intent of intents) {
    await seedIntentWithTokensAndAnswer(intent);
  }

  console.log("✔ Bot populado");
}
