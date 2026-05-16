const intentRequiredFields = {
  WATER_DAMAGE: [
    "deviceType",
    "brand",
    "model",
    "powerState",
  ],

  SCREEN_DAMAGE: [
    "deviceType",
    "brand",
    "model",
  ],

  BATTERY_ISSUE: [
    "deviceType",
    "brand",
    "model",
  ],

  SOFTWARE_ISSUE: [
    "deviceType",
    "brand",
    "model",
    "systemVersion",
  ],
};

export function resolveMissingFields({
  intent,
  entities = {},
  askedFields = [],
}) {
  if (!intent) {
    return [];
  }

  const requiredFields =
    intentRequiredFields[
      intent
    ] || [];

  const missing =
    requiredFields.filter(
      field =>
        !entities[field]
    );

  return missing.filter(
    field =>
      !askedFields.includes(
        field
      )
  );
}
