import React, { useState } from 'react';
import { Subject, Topic, Module, StudyMode } from '../types';
import { CURRICULUM, SUBJECT_CONFIG } from '../constants';
import { generateLesson } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { ChevronRight, ChevronDown, PlayCircle, Loader2, CheckCircle, Circle, Trophy, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

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
    try {
        const content = await generateLesson(currentSubject, topic, studyMode);
        setLessonContent(content);
    } catch (e) {
        setError("Could not generate lesson. Please check your connection.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleBackToCurriculum = () => {
    setActiveTopic(null);
    setLessonContent(null);
  };

  const handleClaimMastery = (topicId: string) => {
    const isNowComplete = !completedTopics.includes(topicId);
    onToggleTopicCompletion(topicId);
    if (isNowComplete) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.8 },
            colors: ['#2563eb', '#10b981', '#f59e0b']
        });
        handleBackToCurriculum();
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
          <div className="h-full flex flex-col bg-white">
              {/* Sticky Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white/95 backdrop-blur-sm sticky top-0 z-10">
                   <button 
                     onClick={handleBackToCurriculum}
                     className="text-gray-500 hover:text-gray-800 font-bold text-sm flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                   >
                     <ArrowLeft size={18} />
                     Back to Path
                   </button>
                   
                   <div className="flex items-center gap-2">
                       {isComplete && (
                           <span className="text-green-600 flex items-center gap-1 text-xs font-bold uppercase tracking-wide bg-green-50 px-2 py-1 rounded-full border border-green-100">
                               <CheckCircle size={14} /> Mastered
                           </span>
                       )}
                   </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                   {isLoading ? (
                       <div className="flex flex-col items-center justify-center h-full space-y-6">
                           <div className="relative">
                                <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${config.color} animate-pulse`}></div>
                                <Loader2 className={`w-16 h-16 animate-spin ${config.textColor} relative z-10`} />
                           </div>
                           <div className="text-center space-y-2">
                               <h3 className="text-lg font-bold text-gray-800">Constructing Neural Path...</h3>
                               <p className="text-gray-500 text-sm">Priming your brain for {activeTopic.title}</p>
                           </div>
                       </div>
                   ) : error ? (
                       <div className="text-center p-8 text-red-500 bg-red-50 rounded-xl border border-red-100">
                           {error}
                           <button onClick={() => handleTopicClick(activeTopic)} className="block mx-auto mt-4 text-sm font-bold underline">Try Again</button>
                       </div>
                   ) : (
                       <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
                           <div className="mb-8">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">{activeTopic.title}</h1>
                                <p className="text-lg text-gray-500 font-medium">{activeTopic.description}</p>
                           </div>
                           
                           {/* Content Render */}
                           <div className="bg-white rounded-2xl">
                                {lessonContent && <MarkdownRenderer content={lessonContent} />}
                           </div>

                           {/* Mastery Action */}
                           <div className="mt-12 py-8 border-t border-gray-100">
                               <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white shadow-xl">
                                   <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                                   <h3 className="text-xl font-bold mb-2">Feeling Confident?</h3>
                                   <p className="text-gray-300 mb-6 max-w-md mx-auto">
                                       By claiming mastery, you confirm you have visualized, encoded, and stored this concept.
                                   </p>
                                   <button 
                                     onClick={() => handleClaimMastery(activeTopic.id)}
                                     className={`px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                                         isComplete 
                                         ? 'bg-green-500 hover:bg-green-600 text-white' 
                                         : 'bg-white text-gray-900 hover:bg-gray-100'
                                     }`}
                                   >
                                     {isComplete ? 'Keep Mastering (Review)' : 'Claim Mastery & Continue'}
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
                <h2 className={`text-xl font-bold text-gray-800`}>Learning Path</h2>
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
                                                                Start
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
                    <p>Loading Learning Path...</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default LessonView;