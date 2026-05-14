import { ProductCategory } from "../../modules/product-categories/product-category.model.js";

import { generateSlug } from "../../core/utils/generate-slug.js";

const categories = [
  "Celulares",
  "Notebooks",
  "Impressoras",
  "Peças",
  "Acessórios",
  "Recondicionados",
];

export async function seedProductCategories() {
  const count = await ProductCategory.countDocuments();

  if (count > 0) {
    console.log("✔ ProductCategories já populado");
    return;
  }

  const payload = categories.map(name => ({
    name,
    slug: generateSlug(name),
  }));

  await ProductCategory.insertMany(payload);

  console.log("✔ ProductCategories populado");
}
