export interface Hotspot {
  id: number;
  lat: number;
  lng: number;
  name: string;
  risk_score: number;
  garbage_percentage: number;
  status: string;
  severity: string;
  cleanliness_score?: number;
  active_dump_sites?: number;
  dominant_waste_type?: string;
  last_updated?: string;
}

export interface AreaDetails {
  area_name: string;
  cleanliness_score: number;
  garbage_concentration: number;
  risk_score: number;
  risk_category: string;
  active_dump_sites: number;
  dominant_waste_type: string;
  last_updated: string;
}

export interface ForecastData {
  today_risk: number;
  three_day_risk: number;
  seven_day_risk: number;
  confidence: number;
  trend: TrendPoint[];
}

export interface TrendPoint {
  day: string;
  risk: number;
}

export interface ImpactData {
  estimated_waste_volume: string;
  labor_cost: number;
  transport_cost: number;
  cleanup_cost: number;
  total_cost: number;
  environmental_risk: string;
  monthly_impact: string;
}

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  risk_reduction: number;
  cost_savings: number;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface VerificationData {
  area_name: string;
  before_image: string;
  after_image: string;
  cleanup_success: number;
  verification_status: string;
  cleanup_date: string;
  risk_before: number;
  risk_after: number;
  waste_type: string;
  dump_site_status: string;
  waste_removed: string;
  cost_savings: number;
  environmental_recovery: number;
  timeline: VerificationTimelineEvent[];
}

export interface VerificationTimelineEvent {
  date: string;
  title: string;
  type: 'detection' | 'analysis' | 'assignment' | 'cleanup' | 'verification';
}

export interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  type: 'dumping' | 'risk' | 'recommendation' | 'cleanup' | 'alert';
}

export interface ScanResult {
  id: string;
  image_url: string;
  image_file: File | null;
  area_name: string;
  area_lat: number;
  area_lng: number;
  waste_type: string;
  severity: string;
  confidence: number;
  estimated_volume: string;
  risk_score: number;
  risk_category: string;
  environmental_impact: string;
  estimated_cost: number;
  recommended_actions: string[];
  scan_date: string;
}
