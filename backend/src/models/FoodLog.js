import mongoose from 'mongoose';

const foodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true }, // in grams
  nutrition: {
    calories: { type: Number, required: true },
    sugar: { type: Number, required: true },
    carbohydrates: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true }
  },
  inputType: { type: String, enum: ['Manual', 'Voice', 'Image'], required: true },
  timestamp: { type: Date, default: Date.now },
  alerts: [{ type: String }] // e.g. "High Sugar Detected"
});

const FoodLog = mongoose.model('FoodLog', foodLogSchema);
export default FoodLog;
