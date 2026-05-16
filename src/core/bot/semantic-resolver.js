import { BotToken }
from "../../modules/bot/bot-token.model.js";

import { BotTokenRelation }
from "../../modules/bot/bot-token-relation.model.js";

export async function resolveSemanticTokens(
  tokens = []
) {
  const inferredTokens = [];

  for (const token of tokens) {
    /**
     * Direct relations
     */

    const relations =
      await BotTokenRelation.find({
        $or: [
          {
            tokenA: token,
          },

          {
            tokenB: token,
          },
        ],

        similarity: {
          $gte: 0.5,
        },

        validated: true,

        isActive: true,
      });

    for (const relation of relations) {
      const relatedToken =
        relation.tokenA ===
        token
          ? relation.tokenB
          : relation.tokenA;

      const tokenDoc =
        await BotToken.findOne({
          normalized:
            relatedToken,

          isActive: true,
        }).populate("intents");

      if (!tokenDoc) {
        continue;
      }

      inferredTokens.push({
        token:
          relatedToken,

        intents:
          tokenDoc.intents,

        semanticWeight:
          relation.similarity,

        source: token,
      });
    }
  }

  return inferredTokens;
}
