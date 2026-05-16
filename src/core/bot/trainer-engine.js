import { normalizeText } from "./normalizer.js";

import { BotToken } from "../../modules/bot/bot-token.model.js";
import { BotIntent } from "../../modules/bot/bot-intent.model.js";
import { BotAnswer } from "../../modules/bot/bot-answer.model.js";
import { BotTraining } from "../../modules/bot/bot-training.model.js";
import { BotTokenRelation } from "../../modules/bot/bot-token-relation.model.js";

import { AppError } from "../errors/app-error.js";

export async function createOrUpdateIntent({
  name,
  description,
  confidenceThreshold = 0.3,
}) {
  const normalizedName = normalizeText(name)
    .toUpperCase()
    .replace(/\s+/g, "_");

  let intent = await BotIntent.findOne({
    name: normalizedName,
  });

  if (!intent) {
    return BotIntent.create({
      name: normalizedName,
      description,
      confidenceThreshold,
    });
  }

  if (description !== undefined) {
    intent.description = description;
  }

  if (confidenceThreshold !== undefined) {
    intent.confidenceThreshold = confidenceThreshold;
  }

  await intent.save();

  return intent;
}

export async function trainToken({
  token,
  intentId,
  weight = 1,
  userId,
}) {
  const normalized = normalizeText(token);

  const intent = await BotIntent.findById(intentId);

  if (!intent) {
    throw new AppError("Intenção não encontrada", 404);
  }

  let tokenDoc = await BotToken.findOne({
    normalized,
  });

  if (!tokenDoc) {
    tokenDoc = await BotToken.create({
      token,
      normalized,
      intents: [intent._id],
      weight,
      occurrences: 1,
      learned: true,
      autoLearned: false,
      createdBy: userId,
    });

    return tokenDoc.populate("intents");
  }

  const alreadyLinked = tokenDoc.intents.some(
    item => String(item) === String(intent._id)
  );

  if (!alreadyLinked) {
    tokenDoc.intents.push(intent._id);
  }

  tokenDoc.weight = Math.max(tokenDoc.weight, weight);
  tokenDoc.learned = true;
  tokenDoc.autoLearned = false;
  tokenDoc.isActive = true;

  await tokenDoc.save();

  return tokenDoc.populate("intents");
}

export async function trainAnswer({
  intentId,
  content,
  priority = 1,
  userId,
}) {
  const intent = await BotIntent.findById(intentId);

  if (!intent) {
    throw new AppError("Intenção não encontrada", 404);
  }

  const answer = await BotAnswer.create({
    intent: intent._id,
    content,
    priority,
    learned: true,
    createdBy: userId,
  });

  intent.responses.addToSet(answer._id);
  await intent.save();

  return answer;
}

export async function validateTokenRelation({
  relationId,
  similarity = 0.8,
}) {
  const relation = await BotTokenRelation.findById(relationId);

  if (!relation) {
    throw new AppError("Relação semântica não encontrada", 404);
  }

  relation.similarity = similarity;
  relation.validated = true;
  relation.isActive = true;

  await relation.save();

  return relation;
}

export async function rejectTokenRelation(relationId) {
  const relation = await BotTokenRelation.findByIdAndUpdate(
    relationId,
    {
      validated: false,
      isActive: false,
    },
    { new: true }
  );

  if (!relation) {
    throw new AppError("Relação semântica não encontrada", 404);
  }

  return relation;
}

export async function approveTraining({
  trainingId,
  finalResponse,
  intentIds = [],
  userId,
}) {
  const training = await BotTraining.findById(trainingId);

  if (!training) {
    throw new AppError("Registro de treinamento não encontrado", 404);
  }

  training.finalResponse = finalResponse || training.finalResponse;
  training.resolvedIntents = intentIds.length
    ? intentIds
    : training.resolvedIntents;
  training.trainedBy = userId;
  training.approved = true;

  await training.save();

  return training;
}

export async function listIntents() {
  return BotIntent.find({
    isActive: true,
  }).sort({
    name: 1,
  });
}

export async function listTokens() {
  return BotToken.find({
    isActive: true,
  })
    .populate("intents")
    .sort({
      occurrences: -1,
      weight: -1,
    });
}

export async function listAnswers() {
  return BotAnswer.find({
    isActive: true,
  })
    .populate("intent")
    .sort({
      priority: -1,
      usageCount: -1,
    });
}

export async function listRelations() {
  return BotTokenRelation.find({
    isActive: true,
  })
    .populate("contexts")
    .sort({
      validated: 1,
      similarity: -1,
      occurrences: -1,
    });
}

export async function listTrainings() {
  return BotTraining.find()
    .populate("resolvedIntents")
    .populate("trainedBy", "name email role")
    .sort({
      createdAt: -1,
    });
}
