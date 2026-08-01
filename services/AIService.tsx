// AI Service for generating questions from educational content
// Uses Gemini API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
}

export const generateQuestionsFromContent = async (
  content: string,
  count: number = 5,
  lang: "ar" | "en" = "ar",
): Promise<GeneratedQuestion[]> => {
  const languageName =
    lang === "ar" ? "Arabic (Modern Standard Arabic)" : "English";

  const prompt = `You are an intelligent educational assistant. Based on the following content, generate ${count} multiple-choice questions (4 options each).
  
Provide the response in the following ${languageName} language.

Content:
${content.substring(0, 3000)}

Respond strictly with JSON only, with no additional text. Format:
[
  {
    "question": "Question text in ${languageName}",
    "options": ["Option 1 in ${languageName}", "Option 2 in ${languageName}", "Option 3 in ${languageName}", "Option 4 in ${languageName}"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of the correct answer in ${languageName}"
  }
]

Notes:
- Ensure diverse difficulty levels (Easy, Medium, Hard).
- correctAnswer is the index of the correct option (0-3).
- Use proper ${languageName} grammar and professional tone.
- Make distractors (wrong options) plausible.
- If the original content is in a different language than ${languageName}, translate the concepts and information accurately into ${languageName} for the questions.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const questions: any[] = JSON.parse(jsonStr.trim());

    return questions.map((q: any, i: number) => ({
      id: `q_${Date.now()}_${i}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || "",
    }));
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error(
      lang === "ar"
        ? "فشل في توليد الأسئلة. تأكد من الاتصال بالإنترنت."
        : "Failed to generate questions. Check your internet connection.",
    );
  }
};

export const extractTextFromPDFForAI = async (
  pdfUrl: string,
): Promise<string> => {
  // For PDF text extraction, we'll use a simpler approach
  // In production, you'd use pdf.js to extract text
  try {
    const response = await fetch(pdfUrl);
    const blob = await response.blob();
    const text = await blob.text();
    // If it's readable text, return it; otherwise return a placeholder
    if (text.length > 100 && !text.includes("%PDF")) {
      return text.substring(0, 3000);
    }
    return "";
  } catch {
    return "";
  }
};

export const translateActionToEnglish = async (
  arabicText: string,
): Promise<string> => {
  const prompt = `Translate the following Arabic action log text to a short, concise English equivalent. Do not include any explanations, just the translated string.
  
Text:
${arabicText}`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 100,
        },
      }),
    });

    if (!response.ok) return arabicText;
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return text.trim() || arabicText;
  } catch (error) {
    return arabicText;
  }
};
