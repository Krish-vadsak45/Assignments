/**
 * Calculate total impact metrics for an order
 * @param {Array} items - Array of order items with quantity and product details
 * @returns {Object} - calculated totals
 */
const calculateImpact = (items) => {
  let totalPlasticSaved = 0;
  let totalCarbonAvoided = 0;
  let locallySourcedCount = 0;

  items.forEach((item) => {
    // Ensure we handle missing factors gracefully (default to 0)
    const plasticFactor = item.plasticSavedFactor || 0;
    const carbonFactor = item.carbonAvoidedFactor || 0;
    const quantity = item.quantity || 0;

    totalPlasticSaved += quantity * plasticFactor;
    totalCarbonAvoided += quantity * carbonFactor;

    if (item.isLocallySourced) {
      locallySourcedCount += quantity;
    }
  });

  return {
    plasticSavedKg: parseFloat(totalPlasticSaved.toFixed(2)),
    carbonAvoidedKg: parseFloat(totalCarbonAvoided.toFixed(2)),
    locallySourcedCount,
  };
};

export { calculateImpact };
