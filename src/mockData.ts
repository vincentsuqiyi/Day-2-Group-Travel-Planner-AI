/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TripPlan, PlaceRecommendation, FamilyOrGroupMember, AdminDashboardState } from './types';

// Group members for the default Disneyland & Tokyo Group Trip
export const mockGroupMembers: FamilyOrGroupMember[] = [
  {
    id: 'm1',
    name: 'Vincent (You)',
    role: 'Planner',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    budgetLimit: 2500,
    dietaryPreferences: ['None'],
    mobilityNeeds: 'None',
    interests: ['Theme Parks', 'Technology', 'Ramen', 'Shopping']
  },
  {
    id: 'm2',
    name: 'Grandma Sarah',
    role: 'Traveler',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    budgetLimit: 3000,
    dietaryPreferences: ['Low Sodium', 'Gluten-free'],
    mobilityNeeds: 'Wheelchair',
    interests: ['Gardens', 'Traditional Food', 'Sightseeing']
  },
  {
    id: 'm3',
    name: 'Chloe (Age 8)',
    role: 'Traveler',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    budgetLimit: 1500,
    dietaryPreferences: ['Peanut Allergy'],
    mobilityNeeds: 'Stroller',
    interests: ['Disneyland', 'Ice Cream', 'Cute Character Cafes']
  },
  {
    id: 'm4',
    name: 'Uncle David',
    role: 'Traveler',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    budgetLimit: 2000,
    dietaryPreferences: ['None'],
    mobilityNeeds: 'None',
    interests: ['Anime', 'Hiking', 'Sub-group Adventure', 'Arcades']
  }
];

