/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// User & Group Types
export interface FamilyOrGroupMember {
  id: string;
  name: string;
  role: 'Planner' | 'Traveler' | 'Manager';
  avatar: string;
  budgetLimit: number;
  dietaryPreferences: string[];
  mobilityNeeds: 'None' | 'Wheelchair' | 'Stroller' | 'Senior-friendly';
  interests: string[];
}

export interface PollOption {
  id: string;
  name: string;
  votes: string[]; // Member IDs
}

export interface GroupPoll {
  id: string;
  question: string;
  options: PollOption[];
  status: 'Open' | 'Closed';
}

// Review analysis structures
export interface PlaceReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string; // YYYY-MM-DD
  isRecent: boolean;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface ReviewTrendAnalysis {
  recentRatingAvg: number;
  olderRatingAvg: number;
  recentConsensus: string; // e.g. "Improving - smoother accessibility ramp completed"
  positiveKeywords: string[];
  negativeKeywords: string[];
  recentReviewsCount: number;
  olderReviewsCount: number;
}

// Destination and accommodation items
export interface PlaceRecommendation {
  id: string;
  name: string;
  category: 'Hotel' | 'Attraction' | 'Food' | 'Shopping' | 'Adventure';
  rating: number;
  ratingCount: number;
  costEstimate: number; // e.g. 150 (per person or total)
  description: string;
  location: string;
  mobilityFriendly: boolean;
  tags: string[];
  imageUrl: string;
  reviews: PlaceReview[];
  trendAnalysis?: ReviewTrendAnalysis;
  alternatives?: string[]; // IDs of other place recommendations that can replace this
  safetyWarnings?: string[];
}

// Daily itinerary representation
export interface ItineraryItem {
  id: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  assignedSubGroups?: string[]; // IDs of members participating (can be subset of group)
  place: PlaceRecommendation;
  notes?: string;
  status: 'Draft' | 'Confirmed' | 'Paid';
}

export interface ItineraryDay {
  dayIndex: number;
  date: string;
  items: ItineraryItem[];
}

// Booking Split details
export interface BookingItem {
  id: string;
  type: 'Flight' | 'Hotel' | 'Transport' | 'Insurance' | 'Special Vehicle';
  provider: string;
  totalCost: number;
  status: 'Pending' | 'Paid';
  paymentSplit: { [memberId: string]: { amount: number; paid: boolean } }; // memberId -> split & payment status
  supplierCommissionPercent: number; // Commission earned by the platform
  accessibilityFeatures?: string;
}

// Risk and conditions warnings
export interface SafetyAlert {
  id: string;
  type: 'Weather' | 'Security' | 'External Factors' | 'Notice';
  message: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

// The core Trip Plan holding everything
export interface TripPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  groupMembers: FamilyOrGroupMember[];
  itinerary: ItineraryDay[];
  bookings: BookingItem[];
  polls: GroupPoll[];
  alerts: SafetyAlert[];
  templatesAnonymized: boolean;
}

// Administrative backend system structures
export interface DestinationMetric {
  name: string;
  bookingsCount: number;
  revenueGenerated: number;
  itinerarySaves: number;
  growthTrend: number; // change percent
}

export interface HotelMetric {
  name: string;
  bookedCount: number;
  avgRating: number;
  commissionEarned: number;
}

export interface VendorPartnerMetric {
  name: string;
  type: string;
  currentBookings: number;
  partnershipLevel: 'Preferred' | 'Standard' | 'Prospect';
  predictiveDemandScore: number; // 0-100 score indicating Disneyland capacity or attraction hotness
  nextNegotiationDate: string;
}

export interface AdminDashboardState {
  popularDestinations: DestinationMetric[];
  frequentlyBookedHotels: HotelMetric[];
  trendingVendors: VendorPartnerMetric[];
  predictiveInsights: string[];
}
