import { resolveTemplate } from "./templates.mjs";
// A single measured scene is consumed by preview, image, PDF and print adapters.
// Coordinates are design units: 1080px-wide keepsakes and 856px-wide wallets.
export function photoCropRect(photo, frameWidth, frameHeight, crop = {}) {
    const zoom = Math.min(3, Math.max(1, Number(crop.photoZoom) || 1));
    const x = Math.min(1, Math.max(0, Number.isFinite(crop.photoX) ? crop.photoX : .5));
    const y = Math.min(1, Math.max(0, Number.isFinite(crop.photoY) ? crop.photoY : .5));
    const ratio = frameWidth / frameHeight;
    let width = photo.width, height = width / ratio;
    if (height > photo.height) {
        height = photo.height;
        width = height * ratio;
    }
    width /= zoom;
    height /= zoom;
    return { x: (photo.width - width) * x, y: (photo.height - height) * y, width, height };
}
export function buildCardLayout(view, metrics, { photo } = {}) {
    const template = resolveTemplate(view);
    if (!template)
        return undefined;
    const c = template.palette, pages = [];
    const field = (id) => view.fields.find(f => f.id === id)?.value || "";
    const page = (side, width, height, background = c.paper) => { const p = { side, width, height, background, items: [], templateId: template.id }; pages.push(p); return p; };
    const rect = (p, x, y, width, height, fill, radius = 0, stroke) => p.items.push({ type: "rect", x, y, width, height, fill, radius, stroke });
    const ellipse = (p, x, y, width, height, fill) => p.items.push({ type: "ellipse", x, y, width, height, fill });
    const text = (p, value, x, y, width, size, font = "regular", colour = c.ink, align = "left", leading = 1.3) => {
        if (!value)
            return y;
        font = metrics.resolveFont(font, value);
        const lines = wrap(value, width, s => metrics.width(s, size, font));
        p.items.push({ type: "text", value, x, y, width, size, font, colour, align, leading, lines });
        return y + lines.length * size * leading;
    };
    const art = (p, x, y, width, height, id = template.illustrationId) => { if (id !== "none")
        p.items.push({ type: "art", id, x, y, width, height, palette: c }); };
    const portrait = (p, x, y, width, height) => { if (photo)
        p.items.push({ type: "photo", x, y, width, height, crop: photoCropRect(photo, width, height, view), photoId: view.photoRef }); };
    const finish = (p, y, { white = false, footer = true } = {}) => {
        p.height = Math.max(p.height, y + 170);
        if (footer) {
            const ink = white ? "#183248" : c.detail;
            text(p, view.footer, 64, p.height - 105, p.width - 128, 22, "regular", ink);
        }
    };
    if (view.kind === "personal") {
        const front = page("Front", 856, 540);
        const name = field("preferredName");
        const heading = view.title;
        // An overly long heading gets its own readable continuation panel, never a
        // clipped front or a reduced font. The front still carries its own label.
        const font = metrics.resolveFont(template.id==="plain"?"bold":"display", heading);
        const titleWidth = template.id === "portrait" && photo ? 480 : template.id === "statement" && template.illustrationId !== "none" ? 580 : 740;
        const titleLines = wrap(heading, titleWidth, s => metrics.width(s, 62, font));
        const titleLimit = template.id === "portrait" ? 2 : 3;
        const visibleLines = titleLines.slice(0, titleLimit), excessTitle = titleLines.slice(titleLimit);
        const frontName = wrap(name, (template.id === "portrait" && photo ? 498 : 740) - metrics.width("…", 38, "bold"), s => metrics.width(s, 38, "bold"))[0] || "";
        const shortName = frontName + (frontName !== name ? "…" : "");
        if (template.id === "communication" || template.id === "plain") {
            rect(front, 0, 0, 856, 20, c.accent);
            rect(front, 0, 0, 14, 540, c.accent);
            text(front, "Personal information", 52, 40, 740, 28, "bold", c.accent);
            text(front, visibleLines.join("\n"), 52, 120, 740, 62, font, c.ink, "left", 1.05);
            text(front, shortName, 52, 355, 740, 38, "bold");
            if (template.illustrationId !== "none")
                art(front, 710, 32, 96, 96);
        }
        else if (template.id === "portrait") {
            rect(front, 0, 0, 856, 82, c.accent);
            text(front, "Personal information", 38, 24, 770, 28, "bold", c.onAccent);
            if (photo) {
                portrait(front, 32, 114, 203, 270);
                rect(front, 282, 114, 3, 270, c.accent);
            }
            const x = photo ? 310 : 48, width = photo ? 498 : 760;
            let y = text(front, shortName, x, 119, width, 38, "bold");
            text(front, visibleLines.join("\n"), x, y + 30, width, 62, "display", c.ink, "left", 1.05);
            if (template.illustrationId !== "none")
                front.items.push({ type: "art", id: template.illustrationId, x: 745, y: 12, width: 62, height: 62, palette: { ...c, accent: c.onAccent, ink: c.onAccent, paper: c.accent } });
        }
        else {
            front.background = c.accent;
            text(front, "Personal information", 48, 36, 750, 25, "bold", c.onAccent);
            if (template.illustrationId !== "none")
                front.items.push({ type: "art", id: template.illustrationId, x: 630, y: 118, width: 180, height: 250, palette: { ...c, accent: c.onAccent, ink: c.onAccent, paper: c.accent } });
            text(front, visibleLines.join("\n"), 48, 124, titleWidth, 62, "display", c.onAccent, "left", 1.05);
            text(front, shortName, 48, 355, 750, 38, "bold", c.onAccent);
        }
        const frontInk = template.id === "statement" ? c.onAccent : c.ink;
        text(front, "Details on the back" + (excessTitle.length ? " · wording continues" : ""), 48, 405, 760, 25, "bold", frontInk);
        text(front, view.footer, 48, 455, 760, 28, "regular", frontInk, "left", 1.1);
        const updated = field("updatedOn");
        let back, y, number = 0;
        const next = () => { number++; back = page(number === 1 ? "Back" : "Details continued " + number, 856, 540, "#FFFFFF"); rect(back, 0, 0, 856, 7, c.accent); text(back, number === 1 ? "Details" : "Details · continued", 40, 22, 776, 28, "bold", c.accent); y = 78; text(back, view.footer, 40, 423, 776, 26, "regular", "#183248", "left", 1.1); if (updated)
            text(back, "Last updated: " + updated, 40, 502, 776, 24, "regular", "#33485C"); };
        next();
        const backFields = [...(excessTitle.length ? [{ label: "Heading (continued)", value: excessTitle.join("\n") }] : []), ...view.fields.filter(f => f.id !== "updatedOn")];
        for (const f of backFields) {
            const labelLines = wrap(f.label, 776, s => metrics.width(s, 28, "bold")), lines = wrap(f.value, 776, s => metrics.width(s, 38, "regular"));
            if (y + (labelLines.length * 37) + 50 > 406)
                next();
            y = text(back, f.label, 40, y, 776, 28, "bold", c.accent) + 4;
            for (const line of lines) {
                if (y + 50 > 406) {
                    next();
                    y = text(back, f.label + " (continued)", 40, y, 776, 28, "bold", c.accent) + 4;
                }
                y = text(back, line, 40, y, 776, 38, "regular", "#183248") + 1;
            }
            y += 14;
        }
        return { kind: view.kind, templateId: template.id, footer: view.footer, pages };
    }
    const p = page("Personal milestone", 1080, 1350), name = field("displayName"), date = field("date"), message = field("message");
    let y;
    if (template.id === "ribbon-poster") {
        rect(p, 0, 0, 1080, 22, c.accent);
        rect(p, 52, 64, 280, 4, c.accent);
        text(p, view.subtitle, 64, 94, 940, 28, "bold", c.accent);
        if (template.illustrationId !== "none") {
            ellipse(p, 575, 180, 470, 600, c.soft);
            art(p, 650, 235, 360, 430);
        }
        const titleWidth = template.illustrationId !== "none" ? 570 : 952;
        y = text(p, view.title, 64, 230, titleWidth, 128, "display", c.ink, "left", 1.05);
        y = Math.max(y + 52, template.illustrationId !== "none" ? 790 : 560);
        y = text(p, name, 64, y, 952, 44, "bold") + 20;
        y = text(p, date, 64, y, 952, 28, "bold", c.accent) + 44;
        y = text(p, message, 64, y, 952, 36) + 20;
        finish(p, y);
    }
    else if (template.id === "warrior") {
        // Dark/navy or the chosen accent acts as the full badge paper.
        const dark = c.paper === "#183248";
        p.background = dark ? c.paper : c.accent;
        const ink = dark ? c.ink : c.onAccent, emblem = { ...c, soft: dark ? c.soft : c.onAccent, accent: dark ? c.accent : c.onAccent, ink: dark ? c.ink : c.accent, paper: dark ? c.paper : c.accent };
        rect(p, 30, 30, 1020, 1290, "none", 0, dark ? c.accent : c.onAccent);
        text(p, view.subtitle, 80, 72, 920, 27, "bold", ink, "center");
        if (template.illustrationId !== "none")
            p.items.push({ type: "art", id: template.illustrationId, x: 345, y: 160, width: 390, height: 390, palette: emblem });
        y = text(p, view.title, 80, template.illustrationId !== "none" ? 610 : 260, 920, 142, "display", ink, "center", 1.03) + 38;
        y = text(p, name, 80, y, 920, 43, "bold", ink, "center") + 18;
        y = text(p, date, 80, y, 920, 29, "bold", ink, "center") + 34;
        y = text(p, message, 105, y, 870, 36, "regular", ink, "center") + 20;
        p.height = Math.max(1350, y + 170);
        p.items[0].height = p.height - 60;
        text(p, view.footer, 80, p.height - 107, 920, 22, "regular", ink, "center");
    }
    else if (template.id === "brain-poster") {
        // Saved identifier retained for the artery-and-ribbon composition.
        rect(p, 0, 0, 1080, 26, c.accent);
        text(p, view.subtitle, 80, 48, 920, 26, "bold", c.accent, "center");
        y = text(p, view.title, 80, 100, 920, 94, "bold", c.ink, "center", 1.15);
        const hasArt = template.illustrationId !== "none";
        if (hasArt) {
            ellipse(p, 270, y + 60, 540, 540, c.soft);
            art(p, 245, y + 30, 590, 590);
            y += 670;
        }
        else
            y += 72;
        y = text(p, name, 80, y, 920, 42, "bold", c.accent, "center") + 18;
        y = text(p, date, 80, y, 920, 28, "bold", c.accent, "center") + 26;
        y = text(p, message, 96, y, 888, 36, "regular", c.ink, "center") + 20;
        finish(p, y);
    }
    else if (template.id === "botanical") {
        rect(p, 42, 42, 996, 1266, "none", 0, c.accent);
        if (template.illustrationId !== "none") {
            art(p, 50, 74, 220, 265);
            p.items.push({ type: "art", id: template.illustrationId, x: 810, y: 970, width: 220, height: 265, palette: c, flip: true });
        }
        text(p, view.subtitle, 150, 225, 780, 27, "bold", c.accent, "center");
        y = text(p, view.title, 120, 360, 840, 98, "bold", c.ink, "center", 1.16) + 56;
        y = text(p, name, 130, y, 820, 43, "bold", c.accent, "center") + 20;
        y = text(p, date, 130, y, 820, 28, "bold", c.accent, "center") + 58;
        y = text(p, message, 160, y, 760, 36, "regular", c.ink, "center") + 20;
        if (template.illustrationId !== "none")
            p.height = Math.max(p.height, y + 430);
        finish(p, y);
        p.items[0].height = p.height - 84;
        const lower = p.items.find(i => i.type === "art" && i.flip);
        if (lower)
            lower.y = p.height - 380;
    }
    else {
        rect(p, 0, 0, 1080, 26, c.accent);
        let base = 115;
        if (photo) {
            portrait(p, 60, 90, 960, 660);
            rect(p, 60, 750, 960, 10, c.accent);
            base = 820;
        }
        else if (template.illustrationId !== "none") {
            art(p, 710, 94, 280, 300);
            base = 420;
        }
        text(p, view.subtitle, 76, base, 928, 26, "bold", c.accent);
        y = text(p, view.title, 76, base + 62, 928, 100, template.id==="plain"?"bold":"display", c.ink, "left", 1.08) + 32;
        y = text(p, name, 76, y, 928, 42, "bold") + 18;
        y = text(p, date, 76, y, 928, 28, "bold", c.accent) + 26;
        y = text(p, message, 76, y, 928, 36) + 20;
        finish(p, y);
    }
    return { kind: view.kind, templateId: template.id, footer: view.footer, pages };
}
export function wrap(text, maxWidth, measure) {
    const lines = [];
    for (const para of String(text).split("\n")) {
        let line = "";
        for (const word of para.split(/\s+/)) {
            if (line && measure(line + " " + word) > maxWidth) {
                lines.push(line);
                line = "";
            }
            if (measure(word) > maxWidth) {
                if (line) {
                    lines.push(line);
                    line = "";
                }
                for (const char of Array.from(word)) {
                    if (line && measure(line + char) > maxWidth) {
                        lines.push(line);
                        line = "";
                    }
                    line += char;
                }
            }
            else
                line = line ? line + " " + word : word;
        }
        lines.push(line);
    }
    return lines;
}
export function paginateScene(page, maxHeight = 1460, footer) {
    if (page.height <= maxHeight)
        return [page];
    const footerColour = page.items.find(i => i.type === "text" && i.value === footer)?.colour || "#183248";
    const content = page.items.filter(i => i.type !== "text" || i.value !== footer).flatMap(i => i.type === "text" ? i.lines.map((line, n) => ({ ...i, value: line, lines: [line], y: i.y + n * i.size * i.leading })) : [i]);
    const end = Math.max(...content.filter(i => i.type !== "rect" && i.type !== "ellipse").map(i => i.y + (i.type === "text" ? i.size * i.leading : i.height)));
    const chunks = [];
    let from = 0;
    while (from < end) {
        let to = Math.min(end, from + maxHeight - 160);
        for (const i of content) {
            const h = i.type === "text" ? i.size * i.leading : i.height;
            if (["text", "art", "photo"].includes(i.type) && i.y < to && i.y + h > to && i.y > from + 40)
                to = i.y;
        }
        if (to <= from + 40)
            to = Math.min(end, from + maxHeight - 160);
        const chunkItems = content.filter(i => { const h = i.type === "text" ? i.size * i.leading : i.height; return ["rect", "ellipse"].includes(i.type) || (i.y >= from - .01 && i.y < to - .01); }).map(i => ({ ...i, y: i.y - from + 36 }));
        const h = to - from + 150;
        chunkItems.push({ type: "text", value: footer, lines: wrapFooter(footer), x: 64, y: h - 95, width: 952, size: 22, font: "regular", colour: footerColour, align: "left", leading: 1.3 });
        chunks.push({ ...page, side: chunks.length ? "Personal milestone · continued" : page.side, height: h, items: chunkItems });
        from = to;
    }
    return chunks;
}
const wrapFooter = s => s.length > 85 ? [s.slice(0, s.lastIndexOf(" ", 85)), s.slice(s.lastIndexOf(" ", 85) + 1)] : [s];
