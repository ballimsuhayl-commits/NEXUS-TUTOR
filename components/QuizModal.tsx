import React, { useState } from 'react';
import { Quiz, Subject } from '../types';
import { SUBJECT_CONFIG } from '../constants';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, X, Trophy, Lightbulb, Brain, Image as ImageIcon } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import MermaidDiagram from './MermaidDiagram';

interface QuizModalProps {
  quiz: Quiz;
  currentSubject: Subject;
  onClose: () => void;
  onRetry: () => void;
  onComplete: (results: { questionIndex: number, isCorrect: boolean }[]) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quiz, currentSubject, onClose, onRetry, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{ questionIndex: number, isCorrect: boolean }[]>([]);

  const activeConfig = SUBJECT_CONFIG[currentSubject];
  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const isCorrect = index === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setResults(prev => [...prev, { questionIndex: currentQuestionIndex, isCorrect }]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
      onComplete(results);
    }
  };

  const handleFinish = () => {
      onComplete(results);
  };

  if (showResults) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const feedbackMsg = percentage > 80 ? "Outstanding!" : percentage > 50 ? "Good Effort!" : "Keep Practicing!";
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative">
          
          <div className={`absolute top-0 left-0 right-0 h-32 ${activeConfig.color} opacity-10 rounded-b-[50%] transform scale-150 -translate-y-10 pointer-events-none`}></div>

          <div className="p-8 text-center relative z-10">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${activeConfig.lightColor} flex items-center justify-center shadow-inner`}>
                <Trophy className={`w-10 h-10 ${activeConfig.textColor}`} />
            </div>
            
            <h2 className={`text-3xl font-extrabold ${activeConfig.textColor} mb-2`}>{feedbackMsg}</h2>
            <p className="text-gray-500 font-medium mb-8">You scored {percentage}%</p>
            
            <div className="flex items-end justify-center gap-1 mb-8">
                <span className="text-6xl font-black text-gray-800">{score}</span>
                <span className="text-xl text-gray-400 font-medium mb-2">/ {quiz.questions.length}</span>
            </div>

            <p className="text-xs text-gray-400 mb-8 max-w-[80%] mx-auto">
               We've updated your Spaced Repetition schedule. Tricky concepts will reappear sooner.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={onRetry}
                className={`w-full py-3.5 rounded-xl text-white font-bold hover:opacity-90 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 ${activeConfig.color}`}
              >
                <RefreshCw size={20} />
                Try Another Set
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3.5 rounded-xl border-2 border-gray-100 text-gray-500 hover:bg-gray-50 font-semibold transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in zoom-in-95 duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col h-[85vh] md:h-[90vh] overflow-hidden">
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100">
            <div 
                className={`h-full ${activeConfig.color} transition-all duration-500 ease-out`} 
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
             <span className={`px-3 py-1 rounded-full text-xs font-bold ${activeConfig.lightColor} ${activeConfig.textColor} border ${activeConfig.borderColor}`}>
                 Q{currentQuestionIndex + 1}
             </span>
             <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider hidden md:block">{quiz.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Panel: Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
                <div className="max-w-2xl mx-auto space-y-6">
                    
                    {/* Question Text */}
                    <div className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
                        <MarkdownRenderer content={currentQuestion.question} />
                    </div>

                    {/* Generated Image (Imagen) */}
                    {currentQuestion.generatedImage && (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-6 group">
                            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
                                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                                  <ImageIcon size={10} />
                                  AI Generated
                                </div>
                                <img 
                                    src={`data:image/jpeg;base64,${currentQuestion.generatedImage}`} 
                                    alt="Quiz Diagram" 
                                    className="w-full h-auto rounded-xl object-contain max-h-[300px] hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Diagram (Mermaid) */}
                    {currentQuestion.diagram && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                                <MermaidDiagram chart={currentQuestion.diagram} />
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-2 italic">
                                Analyze the diagram above
                            </p>
                        </div>
                    )}

                    {/* Feedback Section (Reveals after answer) */}
                    {isAnswered && (
                        <div className={`rounded-2xl p-6 border-l-4 animate-in slide-in-from-bottom-8 duration-300 ${
                            selectedOption === currentQuestion.correctAnswerIndex 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-red-50 border-red-500'
                        }`}>
                            <div className="flex items-start gap-3 mb-3">
                                {selectedOption === currentQuestion.correctAnswerIndex 
                                    ? <CheckCircle className="text-green-600 shrink-0 mt-1" />
                                    : <XCircle className="text-red-600 shrink-0 mt-1" />
                                }
                                <h4 className={`text-lg font-bold ${
                                    selectedOption === currentQuestion.correctAnswerIndex ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {selectedOption === currentQuestion.correctAnswerIndex ? 'Correct!' : 'Not quite right'}
                                </h4>
                            </div>
                            
                            <p className="text-gray-700 leading-relaxed mb-4">
                                {currentQuestion.explanation}
                            </p>

                            {currentQuestion.memoryHook && (
                                <div className="mt-4 pt-4 border-t border-gray-200/50 flex gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-lg h-fit shrink-0">
                                        <Lightbulb size={18} className="text-yellow-600" />
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block mb-1">Memory Hook</span>
                                        <p className="text-sm font-medium text-gray-800 italic">"{currentQuestion.memoryHook}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Options & Actions (Fixed on Desktop, stacked on Mobile) */}
            <div className="md:w-[400px] bg-white border-l border-gray-100 flex flex-col z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="flex-1 p-6 overflow-y-auto space-y-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Select Answer</p>
                    {currentQuestion.options.map((option, idx) => {
                        let btnClass = "border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 text-gray-600";
                        let ringClass = "";

                        if (isAnswered) {
                            if (idx === currentQuestion.correctAnswerIndex) {
                                btnClass = "bg-green-50 border-green-200 text-green-800";
                                ringClass = "ring-2 ring-green-500 ring-offset-2";
                            } else if (idx === selectedOption) {
                                btnClass = "bg-red-50 border-red-200 text-red-800";
                                ringClass = "ring-2 ring-red-500 ring-offset-2";
                            } else {
                                btnClass = "opacity-40 border-transparent bg-gray-50";
                            }
                        } else if (selectedOption === idx) {
                             btnClass = `${activeConfig.lightColor} ${activeConfig.borderColor} ${activeConfig.textColor}`;
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(idx)}
                                disabled={isAnswered}
                                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 font-medium relative group ${btnClass} ${ringClass}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                                        isAnswered && idx === currentQuestion.correctAnswerIndex ? 'border-green-500 text-green-600' :
                                        isAnswered && idx === selectedOption ? 'border-red-500 text-red-600' :
                                        'border-gray-300 text-gray-400 group-hover:border-blue-300'
                                    }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className="flex-1">{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={() => {
                            if (currentQuestionIndex < quiz.questions.length - 1) {
                                handleNext();
                            } else {
                                handleFinish();
                                setShowResults(true);
                            }
                        }}
                        disabled={!isAnswered}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                            isAnswered 
                            ? `${activeConfig.color} text-white hover:brightness-110 hover:shadow-lg transform hover:-translate-y-0.5` 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {currentQuestionIndex === quiz.questions.length - 1 ? 'Complete Quiz' : 'Next Question'}
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;