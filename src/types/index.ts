/**
 * Type Definitions for Sales Manager Portal
 */

// Company/Client Types
export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: CompanyIndustry;
  size: CompanySize;
  logo: string | null;
  favicon: string | null;
  branding: CompanyBranding;
  features: CompanyFeatures;
  adminEmail: string;
  supportEmail: string;
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt: string | null;
  learnerCount: number;
  activeEnrollments: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  salesPerson: string;
  portalUrl: string;
}

export type CompanyIndustry =
  | 'consulting'
  | 'finance'
  | 'technology'
  | 'healthcare'
  | 'manufacturing'
  | 'retail'
  | 'education'
  | 'government'
  | 'other';

export type CompanySize =
  | 'startup'
  | 'small'
  | 'medium'
  | 'large'
  | 'enterprise';

export interface CompanyBranding {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  headerBackground: string;
  textColor: string;
  fontFamily: string;
  headingFont: string;
  buttonStyle: 'rounded' | 'pill' | 'square';
  cardStyle: 'flat' | 'elevated' | 'bordered';
  welcomeTitle: string;
  welcomeSubtitle: string;
  loginMessage: string;
  helpUrl: string | null;
  privacyUrl: string | null;
  termsUrl: string | null;
}

export interface CompanyFeatures {
  courseContent: boolean;
  quizzes: boolean;
  qubits: boolean;
  certificates: boolean;
  aiAssistant: boolean;
  studyGroups: boolean;
  forum: boolean;
  liveSessions: boolean;
  analytics: boolean;
  gamification: boolean;
  flashcards: boolean;
  mindMaps: boolean;
  focusMode: boolean;
  calendar: boolean;
  examSimulator: boolean;
  weakAreaDrills: boolean;
  progressSharing: boolean;
  leaderboards: boolean;
  customReporting: boolean;
  apiAccess: boolean;
}

// Sales Person Types
export interface SalesPerson {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: 'sales_rep' | 'sales_manager' | 'admin';
  territory: string;
  companies: string[];
  totalClients: number;
  activeClients: number;
  revenue: number;
  target: number;
  createdAt: string;
}

// Learner Types (for client management)
export interface Learner {
  id: string;
  companyId: string;
  name: string;
  email: string;
  department: string | null;
  enrolledCourses: number;
  completedCourses: number;
  progress: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

// Course Types
export interface Course {
  id: string;
  code: string;
  name: string;
  vendor: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number;
  enrollments: number;
  completionRate: number;
  rating: number;
  price: number;
  isActive: boolean;
}

// Analytics Types
export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalLearners: number;
  activeLearners: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageCompletionRate: number;
  averageNPS: number;
  newClientsThisMonth: number;
  renewalsThisMonth: number;
}

export interface ClientActivity {
  id: string;
  companyId: string;
  companyName: string;
  type: 'signup' | 'enrollment' | 'completion' | 'renewal' | 'payment' | 'support';
  description: string;
  timestamp: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

// Preset Types
export interface CompanyPreset {
  id: string;
  name: string;
  description: string;
  industry: CompanyIndustry;
  branding: CompanyBranding;
  features: CompanyFeatures;
}
