const Post = require('../models/Post');
const Consultation = require('../models/Consultation');
const Farmer = require('../models/Farmer');
const Listing = require('../models/Listing');

// ---------- Forum ----------
const getPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.json(posts);
};

const createPost = async (req, res) => {
  try {
    const { author, title, message, tags } = req.body;
    if (!author || !title || !message) {
      return res.status(400).json({ error: 'author, title and message are required.' });
    }
    const post = await Post.create({ author, title, message, tags: tags || [] });
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

// ---------- Local Connections ----------
const getFarmers = async (req, res) => {
  const { district, state } = req.query;
  const filter = {};
  if (district) filter.district = new RegExp(district, 'i');
  if (state) filter.state = new RegExp(state, 'i');
  const farmers = await Farmer.find(filter).sort({ name: 1 });
  res.json(farmers);
};

const addFarmer = async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);
    res.status(201).json(farmer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add farmer profile.' });
  }
};

// ---------- Marketplace ----------
const getListings = async (req, res) => {
  const { category } = req.query;
  const filter = { status: 'Available' };
  if (category) filter.category = category;
  const listings = await Listing.find(filter).sort({ createdAt: -1 });
  res.json(listings);
};

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (err) {
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
  getListings,
  createListing,
  updateListingStatus,
};
