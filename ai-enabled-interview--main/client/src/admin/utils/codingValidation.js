// ============================================
// Validate Coding Problem Form
// ============================================

export const validateCodingProblem = (formData) => {
  const errors = {};

  // -------------------------------
  // Title
  // -------------------------------

  if (!formData.title?.trim()) {
    errors.title = "Problem title is required.";
  } else if (formData.title.length < 5) {
    errors.title =
      "Title must contain at least 5 characters.";
  }

  // -------------------------------
  // Description
  // -------------------------------

  if (!formData.description?.trim()) {
    errors.description =
      "Problem description is required.";
  }

  // -------------------------------
  // Topic
  // -------------------------------

  if (!formData.topic?.trim()) {
    errors.topic = "Topic is required.";
  }

  // -------------------------------
  // Difficulty
  // -------------------------------

  if (
    !["Easy", "Medium", "Hard"].includes(
      formData.difficulty
    )
  ) {
    errors.difficulty =
      "Please select a valid difficulty.";
  }

  // -------------------------------
  // Constraints
  // -------------------------------

  if (
    !formData.constraints ||
    formData.constraints.length === 0
  ) {
    errors.constraints =
      "At least one constraint is required.";
  } else {
    const invalid =
      formData.constraints.some(
        (item) => !item.trim()
      );

    if (invalid) {
      errors.constraints =
        "Constraint cannot be empty.";
    }
  }

  // -------------------------------
  // Examples
  // -------------------------------

  if (
    !formData.examples ||
    formData.examples.length === 0
  ) {
    errors.examples =
      "At least one example is required.";
  } else {
    for (let i = 0; i < formData.examples.length; i++) {
      const example = formData.examples[i];

      if (!example.input.trim()) {
        errors.examples = `Example ${
          i + 1
        }: Input is required.`;
        break;
      }

      if (!example.output.trim()) {
        errors.examples = `Example ${
          i + 1
        }: Output is required.`;
        break;
      }
    }
  }

  // -------------------------------
  // Supported Languages
  // -------------------------------

  if (
    !formData.supportedLanguages ||
    formData.supportedLanguages.length === 0
  ) {
    errors.supportedLanguages =
      "Select at least one language.";
  }

  // -------------------------------
  // Starter Code
  // -------------------------------

  if (
    formData.supportedLanguages?.length > 0
  ) {
    for (const language of formData.supportedLanguages) {
      if (
        !formData.starterCode?.[language]?.trim()
      ) {
        errors.starterCode = `Starter code missing for ${language}.`;
        break;
      }
    }
  }

  // -------------------------------
  // Solution
  // -------------------------------

  if (!formData.solution?.trim()) {
    errors.solution =
      "Official solution is required.";
  }

  // -------------------------------
  // Time Limit
  // -------------------------------

  if (
    Number(formData.timeLimit) <= 0
  ) {
    errors.timeLimit =
      "Time limit must be greater than zero.";
  }

  // -------------------------------
  // Memory Limit
  // -------------------------------

  if (
    Number(formData.memoryLimit) <= 0
  ) {
    errors.memoryLimit =
      "Memory limit must be greater than zero.";
  }

  return {
    isValid:
      Object.keys(errors).length === 0,
    errors,
  };
};