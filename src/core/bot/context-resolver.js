function detectDeviceType(
  tokens = []
) {
  const smartphone =
    [
      "celular",
      "smartphone",
      "iphone",
      "android",
    ];

  const notebook =
    [
      "notebook",
      "laptop",
    ];

  const printer =
    [
      "impressora",
      "printer",
    ];

  if (
    tokens.some(token =>
      smartphone.includes(
        token
      )
    )
  ) {
    return "SMARTPHONE";
  }

  if (
    tokens.some(token =>
      notebook.includes(
        token
      )
    )
  ) {
    return "NOTEBOOK";
  }

  if (
    tokens.some(token =>
      printer.includes(
        token
      )
    )
  ) {
    return "PRINTER";
  }

  return null;
}

function detectBrand(
  tokens = []
) {
  const brands = [
    "samsung",
    "apple",
    "iphone",
    "xiaomi",
    "motorola",
    "asus",
    "acer",
    "lenovo",
    "dell",
    "hp",
  ];

  return (
    tokens.find(token =>
      brands.includes(
        token
      )
    ) || null
  );
}

function detectPowerState(
  message = ""
) {
  const normalized =
    message.toLowerCase();

  if (
    normalized.includes(
      "não liga"
    ) ||
    normalized.includes(
      "nao liga"
    )
  ) {
    return "OFF";
  }

  if (
    normalized.includes(
      "liga"
    )
  ) {
    return "ON";
  }

  return null;
}

function detectModel(
  tokens = []
) {
  const possibleModels =
    tokens.filter(token =>
      /[a-z]+\d+/i.test(
        token
      )
    );

  return (
    possibleModels[0] ||
    null
  );
}

export function resolveConversationContext({
  message,
  tokens = [],
  currentState = {},
}) {
  const entities = {
    ...currentState.knownEntities,
  };

  /**
   * ============================
   * DEVICE TYPE
   * ============================
   */

  if (
    !entities.deviceType
  ) {
    const deviceType =
      detectDeviceType(
        tokens
      );

    if (deviceType) {
      entities.deviceType =
        deviceType;
    }
  }

  /**
   * ============================
   * BRAND
   * ============================
   */

  if (!entities.brand) {
    const brand =
      detectBrand(tokens);

    if (brand) {
      entities.brand =
        brand.toUpperCase();
    }
  }

  /**
   * ============================
   * MODEL
   * ============================
   */

  if (!entities.model) {
    const model =
      detectModel(tokens);

    if (model) {
      entities.model =
        model.toUpperCase();
    }
  }

  /**
   * ============================
   * POWER STATE
   * ============================
   */

  if (
    !entities.powerState
  ) {
    const powerState =
      detectPowerState(
        message
      );

    if (powerState) {
      entities.powerState =
        powerState;
    }
  }

  /**
   * ============================
   * STAGE
   * ============================
   */

  let stage =
    currentState.stage ||
    "START";

  const knownCount =
    Object.values(
      entities
    ).filter(Boolean)
      .length;

  if (knownCount >= 1) {
    stage = "TRIAGE";
  }

  if (knownCount >= 3) {
    stage =
      "COLLECTING_INFO";
  }

  if (knownCount >= 4) {
    stage =
      "READY_TO_ANSWER";
  }

  return {
    entities,
    stage,
  };
}
