function getPreference(name, defaultValue) {
  // This will depend on your loader, but here's a flexible version
  return window.Preferences?.[name] !== undefined
    ? window.Preferences[name]
    : defaultValue;
}

// Later, when applying glow:
const animationStyle = getPreference("pulse-glow-animation", 1);
const glowSize = getPreference("pulse-glow-size", 2);
const intensity = getPreference("pulse-glow-intensity", 2);
const enabled = getPreference("pulse-enable-glow", true);

if (!enabled) return;

// Set CSS variables based on prefs
let width = "1px",
  spread = "3px",
  opacity = 0.7;

if (glowSize === 1) spread = "2px";
if (glowSize === 3) spread = "5px";

if (intensity === 1) opacity = 0.5;
if (intensity === 3) opacity = 0.9;

const baseColor = getFaviconColor(img) || "100, 200, 255";
const colorWithAlpha = (a) => `rgba(${baseColor}, ${a * opacity})`;

tab.style.setProperty("--pulse-glow-color", colorWithAlpha(1.0));
tab.style.setProperty("--pulse-glow-width", width);
tab.style.setProperty("--pulse-glow-spread", spread);

// Animation timing
const durations = { 1: "1.8s", 2: "1.2s", 3: "0.8s", 4: "2.5s" };
const easings = {
  1: "ease-out",
  2: "cubic-bezier(0.4, 0, 0.6, 1)",
  3: "linear",
  4: "ease-in-out",
};

tab.style.setProperty("--pulse-glow-duration", durations[animationStyle]);
tab.style.setProperty("--pulse-glow-easing", easings[animationStyle]);
