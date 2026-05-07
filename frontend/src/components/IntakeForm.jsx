import React, { useState, useRef } from 'react';
import { Mic, Camera, Type, Send, Loader2 } from 'lucide-react';
import axios from 'axios';

const IntakeForm = ({ user, onAddLog, onSwitchToDash }) => {
  const [mode, setMode] = useState('text'); // text, voice, image
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Using Mock Data since we lack connected APIs in the demo environment
  const mockMLSubmit = async () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      // Mocking ML logic for text matching
      let mockNutrition = { calories: 239, sugar: 0, carbohydrates: 0, protein: 27, fat: 14 }; // Chicken by default
      let assumedFood = "Chicken";
      
      if (inputText.toLowerCase().includes("apple")) {
        mockNutrition = { calories: 52, sugar: 10, carbohydrates: 14, protein: 0, fat: 0 };
        assumedFood = "Apple";
      } else if (inputText.toLowerCase().includes("rice")) {
        mockNutrition = { calories: 130, sugar: 0, carbohydrates: 28, protein: 2.7, fat: 0.3 };
        assumedFood = "Rice";
      }

      // Generate alerts based on diet
      let newAlerts = [];
      if (user.diabetesStatus && mockNutrition.sugar > 5) {
        newAlerts.push(`⚠️ ${assumedFood} contains ${mockNutrition.sugar}g sugar. Monitor your glucose.`);
      }

      onAddLog({
        foodName: assumedFood,
        quantity: 100, // mock assumed quantity
        nutrition: mockNutrition,
        inputType: mode,
        alerts: newAlerts
      });
      setLoading(false);
      onSwitchToDash();
    }, 1500);
  };

  const fileInputRef = useRef(null);

  const mockImageSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      onAddLog({
        foodName: "Indian Thali (Estimated)",
        quantity: 400, 
        nutrition: { calories: 450, sugar: 5, carbohydrates: 50, protein: 15, fat: 12 },
        inputType: 'image',
        alerts: ["💡 Plate scan complete. Next time add 10% more greens to reach the 50% vegetable goal!"]
      });
      setLoading(false);
      onSwitchToDash();
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Log Your Food</h2>

      {/* Mode Selectors */}
      <div className="flex gap-3 mb-8">
        <button 
          onClick={() => setMode('text')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-xl border font-semibold transition-all ${mode === 'text' ? 'bg-primary text-white border-primary shadow-lg ring-2 ring-primary/30' : 'bg-white text-slate-600'}`}>
          <Type size={18} /> Text
        </button>
        <button 
          onClick={() => setMode('voice')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-xl border font-semibold transition-all ${mode === 'voice' ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg ring-2 ring-indigo-500/30' : 'bg-white text-slate-600'}`}>
          <Mic size={18} /> Voice
        </button>
        <button 
          onClick={() => setMode('image')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 rounded-xl border font-semibold transition-all ${mode === 'image' ? 'bg-purple-500 text-white border-purple-500 shadow-lg ring-2 ring-purple-500/30' : 'bg-white text-slate-600'}`}>
          <Camera size={18} /> Plate
        </button>
      </div>

      <div className="glass-panel p-6">
        {mode === 'text' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-700">What did you eat?</h3>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
              rows="4"
              placeholder="E.g., I had 200 grams of chicken and a banana."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            ></textarea>
            <button 
              disabled={!inputText || loading}
              onClick={mockMLSubmit}
              className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" /> : <><Send size={18}/> Analyze & Log</>}
            </button>
          </div>
        )}

        {mode === 'voice' && (
          <div className="flex flex-col items-center py-8 space-y-6">
             <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center relative">
               {loading && <div className="absolute inset-0 border-4 border-indigo-400 rounded-full animate-ping opacity-75"></div>}
               <Mic size={48} className={`text-indigo-500 ${loading ? 'animate-pulse' : ''}`} />
             </div>
             <p className="text-slate-500 font-medium text-center">
               {loading ? "Processing speech using ML..." : "Tap mic to describe your meal"}
             </p>
             <button 
              onClick={() => {
                setInputText("I had an apple"); 
                mockMLSubmit();
              }}
              className="px-8 py-3 bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30">
              Simulate Voice Input
             </button>
          </div>
        )}

         {mode === 'image' && (
          <div className="flex flex-col items-center py-8 space-y-6">
             <div className="w-full h-48 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center bg-slate-50 cursor-pointer overflow-hidden group hover:border-purple-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}>
               <Camera size={32} className="text-slate-400 group-hover:text-purple-500 transition-colors mb-2" />
               <span className="font-semibold text-slate-500 group-hover:text-purple-600 transition-colors">Tap to scan your plate</span>
               <input type="file" ref={fileInputRef} className="hidden" onChange={mockImageSubmit}/>
             </div>
             {loading && <div className="flex items-center gap-2 text-purple-600 font-bold"><Loader2 className="animate-spin" /> Analyzing plate distribution...</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default IntakeForm;
