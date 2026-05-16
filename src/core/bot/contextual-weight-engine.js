export function applyContextualWeights({
  intents = [],
  conversationState = null,
}) {
  if (
    !conversationState ||
    !intents.length
  ) {
    return intents;
  }

  const contextualized =
    intents.map(intentData => {
      let score =
        intentData.score;

      /**
       * ============================
       * CURRENT INTENT BOOST
       * ============================
       */

      if (
        conversationState.currentIntent &&
        String(
          conversationState.currentIntent
        ) ===
          String(
            intentData.intent._id
          )
      ) {
        score += 1.5;
      }

      /**
       * ============================
       * PREVIOUS DETECTED INTENTS
       * ============================
       */

      const previousIntent =
        conversationState.detectedIntents?.find(
          item =>
            String(
              item.intent
            ) ===
            String(
              intentData.intent
                ._id
            )
        );

      if (
        previousIntent
      ) {
        score +=
          previousIntent.confidence *
          2;
      }

      /**
       * ============================
       * STAGE BOOST
       * ============================
       */

      if (
        conversationState.stage ===
          "COLLECTING_INFO" ||
        conversationState.stage ===
          "READY_TO_ANSWER"
      ) {
        score += 0.5;
      }

      /**
       * ============================
       * SEMANTIC BOOST
       * ============================
       */

      if (
        intentData.semantic
      ) {
        score += 0.3;
      }

      return {
        ...intentData,
        contextualScore:
          score,
      };
    });

  /**
   * ============================
   * REORDER
   * ============================
   */

  contextualized.sort(
    (a, b) =>
      b.contextualScore -
      a.contextualScore
  );

  /**
   * ============================
   * RECALCULATE CONFIDENCE
   * ============================
   */

  const totalScore =
    contextualized.reduce(
      (acc, item) =>
        acc +
        item.contextualScore,
      0
    );

  return contextualized.map(
    item => ({
      ...item,

      confidence:
        totalScore
          ? item.contextualScore /
            totalScore
          : 0,
    })
  );
}
