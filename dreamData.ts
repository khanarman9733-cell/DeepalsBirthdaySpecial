/**
 * AI Dream Gallery - 50 Imaginary Moments and Celestial Wishes
 * Representing beautiful thoughts and magical wishes for Deepal.
 */

export interface DreamItem {
  id: number;
  title: string;
  category: "Astral" | "Ethereal" | "Magic" | "Whispers";
  story: string;
  prompt: string;
  defaultSeedColor: string; // Used to customize the abstract SVG placeholder
  customImageUrl?: string;
}

export const DREAM_ITEMS: DreamItem[] = [
  {
    id: 1,
    title: "The Floating Glass Observatory",
    category: "Astral",
    story: "A sanctuary suspended between dimensions, where one can observe the birth of newborn constellations while sipping hot stardust tea.",
    prompt: "An elegant glass dome floating in deep violet space, surrounded by rings of gold dust and nebula clouds, photorealistic luxury style",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 2,
    title: "Lullaby of the Star Whale",
    category: "Astral",
    story: "An ancient celestial whale gliding through the dark tide, singing a silent frequency that fills the heart with unshakeable peace.",
    prompt: "A massive luminous cosmic whale swimming through a sea of galaxies, glowing with soft warm champagne light",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 3,
    title: "The Whispering Library of Alexandria",
    category: "Ethereal",
    story: "Every book is bound in velvet and written in stardust, holding the laughter of children and the wisdom of forgotten moons.",
    prompt: "An infinite classical library with gold-leaf shelves, floating pages illuminated by gentle candlelight, high-contrast cinematic lighting",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 4,
    title: "A Meadow of Luminescent Lilies",
    category: "Ethereal",
    story: "Walking through petals that gently glow brighter with each footprint, leaving a trail of warm gold in the dark forest.",
    prompt: "A nocturnal field of glowing white lilies under a giant crescent moon, soft fantasy realism, beautiful depth of field",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 5,
    title: "Chai and Smiles in Jaipur",
    category: "Magic",
    story: "That cozy moment in Jaipur, sipping chai together, just laughing and forgetting all about work. Your smile made everything else seem silent.",
    prompt: "A close up of two cups of tea on a wooden table, warm sunlight, cinematic concept art, cozy atmosphere",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 6,
    title: "The Golden Clockwork Phoenix",
    category: "Magic",
    story: "A guardian bird made of delicate brass gears, carrying warmth to anyone who feels a sudden chill in their spirit.",
    prompt: "A majestic bird made of intricate gold clockwork, rising from soft embers, high-end jewelry level detail",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 7,
    title: "Bridges of Woven Moonlight",
    category: "Whispers",
    story: "A bridge connecting two distant cliffs, made entirely of solid moonlight that only appears when you walk with pure intent.",
    prompt: "A glowing translucent bridge of pure light stretching over a misty canyon, surreal romanticism, starry night background",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 8,
    title: "The Symphony of Silent Tears",
    category: "Whispers",
    story: "When words are too heavy, they crystallize into tiny glowing glass beads, singing a melody of absolute understanding.",
    prompt: "Tiny crystal water droplets catching golden morning sunbeams, macroscopic photography, soft blurred abstract background",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 9,
    title: "The Cosmic Carousel",
    category: "Astral",
    story: "Riding on the back of golden paper horses around the rings of Saturn, leaving a sparkling wake of cosmic dust.",
    prompt: "A vintage gold and ivory carousel floating in space around a beautifully ringed gold planet, celestial surrealism",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 10,
    title: "November Hustle and Laughter",
    category: "Ethereal",
    story: "Event management in November was chaotic, but sneaking away with you to just enjoy life and laugh was the best part of it all.",
    prompt: "A blur of event lights and happy people in the background, focused on a joyful moment between two friends, cinematic, cozy November vibe",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 11,
    title: "The Star-Weaver's Loom",
    category: "Magic",
    story: "Spinning cosmic silk into blankets of pure warmth, designed to wrap around anyone who feels lonely on cold winter nights.",
    prompt: "A spinning wheel weaving threads of pure light and gold wire into a glowing celestial fabric, dark studio lighting",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 12,
    title: "Guardian of the Starlight Lantern",
    category: "Whispers",
    story: "A tiny, gentle mouse carrying a lantern filled with captured starlight, guiding travelers safely home through misty woods.",
    prompt: "A cute little fantasy mouse holding a small glowing brass lantern in a misty magical forest, Pixar-style cinematic render",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 13,
    title: "Rings of the Silent Moon",
    category: "Astral",
    story: "A swing hanging from the tip of the crescent moon, overlooking the slow rotation of our blue-gold home below.",
    prompt: "An elegant swing suspended from a giant glowing crescent moon looking over a cosmic earth, romantic fantasy",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 14,
    title: "The Floating Lotus Sanctuary",
    category: "Ethereal",
    story: "An endless golden lake where giant lotus flowers float, offering a quiet space to sit and meditate in perfect tranquility.",
    prompt: "Giant gold-trimmed white lotus flowers floating on dark reflective water under a starry sky, zen luxury style",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 15,
    title: "The Starlight Postbox",
    category: "Magic",
    story: "Drop a letter written with ink made of your wishes, and the morning wind will carry it directly to the stars.",
    prompt: "An antique brass postbox mounted on a stone pillar, glowing letters gently floating out into the night sky",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 16,
    title: "A Walk Among the Clouds",
    category: "Whispers",
    story: "Floating gently on a pathway of soft, warm clouds that smell of lavender and fresh-baked bread.",
    prompt: "A golden stone path winding through puffy, glowing pink and amber clouds at sunset, surreal dreamscape",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 17,
    title: "The Observatory of Dreams",
    category: "Astral",
    story: "A colossal telescope that doesn't look at stars, but zooms into the beautiful hopes and dreams of your loved ones.",
    prompt: "An ornate gold brass celestial telescope in a library with an open dome revealing a sparkling nebula",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 18,
    title: "The Whispering Bamboo Grove",
    category: "Ethereal",
    story: "Bamboo stalks that glow with a gentle emerald light, whispering encouraging secrets to anyone who walks by.",
    prompt: "A pathway through glowing green bamboo stalks, soft golden light filtering through the leaves, dreamlike atmosphere",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 19,
    title: "The Hourglass of Solitude",
    category: "Magic",
    story: "An hourglass filled with sparkling gold sand that pauses the universe, giving you as much quiet time as you need.",
    prompt: "An ancient brass hourglass with glowing golden sand suspended mid-air, mystical background, studio lighting",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 20,
    title: "The Ship of Paper Dreams",
    category: "Whispers",
    story: "A small folded paper boat that sailing across the dark ocean, carrying a single, bright, unquenchable candle.",
    prompt: "A beautiful origami boat floating on calm dark water with a warm candle flame inside, reflecting golden stardust",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 21,
    title: "The Milky Way Cafe",
    category: "Astral",
    story: "A quaint cafe perched on a cosmic highway, serving coffee with foam shaped like spiral galaxies.",
    prompt: "A cozy modern cafe booth looking out a glass window at the spiral Milky Way galaxy, celestial aesthetic",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 22,
    title: "The Crystal Cave of Echoes",
    category: "Ethereal",
    story: "Massive geode crystals that sing beautiful harmonies whenever you speak a kind word inside their chambers.",
    prompt: "A cave lined with gigantic glowing violet and golden crystals, a clear stream reflecting the light",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 23,
    title: "The Stardust Bakery",
    category: "Magic",
    story: "Oven-fresh bread baked with a pinch of stardust, guaranteed to make you feel light as a feather all day long.",
    prompt: "A cozy rustic bakery filled with glowing warm croissants and sparkling pastries, fairy lights, magical kitchen",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 24,
    title: "The Eternal Hearth",
    category: "Whispers",
    story: "A warm, crackling fireplace that burns with a soft, comforting flame, never requiring wood and never fading.",
    prompt: "A minimalist modern fireplace in a room with large windows showing a snowy night and warm glowing fire, hygge design",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 25,
    title: "Sailing the Cosmos",
    category: "Astral",
    story: "A majestic wooden sailboat catching the stellar solar winds, embarking on an endless journey of cosmic discovery.",
    prompt: "An ancient galleon ship sailing on a sea of glittering nebulas and space dust, gold sails fully unfurled",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 26,
    title: "The Wisteria Canopy",
    category: "Ethereal",
    story: "An endless ceiling of cascading violet wisteria blooms, providing an eternal shelter of soft, fragrant shadows.",
    prompt: "A magical tunnel of glowing purple wisteria flowers hanging from above, warm lanterns guiding the path",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 27,
    title: "The Quill of Epiphanies",
    category: "Magic",
    story: "A golden feather pen that automatically writes down your most inspiring, world-changing thoughts the moment they spark.",
    prompt: "A gold quill pen resting on leather-bound paper, sparks of golden light flying from the nib, dark background",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 28,
    title: "The Gate of the Sleeping Stars",
    category: "Whispers",
    story: "An ancient stone archway through which you can hear the soft, rhythmic breathing of stars taking their daytime rest.",
    prompt: "An ancient moss-covered stone archway leading to a starry sky, misty grass, ethereal fantasy landscape",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 29,
    title: "The Ring of Saturn Swing",
    category: "Astral",
    story: "A beautiful wooden swing suspended from Saturn's golden rings, offering a panoramic view of the universe.",
    prompt: "A swing hanging from glowing space dust rings looking down at Saturn, astronomical fine art",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 30,
    title: "The River of Glass Keyways",
    category: "Ethereal",
    story: "A calm, glowing river made of liquid silver, holding keys to every door you've ever wished to unlock.",
    prompt: "A river of glowing liquid glass with ancient gold keys floating in it, dark forest, mystical fantasy",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 31,
    title: "The Floating Teapot Castle",
    category: "Magic",
    story: "A small, whimsical castle built inside a giant porcelain teapot, floating gently over green hills.",
    prompt: "A whimsical miniature castle built inside a glowing porcelain teapot floating in sky, fantasy photography",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 32,
    title: "The Warmest Blanket",
    category: "Whispers",
    story: "A soft, invisible blanket woven from the happiest thoughts, shielding you from any harshness of the outside world.",
    prompt: "A cozy modern bedroom with warm lights, a soft knit blanket glowing with gentle ambient light, high-end design",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 33,
    title: "Aurora's Ballroom",
    category: "Astral",
    story: "An open-air glass ballroom built atop a cold mountain, where the Northern Lights dance to the sound of silent harps.",
    prompt: "A marble dance floor reflecting a spectacular bright green and gold aurora borealis in the night sky",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 34,
    title: "The Zen Garden of Balance",
    category: "Ethereal",
    story: "A quiet sand garden where raked lines represent cosmic waves, and dark obsidian stones float perfectly in the air.",
    prompt: "A minimalist zen garden with black sand, perfectly balanced floating dark stones, warm spotlighting",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 35,
    title: "The Golden Compass of Intent",
    category: "Magic",
    story: "A compass that doesn't point north, but points directly toward your deepest, most authentic happiness.",
    prompt: "An ornate gold pocket compass with glowing runic inscriptions resting on velvet, moody vintage style",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 36,
    title: "The Silent Forest Guardian",
    category: "Whispers",
    story: "A gentle deer made of solid light, appearing when you need to feel protected and guiding you with a warm glow.",
    prompt: "A magnificent spectral stag made of pure gold and white light standing in a dark forest, fantasy digital art",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 37,
    title: "The Comet Transit Station",
    category: "Astral",
    story: "A wooden platform on a tiny asteroid, waiting for the 9:15 comet to take you to the edge of the stellar horizon.",
    prompt: "A charming wooden train platform on a small asteroid, a shooting star approaching, deep space cosmic background",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 38,
    title: "The Conservatory of Clouds",
    category: "Ethereal",
    story: "A botanical greenhouse dedicated to cultivating clouds of different colors, from sunset pink to morning mist.",
    prompt: "A Victorian iron greenhouse filled with fluffy colorful clouds instead of plants, warm glowing sunset light",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 39,
    title: "The Book of Endless Stories",
    category: "Magic",
    story: "Open the book, and the pages transform into interactive paper models that act out beautiful stories.",
    prompt: "A large open old book with detailed golden paper pop-up castle and flying dragons, warm fairy lights",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 40,
    title: "The Sanctuary of Wishes",
    category: "Whispers",
    story: "A small, quiet stone altar in a peaceful valley where you can leave a wish, and watch it turn into a butterfly.",
    prompt: "A simple stone table with glowing golden butterflies flying away under a majestic starry sky",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 41,
    title: "The Stellar Lighthouse",
    category: "Astral",
    story: "A tall tower on a lone space rock, beaming warm gold light across the cosmic sea to welcome interstellar explorers.",
    prompt: "An elegant gothic lighthouse on an asteroid casting a gold light beam through space, celestial digital art",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 42,
    title: "The Lake of Falling Stars",
    category: "Ethereal",
    story: "A tranquil lake where shooting stars land with a soft sizzle, cooling down into valuable crystal wishing gems.",
    prompt: "A dark lake with glowing blue and gold crystals underwater, starry sky above, magical fantasy illustration",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 43,
    title: "The Dreamcatcher's Workshop",
    category: "Magic",
    story: "A room filled with delicate webs made of silver wire, filtering out worries and leaving only bright, happy hopes.",
    prompt: "A cozy workshop filled with intricate glowing silver and gold dreamcatchers, warm cinematic backlight",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 44,
    title: "The Path of Ancient Lanterns",
    category: "Whispers",
    story: "A long pathway winding through old trees, illuminated by floating stone lanterns that hum soft chants of protection.",
    prompt: "A cobblestone path winding through a magical forest at night, lined with floating ancient stone lanterns",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 45,
    title: "The Nebula Greenhouse",
    category: "Astral",
    story: "Tending to mini nebulas in glass jars, watching them swirl with cosmic dust of pink, blue, and gold.",
    prompt: "Dozens of small glass jars filled with colorful glowing nebulas sitting on wooden shelves, alchemy lab",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 46,
    title: "The Garden of Floating Steps",
    category: "Ethereal",
    story: "A pool where stepping stones float slightly above the water, rippling with gold light each time you step.",
    prompt: "A high-end modern courtyard with floating stone slabs over dark water, sparkling particles, architecture showcase",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 47,
    title: "The Alchemist's Inkwell",
    category: "Magic",
    story: "Ink that writes in gold and brings any sketched object to life, if only for a single, fleeting hour.",
    prompt: "A crystal inkwell with metallic liquid gold ink, a fine fountain pen resting beside a sketch of a glowing leaf",
    defaultSeedColor: "#C5A059"
  },
  {
    id: 48,
    title: "The Temple of Eternal Stillness",
    category: "Whispers",
    story: "A minimalist shrine where time stands perfectly still, offering a complete escape from all the noise of the world.",
    prompt: "A beautiful marble pavilion overlooking a peaceful mist-covered mountain range, soft warm dawn lighting",
    defaultSeedColor: "#F5E6CA"
  },
  {
    id: 49,
    title: "The Grand Cosmic Library",
    category: "Astral",
    story: "A library where you don't read books, but look into floating glass orbs that show high-fidelity histories of alien civilizations.",
    prompt: "An immense futuristic dark library with shelves of glowing glass spheres, celestial rays of light",
    defaultSeedColor: "#E6C587"
  },
  {
    id: 50,
    title: "The Final Wishing Tree",
    category: "Whispers",
    story: "An ancient glowing tree at the center of the universe, where your most selfless, pure wishes bloom as golden flowers.",
    prompt: "A giant ancient tree with glowing gold leaves and hanging lanterns under a glorious cosmos, masterpiece digital art",
    defaultSeedColor: "#C5A059"
  }
];
