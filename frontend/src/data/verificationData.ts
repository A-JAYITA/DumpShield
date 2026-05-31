import type { VerificationData } from '../types';

function getSatelliteUrl(lat: number, lng: number, zoom: number = 15): string {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`;
}

interface HotspotCoords {
  lat: number;
  lng: number;
}

const hotspotCoords: Record<string, HotspotCoords> = {
  'Gachibowli Junction': { lat: 17.4447, lng: 78.3483 },
  'Charminar Area': { lat: 17.4065, lng: 78.4772 },
  'Ameerpet Metro': { lat: 17.4486, lng: 78.4468 },
  'Koti Market': { lat: 17.3850, lng: 78.4867 },
  'Punjagutta Flyover': { lat: 17.4375, lng: 78.4482 },
  'Banjara Hills Rd 12': { lat: 17.4239, lng: 78.4519 },
  'Kukatpally Housing Board': { lat: 17.4933, lng: 78.3914 },
  'Old City Chowmahalla': { lat: 17.3616, lng: 78.4747 },
  'Secunderabad Station': { lat: 17.4435, lng: 78.4983 },
  'HITEC City Phase 2': { lat: 17.4344, lng: 78.3844 },
  'Mehdipatnam Rythu Bazar': { lat: 17.4121, lng: 78.4321 },
  'Malakpet Market': { lat: 17.3989, lng: 78.5012 },
  'Madhapur Tech Park': { lat: 17.4600, lng: 78.3500 },
  'Masab Tank': { lat: 17.3700, lng: 78.4500 },
  'Balanagar Industrial': { lat: 17.4800, lng: 78.4200 },
  'Uppal Ring Road': { lat: 17.4100, lng: 78.5200 },
};

interface AreaConfig {
  riskBefore: number;
  riskAfter: number;
  wasteType: string;
  dumpStatus: string;
  wasteRemoved: string;
  costSavings: number;
  envRecovery: number;
  cleanupSuccess: number;
  verificationStatus: string;
  cleanupDate: string;
  timeline: { date: string; title: string; type: string }[];
}

const areaConfigs: Record<string, AreaConfig> = {
  'Gachibowli Junction': {
    riskBefore: 85, riskAfter: 28, wasteType: 'Construction Debris',
    dumpStatus: 'Illegal Dumping Detected', wasteRemoved: '2.1 Tons',
    costSavings: 28000, envRecovery: 88, cleanupSuccess: 91,
    verificationStatus: 'Verified', cleanupDate: '2026-05-18',
    timeline: [
      { date: 'May 10', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 11', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 13', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 17', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 18', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Charminar Area': {
    riskBefore: 65, riskAfter: 35, wasteType: 'Mixed Waste',
    dumpStatus: 'Active Dumping Zone', wasteRemoved: '1.4 Tons',
    costSavings: 18000, envRecovery: 72, cleanupSuccess: 78,
    verificationStatus: 'Pending', cleanupDate: '2026-05-25',
    timeline: [
      { date: 'May 12', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 13', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 15', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 24', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 25', title: 'Verification Pending', type: 'verification' },
    ],
  },
  'Ameerpet Metro': {
    riskBefore: 92, riskAfter: 18, wasteType: 'Industrial Waste',
    dumpStatus: 'Critical Dumping Site', wasteRemoved: '3.2 Tons',
    costSavings: 42000, envRecovery: 93, cleanupSuccess: 95,
    verificationStatus: 'Verified', cleanupDate: '2026-05-20',
    timeline: [
      { date: 'May 8', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 9', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 10', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 19', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 20', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Koti Market': {
    riskBefore: 45, riskAfter: 12, wasteType: 'Organic Waste',
    dumpStatus: 'Minor Accumulation', wasteRemoved: '0.8 Tons',
    costSavings: 12000, envRecovery: 90, cleanupSuccess: 88,
    verificationStatus: 'Verified', cleanupDate: '2026-05-15',
    timeline: [
      { date: 'May 5', title: 'Waste Accumulation Detected', type: 'detection' },
      { date: 'May 6', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 7', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 14', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 15', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Punjagutta Flyover': {
    riskBefore: 78, riskAfter: 31, wasteType: 'Construction Debris',
    dumpStatus: 'Illegal Dumping Detected', wasteRemoved: '1.9 Tons',
    costSavings: 25000, envRecovery: 81, cleanupSuccess: 82,
    verificationStatus: 'Verified', cleanupDate: '2026-05-22',
    timeline: [
      { date: 'May 11', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 12', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 14', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 21', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 22', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Banjara Hills Rd 12': {
    riskBefore: 35, riskAfter: 8, wasteType: 'Mixed Waste',
    dumpStatus: 'Minor Accumulation', wasteRemoved: '0.5 Tons',
    costSavings: 8000, envRecovery: 96, cleanupSuccess: 94,
    verificationStatus: 'Verified', cleanupDate: '2026-05-12',
    timeline: [
      { date: 'May 2', title: 'Waste Accumulation Detected', type: 'detection' },
      { date: 'May 3', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 4', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 11', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 12', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Kukatpally Housing Board': {
    riskBefore: 88, riskAfter: 42, wasteType: 'Construction Debris',
    dumpStatus: 'Critical Dumping Site', wasteRemoved: '2.8 Tons',
    costSavings: 35000, envRecovery: 68, cleanupSuccess: 76,
    verificationStatus: 'Pending', cleanupDate: '2026-05-28',
    timeline: [
      { date: 'May 13', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 14', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 16', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 27', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 28', title: 'Verification Pending', type: 'verification' },
    ],
  },
  'Old City Chowmahalla': {
    riskBefore: 72, riskAfter: 25, wasteType: 'Organic Waste',
    dumpStatus: 'Active Dumping Zone', wasteRemoved: '1.6 Tons',
    costSavings: 21000, envRecovery: 83, cleanupSuccess: 84,
    verificationStatus: 'Verified', cleanupDate: '2026-05-19',
    timeline: [
      { date: 'May 9', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 10', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 12', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 18', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 19', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Secunderabad Station': {
    riskBefore: 95, riskAfter: 48, wasteType: 'Mixed Waste',
    dumpStatus: 'Critical Dumping Site', wasteRemoved: '3.5 Tons',
    costSavings: 45000, envRecovery: 62, cleanupSuccess: 70,
    verificationStatus: 'In Progress', cleanupDate: '2026-05-30',
    timeline: [
      { date: 'May 14', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 15', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 17', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 29', title: 'Cleanup In Progress', type: 'cleanup' },
      { date: 'May 30', title: 'Verification Pending', type: 'verification' },
    ],
  },
  'HITEC City Phase 2': {
    riskBefore: 55, riskAfter: 15, wasteType: 'Electronic Waste',
    dumpStatus: 'Minor Accumulation', wasteRemoved: '0.9 Tons',
    costSavings: 15000, envRecovery: 91, cleanupSuccess: 89,
    verificationStatus: 'Verified', cleanupDate: '2026-05-16',
    timeline: [
      { date: 'May 4', title: 'Waste Accumulation Detected', type: 'detection' },
      { date: 'May 5', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 6', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 15', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 16', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Mehdipatnam Rythu Bazar': {
    riskBefore: 82, riskAfter: 29, wasteType: 'Organic Waste',
    dumpStatus: 'Active Dumping Zone', wasteRemoved: '2.0 Tons',
    costSavings: 26000, envRecovery: 85, cleanupSuccess: 86,
    verificationStatus: 'Verified', cleanupDate: '2026-05-21',
    timeline: [
      { date: 'May 10', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 11', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 13', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 20', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 21', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Malakpet Market': {
    riskBefore: 89, riskAfter: 38, wasteType: 'Mixed Waste',
    dumpStatus: 'Critical Dumping Site', wasteRemoved: '2.5 Tons',
    costSavings: 32000, envRecovery: 74, cleanupSuccess: 79,
    verificationStatus: 'Pending', cleanupDate: '2026-05-26',
    timeline: [
      { date: 'May 12', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 13', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 15', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 25', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 26', title: 'Verification Pending', type: 'verification' },
    ],
  },
  'Madhapur Tech Park': {
    riskBefore: 40, riskAfter: 10, wasteType: 'Electronic Waste',
    dumpStatus: 'Minor Accumulation', wasteRemoved: '0.6 Tons',
    costSavings: 9500, envRecovery: 94, cleanupSuccess: 92,
    verificationStatus: 'Verified', cleanupDate: '2026-05-14',
    timeline: [
      { date: 'May 3', title: 'Waste Accumulation Detected', type: 'detection' },
      { date: 'May 4', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 5', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 13', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 14', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Masab Tank': {
    riskBefore: 70, riskAfter: 27, wasteType: 'Construction Debris',
    dumpStatus: 'Active Dumping Zone', wasteRemoved: '1.7 Tons',
    costSavings: 22000, envRecovery: 82, cleanupSuccess: 83,
    verificationStatus: 'Verified', cleanupDate: '2026-05-17',
    timeline: [
      { date: 'May 7', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 8', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 10', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 16', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 17', title: 'Verification Approved', type: 'verification' },
    ],
  },
  'Balanagar Industrial': {
    riskBefore: 98, riskAfter: 55, wasteType: 'Industrial Waste',
    dumpStatus: 'Critical Dumping Site', wasteRemoved: '4.1 Tons',
    costSavings: 52000, envRecovery: 58, cleanupSuccess: 68,
    verificationStatus: 'In Progress', cleanupDate: '2026-06-01',
    timeline: [
      { date: 'May 15', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 16', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 18', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 30', title: 'Cleanup In Progress', type: 'cleanup' },
      { date: 'Jun 01', title: 'Verification Pending', type: 'verification' },
    ],
  },
  'Uppal Ring Road': {
    riskBefore: 80, riskAfter: 32, wasteType: 'Construction Debris',
    dumpStatus: 'Illegal Dumping Detected', wasteRemoved: '2.2 Tons',
    costSavings: 29000, envRecovery: 79, cleanupSuccess: 81,
    verificationStatus: 'Verified', cleanupDate: '2026-05-23',
    timeline: [
      { date: 'May 11', title: 'Illegal Dumping Detected', type: 'detection' },
      { date: 'May 12', title: 'Risk Analysis Completed', type: 'analysis' },
      { date: 'May 14', title: 'Cleanup Assigned', type: 'assignment' },
      { date: 'May 22', title: 'Cleanup Completed', type: 'cleanup' },
      { date: 'May 23', title: 'Verification Approved', type: 'verification' },
    ],
  },
};

export function getVerificationData(areaName: string): VerificationData {
  const coords = hotspotCoords[areaName] || { lat: 17.3850, lng: 78.4867 };
  const config = areaConfigs[areaName] || areaConfigs['Koti Market'];

  const satelliteUrl = getSatelliteUrl(coords.lat, coords.lng, 16);

  return {
    area_name: areaName,
    before_image: satelliteUrl,
    after_image: satelliteUrl,
    cleanup_success: config.cleanupSuccess,
    verification_status: config.verificationStatus,
    cleanup_date: config.cleanupDate,
    risk_before: config.riskBefore,
    risk_after: config.riskAfter,
    waste_type: config.wasteType,
    dump_site_status: config.dumpStatus,
    waste_removed: config.wasteRemoved,
    cost_savings: config.costSavings,
    environmental_recovery: config.envRecovery,
    timeline: config.timeline as any,
  };
}
