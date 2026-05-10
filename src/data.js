/**
 * Application data — podcasts, genres, and seasons.
 *
 * @principle SRP — Single Responsibility Principle:
 * This module is the single source of truth for static seed data.
 * It does not transform, render, or fetch — it only exports.
 */

/**
 * @typedef {Object} Genre
 * @property {number} id
 * @property {string} title
 */

/** @type {Genre[]} */
export const genres = [
  { id: 1, title: "Technology" },
  { id: 2, title: "Business" },
  { id: 3, title: "True Crime" },
  { id: 4, title: "Mystery" },
  { id: 5, title: "Comedy" },
  { id: 6, title: "Entertainment" },
  { id: 7, title: "Innovation" },
  { id: 8, title: "Entrepreneurship" },
  { id: 9, title: "Health" },
  { id: 10, title: "Lifestyle" },
  { id: 11, title: "History" },
  { id: 12, title: "Education" },
  { id: 13, title: "Sports" },
  { id: 14, title: "News" },
  { id: 15, title: "Science" },
  { id: 16, title: "Nature" },
];

/**
 * @typedef {Object} Season
 * @property {string} title
 * @property {string} [subtitle]
 * @property {number} episodes
 */

/**
 * @typedef {Object} Podcast
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number[]} genres
 * @property {number} seasons
 * @property {string} image  — URL or empty string (empty = render placeholder)
 * @property {string} updated
 * @property {Season[]} seasonDetails
 */

