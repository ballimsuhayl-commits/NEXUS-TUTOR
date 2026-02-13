import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Chat, LiveServerMessage, Modality } from '@google/genai';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import VoiceMode from './components/VoiceMode';
import QuizModal from './components/QuizModal';
import SettingsModal from './components/SettingsModal';
import ReviewModal from './components/ReviewModal';
import SubjectHub from './components/SubjectHub';
import { Message, Role, Subject, Mood, Quiz, StudyMode, Flashcard, AppSettings, ModelMode, UserProgress } from './types';
import { createChatSession, sendMessageToGemini, ai, generateQuiz, hasValidKey } from './services/geminiService';
import { SUBJECT_CONFIG, INITIAL_SYSTEM_INSTRUCTION, IEB_SYLLABUS } from './constants';
import { arrayBufferToBase64, base64ToUint8Array, decodeAudioData, float32To16BitPCM, downsampleBuffer } from './utils/audioUtils';
import { INITIAL_FLASHCARD_STATE, calculateSRS, getDueCards } from './utils/srs';

function App() {
  const [currentSubject, setCurrentSubject] = useState<Subject>(Subject.GENERAL);
  const [mood, setMood] = useState<Mood>(Mood.NEUTRAL);
  const [studyMode, setStudyMode] = useState<StudyMode>(StudyMode.STANDARD);
  const [modelMode, setModelMode] = useState<ModelMode>(ModelMode.SMART); // Default to Smart (Pro)
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [audioPower, setAudioPower] = useState(0);
  
  // Quiz State
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // SRS State
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({ enableSRS: true });

  // Progress State
  const [userProgress, setUserProgress] = useState<UserProgress>({ completedTopics: [] });

  // Load from local storage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem('ieb_nexus_flashcards');
    const savedSettings = localStorage.getItem('ieb_nexus_settings');
    const savedProgress = localStorage.getItem('ieb_nexus_progress');
    
    if (savedCards) setFlashcards(JSON.parse(savedCards));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedProgress) setUserProgress(JSON.parse(savedProgress));

    // Check for API Key
    if (!hasValidKey()) {
      setIsSettingsOpen(true);
      setMessages([{
        id: 'system-welcome',
        role: Role.MODEL,
        text: "👋 **Welcome to IEB Nexus!**\n\nTo get started, please go to **Settings** and enter your Google Gemini API Key in the Admin section.",
        timestamp: new Date()
      }]);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ieb_nexus_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('ieb_nexus_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ieb_nexus_progress', JSON.stringify(userProgress));
  }, [userProgress]);


  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const liveSessionPromise = useRef<Promise<any> | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  // Initialize Text Chat Session
  useEffect(() => {
    if (!hasValidKey()) return;
    setChatSession(createChatSession(currentSubject, mood, studyMode, modelMode));
    setMessages([]);
  }, [currentSubject, mood, studyMode, modelMode, isSettingsOpen]); 

  // --- Live API Implementation ---
  const stopLiveSession = useCallback(() => {
    setIsLive(false);
    setAudioPower(0);
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current = null;
    }
    if (liveSessionPromise.current) {
        liveSessionPromise.current.then(session => {
            try { session.close(); } catch(e) { console.error("Error closing session", e); }
        });
        liveSessionPromise.current = null;
    }
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    audioContextRef.current?.close();
    inputAudioContextRef.current?.close();
    audioContextRef.current = null;
    inputAudioContextRef.current = null;
    nextStartTimeRef.current = 0;
  }, []);

  const startLiveSession = useCallback(async () => {
    if (!hasValidKey()) {
        setIsSettingsOpen(true);
        return;
    }

    try {
        setIsLive(true); 

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        await audioCtx.resume();
        audioContextRef.current = audioCtx;
        nextStartTimeRef.current = audioCtx.currentTime;
        
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        await inputCtx.resume();
        inputAudioContextRef.current = inputCtx;
        
        const g11Syllabus = IEB_SYLLABUS[currentSubject].g11;
        const g12Syllabus = IEB_SYLLABUS[currentSubject].g12;

        const config = {
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
                systemInstruction: INITIAL_SYSTEM_INSTRUCTION
                    .replace('{SUBJECT}', currentSubject)
                    .replace('{MOOD}', mood)
                    .replace('{STUDY_MODE}', studyMode)
                    .replace('{G11_SYLLABUS}', g11Syllabus)
                    .replace('{G12_SYLLABUS}', g12Syllabus),
            }
        };

        const sessionPromise = ai.live.connect({
            model: config.model,
            config: config.config,
            callbacks: {
                onopen: () => {
                    console.log("Live session connected");
                    const source = inputCtx.createMediaStreamSource(stream);
                    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                    processorRef.current = processor;
                    processor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        let sum = 0;
                        for(let i=0; i < inputData.length; i+=50) sum += Math.abs(inputData[i]);
                        const avg = sum / (inputData.length / 50);
                        setAudioPower(prev => (prev * 0.8) + (avg * 100 * 0.2)); 

                        const targetRate = 16000;
                        const resampledData = downsampleBuffer(inputData, inputCtx.sampleRate, targetRate);
                        const pcm16 = float32To16BitPCM(resampledData);
                        const base64Data = arrayBufferToBase64(pcm16.buffer);
                        
                        sessionPromise.then(session => {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: 'audio/pcm;rate=16000',
                                    data: base64Data
                                }
                            });
                        });
                    };
                    source.connect(processor);
                    processor.connect(inputCtx.destination);
                },
                onmessage: async (msg: LiveServerMessage) => {
                    const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audioData && audioContextRef.current) {
                        const ctx = audioContextRef.current;
                        const buffer = await decodeAudioData(base64ToUint8Array(audioData), ctx, 24000, 1);
                        setAudioPower(50);
                        const source = ctx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(ctx.destination);
                        const startTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
                        source.start(startTime);
                        nextStartTimeRef.current = startTime + buffer.duration;
                        sourcesRef.current.add(source);
                        source.onended = () => {
                            sourcesRef.current.delete(source);
                            if (sourcesRef.current.size === 0) setAudioPower(0);
                        };
                    }
                },
                onclose: () => {
                    stopLiveSession();
                },
                onerror: (err) => {
                    console.error("Live session error", err);
                    stopLiveSession();
                }
            }
        });
        liveSessionPromise.current = sessionPromise;
    } catch (error) {
        console.error("Failed to start live session:", error);
        alert("Microphone access failed.");
        setIsLive(false);
    }
  }, [currentSubject, mood, studyMode, stopLiveSession]);

  const toggleLiveSession = () => {
      if (isLive) stopLiveSession();
      else startLiveSession();
  };

  const handleStartQuiz = async () => {
    if (!hasValidKey()) {
        setIsSettingsOpen(true);
        return;
    }
    setIsGeneratingQuiz(true);
    try {
      const data = await generateQuiz(currentSubject, studyMode);
      setQuizData(data);
      setIsQuizOpen(true);
    } catch (error: any) {
      console.error("Failed to generate quiz", error);
      const errorText = error.message || error.toString();
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: Role.MODEL,
        text: `I couldn't generate a quiz right now. \n\n**Error Details:** ${errorText}\n\nPlease check your API Key permissions.`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleQuizComplete = (results: { questionIndex: number, isCorrect: boolean }[]) => {
    if (!settings.enableSRS || !quizData) return;
    setFlashcards(prevCards => {
        const newCards = [...prevCards];
        results.forEach(result => {
            const questionData = quizData.questions[result.questionIndex];
            const existingIndex = newCards.findIndex(c => c.question === questionData.question);
            if (existingIndex >= 0) {
                newCards[existingIndex] = calculateSRS(newCards[existingIndex], result.isCorrect ? 5 : 1);
            } else {
                const newCard: Flashcard = {
                    ...questionData,
                    id: Date.now().toString() + Math.random(),
                    subject: currentSubject,
                    ...INITIAL_FLASHCARD_STATE,
                    dueDate: Date.now() 
                };
                const processedCard = calculateSRS(newCard, result.isCorrect ? 5 : 1);
                newCards.push(processedCard);
            }
        });
        return newCards;
    });
  };

  const handleReviewResult = (cardId: string, grade: number) => {
    setFlashcards(prev => prev.map(card => {
        if (card.id === cardId) return calculateSRS(card, grade);
        return card;
    }));
  };

  const handleToggleTopicCompletion = (topicId: string) => {
    setUserProgress(prev => {
        const exists = prev.completedTopics.includes(topicId);
        return {
            ...prev,
            completedTopics: exists 
                ? prev.completedTopics.filter(id => id !== topicId) 
                : [...prev.completedTopics, topicId]
        };
    });
  };

  const dueCards = settings.enableSRS ? getDueCards(flashcards) : [];

  const handleSendMessage = async (text: string) => {
    if (!hasValidKey()) {
        setIsSettingsOpen(true);
        return;
    }
    if (!chatSession || isLive) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(chatSession, text, currentSubject, mood, studyMode);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: Role.MODEL,
        text: "I encountered an error. Please check your API Key.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header 
        currentSubject={currentSubject} 
        currentMood={mood} 
        currentModelMode={modelMode}
        onSubjectChange={setCurrentSubject}
        onMoodChange={setMood}
        onModelModeChange={setModelMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar 
            currentSubject={currentSubject} 
            onSubjectChange={setCurrentSubject} 
            mood={mood} 
            studyMode={studyMode}
            onStudyModeChange={setStudyMode}
            onStartQuiz={handleStartQuiz}
            isGeneratingQuiz={isGeneratingQuiz}
            dueCardsCount={dueCards.length}
            onStartReview={() => setIsReviewOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="flex-1 flex flex-col lg:ml-72 p-4 md:p-6 h-[calc(100vh-64px)]">
           <div className="flex-1 h-full">
              <SubjectHub 
                  currentSubject={currentSubject}
                  studyMode={studyMode}
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  onToggleLive={toggleLiveSession}
                  isLive={isLive}
                  onStartQuiz={handleStartQuiz}
                  isGeneratingQuiz={isGeneratingQuiz}
                  completedTopics={userProgress.completedTopics}
                  onToggleTopicCompletion={handleToggleTopicCompletion}
              />
           </div>
        </main>
      </div>

      <VoiceMode 
        isActive={isLive} 
        currentSubject={currentSubject} 
        mood={mood} 
        onClose={toggleLiveSession}
        audioPower={audioPower}
      />

      {isQuizOpen && quizData && (
        <QuizModal 
          quiz={quizData} 
          currentSubject={currentSubject} 
          onClose={() => setIsQuizOpen(false)}
          onRetry={handleStartQuiz}
          onComplete={handleQuizComplete}
        />
      )}

      {isReviewOpen && dueCards.length > 0 && (
          <ReviewModal 
             cards={dueCards}
             onReviewResult={handleReviewResult}
             onClose={() => setIsReviewOpen(false)}
          />
      )}

      <SettingsModal 
         isOpen={isSettingsOpen}
         onClose={() => setIsSettingsOpen(false)}
         settings={settings}
         onSettingsChange={setSettings}
         onClearData={() => {
             setFlashcards([]);
             setUserProgress({ completedTopics: [] });
         }}
      />

    </div>
  );
}

export default App;