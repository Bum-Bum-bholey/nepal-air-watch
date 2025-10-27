/**
 * Real Nepal cities and districts with coordinates
 * These are actual locations in Nepal for air quality monitoring
 */

import { Location, SchoolLocation } from '../types/air-quality';

export const nepalCities: Location[] = [
  // Major cities
  { id: 1, city: "Kathmandu", province: "Bagmati", lat: 27.7172, lng: 85.3240 },
  { id: 2, city: "Pokhara", province: "Gandaki", lat: 28.2096, lng: 83.9856 },
  { id: 3, city: "Lalitpur", province: "Bagmati", lat: 27.6588, lng: 85.3240 },
  { id: 4, city: "Bhaktapur", province: "Bagmati", lat: 27.6710, lng: 85.4298 },
  { id: 5, city: "Birgunj", province: "Madhesh", lat: 27.0104, lng: 84.8770 },
  { id: 6, city: "Bharatpur", province: "Bagmati", lat: 27.6833, lng: 84.4333 },
  { id: 7, city: "Hetauda", province: "Bagmati", lat: 27.4284, lng: 85.0320 },
  { id: 8, city: "Dharan", province: "Koshi", lat: 26.7153, lng: 87.2843 },
  { id: 9, city: "Butwal", province: "Lumbini", lat: 27.7000, lng: 83.4483 },
  { id: 10, city: "Janakpur", province: "Madhesh", lat: 26.7288, lng: 85.9254 },
];

export const nepalDistricts: Location[] = [
  // Bagmati Province
  { id: 1, city: "Kathmandu", district: "Kathmandu", province: "Bagmati", lat: 27.7172, lng: 85.3240 },
  { id: 2, city: "Lalitpur", district: "Lalitpur", province: "Bagmati", lat: 27.6588, lng: 85.3240 },
  { id: 3, city: "Bhaktapur", district: "Bhaktapur", province: "Bagmati", lat: 27.6710, lng: 85.4298 },
  { id: 4, city: "Chitwan", district: "Chitwan", province: "Bagmati", lat: 27.6833, lng: 84.4333 },
  { id: 5, city: "Makwanpur", district: "Makwanpur", province: "Bagmati", lat: 27.4284, lng: 85.0320 },
  
  // Gandaki Province
  { id: 6, city: "Kaski", district: "Kaski", province: "Gandaki", lat: 28.2096, lng: 83.9856 },
  { id: 7, city: "Syangja", district: "Syangja", province: "Gandaki", lat: 28.0333, lng: 83.9667 },
  { id: 8, city: "Tanahu", district: "Tanahu", province: "Gandaki", lat: 27.9500, lng: 84.2000 },
  
  // Lumbini Province
  { id: 9, city: "Rupandehi", district: "Rupandehi", province: "Lumbini", lat: 27.7000, lng: 83.4483 },
  { id: 10, city: "Palpa", district: "Palpa", province: "Lumbini", lat: 27.6833, lng: 83.5167 },
  
  // Koshi Province
  { id: 11, city: "Sunsari", district: "Sunsari", province: "Koshi", lat: 26.7153, lng: 87.2843 },
  { id: 12, city: "Morang", district: "Morang", province: "Koshi", lat: 26.4500, lng: 87.2500 },
  
  // Madhesh Province
  { id: 13, city: "Dhanusha", district: "Dhanusha", province: "Madhesh", lat: 26.7288, lng: 85.9254 },
  { id: 14, city: "Parsa", district: "Parsa", province: "Madhesh", lat: 27.0104, lng: 84.8770 },
];

export const schoolLocations: SchoolLocation[] = [
  { id: 1, city: "Kathmandu", province: "Bagmati", name: "Tribhuvan University", type: "university", lat: 27.7172, lng: 85.3240 },
  { id: 2, city: "Kathmandu", province: "Bagmati", name: "St. Xavier's College", type: "college", lat: 27.7140, lng: 85.3200 },
  { id: 3, city: "Lalitpur", province: "Bagmati", name: "KIST Medical College", type: "college", lat: 27.6588, lng: 85.3240 },
  { id: 4, city: "Pokhara", province: "Gandaki", name: "Gandaki Boarding School", type: "secondary", lat: 28.2096, lng: 83.9856 },
  { id: 5, city: "Chitwan", province: "Bagmati", name: "Chitwan Primary School", type: "primary", lat: 27.6833, lng: 84.4333 },
];

export const healthRecommendations = {
  good: {
    title: "Air Quality is Good",
    description: "Air quality is satisfactory, and air pollution poses little or no risk.",
    actions: [
      "Enjoy outdoor activities",
      "Open windows for ventilation",
      "Normal activities can proceed"
    ]
  },
  moderate: {
    title: "Air Quality is Moderate",
    description: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
    actions: [
      "Unusually sensitive people should reduce heavy outdoor exertion",
      "Children and older adults can play outside",
      "Consider reducing outdoor exercise if you experience symptoms"
    ]
  },
  unhealthySensitive: {
    title: "Air Quality is Unhealthy for Sensitive Groups",
    description: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
    actions: [
      "Children, older adults, and those with respiratory issues should limit outdoor activities",
      "Sensitive individuals should stay indoors when possible",
      "Avoid outdoor exercise and stay in well-ventilated areas"
    ]
  },
  unhealthy: {
    title: "Air Quality is Unhealthy",
    description: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
    actions: [
      "Everyone should reduce outdoor activities",
      "Wear a mask if you must go outside",
      "Use air purifiers indoors",
      "Keep doors and windows closed"
    ]
  },
  veryUnhealthy: {
    title: "Air Quality is Very Unhealthy",
    description: "Health alert: everyone may experience more serious health effects.",
    actions: [
      "Avoid all outdoor activities",
      "Stay indoors and use air purifiers",
      "Close all windows and doors",
      "Wear N95 masks if you must go outside",
      "Monitor symptoms and seek medical help if needed"
    ]
  },
  hazardous: {
    title: "Air Quality is Hazardous",
    description: "Health warning of emergency conditions. The entire population is more likely to be affected.",
    actions: [
      "Stay indoors at all times",
      "Use HEPA air purifiers",
      "Close all windows and doors",
      "Avoid any outdoor activities",
      "Wear high-quality masks if you must go outside",
      "Seek medical attention if you experience breathing difficulties"
    ]
  }
};

