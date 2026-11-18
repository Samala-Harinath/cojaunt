import type { Point } from "./areas";

/**
 * Indian cities and towns, by state. Used for picking a city by hand, as an offline fallback when the
 * place lookup is unavailable, and to place sample plans and members. Coordinates are city centres.
 */
export type City = { name: string; state: string; at: Point };

const c = (name: string, state: string, lat: number, lng: number): City => ({ name, state, at: { lat, lng } });

export const cities: City[] = [
  c("Visakhapatnam", "Andhra Pradesh", 17.6868, 83.2185),
  c("Vijayawada", "Andhra Pradesh", 16.5062, 80.648),
  c("Guwahati", "Assam", 26.1445, 91.7362),
  c("Patna", "Bihar", 25.5941, 85.1376),
  c("Chandigarh", "Chandigarh", 30.7333, 76.7794),
  c("Raipur", "Chhattisgarh", 21.2514, 81.6296),
  c("New Delhi", "Delhi", 28.6139, 77.209),
  c("Panaji", "Goa", 15.4909, 73.8278),
  c("Ahmedabad", "Gujarat", 23.0225, 72.5714),
  c("Surat", "Gujarat", 21.1702, 72.8311),
  c("Vadodara", "Gujarat", 22.3072, 73.1812),
  c("Rajkot", "Gujarat", 22.3039, 70.8022),
  c("Gurugram", "Haryana", 28.4595, 77.0266),
  c("Faridabad", "Haryana", 28.4089, 77.3178),
  c("Shimla", "Himachal Pradesh", 31.1048, 77.1734),
  c("Manali", "Himachal Pradesh", 32.2432, 77.1892),
  c("Dharamshala", "Himachal Pradesh", 32.219, 76.3234),
  c("Srinagar", "Jammu and Kashmir", 34.0837, 74.7973),
  c("Jammu", "Jammu and Kashmir", 32.7266, 74.857),
  c("Ranchi", "Jharkhand", 23.3441, 85.3096),
  c("Bengaluru", "Karnataka", 12.9716, 77.5946),
  c("Mysuru", "Karnataka", 12.2958, 76.6394),
  c("Mangaluru", "Karnataka", 12.9141, 74.856),
  c("Kochi", "Kerala", 9.9312, 76.2673),
  c("Thiruvananthapuram", "Kerala", 8.5241, 76.9366),
  c("Kozhikode", "Kerala", 11.2588, 75.7804),
  c("Bhopal", "Madhya Pradesh", 23.2599, 77.4126),
  c("Indore", "Madhya Pradesh", 22.7196, 75.8577),
  c("Mumbai", "Maharashtra", 19.076, 72.8777),
  c("Thane", "Maharashtra", 19.2183, 72.9781),
  c("Bhiwandi", "Maharashtra", 19.2813, 73.0483),
  c("Kalyan", "Maharashtra", 19.2437, 73.1355),
  c("Navi Mumbai", "Maharashtra", 19.033, 73.0297),
  c("Pune", "Maharashtra", 18.5204, 73.8567),
  c("Lonavala", "Maharashtra", 18.7546, 73.4062),
  c("Nashik", "Maharashtra", 19.9975, 73.7898),
  c("Nagpur", "Maharashtra", 21.1458, 79.0882),
  c("Chhatrapati Sambhajinagar", "Maharashtra", 19.8762, 75.3433),
  c("Shillong", "Meghalaya", 25.5788, 91.8933),
  c("Bhubaneswar", "Odisha", 20.2961, 85.8245),
  c("Puducherry", "Puducherry", 11.9416, 79.8083),
  c("Amritsar", "Punjab", 31.634, 74.8723),
  c("Ludhiana", "Punjab", 30.901, 75.8573),
  c("Jaipur", "Rajasthan", 26.9124, 75.7873),
  c("Udaipur", "Rajasthan", 24.5854, 73.7125),
  c("Jodhpur", "Rajasthan", 26.2389, 73.0243),
  c("Gangtok", "Sikkim", 27.3389, 88.6065),
  c("Chennai", "Tamil Nadu", 13.0827, 80.2707),
  c("Coimbatore", "Tamil Nadu", 11.0168, 76.9558),
  c("Madurai", "Tamil Nadu", 9.9252, 78.1198),
  c("Hyderabad", "Telangana", 17.385, 78.4867),
  c("Lucknow", "Uttar Pradesh", 26.8467, 80.9462),
  c("Noida", "Uttar Pradesh", 28.5355, 77.391),
  c("Ghaziabad", "Uttar Pradesh", 28.6692, 77.4538),
  c("Agra", "Uttar Pradesh", 27.1767, 78.0081),
  c("Varanasi", "Uttar Pradesh", 25.3176, 82.9739),
  c("Kanpur", "Uttar Pradesh", 26.4499, 80.3319),
  c("Prayagraj", "Uttar Pradesh", 25.4358, 81.8463),
  c("Dehradun", "Uttarakhand", 30.3165, 78.0322),
  c("Rishikesh", "Uttarakhand", 30.0869, 78.2676),
  c("Kolkata", "West Bengal", 22.5726, 88.3639),
  c("Darjeeling", "West Bengal", 27.041, 88.2663),
];

export function findCity(name: string): City | undefined {
  return cities.find((city) => city.name === name);
}

/** States in alphabetical order, each with its cities, for a grouped picker. */
export const citiesByState: { state: string; cities: City[] }[] = [...new Set(cities.map((city) => city.state))]
  .sort((a, b) => a.localeCompare(b))
  .map((state) => ({ state, cities: cities.filter((city) => city.state === state).sort((a, b) => a.name.localeCompare(b.name)) }));

/** A generous box around India. A point outside it is treated as outside the country. */
export const INDIA_BOUNDS = { minLat: 6, maxLat: 37.6, minLng: 68, maxLng: 97.5 } as const;

export function inIndiaBox(point: Point): boolean {
  return point.lat >= INDIA_BOUNDS.minLat && point.lat <= INDIA_BOUNDS.maxLat && point.lng >= INDIA_BOUNDS.minLng && point.lng <= INDIA_BOUNDS.maxLng;
}
