export interface AreaLocation {
  name: string;
  lat: number;
  lng: number;
  zone: string;
}

export const hyderabadAreas: AreaLocation[] = [
  { name: 'Madhapur Tech Park', lat: 17.4600, lng: 78.3500, zone: 'West Hyderabad' },
  { name: 'Patancheru', lat: 17.5273, lng: 78.2646, zone: 'Northwest Hyderabad' },
  { name: 'Jeedimetla', lat: 17.5137, lng: 78.3924, zone: 'North Hyderabad' },
  { name: 'Shamshabad', lat: 17.2543, lng: 78.4297, zone: 'South Hyderabad' },
  { name: 'Gachibowli Junction', lat: 17.4447, lng: 78.3483, zone: 'West Hyderabad' },
  { name: 'HITEC City Phase 2', lat: 17.4344, lng: 78.3844, zone: 'West Hyderabad' },
  { name: 'Kukatpally Housing Board', lat: 17.4933, lng: 78.3914, zone: 'North Hyderabad' },
  { name: 'Ameerpet Metro', lat: 17.4486, lng: 78.4468, zone: 'Central Hyderabad' },
  { name: 'Secunderabad Station', lat: 17.4435, lng: 78.4983, zone: 'East Hyderabad' },
  { name: 'Charminar Area', lat: 17.4065, lng: 78.4772, zone: 'Old City' },
  { name: 'Mehdipatnam Rythu Bazar', lat: 17.4121, lng: 78.4321, zone: 'Central Hyderabad' },
  { name: 'Malakpet Market', lat: 17.3989, lng: 78.5012, zone: 'East Hyderabad' },
  { name: 'Koti Market', lat: 17.3850, lng: 78.4867, zone: 'Central Hyderabad' },
  { name: 'Punjagutta Flyover', lat: 17.4375, lng: 78.4482, zone: 'Central Hyderabad' },
  { name: 'Banjara Hills Rd 12', lat: 17.4239, lng: 78.4519, zone: 'Central Hyderabad' },
  { name: 'Old City Chowmahalla', lat: 17.3616, lng: 78.4747, zone: 'Old City' },
  { name: 'Masab Tank', lat: 17.3700, lng: 78.4500, zone: 'Central Hyderabad' },
  { name: 'Balanagar Industrial', lat: 17.4800, lng: 78.4200, zone: 'North Hyderabad' },
  { name: 'Uppal Ring Road', lat: 17.4100, lng: 78.5200, zone: 'East Hyderabad' },
];

const wasteTypes = ['Plastic Waste', 'Organic Waste', 'Construction Debris', 'Industrial Waste', 'Mixed Waste'];
const severities = ['Low', 'Medium', 'High', 'Critical'];
const environmentalImpacts = ['Minimal', 'Moderate', 'Significant', 'Severe', 'Critical'];

const actionsByType: Record<string, string[]> = {
  'Plastic Waste': [
    'Deploy plastic collection bins',
    'Initiate recycling program',
    'Schedule bi-weekly pickup',
    'Community awareness campaign',
  ],
  'Organic Waste': [
    'Set up composting units',
    'Increase collection frequency',
    'Install biogas digester',
    'Monitor decomposition levels',
  ],
  'Construction Debris': [
    'Arrange heavy machinery pickup',
    'Coordinate with demolition contractors',
    'Enforce dumping regulations',
    'Install surveillance cameras',
  ],
  'Industrial Waste': [
    'Contact hazardous waste handler',
    'Report to pollution control board',
    'Restrict area access',
    'Emergency containment protocol',
  ],
  'Mixed Waste': [
    'Segregation at source required',
    'Deploy additional collection trucks',
    'Increase monitoring frequency',
    'Community cleanup drive',
  ],
};

export interface AnalysisResult {
  waste_type: string;
  severity: string;
  confidence: number;
  estimated_volume: string;
  risk_score: number;
  risk_category: string;
  environmental_impact: string;
  estimated_cost: number;
  recommended_actions: string[];
}

export function simulateAnalysis(_areaName: string): AnalysisResult {
  const wasteType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
  const severityIdx = Math.floor(Math.random() * severities.length);
  const severity = severities[severityIdx];
  const confidence = Math.round(85 + Math.random() * 14);
  const riskScore = Math.round(40 + Math.random() * 55);
  const riskCategory = riskScore >= 75 ? 'High' : riskScore >= 50 ? 'Medium' : 'Low';
  const envImpact = environmentalImpacts[Math.min(severityIdx, environmentalImpacts.length - 1)];

  const volumes = ['0.5 Tons', '1.2 Tons', '1.8 Tons', '2.4 Tons', '3.1 Tons', '0.8 Tons', '1.5 Tons', '2.0 Tons'];
  const estimatedVolume = volumes[Math.floor(Math.random() * volumes.length)];

  const baseCost = 15000 + Math.floor(Math.random() * 45000);
  const estimatedCost = Math.round(baseCost / 1000) * 1000;

  const actions = actionsByType[wasteType] || actionsByType['Mixed Waste'];

  return {
    waste_type: wasteType,
    severity,
    confidence,
    estimated_volume: estimatedVolume,
    risk_score: riskScore,
    risk_category: riskCategory,
    environmental_impact: envImpact,
    estimated_cost: estimatedCost,
    recommended_actions: actions,
  };
}
