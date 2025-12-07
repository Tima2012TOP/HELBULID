import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// System instruction to ensure the AI acts as a web developer
const SYSTEM_INSTRUCTION = `
You are Helbulid, an expert full-stack web developer and UI/UX designer. 
Your goal is to build single-file HTML prototypes that look modern, beautiful, and are fully functional.

RULES:
1. ALWAYS return a SINGLE HTML file.
2. Use Tailwind CSS via CDN for styling. (<script src="https://cdn.tailwindcss.com"></script>)
3. Use FontAwesome or similar via CDN for icons if needed, or simple SVG icons.
4. Include all JavaScript inside <script> tags within the HTML.
5. Include all CSS inside <style> tags (if custom CSS is needed beyond Tailwind).
6. The design must be responsive (mobile-first) and visually stunning.
7. Use https://picsum.photos/WIDTH/HEIGHT for placeholder images.
8. DO NOT wrap the output in markdown code blocks (like \`\`\`html). Return RAW HTML string only.
9. If the user asks for changes, modify the previous code and return the FULL updated HTML file.
10. Treat the "gpt-5" request as a request for the highest quality reasoning available to you (Gemini 3 Pro).
`;

export const generateWebsiteCode = async (
  prompt: string,
  currentCode?: string
): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';

    // Context preparation
    let fullPrompt = prompt;
    if (currentCode) {
      fullPrompt = `
      Current Code Version:
      ${currentCode}
      
      User Request for updates:
      ${prompt}
      
      Return the fully updated HTML file.
      `;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 2048 }, // Enable thinking for better code logic
        temperature: 0.7,
      },
    });

    let text = response.text || '';

    // Cleanup: Remove markdown code fences if the model accidentally includes them
    text = text.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');

    return text;
  } catch (error) {
    console.error("Error generating code:", error);
    throw new Error("Failed to generate website code. Please check your API key and try again.");
  }
};
