import React, { useState } from 'react';
import { Subject, Topic, Module, StudyMode, Role, Message, Mood, ModelMode } from '../types';
import { CURRICULUM, SUBJECT_CONFIG } from '../constants';
import { generateLesson, createChatSession, sendMessageToGemini } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { ChevronRight, ChevronDown, Loader2, CheckCircle, Circle, Trophy, ArrowLeft, Star, MessageSquare } from 'lucide-react';

interface LessonViewProps {
  currentSubject: Subject;
  studyMode: StudyMode;
  completedTopics: string[];
  onToggleTopicCompletion: (topicId: string) => void;
}

const LessonView: React.FC<LessonViewProps> = ({ 
    currentSubject, 
    studyMode, 
    completedTopics,
    onToggleTopicCompletion
}) => {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [lessonContent, setLessonContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Lesson specific chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lessonChatMessages, setLessonChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const config = SUBJECT_CONFIG[currentSubject];
  const curriculum = CURRICULUM[currentSubject];

  const toggleModule = (id: string) => {
    setActiveModuleId(activeModuleId === id ? null : id);
  };

  const handleTopicClick = async (topic: Topic) => {
    setActiveTopic(topic);
    setLessonContent(null); 
    setIsLoading(true);
    setError(null);
    setLessonChatMessages([]);
    setIsChatOpen(false);
    
    try {
        const content = await generateLesson(currentSubject, topic, studyMode);
        setLessonContent(content);
        // Initialize chat with context of lesson
        setLessonChatMessages([{
            id: 'intro',
            role: Role.MODEL,
            text: "I am your teacher for this lesson. If you have any specific questions about the content above, ask me here.",
            timestamp: new Date()
        }]);
    } catch (e) {
        setError("Could not generate lesson. Please check your connection.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleBackToCurriculum = () => {
    setActiveTopic(null);
    setLessonContent(null);
    setShowCelebration(false);
  };

  const handleClaimMastery = (topicId: string) => {
    const isNowComplete = !completedTopics.includes(topicId);
    onToggleTopicCompletion(topicId);
    
    if (isNowComplete) {
        setShowCelebration(true);
        setTimeout(() => {
            handleBackToCurriculum();
        }, 2500);
    } else {
        handleBackToCurriculum();
    }
  };

  const handleSendLessonChat = async () => {
    if (!chatInput.trim() || !activeTopic) return;
    
    const userMsg: Message = {
        id: Date.now().toString(),
        role: Role.USER,
        text: chatInput,
        timestamp: new Date()
    };
    
    setLessonChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
        // Create a temporary focused session just for this interaction
        // We use a lighter model for quick Q&A context
        const chat = await createChatSession(currentSubject, Mood.NEUTRAL, studyMode, ModelMode.BALANCED);
        
        // Contextualize the chat with the lesson content
        const contextPrompt = `
        CONTEXT: We are currently in a lesson about "${activeTopic.title}".
        LESSON CONTENT SUMMARY: ${activeTopic.description}
        STUDENT QUESTION: ${chatInput}
        
        Answer specifically related to this topic. Be concise.
        `;
        
        const response = await sendMessageToGemini(chat, contextPrompt, currentSubject, Mood.NEUTRAL, studyMode);
        
        const aiMsg: Message = {
            id: Date.now().toString(),
            role: Role.MODEL,
            text: response,
            timestamp: new Date()
        };
        setLessonChatMessages(prev => [...prev, aiMsg]);
    } catch (e) {
        console.error("Chat error", e);
    } finally {
        setIsChatLoading(false);
    }
  };

  // Calculate Progress
  const calculateModuleProgress = (module: Module) => {
      if (module.topics.length === 0) return 0;
      const completedCount = module.topics.filter(t => completedTopics.includes(t.id)).length;
      return Math.round((completedCount / module.topics.length) * 100);
  };

  if (activeTopic) {
      // ---------------- SINGLE LESSON VIEW ----------------
      const isComplete = completedTopics.includes(activeTopic.id);
      
      return (
          <div className="h-full flex flex-col bg-white relative">
              {/* Internal Mastery Overlay */}
              {showCelebration && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm animate-in fade-in duration-500">
                    <div className="text-center">
                        <div className="relative inline-block">
                             <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                             <Trophy className="w-32 h-32 text-yellow-500 relative z-10 animate-bounce drop-shadow-lg mx-auto" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mt-6 tracking-tight animate-in slide-in-from-bottom-5 duration-700">Topic Mastered!</h2>
                        <div className="flex justify-center gap-2 mt-4 text-yellow-500 animate-pulse">
                            <Star fill="currentColor" />
                            <Star fill="currentColor" />
                            <Star fill="currentColor" />
                        </div>
                        <p className="text-gray-500 mt-4 font-medium">Neural pathway encoded.</p>
                    </div>
                </div>
              )}

              {/* Sticky Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10">
                   <div className="flex items-center gap-3">
                       <button 
                         onClick={handleBackToCurriculum}
                         className="text-gray-500 hover:text-gray-800 font-bold text-sm flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                       >
                         <ArrowLeft size={18} />
                         Back
                       </button>
                       <span className="text-sm font-semibold text-gray-400 hidden md:inline">| {activeTopic.title}</span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                       {isComplete && (
                           <span className="text-green-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wide bg-green-50 px-2 py-1 rounded-full border border-green-100">
                               <CheckCircle size={14} /> Mastered
                           </span>
                       )}
                   </div>
              </div>

              <div className="flex-1 overflow-hidden flex relative">
                   <div className={`flex-1 overflow-y-auto p-6 md:p-8 ${isChatOpen ? 'hidden md:block md:w-2/3' : 'w-full'}`}>
                       {isLoading ? (
                           <div className="flex flex-col items-center justify-center h-full space-y-6">
                               <div className="relative">
                                    <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${config.color} animate-pulse`}></div>
                                    <Loader2 className={`w-16 h-16 animate-spin ${config.textColor} relative z-10`} />
                               </div>
                               <div className="text-center space-y-2">
                                   <h3 className="text-lg font-bold text-gray-800">Preparing Classroom...</h3>
                                   <p className="text-gray-500 text-sm">Reviewing syllabus for {activeTopic.title}</p>
                               </div>
                           </div>
                       ) : error ? (
                           <div className="text-center p-8 text-red-500 bg-red-50 rounded-xl border border-red-100">
                               {error}
                               <button onClick={() => handleTopicClick(activeTopic)} className="block mx-auto mt-4 text-sm font-bold underline">Try Again</button>
                           </div>
                       ) : (
                           <div className="max-w-3xl mx-auto animate-in fade-in duration-500 pb-20">
                               <div className="mb-8">
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{activeTopic.title}</h1>
                                    <p className="text-lg text-gray-500 font-medium border-l-4 border-gray-200 pl-4">{activeTopic.description}</p>
                               </div>
                               
                               {/* Content Render */}
                               <div className="bg-white rounded-2xl">
                                    {lessonContent && <MarkdownRenderer content={lessonContent} />}
                               </div>

                               {/* Mastery Action */}
                               <div className="mt-12 py-8 border-t border-gray-100">
                                   <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white shadow-xl">
                                       <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                                       <h3 className="text-xl font-bold mb-2">Class Dismissed?</h3>
                                       <p className="text-gray-300 mb-6 max-w-md mx-auto">
                                           Have you completed the exercises and understood the theory?
                                       </p>
                                       <button 
                                         onClick={() => handleClaimMastery(activeTopic.id)}
                                         className={`px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                                             isComplete 
                                             ? 'bg-green-500 hover:bg-green-600 text-white' 
                                             : 'bg-white text-gray-900 hover:bg-gray-100'
                                         }`}
                                       >
                                         {isComplete ? 'Keep Mastering (Review)' : 'Complete Lesson'}
                                       </button>
                                   </div>
                               </div>
                           </div>
                       )}
                   </div>

                   {/* Floating Chat Button (Mobile) */}
                   {!isChatOpen && !isLoading && (
                       <button 
                         onClick={() => setIsChatOpen(true)}
                         className={`md:hidden absolute bottom-6 right-6 p-4 rounded-full shadow-lg ${config.color} text-white z-20`}
                       >
                           <MessageSquare size={24} />
                       </button>
                   )}

                   {/* Lesson Chat Sidebar */}
                   {(isChatOpen || window.innerWidth >= 768) && !isLoading && (
                       <div className={`
                            fixed inset-0 z-30 bg-white md:static md:w-1/3 md:border-l md:border-gray-100 flex flex-col
                            ${isChatOpen ? 'block' : 'hidden md:block'}
                       `}>
                           <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                               <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                   <MessageSquare size={16} />
                                   Classroom Chat
                               </h3>
                               <button onClick={() => setIsChatOpen(false)} className="md:hidden p-1 text-gray-400">
                                   <ChevronDown />
                               </button>
                           </div>
                           
                           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                               {lessonChatMessages.map((msg) => (
                                   <div key={msg.id} className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}>
                                       <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === Role.USER ? `${config.color} text-white` : 'bg-white border border-gray-200 text-gray-800'}`}>
                                           <MarkdownRenderer content={msg.text} />
                                       </div>
                                   </div>
                               ))}
                               {isChatLoading && (
                                   <div className="flex items-center gap-2 text-xs text-gray-400">
                                       <Loader2 className="w-3 h-3 animate-spin" /> Teacher is typing...
                                   </div>
                               )}
                           </div>

                           <div className="p-3 border-t border-gray-100 bg-white">
                               <div className="flex gap-2">
                                   <input 
                                     type="text" 
                                     value={chatInput}
                                     onChange={(e) => setChatInput(e.target.value)}
                                     placeholder="Raise your hand..."
                                     className="flex-1 text-sm p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                                     onKeyPress={(e) => e.key === 'Enter' && handleSendLessonChat()}
                                   />
                                   <button 
                                     onClick={handleSendLessonChat}
                                     disabled={!chatInput.trim() || isChatLoading}
                                     className={`p-2 rounded-lg text-white ${config.color} disabled:opacity-50`}
                                   >
                                       <ArrowLeft size={16} className="rotate-90 md:rotate-180" />
                                   </button>
                               </div>
                           </div>
                       </div>
                   )}
              </div>
          </div>
      );
  }

  // ---------------- CURRICULUM PATH VIEW ----------------
  return (
    <div className="h-full flex flex-col bg-gray-50/50 rounded-xl overflow-hidden">
        
        {/* Header with Overall Progress */}
        <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <h2 className={`text-xl font-bold text-gray-800`}>Annual Teaching Plan (ATP)</h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {completedTopics.length} / {curriculum?.modules.reduce((acc, m) => acc + m.topics.length, 0) || 0} Topics
                </span>
            </div>
            
            {/* Subject Level Progress Bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${config.color} transition-all duration-1000 ease-out`}
                    style={{ 
                        width: `${curriculum?.modules.reduce((acc, m) => acc + m.topics.length, 0) > 0 
                            ? (completedTopics.length / curriculum.modules.reduce((acc, m) => acc + m.topics.length, 0)) * 100 
                            : 0}%` 
                    }}
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {curriculum?.modules.length > 0 ? (
                curriculum.modules.map((module) => {
                    const progress = calculateModuleProgress(module);
                    const isModuleComplete = progress === 100;

                    return (
                        <div key={module.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                            {/* Module Header */}
                            <button 
                                onClick={() => toggleModule(module.id)}
                                className="w-full p-5 flex items-start justify-between bg-white hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-left flex-1 pr-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{module.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${isModuleComplete ? 'bg-green-500' : config.color} transition-all duration-700`} 
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">{progress}%</span>
                                    </div>
                                </div>
                                {activeModuleId === module.id ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
                            </button>
                            
                            {/* Topics List */}
                            {activeModuleId === module.id && (
                                <div className="border-t border-gray-100">
                                    {module.topics.map((topic, index) => {
                                        const isDone = completedTopics.includes(topic.id);
                                        return (
                                            <div key={topic.id} className="relative group">
                                                {/* Connecting Line */}
                                                {index !== module.topics.length - 1 && (
                                                    <div className="absolute left-8 top-10 bottom-0 w-0.5 bg-gray-100 group-hover:bg-gray-200 transition-colors"></div>
                                                )}

                                                <button
                                                    onClick={() => handleTopicClick(topic)}
                                                    className="w-full flex items-center gap-4 p-4 pl-6 hover:bg-blue-50/30 transition-all text-left"
                                                >
                                                    <div className={`shrink-0 z-10 transition-transform group-hover:scale-110 ${isDone ? 'text-green-500' : 'text-gray-300'}`}>
                                                        {isDone ? <CheckCircle size={24} fill="#ecfdf5" /> : <Circle size={24} />}
                                                    </div>
                                                    
                                                    <div>
                                                        <span className={`block font-medium transition-colors ${isDone ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-900 group-hover:text-blue-600'}`}>
                                                            {topic.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{topic.description}</span>
                                                    </div>
                                                    
                                                    {!isDone && (
                                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.lightColor} ${config.textColor}`}>
                                                                Enter Class
                                                            </div>
                                                        </div>
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-4 opacity-20" />
                    <p>Loading Annual Teaching Plan...</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default LessonView;