// Rich individual recommendations used in the Tokyo trip
export const mockPlaces: PlaceRecommendation[] = [
  {
    id: 'place_hotel_maimai',
    name: 'The Tokyo Station Hotel Prestige',
    category: 'Hotel',
    rating: 4.8,
    ratingCount: 540,
    costEstimate: 320, // slightly higher to support "above budget" recommendation logic
    description: 'A luxurious historical estate directly mapped to Tokyo Station, offering fully step-free suite entrances and top-tier custom assistance services.',
    location: 'Marunouchi, Tokyo',
    mobilityFriendly: true,
    tags: ['Accessible Suite', 'Elevator', 'Luxury', 'Central Location'],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&h=400&q=80',
    safetyWarnings: [
      'Disclaimers: Severe luggage congestion at main station exit during peak morning hours (8:00 AM - 9:30 AM). Safe pathway exits are fully marked.'
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Alex Mercer',
        rating: 5,
        text: 'The absolute gold standard for accessibility. Grandma Sarah was in a wheelchair and staff navigated us through private step-free entry lines with great care.',
        date: '2026-05-15',
        isRecent: true,
        sentiment: 'positive'
      },
      {
        id: 'r2',
        author: 'Kenji Sato',
        rating: 5,
        text: 'Recent remodel made every floor wheelchair-accessible. Very wide doors, spacious bathrooms, helpful staff. Excellent central base!',
        date: '2026-05-10',
        isRecent: true,
        sentiment: 'positive'
      },
      {
        id: 'r3',
        author: 'Clara Oswald',
        rating: 4,
        text: 'Historical vibe is brilliant. Beautiful breakfast buffet. One minor issue: the old elevators are sometimes slow during checkout hours.',
        date: '2025-11-20',
        isRecent: false,
        sentiment: 'positive'
      },
      {
        id: 'r4',
        author: 'Julian Finch',
        rating: 3,
        text: 'Very expensive, and older wing feels a bit cramped. The service was polite but we had to wait 25 minutes for our heavy luggage storage transfer.',
        date: '2025-08-15',
        isRecent: false,
        sentiment: 'negative'
      }
    ],
    trendAnalysis: {
      recentRatingAvg: 5.0,
      olderRatingAvg: 3.5,
      recentConsensus: 'Consensus shifting strongly Positive! Recent 2026 renovations completely resolved older corridor accessibility bottleneck issues. High-value hotel choice for senior group members.',
      positiveKeywords: ['accessible', 'remodel', 'central', 'step-free', 'historical', 'staff'],
      negativeKeywords: ['cramped', 'slow', 'slow elevators', 'heavy luggage'],
      recentReviewsCount: 2,
      olderReviewsCount: 2
    },
    alternatives: ['place_hotel_alt_shibuya', 'place_hotel_alt_apa']
  },
  {
    id: 'place_hotel_alt_shibuya',
    name: 'Shibuya Excel Hotel Tokyu',
    category: 'Hotel',
    rating: 4.6,
    ratingCount: 310,
    costEstimate: 210, // within budget option
    description: 'Perfect overlooking Shibuya Crossing. High-accessibility rooms available upon direct email booking, with step-free pavement paths to the main Shibuya hub.',
    location: 'Shibuya, Tokyo',
    mobilityFriendly: true,
    tags: ['Accessible Paths', 'Shibuya View', 'Mid-scale Budget'],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&h=400&q=80',
    reviews: [
      {
        id: 'r_shib_1',
        author: 'Maria Hill',
        rating: 5,
        text: 'Fantastic views, direct barrier-free station gate connection. Best rate we found.',
        date: '2026-04-20',
        isRecent: true,
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'place_hotel_alt_apa',
    name: 'APA Hotel & Resort Tokyo Bay',
    category: 'Hotel',
    rating: 4.1,
    ratingCount: 920,
    costEstimate: 110, // economy budget option
    description: 'High-density modern lodging nearby Tokyo Disneyland. Small rooms but extremely cost-effective and features a public accessible hot spring.',
    location: 'Chiba Coastline, Tokyo',
    mobilityFriendly: false,
    tags: ['Economy', 'Near Disneyland', 'Ocean Views'],
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&h=400&q=80',
    reviews: [
      {
        id: 'r_apa_1',
        author: 'Robert G.',
        rating: 4,
        text: 'Rooms are extremely tight, barely enough space to open a suitcase. For Disneyland on a budget, it’s unmatched though.',
        date: '2026-05-01',
        isRecent: true,
        sentiment: 'neutral'
      }
    ]
  },
  {
    id: 'place_disneyland',
    name: 'Tokyo Disneyland Park',
    category: 'Attraction',
    rating: 4.9,
    ratingCount: 2450,
    costEstimate: 85,
    description: 'An iconic resort implementing extensive, superb accessibility plans. They offer specialized Guest Assistance cards allowing wheelchair guests to queue virtually for all rides.',
    location: 'Urayasu, Chiba (Tokyo Suburb)',
    mobilityFriendly: true,
    tags: ['Theme Park', 'Kid Friendly', 'Wheelchair Guest Card', 'Crowd management'],
    imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&h=400&q=80',
    safetyWarnings: [
      'Disclaimer: Helicopter rides and ferry paths to the park can fluctuate or be postponed due to high maritime winds.',
      'Alert: Extreme afternoon heat warnings on outdoor concrete squares; recommend indoor sit-down theater passes during 1:00 PM - 3:00 PM.'
    ],
    reviews: [
      {
        id: 'dis_1',
        author: 'Emily Watson',
        rating: 5,
        text: 'Incredible! The Guest Assistance Pass is a blessing. We got to wait for Space Mountain virtually while Grandma rested in the air-conditioned theater. Chloe had the time of her life!',
        date: '2026-05-18',
        isRecent: true,
        sentiment: 'positive'
      },
      {
        id: 'dis_2',
        author: 'Takahiro Mori',
        rating: 5,
        text: 'Very wheelchair-accessible. Flat terrain, wonderful food counters with allergen lists printed clearly. Staff are extremely friendly.',
        date: '2026-04-29',
        isRecent: true,
        sentiment: 'positive'
      },
      {
        id: 'dis_3',
        author: 'Sarah Jenkins',
        rating: 4,
        text: 'Crowds are immense. If you don’t book Premier Access passes early morning, you will queue for hours. We struggled with strollers near Fantasyland during parade shifts.',
        date: '2025-10-15',
        isRecent: false,
        sentiment: 'neutral'
      },
      {
        id: 'dis_4',
        author: 'Brian Fox',
        rating: 2,
        text: 'Overcrowded and impossible. We tried to get wheelchair stroller spaces for the castle show but general public completely blocked views. Disappointing security flow.',
        date: '2025-09-02',
        isRecent: false,
        sentiment: 'negative'
      }
    ],
    trendAnalysis: {
      recentRatingAvg: 5.0,
      olderRatingAvg: 3.0,
      recentConsensus: 'Consensus is heavily Positive following the 2026 introduction of expanded Guest Assistance booking protocols! System permits seamless coordination of mixed-mobility groups.',
      positiveKeywords: ['Guest Assistance', 'allergens', 'wheelchair', 'Chloe', 'Premier Access'],
      negativeKeywords: ['immense crowds', 'blocked views', 'stroller struggle'],
      recentReviewsCount: 2,
      olderReviewsCount: 2
    },
    alternatives: ['place_shibuya_sky', 'place_disneysea']
  },
  {
    id: 'place_disneysea',
    name: 'Tokyo DisneySea Resort',
    category: 'Attraction',
    rating: 4.8,
    ratingCount: 1890,
    costEstimate: 85,
    description: 'The unique maritime-themed park with spectacular visual design. Highly accessible but slightly steep bridges around Mediterranean Harbor.',
    location: 'Urayasu, Chiba',
    mobilityFriendly: true,
    tags: ['Theme Park', 'Scenic Waterways', 'Highly Rated'],
    imageUrl: 'https://images.unsplash.com/photo-1545232979-8bf34eb9757b?auto=format&fit=crop&w=600&h=400&q=80',
    reviews: [
      {
        id: 'ds_1',
        author: 'Yume Chan',
        rating: 5,
        text: 'Absolutely enchanting. Truly the best theme park in the world for adults and youngsters alike.',
        date: '2026-05-02',
        isRecent: true,
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'place_shibuya_sky',
    name: 'Shibuya Sky Observation Deck',
    category: 'Attraction',
    rating: 4.7,
    ratingCount: 1100,
    costEstimate: 18,
    description: 'Roof deck sky view of the entire Kanto plain and Mount Fuji. Stunning escalators and accessible glass viewing slots.',
    location: 'Shibuya, Tokyo',
    mobilityFriendly: true,
    tags: ['Scenic Views', 'Sunset Photo', 'Elevator Access'],
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&h=400&q=80',
    reviews: [
      {
        id: 'ss_1',
        author: 'Hiro S.',
        rating: 5,
        text: 'Must see at sunset. Wind can get cold, wheelchairs get priority access to safety screens.',
        date: '2026-05-01',
        isRecent: true,
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'place_shinjuku_gyoen',
    name: 'Shinjuku Gyoen National Garden',
    category: 'Attraction',
    rating: 4.7,
    ratingCount: 890,
    costEstimate: 5,
    description: 'A serene mix of French-formal, English-landscape, and traditional Japanese style gardens. Beautiful, peaceful oasis.',
    location: 'Shinjuku, Tokyo',
    mobilityFriendly: true,
    tags: ['Nature', 'Senior-friendly', 'Accessible Paths', 'Relaxing'],
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&h=400&q=80',
    reviews: [
      {
        id: 's_gyo_1',
        author: 'David L.',
        rating: 5,
        text: 'Peaceful strolls. Gravel paths are well-compacted, very easy for wheelchairs or strollers to roll along. Excellent rest spots.',
        date: '2026-05-14',
        isRecent: true,
        sentiment: 'positive'
      }
    ]
  },
  {
    id: 'place_food_ippudo',
    name: 'Ippudo Ramen Roppongi (Allergen-conscious)',
    category: 'Food',
    rating: 4.5,
    ratingCount: 420,
    costEstimate: 15,
    description: 'A famous ramen chain specializing in tonkotsu. This flagship branch offers English tablet ordering with comprehensive allergen grids and customizable noodle firmness.',
    location: 'Roppongi, Tokyo',
    mobilityFriendly: true,
    tags: ['Ramen', 'Allergen Grid Available', 'Casual', 'English Menu'],
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&h=400&q=80',
    reviews: [
      {
        id: 'r_ram_1',
        author: 'Marcus Aurelius',
        rating: 5,
        text: 'Tablet specifies peanut-safety perfectly for Chloe. High stools, but the back tables are wheelchair roll-in friendly if you specify priority seating.',
        date: '2026-05-19',
        isRecent: true,
        sentiment: 'positive'
      }
    ],
    trendAnalysis: {
      recentRatingAvg: 4.8,
      olderRatingAvg: 4.2,
      recentConsensus: 'Positive consensus on safety! Clear allergen guides and flexible custom ordering seating made this highly popular for mixed-need families.',
      positiveKeywords: ['allergen', 'tablet', 'wheelchair roll-in', 'Chloe', 'custom'],
      negativeKeywords: ['high stools', 'long waits'],
      recentReviewsCount: 1,
      olderReviewsCount: 1
    }
  },
  {
    id: 'place_adventure_mtfuji',
    name: 'Mount Fuji Explorer Tour (Private Safe Van)',
    category: 'Adventure',
    rating: 4.6,
    ratingCount: 190,
    costEstimate: 140, // standard adventure
    description: 'Private tour van customized with hydraulic lift access options, running safely from Tokyo limits up to Mount Fuji Fifth Station and peaceful Lake Kawaguchiko scenic viewpoints.',
    location: 'Yamanashi Area',
    mobilityFriendly: true,
    tags: ['Fuji View', 'Special Access Van', 'All Ages', 'Private Transport'],
    imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=600&h=400&q=80',
    safetyWarnings: [
      'Disclaimers: Mount Fuji high-altitude roads are regularly blocked due to dense mountain fog or sudden ice sheets. Guide coordinates alternate itinerary valleys seamlessly at short notice.',
      'Accessibility: Hydraulic back lift accommodates standard heavy wheelchairs up to 300 lbs safely.'
    ],
    reviews: [
      {
        id: 'rfuji_1',
        author: 'Robert Sterling',
        rating: 5,
        text: 'The wheelchair-equipped sprinter van was magnificent. Grandma Sarah did not feel any road vibrations and had absolute floor-to-ceiling panoramic views of Mt Fuji of the highest resolution.',
        date: '2026-05-11',
        isRecent: true,
        sentiment: 'positive'
      },
      {
        id: 'rfuji_2',
        author: 'Yoko T.',
        rating: 4,
        text: 'Slightly windy on the observation platforms but completely worth the cost. Safe speed!',
        date: '2026-04-20',
        isRecent: true,
        sentiment: 'positive'
      }
    ]
  }
];

// Combine into mock trip list
export const mockTrips: TripPlan[] = [
  {
    id: 'trip_tokyo_disney_2026',
    destination: 'Japan (Tokyo & Disneyland)',
    startDate: '2026-06-15',
    endDate: '2026-06-22',
    totalBudget: 8000,
    groupMembers: mockGroupMembers,
    templatesAnonymized: true,
    alerts: [
      {
        id: 'a1',
        type: 'Notice',
        message: 'Disneyland Park tickets require verified reservation slots. Fully confirmed via our portal!',
        severity: 'Info'
      },
      {
        id: 'a2',
        type: 'Weather',
        message: 'Disneyland Helicopter tours are subject to gusty shoreline wind factors. Alternatives are prepared! Weather reports will stream to your dashboard live.',
        severity: 'Warning'
      }
    ],
    polls: [
      {
        id: 'poll_subgroup_day3',
        question: 'Day 3 Afternoon Sub-Group Split Recommendation:',
        status: 'Open',
        options: [
          {
            id: 'opt1',
            name: 'Subgroup A: Grandma Sarah & Chloe (Serene Gardens + Cafe Tour)',
            votes: ['m2', 'm3']
          },
          {
            id: 'opt2',
            name: 'Subgroup B: Vincent & David (Sub-group Adventure Arcades + Ramen Quest)',
            votes: ['m1', 'm4']
          }
        ]
      },
      {
        id: 'poll_hotel_vote',
        question: 'Confirm Group Hotel Accommodation Choice:',
        status: 'Closed',
        options: [
          {
            id: 'opt_station',
            name: 'The Tokyo Station Hotel Prestige (Premium Accessibility Upgrade, slightly above budget)',
            votes: ['m1', 'm2', 'm3']
          },
          {
            id: 'opt_shibuya',
            name: 'Shibuya Excel Hotel Tokyu (Standard Option, within budget)',
            votes: ['m4']
          }
        ]
      }
    ],
    bookings: [
      {
        id: 'book_flight',
        type: 'Flight',
        provider: 'ANA Airlines (Allergy/Wheelchair Assured)',
        totalCost: 3200,
        status: 'Paid',
        supplierCommissionPercent: 4.5,
        accessibilityFeatures: 'Pre-boarding assistance, priority wheelchair loading, certified peanut-free zone seating.',
        paymentSplit: {
          m1: { amount: 800, paid: true },
          m2: { amount: 800, paid: true },
          m3: { amount: 800, paid: true },
          m4: { amount: 800, paid: true }
        }
      },
      {
        id: 'book_hotel',
        type: 'Hotel',
        provider: 'The Tokyo Station Hotel Prestige',
        totalCost: 2240, // 7 nights
        status: 'Paid',
        supplierCommissionPercent: 8.0,
        accessibilityFeatures: 'Double roll-in accessible shower suites with grab rails, step-free direct lobby pavement.',
        paymentSplit: {
          m1: { amount: 560, paid: true },
          m2: { amount: 1120, paid: true }, // Grandma covering a larger share of the suite upgrade
          m3: { amount: 0, paid: true },
          m4: { amount: 560, paid: true }
        }
      },
      {
        id: 'book_wheelchair_van',
        type: 'Special Vehicle',
        provider: 'Toyota WelCab Private Transport Co.',
        totalCost: 650,
        status: 'Pending',
        supplierCommissionPercent: 12.0,
        accessibilityFeatures: 'Hydraulic ramp back entry, 4 floor locked harness systems for secure heavy wheelchair transport.',
        paymentSplit: {
          m1: { amount: 200, paid: true },
          m2: { amount: 250, paid: false },
          m3: { amount: 0, paid: true },
          m4: { amount: 200, paid: false } // David and Grandma still need to pay their split!
        }
      },
      {
        id: 'book_insurance',
        type: 'Insurance',
        provider: 'Allianz Global Care Access Plus',
        totalCost: 350,
        status: 'Pending',
        supplierCommissionPercent: 15.0,
        accessibilityFeatures: 'Full emergency evacuation and pre-existing condition senior flight coverage.',
        paymentSplit: {
          m1: { amount: 80, paid: false },
          m2: { amount: 110, paid: false },
          m3: { amount: 80, paid: false },
          m4: { amount: 80, paid: false }
        }
      }
    ],
    itinerary: [
      {
        dayIndex: 1,
        date: '2026-06-15',
        items: [
          {
            id: 'day1_item1',
            timeSlot: 'Morning',
            place: mockPlaces[0], // Tokyo Station Hotel check-in
            notes: 'Roll-in shower room request confirmed. Front desk will inspect stroller paths.',
            status: 'Confirmed'
          },
          {
            id: 'day1_item2',
            timeSlot: 'Afternoon',
            place: mockPlaces.find(p => p.id === 'place_shinjuku_gyoen') || mockPlaces[5],
            notes: 'Leisurely stroll along compacted gravel paths. Senior friendly and relaxing.',
            status: 'Confirmed'
          },
          {
            id: 'day1_item3',
            timeSlot: 'Evening',
            place: mockPlaces.find(p => p.id === 'place_food_ippudo') || mockPlaces[6],
            notes: ' Vincent to verify peanut allergy grid printed tablet is configured.',
            status: 'Draft'
          }
        ]
      },
      {
        dayIndex: 2,
        date: '2026-06-16',
        items: [
          {
            id: 'day2_item1',
            timeSlot: 'Morning',
            place: mockPlaces.find(p => p.id === 'place_disneyland') || mockPlaces[1],
            notes: 'Arrive early at Disneyland! Pick up the Guest Assistance Card at main gate security.',
            status: 'Draft',
            assignedSubGroups: ['m1', 'm2', 'm3', 'm4']
          },
          {
            id: 'day2_item2',
            timeSlot: 'Afternoon',
            place: mockPlaces.find(p => p.id === 'place_disneyland') || mockPlaces[1],
            notes: 'Subgroup A (Sarah/Chloe) rests at theater show. Subgroup B (Vincent/David) fast tracks rides.',
            status: 'Draft',
            assignedSubGroups: ['m1', 'm4'] // Only Vincent and Uncle David active
          }
        ]
      },
      {
        dayIndex: 3,
        date: '2026-06-17',
        items: [
          {
            id: 'day3_item1',
            timeSlot: 'Morning',
            place: mockPlaces.find(p => p.id === 'place_adventure_mtfuji') || mockPlaces[7],
            notes: 'Fuji Safe Private WelCab Tour. Lift locks Grandmother directly in the secure central seats.',
            status: 'Draft'
          }
        ]
      }
    ]
  }
];

// Rich insights for administrative management dashboard
export const mockAdminState: AdminDashboardState = {
  popularDestinations: [
    { name: 'Tokyo & Disneyland, Japan', bookingsCount: 1420, revenueGenerated: 340900, itinerarySaves: 4890, growthTrend: 18.4 },
    { name: 'Kyoto Cultural Heritage, Japan', bookingsCount: 890, revenueGenerated: 198000, itinerarySaves: 3100, growthTrend: 12.1 },
    { name: 'California Theme Parks, USA', bookingsCount: 1150, revenueGenerated: 285000, itinerarySaves: 3900, growthTrend: 24.5 },
    { name: 'Parisian Art & Food Tour, France', bookingsCount: 710, revenueGenerated: 154000, itinerarySaves: 2400, growthTrend: -2.3 }
  ],
  frequentlyBookedHotels: [
    { name: 'The Tokyo Station Hotel Prestige （8% Comm.）', bookedCount: 380, avgRating: 4.8, commissionEarned: 27360 },
    { name: 'Shibuya Excel Hotel Tokyu （6% Comm.）', bookedCount: 290, avgRating: 4.6, commissionEarned: 14100 },
    { name: 'Disneyland Hotel Anaheim （10% Comm.）', bookedCount: 410, avgRating: 4.9, commissionEarned: 35600 },
    { name: 'APA Hotel Tokyo Bay （5% Comm.）', bookedCount: 520, avgRating: 4.1, commissionEarned: 11440 }
  ],
  trendingVendors: [
    { name: 'Oriental Land Co. (Tokyo Disneyland operator)', type: 'Attraction & Dining', currentBookings: 850, partnershipLevel: 'Preferred', predictiveDemandScore: 94, nextNegotiationDate: '2026-08-01' },
    { name: 'Toyota WelCab Vehicle Division', type: 'Special Accessibility Transport', currentBookings: 320, partnershipLevel: 'Preferred', predictiveDemandScore: 88, nextNegotiationDate: '2026-07-15' },
    { name: 'Allianz Global Care', type: 'Priority Group Insurance', currentBookings: 1100, partnershipLevel: 'Standard', predictiveDemandScore: 78, nextNegotiationDate: '2026-10-10' },
    { name: 'Nippon Rent-A-Car Stroller Line', type: 'Mobility Equipment Rental', currentBookings: 190, partnershipLevel: 'Prospect', predictiveDemandScore: 65, nextNegotiationDate: '2026-11-20' }
  ],
  predictiveInsights: [
    'ALERT demand surge: Tokyo Disney Resort demand is projected to spike +32% during late June 2026 due to school holidays and the new "Accessible Fairy Tale Forest" launch. Lock in another 15 WelCab Vehicles with Toyota before June 15 to secure priority commissions!',
    'Disneyland California is raising their standard affiliate park pass commission rate from 10% to 11.5% for agencies delivering more than 400 monthly bookings - currently our path is only 39 bookings away. Proactively feature Disneyland California on template recommendations.',
    'Weather Disruptions Spike Probability: Historic typhoon projections suggest 24% higher wind speeds near Tokyo Bay between June 18-22, 2026. Send early visual alert suggestions to active travelers to swap outdoor bays with indoor Tokyo Skytree tickets ahead of peak pricing shifts.'
  ]
};
