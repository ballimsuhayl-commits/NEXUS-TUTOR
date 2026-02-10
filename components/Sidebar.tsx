import React from 'react';
import { Subject, Mood, StudyMode } from '../types';
import { SUBJECT_CONFIG } from '../constants';
import { BrainCircuit, GraduationCap, Sparkles, Repeat, Settings } from 'lucide-react';

interface SidebarProps {
  currentSubject: Subject;
  onSubjectChange: (subject: Subject) => void;
  mood: Mood;
  studyMode: StudyMode;
  onStudyModeChange: (mode: StudyMode) => void;
  onStartQuiz: () => void;
  isGeneratingQuiz: boolean;
  dueCardsCount: number;
  onStartReview: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    currentSubject, 
    onSubjectChange, 
    mood, 
    studyMode, 
    onStudyModeChange, 
    onStartQuiz, 
    isGeneratingQuiz,
    dueCardsCount,
    onStartReview,
    onOpenSettings
}) => {
  const activeConfig = SUBJECT_CONFIG[currentSubject];
  
  return (
    <div className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 h-[calc(100vh-64px)] fixed left-0 bottom-0 overflow-y-auto">
        
        {/* Study Mode Toggle */}
        <div className="p-6 pb-2">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Academic Level</h2>
            <div className="bg-gray-100 p-1 rounded-xl flex relative">
                <button 
                    onClick={() => onStudyModeChange(StudyMode.STANDARD)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all z-10 ${studyMode === StudyMode.STANDARD ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Grade 11
                </button>
                <button 
                    onClick={() => onStudyModeChange(StudyMode.ADVANCED)}
                    className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all z-10 flex items-center justify-center gap-1 ${studyMode === StudyMode.ADVANCED ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Advanced
                    <Sparkles size={10} />
                </button>
            </div>
            {studyMode === StudyMode.ADVANCED && (
                <p className="text-[10px] text-purple-600 mt-2 text-center font-medium px-2">
                    Includes Grade 12 Syllabus Integration
                </p>
            )}
        </div>

        <div className="p-6 pt-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Curriculum Subjects</h2>
            <div className="space-y-2">
                {Object.values(Subject).map((subject) => {
                    const config = SUBJECT_CONFIG[subject];
                    const isActive = currentSubject === subject;
                    const Icon = config.icon;
                    
                    return (
                        <button
                            key={subject}
                            onClick={() => onSubjectChange(subject)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive 
                                ? `${config.lightColor} ${config.textColor} font-medium` 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icon size={20} className={isActive ? config.textColor : 'text-gray-400'} />
                            <div className="text-left">
                                <span className="block text-sm">{subject}</span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>

        <div className="px-6 py-2 space-y-3">
             <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Practice & Tools</h2>
             
             {/* Quiz Button */}
             <button 
                onClick={onStartQuiz}
                disabled={isGeneratingQuiz}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 group ${activeConfig.borderColor} ${activeConfig.lightColor} hover:brightness-95`}
             >
                <div className={`p-2 rounded-lg bg-white ${activeConfig.textColor}`}>
                    <BrainCircuit size={20} className={isGeneratingQuiz ? 'animate-spin' : ''} />
                </div>
                <div className="text-left">
                     <span className={`block text-sm font-bold ${activeConfig.textColor}`}>
                        {isGeneratingQuiz ? 'Generating...' : 'Take Practice Quiz'}
                     </span>
                     <span className="text-xs text-gray-500">
                         {studyMode === StudyMode.ADVANCED ? 'Hard • Matric Level' : 'Standard • Grade 11'}
                     </span>
                </div>
             </button>

             {/* Review Button */}
             {dueCardsCount > 0 && (
                <button 
                    onClick={onStartReview}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-all duration-200 group animate-in slide-in-from-left-2"
                >
                    <div className="p-2 rounded-lg bg-white text-yellow-600 relative">
                        <Repeat size={20} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold">
                            {dueCardsCount}
                        </span>
                    </div>
                    <div className="text-left">
                        <span className="block text-sm font-bold text-yellow-700">
                            Review Due
                        </span>
                        <span className="text-xs text-yellow-600/80">
                            Spaced Repetition
                        </span>
                    </div>
                </button>
             )}
        </div>

        <div className="mt-auto p-6 border-t border-gray-100">
            <button 
                onClick={onOpenSettings}
                className="w-full flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-4 px-2"
            >
                <Settings size={16} />
                <span className="text-xs font-medium">Settings</span>
            </button>

            <div className={`p-4 rounded-xl border ${SUBJECT_CONFIG[currentSubject].borderColor} ${SUBJECT_CONFIG[currentSubject].lightColor}`}>
                <p className={`text-sm ${SUBJECT_CONFIG[currentSubject].textColor} italic`}>
                    "{SUBJECT_CONFIG[currentSubject].tips}"
                </p>
            </div>
        </div>
    </div>
  );
};

export default Sidebar;
