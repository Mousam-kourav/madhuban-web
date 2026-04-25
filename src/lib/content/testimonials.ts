export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  location: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'nikhil-acharya',
    author: 'Nikhil Acharya',
    location: 'Madhya Pradesh',
    quote: `Overall a good experience of calm & peaceful stay. Nice staff, services are prompt. Food freshly cooked and served. Blend of modern & forest stay amenities. Away from city's chaos yet connected with it. Staff is well trained and their behavior was welcoming. They gave guided tour to property as well. Taking care of small needs during stay was well handled. Pool was clean and maintained. Best part is - Fully vegetarian & no alcohol zone.`,
  },
  {
    id: 'shubhobroto-ghosh',
    author: 'Shubhobroto Ghosh',
    location: 'New Delhi',
    quote: `Grand experience. Resort staff are polite and helpful. Surroundings are beautiful. Thoroughly enjoyable. We saw many animals, including a variety of birds. Among birds, Ashy Prinias and Paradise Flycatchers were mesmerizing to observe. We were also able to observe a baby Fan-Throated Lizard, an animal we saw for the first time. There were wild fishes and crabs to see. We enjoyed watching dragonflies hovering like helicopters.`,
  },
  {
    id: 'gaura-joshi',
    author: 'Gaura Joshi',
    location: 'Bhopal, Madhya Pradesh',
    quote: `What a wonderful place! The location, the room, view, food, staff - everything was excellent! Would be back soon. Special thanks to Shibaji da for making the stay all the more beautiful.`,
  },
  {
    id: 'apoorva-ugarkar',
    author: 'Apoorva Ugarkar',
    location: 'Indore, Madhya Pradesh',
    quote: `The stay at Madhuban resort was very comfortable and relaxing. The staff was very friendly and caring. The food was too good. The star gazing activity was the most beautiful experience. The morning forest walk was refreshing. The overall experience at Madhuban resort was awesome. I would definitely like to visit this place again.`,
  },
  {
    id: 'alok-shrivastava',
    author: 'Alok Shrivastava',
    location: 'Bhopal, Madhya Pradesh',
    quote: `We all from defence service came to Madhuban for a picnic today. The property is ideally suited for large gatherings of 150-200 persons. They have attractions for all age groups. The staff were very courteous and prompt in service. We had a great day outing. Food was awesome, and the place was offered in a spic and span condition. Must-visit place for nature lovers.`,
  },
  {
    id: 'poonam-acharekar',
    author: 'Poonam Acharekar',
    location: 'Mumbai, Maharashtra',
    quote: `I recently stayed at Madhuban Resort by Somaiya, and it was truly a magical experience! Nestled in the heart of the jungle (specifically surrounded by Ratapani Wildlife Sanctuary & Tiger Reserve), the resort offers an incredible blend of adventure and tranquility. From the moment we arrived, the Manager Mr. Shibaji and the rest of the staff were warm, welcoming, and attentive, making us feel right at home.`,
  },
] as const;
