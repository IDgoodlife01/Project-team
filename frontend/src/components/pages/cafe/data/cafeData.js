import { cafes as mockCafes } from "./mockData.js";

export const getAllCafes = () => {
  const saved = localStorage.getItem("petapp_cafes");
  let localCafes = [];
  if (saved) {
    try {
      localCafes = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  const cafeMap = new Map();
  [...mockCafes, ...localCafes].forEach((c) => cafeMap.set(String(c.id), c));
  return Array.from(cafeMap.values());
};

export const getCafeById = (id) =>
  getAllCafes().find((c) => String(c.id) === String(id));
