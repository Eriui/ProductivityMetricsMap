/**
 * Concept map data definitions
 * Copyright (c) 2025 [Your Name]
 * MIT License
 */

// Color scheme
export const groupColors = {
  resource: "#6366F1", // Indigo
  outcome: "#14B8A6",  // Teal
  value: "#de7a22"     // Orange
};

// Data structure for all concepts
export const conceptData = [
  { 
    id: "Produktivität", group: "resource", 
    position: { x: 30, y: 35 },
    overlaps: ["Effizienz", "Capacity Utilization"]
  },
  { 
    id: "Effizienz", group: "resource", 
    position: { x: 55, y: 45 },
    overlaps: ["Produktivität", "Capacity Utilization"]
  },
  { 
    id: "Capacity Utilization", group: "resource", 
    position: { x: 45, y: 70 },
    overlaps: ["Produktivität", "Effizienz"]
  },
  { 
    id: "Wirksamkeit", group: "outcome", 
    position: { x: 155, y: 47 },
    overlaps: ["Effectiveness", "Performance"]
  },
  { 
    id: "Effectiveness", group: "outcome", 
    position: { x: 135, y: 40 },
    overlaps: ["Wirksamkeit", "Performance"]
  },
  { 
    id: "Performance", group: "outcome", 
    position: { x: 130, y: 80 },
    overlaps: ["Wirksamkeit", "Effectiveness", "Impact"]
  },
  { 
    id: "Impact", group: "value", 
    position: { x: 130, y: 115 },
    overlaps: ["Performance", "Customer Satisfaction", "Value Delivery"]
  },
  { 
    id: "Value Delivery", group: "value", 
    position: { x: 160, y: 130 },
    overlaps: ["Impact", "Customer Satisfaction"]
  },
  { 
    id: "Customer Satisfaction", group: "value", 
    position: { x: 140, y: 150 },
    overlaps: ["Impact", "Value Delivery"]
  }
];

// Ellipse position data for the three main groups
export const ellipsePositions = {
  resource: { cx: 50, cy: 50, rx: 55, ry: 38 },
  outcome: { cx: 140, cy: 60, rx: 55, ry: 40 }, 
  value: { cx: 140, cy: 132, rx: 50, ry: 40 }
};