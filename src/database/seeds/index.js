import { seedDeviceTypes } from "./device-types.seed.js";
import { seedProductCategories } from "./product-categories.seed.js";

export async function runSeeds() {
  console.log("🌱 Verificando seeds...");

  await seedDeviceTypes();
  await seedProductCategories();

  console.log("🌱 Seeds finalizados");
}
