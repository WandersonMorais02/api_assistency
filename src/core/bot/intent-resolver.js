export function resolveIntents(
  knownTokens = []
) {
  const scores = {};

  for (const token of knownTokens) {
    for (const intent of token.intents) {
      const id =
        String(intent._id);

      if (!scores[id]) {
        scores[id] = {
          intent,
          score: 0,
        };
      }

      scores[id].score +=
        token.weight || 1;
    }
  }

  const ranked =
    Object.values(scores)
      .sort(
        (a, b) =>
          b.score - a.score
      );

  const totalScore =
    ranked.reduce(
      (acc, item) =>
        acc + item.score,
      0
    );

  return ranked.map(
    item => ({
      intent:
        item.intent,

      score:
        item.score,

      confidence:
        totalScore
          ? item.score /
            totalScore
          : 0,
    })
  );
}
