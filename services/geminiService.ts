import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Message, Role, Subject, Mood, Quiz, StudyMode, QuizQuestion, ModelMode } from '../types';
import { INITIAL_SYSTEM_INSTRUCTION, IEB_SYLLABUS, CORE_DIAGRAMS } from '../constants';

// --- Dynamic API Key Management ---
const getStoredKey = () => {
  // Check localStorage first (Admin set), then environment variable (Build set)
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('gemini_api_key');
    if (localKey && localKey.trim().length > 0) return localKey;
    
    if (process.env.API_KEY && process.env.API_KEY.trim().length > 0) return process.env.API_KEY;
  }
  return '';
};

// Export 'ai' as a mutable let binding so it can be updated
// We initialize with a placeholder if empty to avoid immediate crash, but requests will fail until key is set
export let ai = new GoogleGenAI({ apiKey: getStoredKey() || "PLACEHOLDER_KEY" });

export const setStoredApiKey = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gemini_api_key', key);
  }
  // Re-initialize the client with the new key
  console.log("Re-initializing Gemini client with new key");
  ai = new GoogleGenAI({ apiKey: key });
};

export const hasValidKey = () => {
  const key = getStoredKey();
  return key && key.length > 0 && key !== "PLACEHOLDER_KEY";
};
// ----------------------------------

export const createChatSession = (subject: Subject, mood: Mood, studyMode: StudyMode, modelMode: ModelMode) => {
  const g11Syllabus = IEB_SYLLABUS[subject].g11;
  const g12Syllabus = IEB_SYLLABUS[subject].g12;

  // Prepare Core Diagrams Context
  const relevantDiagrams = CORE_DIAGRAMS[subject as keyof typeof CORE_DIAGRAMS] || {};
  const diagramsJson = JSON.stringify(relevantDiagrams);
  const diagramKeys = Object.keys(relevantDiagrams).join(', ');

  const instruction = INITIAL_SYSTEM_INSTRUCTION
    .replace('{SUBJECT}', subject)
    .replace('{MOOD}', mood)
    .replace('{STUDY_MODE}', studyMode)
    .replace('{G11_SYLLABUS}', g11Syllabus)
    .replace('{G12_SYLLABUS}', g12Syllabus)
    .replace('{CORE_DIAGRAMS_KEYS}', diagramKeys)
    .replace('{CORE_DIAGRAMS_JSON}', diagramsJson);

  let modelName = 'gemini-3-flash-preview'; // Default fallback
  let thinkingBudget = 0;

  switch (modelMode) {
    case ModelMode.FAST:
      modelName = 'gemini-flash-lite-latest';
      thinkingBudget = 0;
      break;
    case ModelMode.BALANCED:
      modelName = 'gemini-3-flash-preview'; // Standard Flash
      thinkingBudget = 0;
      break;
    case ModelMode.SMART:
      modelName = 'gemini-3-pro-preview';
      thinkingBudget = 0;
      break;
    case ModelMode.DEEP:
      modelName = 'gemini-3-pro-preview';
      thinkingBudget = 32768; // Max thinking budget for Pro
      break;
    default:
      modelName = 'gemini-3-flash-preview';
  }

  const chatConfig: any = {
    systemInstruction: instruction,
  };

  if (thinkingBudget > 0) {
    chatConfig.thinkingConfig = { thinkingBudget };
    // DO NOT set maxOutputTokens when using thinking budget
  }

  console.log(`Creating chat session with model: ${modelName}`);
  return ai.chats.create({
    model: modelName,
    config: chatConfig,
  });
};

export const sendMessageToGemini = async (
  chat: Chat, 
  message: string, 
  subject: Subject, 
  mood: Mood,
  studyMode: StudyMode
): Promise<string> => {
  try {
    const contextUpdate = `[Context Update: Subject=${subject}, Mood=${mood}, Mode=${studyMode}]`;
    const fullMessage = `${contextUpdate}\n${message}`;

    const result = await chat.sendMessage({
      message: fullMessage
    });

    return result.text || "I'm having trouble processing that right now. Let's try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const generateImageForQuestion = async (prompt: string): Promise<string | undefined> => {
  try {
    // Using Gemini 3 Pro Image Preview for better integration and quality
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: `Educational scientific textbook illustration, clear line art or diagram style, white background, high detail: ${prompt}` }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "4:3",
            imageSize: "1K"
        }
      },
    });

    // Extract image part safely
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return part.inlineData.data;
            }
        }
    }
    return undefined;
  } catch (e) {
    console.warn("Image generation failed", e);
    return undefined;
  }
}

