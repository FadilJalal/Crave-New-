// tests/recommendation.test.js
// Run with: npx jest tests/recommendation.test.js
// Install:  npm install --save-dev jest

/**
 * Unit tests for the collaborative filtering + category fallback logic
 * extracted from recommendationRoute.js.
 *
 * We test the pure logic in isolation — no DB, no HTTP.
 */

// ── Extracted pure functions (mirrors recommendationRoute.js logic) ──────────

function getTopCategories(orders) {
  const counts = {};
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (item.category) counts[item.category] = (counts[item.category] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);
}

function getMyItemIds(orders) {
  const ids = new Set();
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (item._id) ids.add(String(item._id));
    });
  });
  return ids;
}

function collaborativeScore(myItemIds, otherOrders) {
  const score = {};
  otherOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const id = String(item._id);
      if (!myItemIds.has(id)) {
        score[id] = (score[id] || 0) + 1;
      }
    });
  });
  return score;
}

function topN(scoreMap, n) {
  return Object.entries(scoreMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id]) => id);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("getMyItemIds", () => {
  test("returns a set of item _ids from all orders", () => {
    const orders = [
      { items: [{ _id: "a1" }, { _id: "a2" }] },
      { items: [{ _id: "a3" }] },
    ];
    const ids = getMyItemIds(orders);
    expect(ids.has("a1")).toBe(true);
    expect(ids.has("a2")).toBe(true);
    expect(ids.has("a3")).toBe(true);
    expect(ids.size).toBe(3);
  });

  test("handles orders with no items gracefully", () => {
    const orders = [{ items: [] }, {}];
    expect(getMyItemIds(orders).size).toBe(0);
  });
});

describe("getTopCategories", () => {
  test("returns categories sorted by order frequency", () => {
    const orders = [
      { items: [{ category: "Pizza" }, { category: "Burgers" }] },
      { items: [{ category: "Pizza" }] },
      { items: [{ category: "Sushi" }] },
    ];
    const cats = getTopCategories(orders);
    expect(cats[0]).toBe("Pizza");   // 2 occurrences
    expect(cats).toContain("Burgers");
    expect(cats).toContain("Sushi");
  });

  test("returns empty array when no orders", () => {
    expect(getTopCategories([])).toEqual([]);
  });
});

describe("collaborativeScore", () => {
  test("scores items ordered by similar users that I haven't ordered", () => {
    const myIds = new Set(["item1", "item2"]);
    const otherOrders = [
      { items: [{ _id: "item1" }, { _id: "item3" }] }, // item3 is new
      { items: [{ _id: "item3" }, { _id: "item4" }] }, // item3 scored twice
      { items: [{ _id: "item4" }] },
    ];
    const score = collaborativeScore(myIds, otherOrders);
    expect(score["item3"]).toBe(2);
    expect(score["item4"]).toBe(2);
    expect(score["item1"]).toBeUndefined(); // already ordered
    expect(score["item2"]).toBeUndefined();
  });

  test("returns empty object when no other orders", () => {
    const myIds = new Set(["item1"]);
    expect(collaborativeScore(myIds, [])).toEqual({});
  });
});

describe("topN", () => {
  test("returns top N ids sorted by score descending", () => {
    const scores = { a: 5, b: 10, c: 3, d: 8 };
    const result = topN(scores, 2);
    expect(result).toEqual(["b", "d"]);
  });

  test("returns fewer than N if not enough items", () => {
    const scores = { x: 1 };
    expect(topN(scores, 5)).toHaveLength(1);
  });

  test("handles empty score map", () => {
    expect(topN({}, 4)).toEqual([]);
  });
});
