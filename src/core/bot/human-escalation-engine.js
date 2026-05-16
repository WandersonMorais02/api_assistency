const criticalKeywords = [
  "explodiu",
  "fumaca",
  "fumaça",
  "pegando fogo",
  "incendio",
  "incêndio",
  "choque",
  "curto grave",
];

const angryKeywords = [
  "horrivel",
  "péssimo",
  "pessimo",
  "ninguém resolve",
  "ninguem resolve",
  "cancelar",
  "processo",
  "procon",
  "reclamação",
  "reclamacao",
];

const technicalCriticalKeywords = [
  "reballing",
  "curto primario",
  "linha primaria",
  "cpu em curto",
  "pmic",
  "memoria nand",
];

export function evaluateHumanEscalation({
  message = "",

  confidence = 0,

  confidenceLevel = "LOW",

  userRole = "CLIENT",

  context = {},
}) {
  const normalized =
    message.toLowerCase();

  /**
   * ============================
   * LOW CONFIDENCE
   * ============================
   */

  if (confidence < 0.25) {
    return {
      shouldEscalate: true,

      priority: "MEDIUM",

      sector: "ATTENDANT",

      reason:
        "LOW_CONFIDENCE",
    };
  }

  /**
   * ============================
   * CRITICAL CLIENT CASES
   * ============================
   */

  const hasCriticalKeyword =
    criticalKeywords.some(
      keyword =>
        normalized.includes(
          keyword
        )
    );

  if (hasCriticalKeyword) {
    return {
      shouldEscalate: true,

      priority: "HIGH",

      sector: "TECHNICIAN",

      reason:
        "CRITICAL_CASE",
    };
  }

  /**
   * ============================
   * ANGRY CUSTOMER
   * ============================
   */

  const angryDetected =
    angryKeywords.some(
      keyword =>
        normalized.includes(
          keyword
        )
    );

  if (angryDetected) {
    return {
      shouldEscalate: true,

      priority: "HIGH",

      sector: "ADMIN",

      reason:
        "CUSTOMER_STRESS",
    };
  }

  /**
   * ============================
   * TECHNICAL ESCALATION
   * ============================
   */

  if (
    userRole ===
      "TECHNICIAN" ||
    userRole === "ADMIN"
  ) {
    const technicalCritical =
      technicalCriticalKeywords.some(
        keyword =>
          normalized.includes(
            keyword
          )
      );

    if (
      technicalCritical
    ) {
      return {
        shouldEscalate: true,

        priority:
          "HIGH",

        sector:
          "TECH_LEAD",

        reason:
          "ADVANCED_TECHNICAL_CASE",
      };
    }
  }

  /**
   * ============================
   * READY TO ANSWER
   * ============================
   */

  if (
    context.stage ===
      "READY_TO_ANSWER" &&
    confidenceLevel ===
      "HIGH"
  ) {
    return {
      shouldEscalate: false,
    };
  }

  /**
   * ============================
   * DEFAULT
   * ============================
   */

  return {
    shouldEscalate: false,
  };
}
