import { BotAnswer }
from "../../modules/bot/bot-answer.model.js";

export async function resolveResponse(
  intents = []
) {
  if (!intents.length) {
    return null;
  }

  const bestIntent =
    intents[0];

  const answers =
    await BotAnswer.find({
      intent:
        bestIntent.intent._id,

      isActive: true,
    }).sort({
      priority: -1,
      usageCount: -1,
    });

  if (!answers.length) {
    return null;
  }

  const selected =
    answers[0];

  selected.usageCount += 1;

  await selected.save();

  return {
    response:
      selected.content,

    intent:
      bestIntent.intent,

    confidence:
      bestIntent.confidence,
  };
}
