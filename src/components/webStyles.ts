import { fontStack, focusColours } from "./theme";
export const webStyles = `
html{scroll-behavior:auto}body{margin:0;font-family:${fontStack}}button,a,input,textarea{font:inherit}
button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible,[tabindex]:focus-visible{outline:3px solid ${focusColours.light};outline-offset:3px}
[data-vad-theme="dark"]{color-scheme:dark}
[data-vad-theme="dark"] :focus-visible{outline-color:${focusColours.dark}}
[data-vad-contrast="high"] :focus-visible{outline-width:4px}
#skip-to-content:focus-visible{left:16px!important;top:4px!important}
main:focus{outline:none}
button,a,input,textarea{max-width:100%;overflow-wrap:anywhere}
*{animation:none!important;transition:none!important;scroll-behavior:auto!important}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
@media print{html,body,#root{height:auto!important;overflow:visible!important;background:#FFFFFF!important;color:#111111!important}[data-testid="urgent-banner"],[data-testid="site-header"],[data-testid="app-navigation"],[data-testid="skip-link"],[data-testid="site-footer"],button,input,textarea,[role="button"]{display:none!important}a{color:#111111!important;text-decoration:none!important}*{box-shadow:none!important;overflow:visible!important}}
`;
