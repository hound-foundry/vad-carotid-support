/** @type {Record<string,{name:string,paper:string,ink:string,accent:string,soft:string,onAccent:string,detail:string}>} */
export const CARD_PALETTES = {
    blue: { name: "Blue and white", paper: "#FFFFFF", ink: "#183248", accent: "#2B5F87", soft: "#E8EFF4", onAccent: "#FFFFFF", detail: "#33485C" },
    plum: { name: "Plum and cream", paper: "#FFFAF5", ink: "#183248", accent: "#5B3D7F", soft: "#EEE7F3", onAccent: "#FFFFFF", detail: "#33485C" },
    cranberry: { name: "Cranberry and cream", paper: "#FFFAF5", ink: "#183248", accent: "#9F3049", soft: "#F6E8EC", onAccent: "#FFFFFF", detail: "#33485C" },
    sage: { name: "Sage and cream", paper: "#FFFAF5", ink: "#183248", accent: "#376657", soft: "#E9F0EC", onAccent: "#FFFFFF", detail: "#33485C" },
    gold: { name: "Navy and gold", paper: "#183248", ink: "#FFFAF5", accent: "#D7BB75", soft: "#24445C", onAccent: "#183248", detail: "#E8EFF4" },
    coral: { name: "Coral and sage", paper: "#FFFAF5", ink: "#183248", accent: "#376657", soft: "#F4CCC3", onAccent: "#FFFFFF", detail: "#33485C" },
};
export const CARD_TEMPLATES = [
    { id: "communication", kind: "personal", name: "Communication first", description: "Your words first. Useful details on the back.", colours: ["blue", "plum", "sage"], illustration: "none", illustrations: ["none", "branch"], photo: false, category: "clear", finish: "plain" },
    { id: "portrait", kind: "personal", name: "Photo and details", description: "An optional portrait beside your name and words.", colours: ["plum", "blue", "cranberry"], illustration: "none", illustrations: ["none", "branch"], photo: true, category: "clear", finish: "plain" },
    { id: "statement", kind: "personal", name: "Statement card", description: "A bold front, with practical information on the back.", colours: ["cranberry", "blue", "plum"], illustration: "ribbon-bold", illustrations: ["ribbon-bold", "none", "branch"], photo: false, category: "serious", finish: "letterpress" },
    { id: "quiet-white", kind: "personal", name: "Quiet white", description: "A low-clutter card with a fine border and soft detail.", colours: ["blue", "sage", "plum"], illustration: "none", illustrations: ["none", "branch"], photo: false, category: "clear", finish: "quiet" },
    { id: "engraved-slate", kind: "personal", name: "Engraved slate", description: "A dark, calm panel with a subtle gold line treatment.", colours: ["gold", "blue", "plum"], illustration: "crest", illustrations: ["crest", "ribbon-bold", "none"], photo: false, category: "textured", finish: "engraved" },
    { id: "embossed-cream", kind: "personal", name: "Embossed cream", description: "Warm paper tones and a quiet raised-edge effect.", colours: ["plum", "coral", "sage"], illustration: "branch", illustrations: ["branch", "none"], photo: false, category: "gentle", finish: "embossed" },
    { id: "letterpress-blue", kind: "personal", name: "Blue letterpress", description: "A strong blue field with generous, readable type.", colours: ["blue", "gold", "plum"], illustration: "none", illustrations: ["none", "ribbon-bold"], photo: false, category: "serious", finish: "letterpress" },
    { id: "message-band", kind: "personal", name: "Message band", description: "One clear message framed by a bold band.", colours: ["cranberry", "blue", "plum"], illustration: "ribbon-bold", illustrations: ["ribbon-bold", "none"], photo: false, category: "serious", finish: "foil" },
    { id: "ribbon-poster", kind: "milestone", name: "Survivor ribbon", description: "Strong lettering and a prominent ribbon. Use your own wording.", colours: ["plum", "blue", "cranberry"], illustration: "ribbon-bold", illustrations: ["ribbon-bold", "none", "branch"], photo: false, category: "expression", finish: "foil" },
    { id: "warrior", kind: "milestone", name: "Warrior badge", description: "A shield and leaf, with bold lettering.", colours: ["gold", "blue", "plum"], illustration: "crest", illustrations: ["crest", "none", "ribbon-bold"], photo: false, category: "serious", finish: "engraved" },
    { id: "brain-poster", kind: "milestone", name: "Artery & ribbon", description: "A branching-vessel motif and ribbon, with your own words.", colours: ["blue", "coral", "sage"], illustration: "brain-character", illustrations: ["brain-character", "none", "branch"], photo: false, category: "clear", finish: "plain" },
    { id: "botanical", kind: "milestone", name: "Botanical keepsake", description: "Leafy framing for a moment in your own words.", colours: ["sage", "blue", "plum"], illustration: "branch", illustrations: ["branch", "none", "ribbon-bold"], photo: false, category: "gentle", finish: "embossed" },
    { id: "photo-story", kind: "milestone", name: "Photo story", description: "An optional photo above a readable caption panel.", colours: ["blue", "plum", "sage"], illustration: "none", illustrations: ["none", "branch"], photo: true, category: "expression", finish: "plain" },
    { id: "fox-story", kind: "milestone", name: "Fox and wildflower", description: "A friendly illustrated keepsake with room for your words.", colours: ["coral", "sage", "cranberry"], illustration: "fox", illustrations: ["fox", "none", "branch"], photo: false, category: "gentle", finish: "embossed" },
    { id: "bird-ribbon", kind: "milestone", name: "Bird and ribbon", description: "A quiet, hopeful composition with an original bird motif.", colours: ["blue", "sage", "plum"], illustration: "bird", illustrations: ["bird", "none", "branch"], photo: false, category: "gentle", finish: "letterpress" },
    { id: "cat-badge", kind: "milestone", name: "Cat badge", description: "A small, kind companion mark with a bold title.", colours: ["plum", "coral", "blue"], illustration: "cat", illustrations: ["cat", "none", "crest"], photo: false, category: "expression", finish: "plain" },
];
export const ILLUSTRATIONS = [
    { id: "none", name: "No artwork" }, { id: "ribbon-bold", name: "Ribbon" }, { id: "branch", name: "Leafy branch" }, { id: "crest", name: "Shield and leaf" }, { id: "brain-character", name: "Artery & ribbon" }, { id: "fox", name: "Fox" }, { id: "bird", name: "Bird" }, { id: "cat", name: "Cat" },
];
export function cardTemplate(id, kind) {
    if(id==="plain")return {id:"plain",kind:kind||"personal",name:"Plain layout",description:"A simple text layout.",colours:["blue","plum","sage"],illustration:"none",illustrations:["none"],photo:false};
    return CARD_TEMPLATES.find(t => t.id === id && (!kind || t.kind === kind));
}
export function templateAppearance(input, kind) {
    const template = cardTemplate(input?.templateId, kind);
    if (!template)
        return { templateId: "", colourId: "", illustrationId: "auto" };
    return { templateId: template.id, colourId: template.colours.includes(input.colourId) ? input.colourId : template.colours[0], illustrationId: input.illustrationId === "auto" || !template.illustrations.includes(input.illustrationId) ? "auto" : input.illustrationId };
}
export function resolveTemplate(view) {
    const template = cardTemplate(view.templateId, view.kind);
    if (!template)
        return undefined;
    const style = templateAppearance(view, view.kind);
    return { ...template, palette: CARD_PALETTES[style.colourId], colourId: style.colourId, illustrationId: style.illustrationId === "auto" ? template.illustration : style.illustrationId };
}
