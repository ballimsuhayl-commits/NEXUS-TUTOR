import React, { useState } from 'react';
import { Flashcard } from '../types';
import { SUBJECT_CONFIG } from '../constants';
import { CheckCircle, XCircle, ArrowRight, X, Repeat, Check } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface ReviewModalProps {
  cards: Flashcard[];
  onReviewResult: (cardId: string, grade: number) => void;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ cards, onReviewResult, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // If no cards, shouldn't happen but handle safely
  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];
  const activeConfig = SUBJECT_CONFIG[currentCard.subject];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
  };

  const handleNext = () => {
    // Process SRS Result
    const grade = selectedOption === currentCard.correctAnswerIndex ? 5 : 1;
    onReviewResult(currentCard.id, grade);

    // Move to next or close
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-yellow-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-yellow-100 text-yellow-700 rounded-lg">
                <Repeat size={20} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gray-800">Review Session</h2>
                <p className="text-sm font-medium text-yellow-700">
                    Card {currentIndex + 1} of {cards.length}
                </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-yellow-200 rounded-full text-yellow-700 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 mb-2">
            {currentCard.subject}
          </div>

          {/* Question */}
          <div className="text-lg font-medium text-gray-900 leading-relaxed">
            <MarkdownRenderer content={currentCard.question} />
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentCard.options.map((option, idx) => {
              let btnClass = "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
              let icon = null;

              if (isAnswered) {
                if (idx === currentCard.correctAnswerIndex) {
                  btnClass = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                  icon = <CheckCircle className="text-green-600" size={20} />;
                } else if (idx === selectedOption) {
                  btnClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                  icon = <XCircle className="text-red-600" size={20} />;
                } else {
                  btnClass = "border-gray-100 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center ${btnClass}`}
                >
                  <span className="flex-1">{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 animate-in slide-in-from-bottom-2 duration-300">
              <h4 className="text-sm font-bold text-yellow-800 mb-2 uppercase tracking-wide">Explanation</h4>
              <p className="text-yellow-900 text-sm leading-relaxed">
                {currentCard.explanation}
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              isAnswered 
              ? `bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transform hover:translate-x-1` 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {currentIndex === cards.length - 1 ? 'Finish Review' : 'Next Card'}
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReviewModal;
