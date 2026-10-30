const Post = require('../models/Post');
const Consultation = require('../models/Consultation');
const Farmer = require('../models/Farmer');
const Listing = require('../models/Listing');
const User = require('../models/User');
const { CROP_PRESETS, generatePlantedCropData } = require('../utils/cropPresets');

// ---------- Forum ----------
const getPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.json(posts);
};

const createPost = async (req, res) => {
  try {
    const { author, title, message, tags, postType, price, location, contact } = req.body;
    if (!author || !title || !message) {
      return res.status(400).json({ error: 'author, title and message are required.' });
    }
    const post = await Post.create({
      author,
      title,
      message,
      tags: tags || [],
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post.' });
  }
};

const addReply = async (req, res) => {
  try {
    const { author, message } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    post.replies.push({ author, message });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add reply.' });
  }
};

// ---------- Expert Advice / Consultations ----------
const requestConsultation = async (req, res) => {
  try {
    const { name, phone, email, cropConcern, description, preferredDate } = req.body;
    if (!name || !phone || !cropConcern || !description) {
      return res.status(400).json({ error: 'name, phone, cropConcern and description are required.' });
    }
    const consultation = await Consultation.create({
      name,
      phone,
      email,
      cropConcern,
      description,
      preferredDate,
    });
    res.status(201).json(consultation);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit consultation request.' });
  }
};

// ---------- Local Connections (Farmers) ----------
const getFarmers = async (req, res) => {
  try {
    const { district, state } = req.query;
    const filter = {};
    if (district) filter.district = new RegExp(district, 'i');
    if (state) filter.state = new RegExp(state, 'i');

    const farmers = await Farmer.find(filter).sort({ createdAt: -1 });
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve farmers.' });
  }
};

const addFarmer = async (req, res) => {
  try {
    const { name, village, district, state, primaryCrops, contact, groupName, experienceYears, farmSize, initialCrop } = req.body;
    
    let plantedCrops = [];
    if (initialCrop) {
      plantedCrops.push(generatePlantedCropData({ cropName: initialCrop, fieldArea: farmSize || '3 Acres' }));
    }

    const farmer = await Farmer.create({
      name,
      village,
      district,
      state,
      primaryCrops: Array.isArray(primaryCrops) ? primaryCrops : primaryCrops ? [primaryCrops] : [],
      contact,
      groupName,
      experienceYears: Number(experienceYears) || 0,
      farmSize: farmSize || '3 Acres',
      plantedCrops,
    });
    res.status(201).json(farmer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add farmer profile.' });
  }
};

// Add Planted Crop Progress to Farmer
const addPlantedCrop = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { cropName, variety, plantingDate, fieldArea, customDuration } = req.body;

    if (!cropName) {
      return res.status(400).json({ error: 'Crop name is required.' });
    }

    const cropData = generatePlantedCropData({
      cropName,
      variety,
      plantingDate: plantingDate || new Date(),
      fieldArea,
      customDuration,
    });

    let farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      // Check if farmerId belongs to a User
      const user = await User.findById(farmerId);
      if (user && user.role === 'farmer') {
        user.plantedCrops.unshift(cropData);
        await user.save();
        // Also sync in Farmer collection
        farmer = await Farmer.findOne({ userId: user._id });
        if (farmer) {
          farmer.plantedCrops.unshift(cropData);
          await farmer.save();
        }
        return res.status(201).json({ message: 'Crop planted successfully', crop: cropData, farmer: user });
      }
      return res.status(404).json({ error: 'Farmer profile not found.' });
    }

    farmer.plantedCrops.unshift(cropData);
    if (!farmer.primaryCrops.includes(cropName)) {
      farmer.primaryCrops.push(cropName);
    }
    await farmer.save();

    // If linked to User, sync User document too
    if (farmer.userId) {
      await User.findByIdAndUpdate(farmer.userId, {
        $push: { plantedCrops: cropData },
        $addToSet: { primaryCrops: cropName },
      });
    }

    res.status(201).json({ message: 'Crop added to progress tracker!', crop: cropData, farmer });
  } catch (err) {
    console.error('Error adding planted crop:', err);
    res.status(500).json({ error: 'Failed to add crop to farmer profile.' });
  }
};

