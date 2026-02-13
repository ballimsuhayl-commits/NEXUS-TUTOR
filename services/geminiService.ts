import { GoogleGenAI, Chat, GenerateContentResponse, Type } from "@google/genai";
import { Message, Role, Subject, Mood, Quiz, StudyMode, QuizQuestion, ModelMode, Topic } from '../types';
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
  return !!(key && key.length > 0 && key !== "PLACEHOLDER_KEY");
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

  // STRICT MODEL SELECTION BASED ON GOOGLE GENAI SDK GUIDELINES
  let modelName = 'gemini-3-flash-preview'; // Default fallback (Basic Text Tasks)
  let thinkingBudget = 0;

  switch (modelMode) {
    case ModelMode.FAST:
      modelName = 'gemini-flash-lite-latest';
      thinkingBudget = 0;
      break;
    case ModelMode.BALANCED:
      modelName = 'gemini-3-flash-preview';
      thinkingBudget = 0;
      break;
    case ModelMode.SMART:
      modelName = 'gemini-3-pro-preview'; // Complex Text Tasks
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
    // Using Gemini 3 Pro Image Preview for high-quality illustrations
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

export const generateLesson = async (subject: Subject, topic: Topic, studyMode: StudyMode): Promise<string> => {
    // Inject diagrams into quiz generation context as well
    const relevantDiagrams = CORE_DIAGRAMS[subject as keyof typeof CORE_DIAGRAMS] || {};
    const diagramsJson = JSON.stringify(relevantDiagrams);

    const prompt = `
    ROLE: Senior IEB Grade 11 Teacher.
    SUBJECT: ${subject}
    TOPIC: "${topic.title}" - ${topic.description}
    LEVEL: ${studyMode}

    TASK: Deliver a **Full Classroom Lecture** on this topic. This is NOT a summary. This is the complete teaching of the concept as if you were standing at the chalkboard.

    STRUCTURE THE LESSON AS FOLLOWS (Use Markdown):

    # 1. Learning Intentions
    *Briefly state what we will master today.*

    # 2. 🧠 Teacher's Introduction (The Hook)
    *Connect this concept to the real world or previous knowledge to prime the brain.*

    # 3. 📚 Deep Theory & Core Concepts
    *Teach the content in FULL detail. Use bullet points, bold definitions, and clear explanations.*
    *If this is Maths/Physics: State formulas clearly. Explain variables.*
    *If this is Biology: Explain structure and function.*
    
    # 4. 👁️ Visual Aid
    *Describe the diagram/graph students must visualize.*
    *IF RELEVANT: Insert a Mermaid Diagram from this library: ${diagramsJson}*

    # 5. 📝 Worked Examples (Crucial)
    *Provide 2 distinct examples. Walk through the solution step-by-step. Explain the 'why' behind each step.*
    
    # 6. ⚠️ Common Pitfalls (The Examiner's Voice)
    *Where do students lose marks in finals? Be specific.*

    # 7. ⚓ Class Summary (Memory Anchor)
    *A quick mnemonic or rhyme to lock it in.*

    TONE: Authoritative, Encouraging, Academic but accessible. 
    LENGTH: Comprehensive (approx 800-1000 words).
    `;

    try {
        // Use Gemini 3 Pro for comprehensive lesson generation (Thinking allowed for deep structure)
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: prompt,
            config: {
                systemInstruction: "You are the best teacher in the country. You do not leave out details. You explain until the student understands.",
                thinkingConfig: { thinkingBudget: 4000 } // Allocate thinking for structuring the lesson
            }
        });
        return response.text || "Lesson generation incomplete.";
    } catch (e) {
        console.error("Lesson generation failed", e);
        throw e;
    }
};

export const generateExamCheatSheet = async (subject: Subject, examContext: string, topic: string): Promise<string> => {
    const relevantDiagrams = CORE_DIAGRAMS[subject as keyof typeof CORE_DIAGRAMS] || {};
    const diagramsJson = JSON.stringify(relevantDiagrams);

    const prompt = `
    ROLE: Senior IEB Grade 11 Examiner.
    SUBJECT: ${subject}
    CONTEXT: ${examContext} (e.g., Paper 1, Section B)
    TOPIC: ${topic}

    TASK: Create a **High-Yield Exam Cheat Sheet** for this specific topic. The student is memorizing this for an exam.
    
    STRUCTURE (Markdown):
    
    # 📝 ${topic} - Exam Cheat Sheet
    
    ## 1. 🔑 Keywords & Definitions (Verbatim)
    *List 3-5 definitions that must be memorized word-for-word for marks.*
    
    ## 2. ⚡ Core Formulae / Rules
    *The absolute essentials. If Maths/Physics, show the formula. If English/History, show the key dates or quote.*
    
    ## 3. 🧠 The "Golden Thread" (Essay/Long Question Link)
    *How to link this concept to broader themes for Level 4 (Application) marks.*
    
    ## 4. ⚠️ Examiner's Warning
    *A specific "Don't do this" warning based on common marking errors.*
    
    ## 5. 🦁 Mnemonic / Memory Hook
    *A creative acronym or rhyme to remember the main points.*

    ## 6. 🖼️ Visual Map
    *IF RELEVANT: Insert a Mermaid Diagram from this library: ${diagramsJson}. If no exact match, create a simple graph TD or mindmap.*

    STYLE: Concise, High-Impact, Memorization-Focused. No fluff.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: "You are a helpful, strict, and precise exam coach.",
                thinkingConfig: { thinkingBudget: 2000 }
            }
        });
        return response.text || "Could not generate notes.";
    } catch (e) {
        console.error("Note generation failed", e);
        throw e;
    }
};

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
      // Use Gemini 3 Pro for high-quality quiz generation (Complex Task)
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
            // Generate image using Gemini 3 Pro Image
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