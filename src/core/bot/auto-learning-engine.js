import { BotToken }
from "../../modules/bot/bot-token.model.js";

import { BotIntent }
from "../../modules/bot/bot-intent.model.js";

export async function autoLearn({
  tokens = [],
  intents = [],
}) {
  if (
    !tokens.length ||
    !intents.length
  ) {
    return;
  }

  const mainIntent =
    intents[0]?.intent;

  if (!mainIntent) {
    return;
  }

  for (const token of tokens) {
    let tokenDoc =
      await BotToken.findOne({
        normalized: token,
      });

    /**
     * ============================
     * CREATE UNKNOWN TOKEN
     * ============================
     */

    if (!tokenDoc) {
      tokenDoc =
        await BotToken.create({
          token,

          normalized:
            token,

          intents: [
            mainIntent._id,
          ],

          weight: 0.1,

          occurrences: 1,

          autoLearned: true,

          learned: false,
        });

      continue;
    }

    /**
     * ============================
     * UPDATE OCCURRENCES
     * ============================
     */

    tokenDoc.occurrences += 1;

    /**
     * ============================
     * AUTO ASSOCIATION
     * ============================
     */

    const alreadyLinked =
      tokenDoc.intents.some(
        intentId =>
          String(intentId) ===
          String(
            mainIntent._id
          )
      );

    if (!alreadyLinked) {
      /**
       * First association
       */

      if (
        tokenDoc.occurrences >=
        3
      ) {
        tokenDoc.intents.push(
          mainIntent._id
        );
      }
    }

    /**
     * ============================
     * WEIGHT EVOLUTION
     * ============================
     */

    if (
      alreadyLinked
    ) {
      tokenDoc.weight =
        Math.min(
          tokenDoc.weight +
            0.05,
          5
        );
    }

    /**
     * ============================
     * AUTO VALIDATION
     * ============================
     */

    if (
      tokenDoc.weight >=
      1
    ) {
      tokenDoc.learned =
        true;
    }

    await tokenDoc.save();
  }

  /**
   * ============================
   * INTENT EVOLUTION
   * ============================
   */

  const intent =
    await BotIntent.findById(
      mainIntent._id
    );

  if (intent) {
    intent.usageCount += 1;

    await intent.save();
  }
}
