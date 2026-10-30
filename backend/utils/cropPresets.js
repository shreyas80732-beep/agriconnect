/**
 * Pre-configured agronomic data for popular crops
 * Provides realistic timelines, critical irrigation schedules, and yield benchmarks.
 */

const addDays = (startDate, days) => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const CROP_PRESETS = {
  'Wheat': {
    durationDays: 125,
    fieldAreaDefault: '4 Acres',
    expectedYield: '22 - 26 Quintals / Acre',
    estimatedTotalYield: '90 - 105 Quintals',
    irrigationSchedule: [
      {
        stageName: 'Crown Root Initiation (CRI)',
        dayOffset: 21,
        waterRequirement: 'Critical (5-6 cm depth) - Root anchoring',
        notes: 'First and most crucial irrigation. Water stress here reduces yield up to 40%.',
      },
      {
        stageName: 'Late Tillering Stage',
        dayOffset: 45,
        waterRequirement: 'Moderate (4-5 cm depth)',
        notes: 'Promotes vigorous tiller production and leaf canopy development.',
      },
      {
        stageName: 'Late Jointing Stage',
        dayOffset: 65,
        waterRequirement: 'Moderate to High',
        notes: 'Supports elongation of stem and formation of ear head spikes.',
      },
      {
        stageName: 'Flowering & Heading Stage',
        dayOffset: 85,
        waterRequirement: 'Critical (Adequate moisture)',
        notes: 'Ensures proper anthesis and flower pollination.',
      },
      {
        stageName: 'Milking / Dough Stage',
        dayOffset: 105,
        waterRequirement: 'Light irrigation on calm windless days',
        notes: 'Accelerates grain filling and kernel size. Stop watering 10 days before harvest.',
      },
    ],
    harvestTimeline: [
      { milestone: 'Sowing & Seed Treatment', dayOffset: 0, details: 'Certified HD-2967 seed treated with Trichoderma' },
      { milestone: 'Crown Rooting & 1st Irrigation', dayOffset: 21, details: 'Applied 1st split Urea dose' },
      { milestone: 'Peak Tillering & Weed Check', dayOffset: 45, details: 'Canopy dense, zero weed interference' },
      { milestone: 'Booting & Ear Emergence', dayOffset: 75, details: 'Spikelets emerging with healthy green foliage' },
      { milestone: 'Grain Filling (Dough Phase)', dayOffset: 105, details: 'Starch accumulating in grains' },
      { milestone: 'Golden Maturity & Combine Harvest', dayOffset: 125, details: 'Grains below 12% moisture ready for storage/mandi' },
    ],
  },
  'Rice (Paddy)': {
    durationDays: 135,
    fieldAreaDefault: '3 Acres',
    expectedYield: '28 - 34 Quintals / Acre',
    estimatedTotalYield: '85 - 100 Quintals',
    irrigationSchedule: [
      {
        stageName: 'Transplantation & Puddling',
        dayOffset: 5,
        waterRequirement: 'Shallow submergence (2-3 cm)',
        notes: 'Helps seedlings settle quickly in nursery/field.',
      },
      {
        stageName: 'Active Tillering Phase',
        dayOffset: 30,
        waterRequirement: 'Continuous shallow ponding (3-5 cm)',
        notes: 'Crucial for tiller multiplication.',
      },
      {
        stageName: 'Panicle Initiation (PI)',
        dayOffset: 60,
        waterRequirement: 'Critical depth (5 cm)',
        notes: 'High water requirement. Never let field dry during PI.',
      },
      {
        stageName: 'Flowering & Heading',
        dayOffset: 90,
        waterRequirement: 'Adequate standing water (3-4 cm)',
        notes: 'Pollen viability depends on soil moisture.',
      },
      {
        stageName: 'Terminal Drainage',
        dayOffset: 120,
        waterRequirement: 'Completely drain water 10-15 days prior to harvest',
        notes: 'Promotes uniform grain drying and easy mechanical harvesting.',
      },
    ],
    harvestTimeline: [
      { milestone: 'Nursery Raising & Sowing', dayOffset: 0, details: 'Certified Pusa 1121 / PR-126' },
      { milestone: 'Field Transplantation', dayOffset: 25, details: '2-3 seedlings per hill with 20x15cm spacing' },
      { milestone: 'Active Tillering & Weeding', dayOffset: 45, details: 'Cono-weeder run and second fertilizer split' },
      { milestone: 'Panicle Primordia Emergence', dayOffset: 70, details: 'Panicles forming inside stem base' },
      { milestone: 'Full Heading & Milk Stage', dayOffset: 95, details: 'Panicles hanging golden, grain filling rapidly' },
      { milestone: 'Field Harvest & Threshing', dayOffset: 135, details: 'Straw golden-yellow, harvest ready' },
    ],
  },
  'Cotton': {
    durationDays: 160,
    fieldAreaDefault: '5 Acres',
    expectedYield: '14 - 18 Quintals (Kapas) / Acre',
    estimatedTotalYield: '70 - 90 Quintals',
    irrigationSchedule: [
      {
        stageName: 'Germination & Early Vegetative',
        dayOffset: 20,
        waterRequirement: 'Light irrigation (Furrow / Drip)',
        notes: 'Encourages deep tap root penetration.',
      },
      {
        stageName: 'Square Initiation (Budding)',
        dayOffset: 50,
        waterRequirement: 'Moderate watering',
        notes: 'Promotes floral bud retention.',
      },
      {
        stageName: 'Peak Flowering & Early Boll',
        dayOffset: 85,
        waterRequirement: 'Critical high demand',
        notes: 'Water deficit causes heavy shedding of flowers and squares.',
      },
      {
        stageName: 'Boll Development & Maturation',
        dayOffset: 115,
        waterRequirement: 'Moderate watering',
        notes: 'Maintains fiber length and boll size.',
      },
      {
        stageName: 'Boll Bursting',
        dayOffset: 140,
        waterRequirement: 'Cut off irrigation completely',
        notes: 'Enables clean lint drying and prevents boll rot.',
      },
    ],
    harvestTimeline: [
      { milestone: 'Dibbling / Sowing with Basal Dose', dayOffset: 0, details: 'BT Cotton hybrid seeds sown with fungicide seed coating' },
      { milestone: 'Vegetative Canopy Expansion', dayOffset: 35, details: 'Stem thickening, branch development' },
      { milestone: 'Square Formation & Pest Monitoring', dayOffset: 60, details: 'Installed pheromone traps for pink bollworm' },
      { milestone: 'Peak Bloom & Boll Setting', dayOffset: 90, details: 'White flowers turning pink, bolls enlarging' },
      { milestone: 'First Boll Bursting (Picking 1)', dayOffset: 135, details: 'Fluffy white cotton picking under sunny skies' },
      { milestone: 'Final Harvest & Field Cleanup', dayOffset: 160, details: 'Second picking and stalks mulched into soil' },
    ],
  },
  'Tomato': {
    durationDays: 105,
    fieldAreaDefault: '2 Acres',
    expectedYield: '20 - 25 Tonnes / Acre',
    estimatedTotalYield: '40 - 50 Tonnes',
    irrigationSchedule: [
      {
        stageName: 'Transplanting & Establishment',
        dayOffset: 3,
        waterRequirement: 'Light daily drip wetting',
        notes: 'Keeps root zone moist while rootlets take hold.',
      },
      {
        stageName: 'Vegetative Staking Phase',
        dayOffset: 25,
        waterRequirement: 'Drip irrigation every 2-3 days',
        notes: 'Supports strong trellised indeterminate vines.',
      },
      {
        stageName: 'Flowering & Fruit Cluster Set',
        dayOffset: 50,
        waterRequirement: 'Uniform moisture (Avoid sudden wetting/drying)',
        notes: 'Fluctuating moisture triggers blossom end rot and fruit cracking.',
      },
      {
        stageName: 'Fruit Sizing & Maturation',
        dayOffset: 75,
        waterRequirement: 'Regular drip with fertigation (K2O)',
        notes: 'Maximizes fruit firmness and sugar brix level.',
      },
    ],
    harvestTimeline: [
      { milestone: 'Nursery Sowing & Hardening', dayOffset: 0, details: 'Hybrid indeterminate variety (e.g. Abhinav)' },
      { milestone: 'Field Bed Planting & Staking', dayOffset: 25, details: 'Silver-black plastic mulch with drip lines' },
      { milestone: 'Flowering & Pruning', dayOffset: 45, details: 'Removing suckers and staking vertical twines' },
      { milestone: 'Green Fruit Bulking', dayOffset: 70, details: 'Dense clusters of heavy green tomatoes' },
      { milestone: 'First Breaker Stage Picking', dayOffset: 90, details: 'Pink-tinged fruit harvested for distant transport' },
      { milestone: 'Peak Red Ripe Harvest', dayOffset: 105, details: 'Yield crates packed for local market' },
    ],
  },
  'Sugarcane': {
    durationDays: 330,
    fieldAreaDefault: '5 Acres',
    expectedYield: '45 - 55 Tonnes / Acre',
    estimatedTotalYield: '225 - 275 Tonnes',
    irrigationSchedule: [
      {
        stageName: 'Germination Phase',
        dayOffset: 15,
        waterRequirement: 'Light frequent irrigation (every 7-10 days)',
        notes: 'Sett germination requires aerated yet moist soil.',
      },
      {
        stageName: 'Formative & Tillering Stage',
        dayOffset: 65,
        waterRequirement: 'High water demand',
        notes: 'Water stress here limits tiller count and millable canes.',
      },
      {
        stageName: 'Grand Growth Phase (Cane Elongation)',
        dayOffset: 150,
        waterRequirement: 'Peak requirement (Copious watering)',
        notes: 'Accounts for 70-80% of total cane weight accumulation.',
      },
      {
        stageName: 'Ripening / Sugar Synthesis Phase',
        dayOffset: 270,
        waterRequirement: 'Gradually lengthen irrigation intervals',
        notes: 'Mild water deficit concentrates sucrose in internodes.',
      },
    ],
    harvestTimeline: [
      { milestone: 'Sett Furrow Planting & Earthing up', dayOffset: 0, details: 'Co-0238 / Co-86032 two-bud setts planted' },
      { milestone: 'Tiller Emergence & Fertilizer Dressing', dayOffset: 60, details: 'Shoots established, earthing up ridges' },
      { milestone: 'Grand Cane Elongation', dayOffset: 150, details: 'Rapid height growth, tying canes to prevent lodging' },
      { milestone: 'Sucrose Accumulation', dayOffset: 260, details: 'Brix reading >18, sweet stalk maturation' },
      { milestone: 'Maturity & Mill Crushing Harvest', dayOffset: 330, details: 'Cut at ground level for maximum juice extraction' },
    ],
  },
  'Maize (Corn)': {
    durationDays: 105,
    fieldAreaDefault: '3 Acres',
    expectedYield: '25 - 30 Quintals / Acre',
    estimatedTotalYield: '75 - 90 Quintals',
    irrigationSchedule: [
      {
        stageName: 'Early Seedling',
        dayOffset: 15,
        waterRequirement: 'Moderate furrow irrigation',
        notes: 'Avoid waterlogging at young stage.',
      },
      {
        stageName: 'Knee-High Stage',
        dayOffset: 35,
        waterRequirement: 'Moderate watering',
        notes: 'Rapid stem extension and leaf emergence.',
      },
      {
        stageName: 'Tasseling & Silking Stage',
        dayOffset: 60,
        waterRequirement: 'Most critical moisture period',
        notes: 'Stress causes poor pollination and barren ears.',
      },
      {
        stageName: 'Grain Filling / Dough Stage',
        dayOffset: 80,
        waterRequirement: 'Adequate moisture',
        notes: 'Enlarges cob kernels and density.',
      },
    ],
    harvestTimeline: [
      { milestone: 'Ridge Sowing & Seed Treatment', dayOffset: 0, details: 'Single cross high-yielding hybrid maize' },
      { milestone: 'Knee-High Growth & Top Dressing', dayOffset: 30, details: 'Nitrogen applied at 6-leaf stage' },
      { milestone: 'Tassel Emergence & Silking', dayOffset: 55, details: 'Silks moist, pollen shedding actively' },
      { milestone: 'Milk & Soft Dough Stage', dayOffset: 75, details: 'Kernels filled with sweet milky fluid' },
      { milestone: 'Black Layer Formation & Harvest', dayOffset: 105, details: 'Husk turned dry and papery, ready for shelling' },
    ],
  },
};