// Toggle irrigation task status or update milestone
const updateIrrigationMilestone = async (req, res) => {
  try {
    const { farmerId, cropId, milestoneId } = req.params;
    const { completed, notes } = req.body;

    const farmer = await Farmer.findById(farmerId);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found.' });

    const crop = farmer.plantedCrops.id(cropId);
    if (!crop) return res.status(404).json({ error: 'Planted crop record not found.' });

    const milestone = crop.irrigationSchedule.id(milestoneId);
    if (!milestone) return res.status(404).json({ error: 'Irrigation milestone not found.' });

    milestone.completed = completed !== undefined ? completed : !milestone.completed;
    if (milestone.completed) {
      milestone.completedDate = new Date();
    }
    if (notes) milestone.notes = notes;

    // Recalculate progress based on completed milestones
    const totalMilestones = crop.irrigationSchedule.length + crop.harvestTimeline.length;
    const doneMilestones =
      crop.irrigationSchedule.filter((m) => m.completed).length +
      crop.harvestTimeline.filter((m) => m.completed).length;
    if (totalMilestones > 0) {
      crop.progressPercent = Math.min(100, Math.max(crop.progressPercent, Math.round((doneMilestones / totalMilestones) * 100)));
    }

    await farmer.save();

    // Sync with User if linked
    if (farmer.userId) {
      const user = await User.findById(farmer.userId);
      if (user) {
        const uCrop = user.plantedCrops.id(cropId);
        if (uCrop) {
          const uM = uCrop.irrigationSchedule.id(milestoneId);
          if (uM) {
            uM.completed = milestone.completed;
            uM.completedDate = milestone.completedDate;
            if (notes) uM.notes = notes;
            uCrop.progressPercent = crop.progressPercent;
            await user.save();
          }
        }
      }
    }

    res.json({ message: 'Irrigation milestone updated!', farmer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update irrigation milestone.' });
  }
};

// Return supported crop presets for UI dropdowns
const getCropPresets = (req, res) => {
  const presets = Object.keys(CROP_PRESETS).map((key) => ({
    name: key,
    durationDays: CROP_PRESETS[key].durationDays,
    expectedYield: CROP_PRESETS[key].expectedYield,
    estimatedTotalYield: CROP_PRESETS[key].estimatedTotalYield,
    irrigationStagesCount: CROP_PRESETS[key].irrigationSchedule.length,
    timelineStagesCount: CROP_PRESETS[key].harvestTimeline.length,
  }));
  res.json(presets);
};

// ---------- Marketplace (Seller Sell Posts & Purchases) ----------
const getListings = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { status: 'Available' };
    if (category && category !== 'All') filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { location: new RegExp(search, 'i') },
        { sellerName: new RegExp(search, 'i') },
        { businessName: new RegExp(search, 'i') },
      ];
    }
    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve listings.' });
  }
};

const createListing = async (req, res) => {
  try {
    const {
      sellerName,
      businessName,
      contact,
      category,
      title,
      description,
      price,
      unit,
      location,
      imageUrl,
      tags,
    } = req.body;

    if (!sellerName || !contact || !title || !price || !location) {
      return res.status(400).json({ error: 'sellerName, contact, title, price, and location are required.' });
    }

    const isSeller = req.user?.role === 'seller';
    const listing = await Listing.create({
      sellerId: req.user?.id,
      sellerName,
      businessName: businessName || (isSeller ? req.user?.businessName || sellerName : ''),
      isVerifiedSeller: isSeller || true,
      sellerType: isSeller ? (req.user?.sellerType || 'Verified Seller') : 'Farmer / Seller',
      contact,
      category: category || 'Other',
      title,
      description: description || '',
      price: Number(price),
      unit: unit || 'unit',
      location,
      imageUrl: imageUrl || '',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()) : [],
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ error: 'Failed to create listing.' });
  }
};

const updateListingStatus = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing.' });
  }
};

module.exports = {
  getPosts,
  createPost,
  addReply,
  requestConsultation,
  getFarmers,
  addFarmer,
  addPlantedCrop,
  updateIrrigationMilestone,
  getCropPresets,
  getListings,
  createListing,
  updateListingStatus,
};
