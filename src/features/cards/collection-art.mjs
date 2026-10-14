// Original paths in a 100 × 100 coordinate space. Colour roles are resolved by
// the chosen card palette. These are decorative motifs, not official symbols
// or anatomical diagrams.
export const ARTERY_RIBBON_PATHS = [
    { d: "M18 70C6 52 10 31 27 18C40 8 58 8 72 18C88 29 93 52 83 70", stroke: "accent", width: 2 },
    { d: "M44 73L44 47C44 38 37 31 29 27L25 25L31 15L36 18C42 21 47 26 50 31C53 26 58 21 64 18L69 15L75 25L71 27C63 31 56 38 56 47L56 73Z", fill: "accent" },
    { d: "M50 63L50 46C50 36 43 28 34 23M50 46C50 36 57 28 66 23", stroke: "paper", width: 2.3 },
    { d: "M42 68C39 58 44 53 50 53C56 53 61 58 58 68C55 75 46 84 40 93L32 85C41 76 55 63 52 60C51 59 49 59 48 60C45 63 59 76 68 85L60 93C54 84 45 75 42 68Z", fill: "accent", stroke: "soft", width: 2.5 },
    { d: "M46 61C47 57 53 57 54 61M44 76L38 83M56 76L62 83", stroke: "paper", width: 1.5 },
];
export const COLLECTION_ART = {
    // Retain the old saved illustration identifier; its drawing is replaced.
    "brain-character": ARTERY_RIBBON_PATHS,
    "ribbon-bold": [
        { d: "M29 27C31 7 69 7 71 27C73 45 57 61 40 83L30 98L13 80C35 59 66 29 57 24C53 21 47 21 43 24C34 29 65 59 87 80L70 98L60 83C43 61 27 45 29 27Z", fill: "accent" },
        { d: "M36 26C39 19 61 19 64 26", stroke: "ink", width: 2 },
        { d: "M34 61L23 78M65 61L77 78", stroke: "paper", width: 2 },
    ],
    branch: [
        { d: "M20 94C30 73 43 45 77 9", stroke: "accent", width: 2.3 },
        { d: "M30 76C10 78 3 68 7 55C24 54 34 61 30 76Z", fill: "accent" },
        { d: "M39 62C39 39 49 29 67 31C69 48 57 64 39 62Z", fill: "accent" },
        { d: "M49 45C30 44 22 34 25 21C42 22 52 28 49 45Z", fill: "accent" },
        { d: "M63 28C64 10 77 3 92 6C92 20 83 29 63 28Z", fill: "accent" },
        { d: "M22 70L31 73M46 52L56 40M39 31L48 39M73 20L82 12", stroke: "paper", width: 1.5 },
    ],
    crest: [
        { d: "M50 3C64 13 79 15 91 15L91 47C91 69 75 86 50 99C25 86 9 69 9 47L9 15C21 15 36 13 50 3Z", fill: "soft", stroke: "accent", width: 2 },
        { d: "M50 11C64 19 75 21 83 21L83 47C83 65 70 80 50 90C30 80 17 65 17 47L17 21C25 21 36 19 50 11Z", stroke: "accent", width: 1 },
        { d: "M45 66C37 41 50 26 72 27C73 51 59 68 45 66Z", fill: "accent" },
        { d: "M34 81L60 41", stroke: "ink", width: 2.5 },
        { d: "M14 64L5 59M20 77L10 74M86 64L95 59M80 77L90 74", stroke: "accent", width: 2 },
    ],
    fox: [
        { d: "M18 28L24 8L42 20C47 18 53 18 58 20L76 8L82 28C88 38 84 58 71 69C61 78 39 78 29 69C16 58 12 38 18 28Z", fill: "soft", stroke: "accent", width: 2 },
        { d: "M34 43C37 39 41 39 44 43M56 43C59 39 63 39 66 43M45 54C48 57 52 57 55 54", stroke: "ink", width: 2 },
        { d: "M28 65C19 77 12 86 7 92M72 65C81 77 88 86 93 92", stroke: "accent", width: 2 },
        { d: "M24 78C39 84 61 84 76 78", stroke: "paper", width: 2 },
    ],
    bird: [
        { d: "M15 50C28 21 55 12 82 23C70 29 61 38 57 51C47 45 37 43 26 47C35 54 41 62 43 73C30 68 20 60 15 50Z", fill: "soft", stroke: "accent", width: 2 },
        { d: "M56 51C69 54 80 63 90 76M28 81C45 78 62 79 82 84", stroke: "accent", width: 2 },
        { d: "M45 29C52 24 59 23 67 25", stroke: "paper", width: 2 },
    ],
    cat: [
        { d: "M18 37L22 10L43 24C48 22 52 22 57 24L78 10L82 37C86 55 74 75 50 78C26 75 14 55 18 37Z", fill: "soft", stroke: "accent", width: 2 },
        { d: "M33 46L42 48M58 48L67 46M45 58C48 61 52 61 55 58M28 55L12 51M28 61L11 64M72 55L88 51M72 61L89 64", stroke: "ink", width: 1.8 },
        { d: "M38 27L43 33M62 27L57 33", stroke: "paper", width: 2 },
    ],
};
