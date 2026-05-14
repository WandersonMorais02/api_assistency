import { DeviceType } from "../../modules/device-types/device-type.model.js";

import { generateSlug } from "../../core/utils/generate-slug.js";

const deviceTypes = [
  "SMARTPHONE",
  "TABLET",
  "NOTEBOOK",
  "DESKTOP",
  "PRINTER",
  "MONITOR",
];

export async function seedDeviceTypes() {
  const count = await DeviceType.countDocuments();

  if (count > 0) {
    console.log("✔ DeviceTypes já populado");
    return;
  }

  const payload = deviceTypes.map(name => ({
    name,
    slug: generateSlug(name),
  }));

  await DeviceType.insertMany(payload);

  console.log("✔ DeviceTypes populado");
}
