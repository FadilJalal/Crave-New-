// tests/orderHelpers.test.js
// Run with: npx jest tests/orderHelpers.test.js

/**
 * Tests for the pure helper functions in orderController.js:
 *   - calcDeliveryFee
 *   - haversine
 */

// ── Extracted pure functions (mirrors orderController.js) ──────────────────

const FLAT_DELIVERY = 5;

function calcDeliveryFee(tiers, distKm) {
  if (!tiers || tiers.length === 0) return FLAT_DELIVERY;
  const sorted = [...tiers].sort((a, b) => {
    if (a.upToKm === null) return 1;
    if (b.upToKm === null) return -1;
    return a.upToKm - b.upToKm;
  });
  for (const tier of sorted) {
    if (tier.upToKm === null || distKm <= tier.upToKm) return tier.fee;
  }
  return sorted[sorted.length - 1]?.fee ?? FLAT_DELIVERY;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("calcDeliveryFee", () => {
  const tiers = [
    { upToKm: 3,    fee: 5  },
    { upToKm: 7,    fee: 10 },
    { upToKm: null, fee: 15 }, // catch-all
  ];

  test("returns fee for first tier when distance is within range", () => {
    expect(calcDeliveryFee(tiers, 2)).toBe(5);
    expect(calcDeliveryFee(tiers, 3)).toBe(5); // boundary
  });

  test("returns second tier fee for mid-range distance", () => {
    expect(calcDeliveryFee(tiers, 5)).toBe(10);
    expect(calcDeliveryFee(tiers, 7)).toBe(10); // boundary
  });

  test("returns catch-all tier fee for long distance", () => {
    expect(calcDeliveryFee(tiers, 20)).toBe(15);
    expect(calcDeliveryFee(tiers, 100)).toBe(15);
  });

  test("returns flat rate when no tiers provided", () => {
    expect(calcDeliveryFee([], 5)).toBe(FLAT_DELIVERY);
    expect(calcDeliveryFee(null, 5)).toBe(FLAT_DELIVERY);
  });

  test("handles unsorted tiers correctly", () => {
    const unordered = [
      { upToKm: null, fee: 15 },
      { upToKm: 7,    fee: 10 },
      { upToKm: 3,    fee: 5  },
    ];
    expect(calcDeliveryFee(unordered, 2)).toBe(5);
    expect(calcDeliveryFee(unordered, 5)).toBe(10);
    expect(calcDeliveryFee(unordered, 50)).toBe(15);
  });
});

describe("haversine", () => {
  test("returns 0 for identical coordinates", () => {
    expect(haversine(25.3, 55.4, 25.3, 55.4)).toBeCloseTo(0, 5);
  });

  test("calculates distance between Dubai and Sharjah (~15 km)", () => {
    // Approx coords: Dubai Mall ~25.197, 55.279 | Sharjah City Centre ~25.339, 55.412
    const dist = haversine(25.197, 55.279, 25.339, 55.412);
    expect(dist).toBeGreaterThan(10);
    expect(dist).toBeLessThan(25);
  });

  test("calculates a known long-distance reference (London to Paris ~340 km)", () => {
    const dist = haversine(51.5074, -0.1278, 48.8566, 2.3522);
    expect(dist).toBeGreaterThan(300);
    expect(dist).toBeLessThan(400);
  });

  test("is symmetric — A to B equals B to A", () => {
    const d1 = haversine(25.0, 55.0, 26.0, 56.0);
    const d2 = haversine(26.0, 56.0, 25.0, 55.0);
    expect(d1).toBeCloseTo(d2, 5);
  });
});