/**
 * Builds realistic planted crop progress data based on planting date and selected crop preset
 */
function generatePlantedCropData({ cropName, variety, plantingDate = new Date(), fieldArea = '3 Acres', customDuration }) {
  const pDate = new Date(plantingDate);
  const now = new Date();
  const preset = CROP_PRESETS[cropName];

  const durationDays = customDuration || preset?.durationDays || 110;
  const harvestDate = new Date(pDate);
  harvestDate.setDate(harvestDate.getDate() + durationDays);

  // Calculate actual elapsed days and progress %
  const elapsedMs = now.getTime() - pDate.getTime();
  const elapsedDays = Math.max(0, Math.floor(elapsedMs / (1000 * 60 * 60 * 24)));
  const progressPercent = Math.min(100, Math.max(5, Math.round((elapsedDays / durationDays) * 100)));

  // Determine stage
  let stage = 'Seedling & Germination';
  if (progressPercent > 85) stage = 'Ready for Harvest';
  else if (progressPercent > 65) stage = 'Grain Filling / Fruit Maturation';
  else if (progressPercent > 45) stage = 'Flowering & Pollination';
  else if (progressPercent > 25) stage = 'Active Vegetative & Tillering';
  else if (progressPercent > 10) stage = 'Early Establishment';

  // Build irrigation schedule with absolute dates
  const irrigationSchedule = (preset?.irrigationSchedule || [
    { stageName: 'Initial Sowing Watering', dayOffset: 2, waterRequirement: 'Normal', notes: 'Moisture for seed emergence' },
    { stageName: 'Vegetative Irrigation', dayOffset: 30, waterRequirement: 'Adequate', notes: 'Promotes deep rooting' },
    { stageName: 'Flowering Stage Irrigation', dayOffset: 60, waterRequirement: 'High', notes: 'Critical water window' },
    { stageName: 'Grain/Fruit Bulking', dayOffset: 85, waterRequirement: 'Moderate', notes: 'Supports final sizing' },
  ]).map((item) => {
    const isPast = elapsedDays >= item.dayOffset;
    return {
      stageName: item.stageName,
      dueDate: addDays(pDate, item.dayOffset),
      waterRequirement: item.waterRequirement,
      completed: isPast,
      completedDate: isPast ? addDays(pDate, item.dayOffset) : null,
      notes: item.notes,
    };
  });

  // Build harvest timeline with absolute dates
  const harvestTimeline = (preset?.harvestTimeline || [
    { milestone: 'Sowing in Field', dayOffset: 0, details: 'Field prepared with base organic manure' },
    { milestone: 'Establishment Phase', dayOffset: 20, details: 'Young healthy plants with true leaves' },
    { milestone: 'Canopy Development', dayOffset: 45, details: 'Inter-row cultivation and fertilization' },
    { milestone: 'Bloom & Reproductive Stage', dayOffset: 70, details: 'Peak floral development' },
    { milestone: 'Maturity & Harvest Window', dayOffset: durationDays, details: 'Crop reaches physiological ripeness' },
  ]).map((m) => {
    const isPast = elapsedDays >= m.dayOffset;
    return {
      milestone: m.milestone,
      date: addDays(pDate, m.dayOffset),
      completed: isPast,
      details: m.details,
    };
  });

  return {
    cropName,
    variety: variety || `${cropName} Premium Hybrid`,
    plantingDate: pDate,
    expectedHarvestDate: harvestDate,
    stage,
    progressPercent,
    fieldArea: fieldArea || preset?.fieldAreaDefault || '3 Acres',
    irrigationSchedule,
    harvestTimeline,
    expectedYield: preset?.expectedYield || '25 Quintals / Acre',
    estimatedTotalYield: preset?.estimatedTotalYield || '75 Quintals',
    healthStatus: progressPercent > 90 ? 'Ready for Harvest' : 'Optimal Growth',
    notes: `Planted on ${pDate.toLocaleDateString()}. Monitored via AgriConnect Smart Advisory.`,
  };
}

module.exports = {
  CROP_PRESETS,
  generatePlantedCropData,
};
