import React from 'react';
import { AlertTriangle, Flame, Droplet, Wheat, Target } from 'lucide-react';

const Dashboard = ({ user, logs }) => {
  // Calculate totals
  const totals = logs.reduce((acc, log) => {
    acc.calories += log.nutrition.calories;
    acc.carbs += log.nutrition.carbohydrates;
    acc.protein += log.nutrition.protein;
    acc.fat += log.nutrition.fat;
    acc.sugar += log.nutrition.sugar;
    return acc;
  }, { calories: 0, carbs: 0, protein: 0, fat: 0, sugar: 0 });

  // Calculate percentages based on user goals
  const calPercent = Math.min((totals.calories / user.dailyCalorieGoal) * 100, 100);
  const sugarPercent = Math.min((totals.sugar / user.sugarLimit) * 100, 100);

  // Collect all unique alerts
  const todayAlerts = [...new Set(logs.flatMap(l => l.alerts))];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Hi, {user.name} 👋</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Here is your daily summary</p>
        </div>
      </div>

       {/* Calories Glass Panel */}
       <div className="glass-panel p-6 bg-gradient-to-br from-primary/10 to-teal-50">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-500" />
            <h3 className="font-bold text-slate-700">Calories</h3>
          </div>
          <span className="text-sm font-semibold text-slate-500">{Math.round(totals.calories)} / {user.dailyCalorieGoal} kcal</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-3.5 mb-2 overflow-hidden shadow-inner">
          <div 
            className="bg-primary h-3.5 rounded-full transition-all duration-1000 ease-out relative" 
            style={{ width: `${calPercent}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Diabetic Special Monitor */}
      {user.diabetesStatus && (
        <div className="glass-panel p-5 border-l-4 border-l-red-500 bg-red-50/50">
          <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2">
               <Droplet className="text-red-500" size={20} />
               <h3 className="font-bold text-red-700">Sugar Tracker <span className="text-xs ml-1 px-2 py-0.5 bg-red-100 rounded-full">Diabetic Strict</span></h3>
             </div>
             <span className="text-sm font-bold text-red-600">{Math.round(totals.sugar)}g / {user.sugarLimit}g</span>
          </div>
          <div className="w-full bg-red-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${sugarPercent > 80 ? 'bg-red-600' : 'bg-red-400'}`}
              style={{ width: `${sugarPercent}%` }}
            ></div>
          </div>
          {sugarPercent > 80 && (
             <p className="text-xs text-red-600 mt-2 font-semibold">⚠️ Approaching daily sugar limit! Consider walking to drop glucose levels.</p>
          )}
        </div>
      )}

      {/* Macro Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Carbs */}
        <div className="glass-panel p-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 mb-2">
            <Wheat className="text-yellow-600" size={18}/>
            <span className="text-sm font-bold text-slate-700">Carbs</span>
          </div>
          <div className="text-xl font-black text-slate-800">{Math.round(totals.carbs)}g</div>
          <div className="text-xs text-slate-500 font-medium">Goal: {user.dailyCarbsGoal}g</div>
        </div>

        {/* Protein */}
        <div className="glass-panel p-4 flex flex-col justify-between hover:shadow-lg transition-shadow">
           <div className="flex items-center gap-2 mb-2">
            <Target className="text-indigo-500" size={18}/>
            <span className="text-sm font-bold text-slate-700">Protein</span>
          </div>
          <div className="text-xl font-black text-slate-800">{Math.round(totals.protein)}g</div>
          <div className="text-xs text-slate-500 font-medium">Goal: {user.dailyProteinGoal}g</div>
        </div>
      </div>

      {/* Smart Alerts */}
      {todayAlerts.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={20}/> 
            Smart Health Alerts
          </h3>
          <div className="space-y-3">
            {todayAlerts.map((alert, idx) => (
              <div key={idx} className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl shadow-sm text-sm font-semibold text-yellow-800">
                {alert}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
