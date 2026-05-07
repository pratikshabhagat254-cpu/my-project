import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET a user profile (Assuming single user for MVP)
router.get('/:id', async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a user
router.post('/', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error("User creation error:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
