const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Farmer = require('../models/Farmer');
const { JWT_SECRET } = require('../middleware/auth');
const { generatePlantedCropData } = require('../utils/cropPresets');

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const register = async (req, res) => {
  try {
    const {
      name,
      password,
      role = 'farmer',
      state,
      district,
      village,
      farmArea = '',
    } = req.body;

    // Strict validation for required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    if (!password || password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters.' });
    }

    if (!state || !state.trim()) {
      return res.status(400).json({ error: 'State is required.' });
    }

    if (!district || !district.trim()) {
      return res.status(400).json({ error: 'District is required.' });
    }

    if (!village || !village.trim()) {
      return res.status(400).json({ error: 'Village is required.' });
    }

    if (role === 'farmer' && (!farmArea || !farmArea.trim())) {
      return res.status(400).json({ error: 'Farm area is required for farmer account.' });
    }

    const trimmedName = name.trim();
    const existing = await User.findOne({
      name: { $regex: new RegExp(`^${trimmedName}$`, 'i') },
      role,
    });

    if (existing) {
      return res.status(400).json({
        error: `An account with the name "${trimmedName}" already exists for ${role}. Please sign in.`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let plantedCrops = [];
    if (role === 'farmer') {
      const cropData = generatePlantedCropData({
        cropName: 'Wheat',
        fieldArea: `${farmArea.trim()} Acres`,
        plantingDate: new Date(),
      });
      plantedCrops.push(cropData);
    }

    const user = await User.create({
      name: trimmedName,
      password: hashedPassword,
      role,
      state: state.trim(),
      district: district.trim(),
      village: village.trim(),
      farmArea: role === 'farmer' ? `${farmArea.trim()} Acres` : '',
      primaryCrops: role === 'farmer' ? ['Wheat'] : [],
      businessName: role === 'seller' ? `${trimmedName} Agro Supplies` : '',
      sellerType: role === 'seller' ? 'Agri Equipment & Inputs' : '',
      address: `${village.trim()}, ${district.trim()}, ${state.trim()}`,
      plantedCrops,
    });

    // If farmer, also mirror into Farmer collection for Local Connect feature
    if (role === 'farmer') {
      await Farmer.create({
        userId: user._id,
        name: user.name,
        village: user.village,
        district: user.district,
        state: user.state,
        farmArea: user.farmArea,
        farmSize: user.farmArea,
        primaryCrops: ['Wheat'],
        contact: `${user.village}, ${user.district}`,
        plantedCrops: user.plantedCrops,
      });
    }

    const token = createToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userSafe,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
};

const login = async (req, res) => {
  try {
    const { name, password, role } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: 'Please enter both your name and password.' });
    }

    const query = {
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') },
    };
    if (role) {
      query.role = role;
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ error: 'Invalid name or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid name or password.' });
    }

    const token = createToken(user);
    const userSafe = user.toObject();
    delete userSafe.password;

    res.json({
      message: `Welcome back, ${user.name}!`,
      token,
      user: userSafe,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message || 'Login failed.' });
  }
};

const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Session invalid. Please sign in.' });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Session expired. Please sign in.' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
