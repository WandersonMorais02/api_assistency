import { normalizeText } from "./normalizer.js";
import { resolveTokens } from "./token-resolver.js";
import { resolveIntents } from "./intent-resolver.js";
import { resolveResponse } from "./response-resolver.js";
import { resolveBotProfile } from "./role-resolver.js";
import { resolveConversationContext } from "./context-resolver.js";
import { resolveMissingFields } from "./missing-info-resolver.js";
import { buildDynamicSentence } from "./sentence-builder.js";
import { autoLearn } from "./auto-learning-engine.js";
import { processSemanticRelations } from "./similarity-engine.js";
import { applyContextualWeights } from "./contextual-weight-engine.js";
import { calculateAdaptiveConfidence } from "./adaptive-confidence-engine.js";
import { evaluateHumanEscalation } from "./human-escalation-engine.js";

import { BotTraining } from "../../modules/bot/bot-training.model.js";
import { ConversationState } from "../../modules/bot/conversation-state.model.js";

export async function processBotMessage({ roomId, message, user }) {
  const normalized = normalizeText(message);
  const tokenResult = await resolveTokens(normalized);

  let state = await ConversationState.findOne({
    room: roomId,
    user: user.id,
    isActive: true,
  });

  if (!state) {
    state = await ConversationState.create({
      room: roomId,
      user: user.id,
    });
  }

  let intents = await resolveIntents(
    tokenResult.knownTokens,
    tokenResult.tokens
  );

  intents = applyContextualWeights({
    intents,
    conversationState: state,
  });

  const mainIntent = intents[0] || null;
  const profile = await resolveBotProfile(user.role);

  const context = resolveConversationContext({
    message,
    tokens: tokenResult.tokens,
    currentState: state,
  });

  const missingFields = resolveMissingFields({
    intent: mainIntent?.intent?.name,
    entities: context.entities,
    askedFields: state.askedFields || [],
  });

  const adaptiveConfidence = calculateAdaptiveConfidence({
    mainIntent,
    intents,
    context,
    tokenResult,
    missingFields,
  });

  const escalation = evaluateHumanEscalation({
    message,
    confidence: adaptiveConfidence.confidence,
    confidenceLevel: adaptiveConfidence.level,
    userRole: user.role,
    context,
  });

  const resolvedResponse = await resolveResponse(intents);

  let responseContent = resolvedResponse?.response;

  if (adaptiveConfidence.shouldEscalate) {
    responseContent =
      "Ainda não tenho certeza suficiente sobre esse caso. Poderia me fornecer mais detalhes para que eu possa entender melhor?";
  }

  if (escalation.shouldEscalate) {
    responseContent =
      "Esse caso será encaminhado para nossa equipe especializada para uma análise mais precisa.";
  }

  const finalMessage = buildDynamicSentence({
    profile,
    missingFields,
    context,
    response: responseContent,
  });

  state.currentIntent = mainIntent?.intent?._id;

  state.detectedIntents = intents.map(item => ({
    intent: item.intent._id,
    confidence: item.confidence,
  }));

  state.knownEntities = context.entities;
  state.stage = escalation.shouldEscalate ? "WAITING_HUMAN" : context.stage;
  state.lastUserMessage = message;
  state.lastBotMessage = finalMessage;

  state.metadata = {
    tokens: tokenResult.tokens,
    knownTokens: tokenResult.knownTokens.map(token => token.normalized),
    unknownTokens: tokenResult.unknownTokens,
    confidence: adaptiveConfidence.confidence,
    confidenceLevel: adaptiveConfidence.level,
    escalation,
  };

  state.missingFields = missingFields;

  state.askedFields = [
    ...new Set([
      ...(state.askedFields || []),
      ...missingFields,
    ]),
  ];

  await state.save();

  await BotTraining.create({
    originalMessage: message,
    normalizedMessage: normalized,
    detectedTokens: tokenResult.tokens,
    unknownTokens: tokenResult.unknownTokens,
    resolvedIntents: intents.map(item => item.intent._id),
    finalResponse: finalMessage,
    trainedBy: user.id,
    approved: false,
  });

  await autoLearn({
    tokens: tokenResult.tokens,
    intents,
  });

  await processSemanticRelations({
    tokens: tokenResult.tokens,
    intents,
  });

  return {
    success: true,
    response: finalMessage,
    confidence: adaptiveConfidence.confidence,
    confidenceLevel: adaptiveConfidence.level,
    shouldEscalate: escalation.shouldEscalate,
    escalation,
    intent: mainIntent?.intent?.name || null,
    context,
    missingFields,
    tokens: tokenResult.tokens,
    knownTokens: tokenResult.knownTokens.map(token => token.normalized),
    unknownTokens: tokenResult.unknownTokens,
  };
}
