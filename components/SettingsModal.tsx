import React, { useState } from 'react';
import { X, Save, Trash2, Key, ShieldCheck } from 'lucide-react';
import { AppSettings } from '../types';
import { setStoredApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClearData: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange,
  onClearData
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    if (apiKeyInput.trim()) {
      setStoredApiKey(apiKeyInput.trim());
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          
          {/* Admin Section */}
          <div className="space-y-4 bg-blue-50 p-5 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2">
               <ShieldCheck size={18} className="text-blue-600" />
               <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Admin: API Setup</h3>
            </div>
            
            <p className="text-xs text-blue-700 leading-relaxed">
              Enter your Google Gemini API Key here. It will be stored locally on your device. You only need to do this once.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-blue-900 block">API Key</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button 
                  onClick={handleSaveKey}
                  className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-all ${keySaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {keySaved ? 'Saved' : 'Save'}
                </button>
              </div>
              {keySaved && <p className="text-xs text-green-600 font-medium mt-1">Key updated successfully!</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Learning Optimization</h3>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <span className="block font-medium text-gray-900">Spaced Repetition</span>
                <span className="text-xs text-gray-500">Auto-schedule reviews for tricky topics</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.enableSRS}
                  onChange={(e) => onSettingsChange({...settings, enableSRS: e.target.checked})}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Data Management</h3>
            <button 
              onClick={() => {
                if(window.confirm("Are you sure? This will delete all your flashcards and progress.")) {
                  onClearData();
                }
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 size={20} />
              <div className="text-left">
                <span className="block font-medium">Clear Progress Data</span>
                <span className="text-xs opacity-75">Resets all spaced repetition history</span>
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button 
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
                <Save size={18} />
                Done
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;