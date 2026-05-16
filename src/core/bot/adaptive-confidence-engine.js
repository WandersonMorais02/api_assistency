export function calculateAdaptiveConfidence({
  mainIntent,

  intents = [],

  context = {},

  tokenResult = {},

  missingFields = [],
}) {
  let confidence =
    mainIntent
      ?.confidence || 0;

  /**
   * ============================
   * KNOWN ENTITIES BOOST
   * ============================
   */

  const knownEntities =
    Object.values(
      context.entities || {}
    ).filter(Boolean)
      .length;

  confidence +=
    knownEntities * 0.05;

  /**
   * ============================
   * UNKNOWN TOKENS PENALTY
   * ============================
   */

  const unknownCount =
    tokenResult
      .unknownTokens
      ?.length || 0;

  confidence -=
    unknownCount * 0.08;

  /**
   * ============================
   * MULTIPLE INTENTS PENALTY
   * ============================
   */

  if (
    intents.length > 3
  ) {
    confidence -= 0.1;
  }

  /**
   * ============================
   * MISSING FIELDS PENALTY
   * ============================
   */

  confidence -=
    missingFields.length *
    0.05;

  /**
   * ============================
   * STAGE BOOST
   * ============================
   */

  if (
    context.stage ===
    "READY_TO_ANSWER"
  ) {
    confidence += 0.2;
  }

  /**
   * ============================
   * SEMANTIC PENALTY
   * ============================
   */

  if (
    mainIntent?.semantic
  ) {
    confidence -= 0.05;
  }

  /**
   * ============================
   * LIMITS
   * ============================
   */

  confidence =
    Math.max(
      0,
      Math.min(
        confidence,
        1
      )
    );

  /**
   * ============================
   * CONFIDENCE LEVEL
   * ============================
   */

  let level = "LOW";

  if (
    confidence >= 0.75
  ) {
    level = "HIGH";
  } else if (
    confidence >= 0.45
  ) {
    level = "MEDIUM";
  }

  /**
   * ============================
   * HUMAN ESCALATION
   * ============================
   */

  const shouldEscalate =
    confidence < 0.3;

  return {
    confidence,
    level,
    shouldEscalate,
  };
}
