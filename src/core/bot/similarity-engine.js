import { BotTokenRelation }
from "../../modules/bot/bot-token-relation.model.js";

export async function processSemanticRelations({
  tokens = [],
  intents = [],
}) {
  if (tokens.length < 2) {
    return;
  }

  const uniqueTokens =
    [...new Set(tokens)];

  const mainIntent =
    intents[0]?.intent;

  for (
    let i = 0;
    i < uniqueTokens.length;
    i++
  ) {
    for (
      let j = i + 1;
      j < uniqueTokens.length;
      j++
    ) {
      const tokenA =
        uniqueTokens[i];

      const tokenB =
        uniqueTokens[j];

      /**
       * Avoid self relation
       */

      if (
        tokenA === tokenB
      ) {
        continue;
      }

      /**
       * Find relation
       */

      let relation =
        await BotTokenRelation.findOne(
          {
            $or: [
              {
                tokenA,
                tokenB,
              },

              {
                tokenA:
                  tokenB,

                tokenB:
                  tokenA,
              },
            ],
          }
        );

      /**
       * Create relation
       */

      if (!relation) {
        relation =
          await BotTokenRelation.create(
            {
              tokenA,

              tokenB,

              similarity:
                0.1,

              occurrences: 1,

              contexts:
                mainIntent
                  ? [
                      mainIntent._id,
                    ]
                  : [],
            }
          );

        continue;
      }

      /**
       * Update occurrences
       */

      relation.occurrences += 1;

      /**
       * Increase similarity
       */

      relation.similarity =
        Math.min(
          relation.similarity +
            0.03,
          1
        );

      /**
       * Attach context
       */

      if (
        mainIntent
      ) {
        const alreadyHasContext =
          relation.contexts.some(
            contextId =>
              String(
                contextId
              ) ===
              String(
                mainIntent._id
              )
          );

        if (
          !alreadyHasContext
        ) {
          relation.contexts.push(
            mainIntent._id
          );
        }
      }

      /**
       * Auto validation
       */

      if (
        relation.similarity >=
          0.7 &&
        relation.occurrences >=
          5
      ) {
        relation.validated =
          true;
      }

      await relation.save();
    }
  }
}
