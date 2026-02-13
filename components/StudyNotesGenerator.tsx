import React, { useState } from 'react';
import { Subject } from '../types';
import { generateExamCheatSheet } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';
import { SUBJECT_CONFIG } from '../constants';
import { Loader2, ScrollText, Sparkles, Printer, FileText } from 'lucide-react';

interface StudyNotesGeneratorProps {
  currentSubject: Subject;
}

const StudyNotesGenerator: React.FC<StudyNotesGeneratorProps> = ({ currentSubject }) => {
  const [examContext, setExamContext] = useState('');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const config = SUBJECT_CONFIG[currentSubject];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examContext.trim() || !topic.trim()) return;

    setIsLoading(true);
    setNotes(null);

    try {
      const generatedNotes = await generateExamCheatSheet(currentSubject, examContext, topic);
      setNotes(generatedNotes);
    } catch (error) {
      console.error("Failed to generate notes", error);
      setNotes("Sorry, I couldn't create your notes right now. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 overflow-hidden relative">
      
      {/* Input Section */}
      <div className="p-6 bg-white border-b border-gray-200 shadow-sm z-10">
         <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${config.lightColor} ${config.textColor}`}>
                    <ScrollText size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Exam Cheat Sheet Generator</h2>
                    <p className="text-xs text-gray-500">Create high-yield memorization notes for specific exams.</p>
                </div>
            </div>

            <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Exam Context</label>
                    <input 
                        type="text" 
                        value={examContext}
                        onChange={(e) => setExamContext(e.target.value)}
                        placeholder="e.g., Paper 2, Section C (Essay)"
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                        disabled={isLoading}
                    />
                </div>
                <div className="flex-[2]">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Specific Topic / Aspect</label>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder={`e.g., ${currentSubject === 'Mathematics' ? 'Circle Geometry Proofs' : 'Theme of Ambition in Macbeth'}`}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-sm"
                        disabled={isLoading}
                    />
                </div>
                <div className="flex items-end">
                    <button 
                        type="submit"
                        disabled={!examContext.trim() || !topic.trim() || isLoading}
                        className={`h-[46px] px-6 rounded-xl font-bold text-white shadow-md transition-all flex items-center gap-2 ${isLoading ? 'bg-gray-300 cursor-not-allowed' : `${config.color} hover:brightness-110`}`}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        <span className="hidden md:inline">Generate</span>
                    </button>
                </div>
            </form>
         </div>
      </div>

      {/* Output Section */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 text-center opacity-50">
                <FileText className={`w-16 h-16 ${config.textColor} animate-pulse`} />
                <div>
                    <h3 className="text-lg font-bold text-gray-700">Consulting Examiner...</h3>
                    <p className="text-sm text-gray-500">Compiling definitions, warnings, and memory hooks.</p>
                </div>
            </div>
        ) : notes ? (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative">
                    
                    {/* Paper Header */}
                    <div className="bg-yellow-50 border-b border-yellow-100 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <FileText size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">High-Yield Notes</span>
                        </div>
                        <div className="text-[10px] text-yellow-600 font-mono bg-yellow-100 px-2 py-1 rounded">
                            {examContext}
                        </div>
                    </div>

                    <div className="p-8 md:p-10">
                        <MarkdownRenderer content={notes} />
                    </div>

                    {/* Footer Action */}
                    <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center">
                        <button 
                            onClick={() => window.print()}
                            className="text-gray-500 hover:text-gray-800 flex items-center gap-2 text-sm font-medium transition-colors"
                        >
                            <Printer size={16} />
                            Print Notes / Save as PDF
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-gray-400">
                <ScrollText className="w-12 h-12 opacity-20" />
                <p>Enter your exam details above to generate custom study notes.</p>
            </div>
        )}
      </div>

    </div>
  );
};

export default StudyNotesGenerator;