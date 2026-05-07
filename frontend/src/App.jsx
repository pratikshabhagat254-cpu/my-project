import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import IntakeForm from './components/IntakeForm';
import { Activity, Apple } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Hardcoded mock user for MVP to simulate the diabetes and profile features
  const [user] = useState({
    _id: 'user123',
    name: 'Sarah',
    diabetesStatus: true,
    dailyCalorieGoal: 1800,
    dailyCarbsGoal: 180,
    dailyProteinGoal: 112,
    dailyFatGoal: 60,
    sugarLimit: 25
  });

  const [todaysLogs, setTodaysLogs] = useState([]);

  const addLog = (log) => {
    setTodaysLogs([...todaysLogs, log]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Apple size={24} />
            <h1 className="font-bold text-xl tracking-wide">NutriSmart</h1>
          </div>
          {user.diabetesStatus && (
             <span className="bg-red-500 text-xs px-2 py-1 rounded-full font-semibold animate-pulse">Diabetic Mode Active</span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 max-w-md mx-auto mt-4">
        {activeTab === 'dashboard' ? (
          <Dashboard user={user} logs={todaysLogs} />
        ) : (
          <IntakeForm user={user} onAddLog={addLog} onSwitchToDash={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Bottom Mobile Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t p-3 flex justify-around shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'dashboard' ? 'text-primary' : 'text-slate-400'}`}>
          <Activity size={24} />
          <span className="text-xs font-semibold mt-1">Dash</span>
        </button>
        <button 
          onClick={() => setActiveTab('intake')}
          className={`flex flex-col items-center bg-primary text-white px-6 py-2 rounded-xl shadow-lg transform -translate-y-4 hover:scale-105 transition-all`}>
          <Apple size={28} />
          <span className="text-xs font-semibold mt-1">Log Food</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
