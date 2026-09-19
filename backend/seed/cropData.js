// Shared crop reference data used by both the seed script and the
// server's auto-seed-if-empty startup check.
const defaultCrops = [
  {
    cropName: 'Maize',
    description: 'A versatile cereal crop grown widely across India, used for food, fodder, and industrial purposes.',
    optimalTempMin: 21,
    optimalTempMax: 30,
    optimalRainfall: '600-1200 mm/year',
    soilType: ['Loamy', 'Sandy Loam', 'Alluvial'],
    fertilizerGuide: {
      seedling: 'Apply DAP (50kg/acre) at sowing for root establishment.',
      vegetative: 'Top-dress Urea (40kg/acre) 25-30 days after sowing.',
      flowering: 'Apply potash (20kg/acre) to support cob development.',
      maturity: 'Reduce nitrogen input; ensure adequate irrigation to grain-fill.',
    },
    commonDiseases: [
      { name: 'Maydis Leaf Blight', prevention: 'Use resistant hybrids and avoid excess nitrogen; rotate crops.' },
      { name: 'Fall Armyworm', prevention: 'Monitor early, use pheromone traps, apply neem-based biopesticide.' },
    ],
    averageMarketPrice: '₹1900-2200 per quintal',
  },
  {
    cropName: 'Rice',
    description: 'A staple food crop grown predominantly in flooded paddies across tropical and subtropical India.',
    optimalTempMin: 20,
    optimalTempMax: 35,
    optimalRainfall: '1000-2000 mm/year',
    soilType: ['Clayey', 'Alluvial', 'Loamy'],
    fertilizerGuide: {
      seedling: 'Basal dose of NPK (12:32:16) at transplanting.',
      vegetative: 'Split Urea application at tillering stage (30-35 DAT).',
      flowering: 'Apply potash to strengthen panicle formation.',
      maturity: 'Withhold nitrogen; drain field 7-10 days before harvest.',
    },
    commonDiseases: [
      { name: 'Blast Disease', prevention: 'Use resistant varieties, avoid excess nitrogen, apply tricyclazole if needed.' },
      { name: 'Bacterial Leaf Blight', prevention: 'Use certified seed, avoid water stagnation, maintain field sanitation.' },
    ],
    averageMarketPrice: '₹2000-2300 per quintal',
  },
  {
    cropName: 'Ragi',
    description: 'Finger millet, a hardy, drought-tolerant cereal rich in calcium, well suited to dryland farming.',
    optimalTempMin: 20,
    optimalTempMax: 30,
    optimalRainfall: '500-1000 mm/year',
    soilType: ['Red Loam', 'Sandy', 'Black Soil'],
    fertilizerGuide: {
      seedling: 'Apply FYM (2 tons/acre) and basal NPK at sowing.',
      vegetative: 'Top-dress Urea (20kg/acre) 20-25 days after sowing.',
      flowering: 'Light irrigation with balanced potash application.',
      maturity: 'Minimal input required; ensure timely harvest to avoid shattering.',
    },
    commonDiseases: [
      { name: 'Blast (Neck and Finger)', prevention: 'Use resistant varieties and avoid dense sowing.' },
      { name: 'Downy Mildew', prevention: 'Treat seeds with fungicide before sowing; ensure proper drainage.' },
    ],
    averageMarketPrice: '₹3300-3600 per quintal',
  },
  {
    cropName: 'Corn',
    description: 'Sweet corn variety grown for fresh consumption and processing, requiring warm growing conditions.',
    optimalTempMin: 18,
    optimalTempMax: 32,
    optimalRainfall: '500-800 mm/year',
    soilType: ['Loamy', 'Sandy Loam'],
    fertilizerGuide: {
      seedling: 'Apply balanced NPK (19:19:19) at sowing.',
      vegetative: 'Nitrogen top-dressing at knee-high stage.',
      flowering: 'Potash boost during tasseling and silking.',
      maturity: 'Ensure consistent moisture for kernel development.',
    },
    commonDiseases: [
      { name: 'Common Rust', prevention: 'Plant resistant hybrids, apply fungicide at first sign of pustules.' },
      { name: 'Stalk Rot', prevention: 'Avoid waterlogging and maintain balanced potassium levels.' },
    ],
    averageMarketPrice: '₹1800-2100 per quintal',
  },
  {
    cropName: 'Jowar',
    description: 'Sorghum, a drought-resistant cereal crop suited to semi-arid regions, used for food and fodder.',
    optimalTempMin: 25,
    optimalTempMax: 35,
    optimalRainfall: '400-800 mm/year',
    soilType: ['Black Soil', 'Sandy Loam', 'Red Soil'],
    fertilizerGuide: {
      seedling: 'Apply basal dose of NPK (20:20:0) at sowing.',
      vegetative: 'Urea top-dressing at 30 days after sowing.',
      flowering: 'Light potash application to support grain filling.',
      maturity: 'Minimal irrigation; harvest when grains harden.',
    },
    commonDiseases: [
      { name: 'Grain Mold', prevention: 'Use resistant hybrids and harvest promptly at maturity to avoid moisture exposure.' },
      { name: 'Shoot Fly', prevention: 'Timely sowing and seed treatment with recommended insecticide.' },
    ],
    averageMarketPrice: '₹2900-3200 per quintal',
  },
  {
    cropName: 'Sugarcane',
    description: 'A long-duration cash crop grown for sugar and jaggery production, requiring high water input.',
    optimalTempMin: 21,
    optimalTempMax: 38,
    optimalRainfall: '1500-2500 mm/year',
    soilType: ['Loamy', 'Clayey', 'Alluvial'],
    fertilizerGuide: {
      seedling: 'Apply FYM and basal NPK (100:50:50 kg/acre) at planting.',
      vegetative: 'Split nitrogen doses at 45 and 90 days after planting.',
      flowering: 'Potash application to improve sucrose content.',
      maturity: 'Reduce irrigation and nitrogen 4-6 weeks before harvest to boost sugar recovery.',
    },
    commonDiseases: [
      { name: 'Red Rot', prevention: 'Use disease-free setts, resistant varieties, and avoid waterlogging.' },
      { name: 'Smut', prevention: 'Hot water seed treatment and removal of infected clumps.' },
    ],
    averageMarketPrice: '₹315-340 per quintal (FRP-linked)',
  },
];

module.exports = { defaultCrops };
