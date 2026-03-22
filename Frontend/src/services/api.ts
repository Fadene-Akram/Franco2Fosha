const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface TransliterationAlternative {
  text: string;
  confidence: number;
}

export interface TransliterationResponse {
  input_text: string;
  output_text: string;
  output_type: string;
  confidence: number;
  alternatives: TransliterationAlternative[];
}

export interface FeedbackPayload {
  input_text: string;
  output_text: string;
  feedback_type: "positive" | "negative";
  comment?: string | null;
}

export interface ErrorResponse {
  error: string | Record<string, string[]>;
}

export const transliterateText = async (
  text: string,
  outputType: "darija" | "msa",
): Promise<TransliterationResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transliterate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        text,
        output_type: outputType,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = "Failed to transliterate text";

      try {
        const errorData: ErrorResponse = JSON.parse(responseText);
        errorMessage =
          typeof errorData.error === "string"
            ? errorData.error
            : JSON.stringify(errorData.error);
      } catch {
        errorMessage = responseText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("API Error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error. Please check your connection.");
  }
};

export const submitFeedback = async (
  payload: FeedbackPayload,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/feedback/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      input_text: payload.input_text,
      output_text: payload.output_text,
      feedback_type: payload.feedback_type,
      comment: payload.comment || null,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    let errorMessage = "Failed to submit feedback";

    try {
      const errorData: ErrorResponse = JSON.parse(responseText);
      errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : JSON.stringify(errorData.error);
    } catch {
      errorMessage = responseText || errorMessage;
    }

    throw new Error(errorMessage);
  }
};

export interface ContributionPayload {
  arabizi: string;
  darija: string;
  msa: string;
}

export const submitContribution = async (
  payload: ContributionPayload,
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/contribute/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const responseText = await response.text();
    let errorMessage = "Failed to submit contribution";

    try {
      const errorData: ErrorResponse = JSON.parse(responseText);
      errorMessage =
        typeof errorData.error === "string"
          ? errorData.error
          : JSON.stringify(errorData.error);
    } catch {
      errorMessage = responseText || errorMessage;
    }

    throw new Error(errorMessage);
  }
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/`);
    return response.ok;
  } catch {
    return false;
  }
};
