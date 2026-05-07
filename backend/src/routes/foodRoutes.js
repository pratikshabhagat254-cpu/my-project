import express from 'express';
import FoodLog from '../models/FoodLog.js';
import User from '../models/User.js';

const router = express.Router();

// POST a new food log
router.post('/', async (req, res) => {
  try {
    const { userId, foodName, quantity, nutrition, inputType } = req.body;
    
    // Fetch User to check constraints
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    let alerts = [];
    
    // Diabetic check and standard limits
    if (user.diabetesStatus) {
      if (nutrition.sugar > 10) {
         alerts.push("⚠️ High sugar content detected. This may spike your blood glucose.");
      }
      if (nutrition.carbohydrates > 50) {
         alerts.push("⚠️ High carbohydrate portion. Consider balancing with protein/fiber.");
      }
    }

    if (nutrition.calories > 800) {
      alerts.push("⚠️ Heavy meal detected. A 15-minute walk is recommended after eating.");
    }

    const newLog = new FoodLog({
      userId,
      foodName,
      quantity,
      nutrition,
      inputType,
      alerts
    });

    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET user logs for today
router.get('/daily/:userId', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await FoodLog.find({
      userId: req.params.userId,
      timestamp: { $gte: startOfDay, $lte: endOfDay }
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
