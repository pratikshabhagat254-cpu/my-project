import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  weight: { type: Number, required: true }, // kg
  height: { type: Number, required: true }, // cm
  activityLevel: { 
    type: String, 
    enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'], 
    default: 'Sedentary' 
  },
  diabetesStatus: { type: Boolean, default: false }, // true for diabetic
  dailyCalorieGoal: { type: Number },
  dailyCarbsGoal: { type: Number }, // grams
  dailyProteinGoal: { type: Number }, // grams
  dailyFatGoal: { type: Number }, // grams
  sugarLimit: { type: Number } // grams, important for diabetic status
}, { timestamps: true });

// Pre-save hook to calculate baseline goals based on user profile
userSchema.pre('save', function (next) {
  if (this.isModified('weight') || this.isModified('height') || this.isModified('age') || this.isModified('gender') || this.isModified('activityLevel') || this.isModified('diabetesStatus')) {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    let bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age);
    bmr += this.gender === 'Male' ? 5 : -161;

    // Activity multiplier
    const activityMultipliers = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725
    };
    const tdee = bmr * activityMultipliers[this.activityLevel];

    this.dailyCalorieGoal = Math.round(tdee);
    
    // Macro split: standard is 50% carbs, 20% protein, 30% fat.
    // For diabetics, restrict carbs more strictly.
    if (this.diabetesStatus) {
      this.dailyCarbsGoal = Math.round((tdee * 0.40) / 4); // 40% carbs
      this.dailyProteinGoal = Math.round((tdee * 0.25) / 4); // 25% protein
      this.dailyFatGoal = Math.round((tdee * 0.35) / 9); // 35% fat
      this.sugarLimit = 25; // Strict sugar limit
    } else {
      this.dailyCarbsGoal = Math.round((tdee * 0.50) / 4);
      this.dailyProteinGoal = Math.round((tdee * 0.20) / 4);
      this.dailyFatGoal = Math.round((tdee * 0.30) / 9);
      this.sugarLimit = 40; // Standard limit
    }
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
