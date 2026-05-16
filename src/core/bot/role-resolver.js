import { BotProfile }
from "../../modules/bot/bot-profile.model.js";

export async function resolveBotProfile(
  role
) {
  let profile =
    await BotProfile.findOne({
      targetRoles: role,
      isActive: true,
    });

  if (!profile) {
    profile =
      await BotProfile.findOne({
        name: "DEFAULT",
        isActive: true,
      });
  }

  return profile;
}
