import { seedDeviceTypes } from "./device-types.seed.js";
import { seedProductCategories } from "./product-categories.seed.js";
import { seedBot } from "./bot.seed.js";

export async function runSeeds() {
  console.log("🌱 Verificando seeds...");

  await seedDeviceTypes();
  await seedProductCategories();
  await seedBot();

  console.log("🌱 Seeds finalizados");
}
