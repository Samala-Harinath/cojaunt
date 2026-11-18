/**
 * SAMPLE DATA: where each sample plan starts and roughly where each sample member is.
 * A backend replaces this with real data and does the distance sorting itself, so members'
 * positions never reach anyone else's browser.
 * Plans are placed at the public area of their meeting point, never the exact spot, which stays
 * hidden until the host approves the member. Trips are placed at their pickup point.
 */
export type Point = { lat: number; lng: number };
export type Spot = { city: string; at: Point };

const s = (city: string, lat: number, lng: number): Spot => ({ city, at: { lat, lng } });

export const planSpots: Record<string, Spot> = {
  // Bengaluru, by neighbourhood
  nandi: s("Bengaluru", 13.0358, 77.597),
  boardgames: s("Bengaluru", 12.9784, 77.6408),
  pottery: s("Bengaluru", 12.925, 77.5938),
  cubbon: s("Bengaluru", 12.9756, 77.6066),
  savandurga: s("Bengaluru", 12.9719, 77.53),
  coorg: s("Bengaluru", 12.9784, 77.6408),
  gokarna: s("Bengaluru", 12.9767, 77.5713),
  chikmagalur: s("Bengaluru", 13.0285, 77.5409),
  kabini: s("Bengaluru", 12.9081, 77.4826),
  sakleshpur: s("Bengaluru", 12.9767, 77.5713),
  foodwalk: s("Bengaluru", 12.9417, 77.5755),
  comedy: s("Bengaluru", 12.9352, 77.6245),
  pondicherry: s("Bengaluru", 12.9172, 77.6228),
  hampi: s("Bengaluru", 12.9767, 77.5713),
  lalbagh: s("Bengaluru", 12.9417, 77.5755),
  ramanagara: s("Bengaluru", 12.9081, 77.4826),
  // Across India
  kalavantin: s("Thane", 19.1865, 72.9757),
  colaba: s("Mumbai", 18.9067, 72.8147),
  rajmachi: s("Mumbai", 19.0178, 72.8478),
  pune: s("Pune", 18.5196, 73.8553),
  olddelhi: s("New Delhi", 28.6562, 77.241),
  rishikesh: s("New Delhi", 28.6328, 77.2197),
  goa: s("Panaji", 15.4989, 73.8278),
  charminar: s("Hyderabad", 17.3616, 78.4747),
};

/** Rough home areas of sample members. */
export const personHomes: Record<string, Spot> = {
  divya: s("Bengaluru", 12.9784, 77.6408),
  karthik: s("Bengaluru", 12.925, 77.5938),
  meera: s("Bengaluru", 12.9352, 77.6245),
  sana: s("Mumbai", 19.0596, 72.8295),
  rahul: s("Pune", 18.5679, 73.9143),
  arjun: s("Bengaluru", 12.9417, 77.5755),
  neha: s("Thane", 19.2183, 72.9781),
  ishaan: s("Bhiwandi", 19.2967, 73.0631),
  tara: s("Mumbai", 19.1197, 72.8468),
  kabir: s("New Delhi", 28.5672, 77.21),
  zoya: s("Navi Mumbai", 19.033, 73.0297),
  dev: s("Panaji", 15.4909, 73.8278),
  riya: s("Kalyan", 19.2437, 73.1355),
  aditya: s("Hyderabad", 17.4401, 78.3489),
  farah: s("Mumbai", 18.9696, 72.8205),
  vikram: s("Gurugram", 28.4595, 77.0266),
  anika: s("Bengaluru", 13.0285, 77.5409),
  sam: s("Chennai", 13.0418, 80.2341),
};