export const generateQuiz = async (subject: Subject, studyMode: StudyMode): Promise<Quiz> => {
  console.log("Generating quiz for:", subject);
  
  // Inject diagrams into quiz generation context as well
  const relevantDiagrams = CORE_DIAGRAMS[subject as keyof typeof CORE_DIAGRAMS] || {};
  const diagramsJson = JSON.stringify(relevantDiagrams);

  const schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            diagram: { type: Type.STRING, description: "Optional Mermaid.js diagram code. YOU MAY COPY from {CORE_DIAGRAMS_JSON} if relevant." },
            imageDescription: { type: Type.STRING, description: "Prompt for the image model to generate a scientific illustration (e.g., 'Labeled diagram of a chloroplast'). Use this for structural diagrams." },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            memoryHook: { type: Type.STRING, description: "A catchy mnemonic, visual metaphor, or rhyme." }
          },
          required: ['question', 'options', 'correctAnswerIndex', 'explanation']
        }
      }
    },
    required: ['title', 'questions']
  };

  const difficulty = studyMode === StudyMode.ADVANCED ? "Hard/Matric Level" : "Standard Grade 11 IEB";
  
  let promptExtras = "";
  if (subject === Subject.BIOLOGY) {
      promptExtras = "CRITICAL: Include at least 2 questions with 'imageDescription' fields to generate diagrams (e.g., Heart structure, Leaf cross-section). Use 'diagram' (Mermaid) for metabolic cycles.";
  } else if (subject === Subject.BUSINESS) {
      promptExtras = "Use 'diagram' (Mermaid) for Business Structures/Hierarchies.";
  } else if (subject === Subject.PHYSICS) {
       promptExtras = "Include 'imageDescription' for Free Body Diagrams or Circuit setups.";
  }

  const prompt = `Create a visually engaging, high-quality IEB practice quiz for ${subject}.
  Study Mode: ${studyMode}. Difficulty: ${difficulty}.
  Syllabus Context: ${IEB_SYLLABUS[subject].g11} ${studyMode === StudyMode.ADVANCED ? 'AND ' + IEB_SYLLABUS[subject].g12 : ''}.
  
  ${promptExtras}
  
  AVAILABLE DIAGRAM LIBRARY: ${diagramsJson}
  If a question relates to these diagrams, USE THE EXACT MERMAID CODE provided in the library for the 'diagram' field.

  The quiz should contain 5 multiple choice questions.
  - **Visuals**: Use 'imageDescription' for illustrations and 'diagram' for charts.
  - **Memory**: Every question MUST have a 'memoryHook'.
  - **Critical Thinking**: Avoid simple definitions. Use scenarios.
  
  Make the 'explanation' rich and encouraging.`;

  try {
      // Use Gemini 3 Pro for high-quality quiz generation
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
            systemInstruction: "You are an expert IEB Examiner and Educational Psychologist. You believe in Dual Coding theory."
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("Empty response from quiz generator");
      
      let quiz: Quiz;
      try {
        quiz = JSON.parse(text) as Quiz;
      } catch (parseError) {
        console.error("Failed to parse quiz JSON:", text);
        throw new Error("Received invalid JSON format from model.");
      }

      // Post-process: Generate images for questions that requested them
      const questionsWithImages = await Promise.all(quiz.questions.map(async (q: QuizQuestion) => {
        if (q.imageDescription) {
            // Generate image
            const imageBytes = await generateImageForQuestion(q.imageDescription);
            if (imageBytes) {
                return { ...q, generatedImage: imageBytes };
            }
        }
        return q;
      }));

      return { ...quiz, questions: questionsWithImages };

  } catch (e: any) {
      console.error("Quiz generation failed. Full error:", e);
      // Helpful logging for the user
      if (e.toString().includes('403') || e.toString().includes('API key')) {
          console.error("API Key Issue detected. Please check permissions.");
      }
      throw e;
  }
};
