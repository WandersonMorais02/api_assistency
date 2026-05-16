import { BotToken }
from "../../modules/bot/bot-token.model.js";

import { tokenize }
from "./tokenizer.js";

export async function resolveTokens(
  message
) {
  const tokens =
    tokenize(message);

  const knownTokens = [];
  const unknownTokens = [];

  for (const token of tokens) {
    const exists =
      await BotToken.findOne({
        normalized: token,
        isActive: true,
      }).populate("intents");

    if (exists) {
      exists.occurrences += 1;

      await exists.save();

      knownTokens.push(exists);
    } else {
      unknownTokens.push(
        token
      );
    }
  }

  return {
    tokens,
    knownTokens,
    unknownTokens,
  };
}
