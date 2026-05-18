import { cafes as mockCafes } from "../components/pages/cafe/data/mockData.js";

export const getAllCafes = () => {
  const saved = localStorage.getItem("petapp_cafes");
  let localCafes = [];
  if (saved) {
    try {
      localCafes = JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved cafes", e);
    }
  }

  // Merge unique cafes by ID, prioritizing local ones
  const cafeMap = new Map();
  [...mockCafes, ...localCafes].forEach((c) => {
    cafeMap.set(c.id, c);
  });

  return Array.from(cafeMap.values());
};

export const getCafeById = (id) => {
  return getAllCafes().find((c) => c.id === id);
};