/** @type {Podcast[]} */
export const podcasts = [
  {
    id: "p1",
    title: "Tech Forward",
    description:
      "Join us every week as we dive deep into the latest technology trends, innovations, and industry insights. From artificial intelligence and machine learning to startup culture and digital transformation, we explore the forces shaping our digital future. Each episode features expert interviews, case studies, and actionable insights for professionals and enthusiasts alike.",
    seasons: 3,
    image: "",
    genres: [1, 2],
    updated: "2025-01-15T00:00:00.000Z",
    seasonDetails: [
      { title: "Season 1: Getting Started", subtitle: "Introduction to the fundamentals", episodes: 12 },
      { title: "Season 2: Advanced Topics", subtitle: "Deep dives into complex subjects", episodes: 15 },
      { title: "Season 3: Industry Insights", subtitle: "Expert perspectives and case studies", episodes: 18 },
    ],
  },
  {
    id: "p2",
    title: "The Vanishing Hour",
    description:
      "An award-winning true crime docuseries about unsolved disappearances and the families left searching for answers. Each season follows a single case from first report to present day, with original interviews and meticulous research.",
    seasons: 5,
    image: "",
    genres: [3, 4],
    updated: "2025-01-08T00:00:00.000Z",
    seasonDetails: [
      { title: "Season 1: The Lighthouse Keeper", subtitle: "A coastal town, a missing man", episodes: 8 },
      { title: "Season 2: Mile Marker 27", subtitle: "A highway, a stalled car, no driver", episodes: 10 },
      { title: "Season 3: The Camp", subtitle: "Six counsellors, one missing summer", episodes: 9 },
      { title: "Season 4: Riverside", subtitle: "Cold case reopened after thirty years", episodes: 8 },
      { title: "Season 5: The Last Letter", subtitle: "A handwritten note changes everything", episodes: 7 },
    ],
  },
  {
    id: "p3",
    title: "After Hours Comedy",
    description:
      "Stand-up comedians sit down to talk about the bits that worked, the bits that bombed, and everything that happens after the green room empties out. Long-form, loose, and often slightly off the rails.",
    seasons: 2,
    image: "",
    genres: [5, 6],
    updated: "2025-01-12T00:00:00.000Z",
    seasonDetails: [
      { title: "Season 1: The Open Mic", subtitle: "First sets and lifelong friendships", episodes: 14 },
      { title: "Season 2: On the Road", subtitle: "Tour stories from across the country", episodes: 16 },
    ],
  },
  {
    id: "p4",
    title: "Founders Who Failed",
    description:
      "Honest, unsensational conversations with founders whose companies didn't make it. What they tried, what they missed, what they'd do differently. The stories you don't usually hear on business podcasts.",
    seasons: 4,
    image: "",
    genres: [2, 8],
    updated: "2025-01-05T00:00:00.000Z",
    seasonDetails: [
      { title: "Season 1: The First Year", subtitle: "Why most ideas don't survive launch", episodes: 10 },
      { title: "Season 2: Scaling Pains", subtitle: "When growth becomes the problem", episodes: 12 },
      { title: "Season 3: The Pivot", subtitle: "Stories of changing course mid-flight", episodes: 11 },
      { title: "Season 4: The End", subtitle: "Closing the doors with grace", episodes: 9 },
    ],
  },
  {
    id: "p5",
    title: "Quiet Mornings",
    description:
      "A gentle podcast about slow living, mindful routines, and the small habits that change a life. Hosted by a former burnout case who now goes to bed at 9 and isn't sorry about it.",
    seasons: 6,
    image: "",
    genres: [9, 10],
    updated: "2025-01-14T00:00:00.000Z",
    seasonDetails: [
      { title: "Season 1: Beginnings", subtitle: "Starting a slower life", episodes: 8 },
      { title: "Season 2: Routines", subtitle: "The shape of a quiet day", episodes: 10 },
      { title: "Season 3: Food", subtitle: "Cooking without rushing", episodes: 9 },
      { title: "Season 4: Movement", subtitle: "Walking, stretching, breathing", episodes: 8 },
      { title: "Season 5: Rest", subtitle: "The case for doing less", episodes: 7 },
      { title: "Season 6: Connection", subtitle: "Friendship at a slower pace", episodes: 8 },
    ],
  },
  {
    id: "p6",
    title: "Backwards Through Time",
    description:
      "A history podcast that starts at a familiar moment and walks the chain of causes backward, era by era, until you're somewhere genuinely strange. Each season picks a different starting point.",
    seasons: 7,
    image: "",
    genres: [11, 12],
    updated: "2025-01-02T00:00:00.000Z",
    seasonDetails: [
      { title: "Season 1: The Internet", subtitle: "From iPhone back to the telegraph", episodes: 12 },
      { title: "Season 2: Democracy", subtitle: "The long road from Athens to now", episodes: 10 },
      { title: "Season 3: The Calendar", subtitle: "Why the year is the length it is", episodes: 9 },
      { title: "Season 4: Money", subtitle: "From shells to stablecoins", episodes: 11 },
      { title: "Season 5: Cities", subtitle: "How people started living together", episodes: 10 },
      { title: "Season 6: Writing", subtitle: "From clay tablets to text messages", episodes: 9 },
      { title: "Season 7: Music", subtitle: "A history of organised sound", episodes: 10 },
    ],
  },
  {
    id: "p7",
    title: "Sideline Stories",
    description:
      "Sports journalism that goes past the score. Long features about athletes, coaches, and the moments that almost no one sees. New episodes weekly during the season.",
    seasons: 8,
    image: "",
    genres: [13, 14],
    updated: "2024-12-28T00:00:00.000Z",
    seasonDetails: [
      { title: "Season 1: Origins", subtitle: "How a beat reporter starts", episodes: 12 },
      { title: "Season 2: Breakthrough", subtitle: "Rookies and rising stars", episodes: 13 },
      { title: "Season 3: Finals Run", subtitle: "Inside championship pressure", episodes: 14 },
      { title: "Season 4: Off-Season", subtitle: "What players do in the quiet months", episodes: 10 },
      { title: "Season 5: Trades", subtitle: "The phone calls that change careers", episodes: 11 },
      { title: "Season 6: Coaches", subtitle: "The people who don't play", episodes: 12 },
      { title: "Season 7: International", subtitle: "Stories from outside the league", episodes: 13 },
      { title: "Season 8: Retirement", subtitle: "Life after the final whistle", episodes: 9 },
    ],
  },
  {
    id: "p8",
    title: "Field Notes",
    description:
      "Two field biologists pack a microphone alongside their binoculars and report back from forests, reefs, and remote islands. Equal parts science and travelogue.",
    seasons: 3,
    image: "",
    genres: [15, 16],
    updated: "2025-01-08T00:00:00.000Z",
    seasonDetails: [
      { title: "Season 1: The Canopy", subtitle: "Six weeks above the rainforest floor", episodes: 10 },
      { title: "Season 2: Coral", subtitle: "What the reefs are telling us", episodes: 9 },
      { title: "Season 3: The Tundra", subtitle: "Life in a changing North", episodes: 11 },
    ],
  },
];
