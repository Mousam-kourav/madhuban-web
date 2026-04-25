export type Faq = { id: string; question: string; answer: string };

export const HOMEPAGE_FAQS: readonly Faq[] = [
  {
    id: 'location',
    question: 'Where is Madhuban Eco Retreat located?',
    answer:
      'Madhuban Eco Retreat is in Village Bori, Salkanpur Road, Rehti, Sehore district, Madhya Pradesh — 60 km from Bhopal Airport, adjacent to Ratapani Wildlife Sanctuary. The drive from Bhopal takes approximately 90 minutes.',
  },
  {
    id: 'accommodations',
    question: 'What types of accommodations are available?',
    answer:
      'Madhuban offers six accommodation types: Camping Tents (₹2,500/night), Glamping Tents (₹7,500/night), Mud House 2 (₹9,000/night), Mud House 1 with private bathtub (₹10,000/night), Safari Tents (₹12,000/night), and Pool Side Villa (₹12,000/night). All prices include GST and are per night.',
  },
  {
    id: 'cancellation',
    question: 'What is the cancellation policy?',
    answer:
      'Cancellations 7 or more days before check-in receive a 90% refund. Cancellations 3–7 days before check-in receive a 50% refund. Cancellations less than 3 days before check-in or no-shows receive no refund.',
  },
  {
    id: 'family',
    question: 'Is Madhuban Eco Retreat suitable for families with children?',
    answer:
      'Yes. The property is designed for slow travel with families in mind — featuring forest walks, bird watching, recreation areas, a pool, and family-sized accommodations. It is fully vegetarian and an alcohol-free zone, ideal for family stays.',
  },
  {
    id: 'included',
    question: 'What is included in the stay?',
    answer:
      'All stays include accommodation, breakfast, and access to forest trails, bird watching points, the swimming pool, and recreational facilities. Other meals (lunch, dinner) and guided experiences are additional.',
  },
  {
    id: 'wildlife',
    question: 'Are there wildlife safari options nearby?',
    answer:
      'Yes. Ratapani Wildlife Sanctuary is adjacent to the property and home to tigers, leopards, sloth bears, and 200+ bird species. Bhimbetka rock shelters (UNESCO heritage) are 50 km away. We can arrange guided tours upon request.',
  },
  {
    id: 'transport',
    question: 'Is the property accessible by public transport?',
    answer:
      'The nearest railway station is Bhopal Junction (60 km). The nearest airport is Raja Bhoj Airport, Bhopal (60 km). Most guests drive or arrange a private taxi. Pickup from Bhopal can be arranged on request.',
  },
  {
    id: 'corporate',
    question: 'Do you accommodate corporate offsites and large groups?',
    answer:
      'Yes. The property is suited for corporate offsites, team retreats, and groups of 150–200 persons for day outings. Pricing for corporate bookings is on enquiry basis. Contact us via the booking page or WhatsApp for tailored proposals.',
  },
] as const;
