import { getDistance } from "./getDistance";

describe("getDistance", () => {
  it("should return 0 for identical points", () => {
    const point = { lat: 48.8566, lng: 2.3522 }; // Paris
    expect(getDistance(point, point)).toBe(0);
  });

  it("should calculate distance between Paris and Lyon (~392 km)", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const lyon = { lat: 45.764, lng: 4.8357 };
    const distance = getDistance(paris, lyon);
    expect(distance).toBeGreaterThan(390);
    expect(distance).toBeLessThan(395);
  });

  it("should calculate distance between Paris and New York (~5837 km)", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const newYork = { lat: 40.7128, lng: -74.006 };
    const distance = getDistance(paris, newYork);
    expect(distance).toBeGreaterThan(5830);
    expect(distance).toBeLessThan(5850);
  });

  it("should be symmetric (distance A->B == distance B->A)", () => {
    const paris = { lat: 48.8566, lng: 2.3522 };
    const tokyo = { lat: 35.6762, lng: 139.6503 };
    expect(getDistance(paris, tokyo)).toBeCloseTo(getDistance(tokyo, paris));
  });
});
