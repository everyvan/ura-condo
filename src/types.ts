export type Region = 'CCR' | 'RCR' | 'OCR';
export type LaunchStatus = 'awarded' | 'preview' | 'upcoming';

export interface GLSSite {
  id: string;
  name: string;
  district: string;
  districtCode: string; // e.g. D21, D15, D26
  location: string;
  region: Region;
  status: LaunchStatus;
  statusLabel: string;
  developer: string;
  tenderClosingDate?: string;
  landBidPsf: number;
  breakevenPsf: number;
  indicativeLaunchPsfLow: number;
  indicativeLaunchPsfHigh: number;
  estimatedWindow: string;
  estCompletion: string;
  units: number;
  siteAreaSqm: number;
  gpr: number; // Gross Plot Ratio
  gfaSqft: number;
  marginBufferVsPeers: string;
  tagline: string;
  mrtProximity: string;
  schoolsWithin1km: string[];
  caveatBenchmarkDistrict: string;
  caveatBenchmarkAvgPsf: number;
}

export interface UraTransaction {
  id: string;
  project: string;
  district: string;
  street: string;
  type: 'New Sale' | 'Resale' | 'Sub Sale';
  tenure: string;
  date: string;
  floorLevel: string;
  areaSqft: number;
  psf: number;
  totalPrice: number;
  bedCount: number;
}

export interface SavedReport {
  id: string;
  siteName: string;
  district: string;
  landPsf: number;
  breakevenPsf: number;
  projectedPsf: string;
  dateCreated: string;
  clientTarget?: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'award' | 'caveat' | 'planning';
  description: string;
  read: boolean;
}
