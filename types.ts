// Add global process declaration for the build system
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
    }
  }
}

export enum Subject {
  MATHS = 'Mathematics',
  PHYSICS = 'Physical Sciences',
  BIOLOGY = 'Life Sciences',
  BUSINESS = 'Business Studies',
  LO = 'Life Orientation',
  GENERAL = 'General Consulting'
}

export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export enum Mood {
  NEUTRAL = 'Neutral',
  STRESSED = 'Stressed',
  CONFIDENT = 'Confident',
  CONFUSED = 'Confused',
  TIRED = 'Tired'
}

export enum StudyMode {
  STANDARD = 'Grade 11 Standard',
  ADVANCED = 'Advanced (Grade 11 + 12)'
}

export enum ModelMode {
  FAST = 'Lightning (Flash Lite)',
  BALANCED = 'Standard (Gemini 3 Flash)',
  SMART = 'Smart (Gemini 3 Pro)',
  DEEP = 'Deep Thinker (Pro 3 + Thinking)'
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface UserState {
  name: string;
  currentSubject: Subject;
  mood: Mood;
  studyMode: StudyMode;
}

export interface QuizQuestion {
  question: string;
  diagram?: string; // Mermaid code for the diagram
  imageDescription?: string; // Prompt for Imagen
  generatedImage?: string; // Base64 image data
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  memoryHook?: string; // A short mnemonic or visual anchor
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface Flashcard extends QuizQuestion {
  id: string;
  subject: Subject;
  interval: number;
  repetition: number;
  efactor: number;
  dueDate: number;
}

export interface AppSettings {
  enableSRS: boolean;
}

// Curriculum Types
export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface Curriculum {
  modules: Module[];
}

// Progress Tracking
export interface UserProgress {
  completedTopics: string[]; // Array of Topic IDs
}