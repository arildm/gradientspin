const canvas = document.getElementById("canvas");

function paint(el) {
  // Load data
  const gr = JSON.parse(el.getAttribute("data-gr"))

  // Calculate new values
  const s = (Date.now() - gr.start) / 1000
  const alpha = Math.round(getAlpha(s) * .7);
  const deg = Math.round(gr.deg + s * 20);

  // Paint gradient
  el.style.background = `linear-gradient(${deg}deg, ${oklchStr(gr.from, alpha)}, ${oklchStr(gr.to, alpha)})`

  // Collect garbage
  if (alpha < 0) canvas.removeChild(el);
}

// Quadratic curve that goes 0 -> 100 -> 0, with 100 on x=peak
const mkInout = peak => x => -100/peak/peak * x*x + 200/peak * x
const getAlpha = mkInout(5); // Peak in 5s
const oklchStr = (lch, a) => `oklch(${lch.l}% ${lch.c} ${lch.h} / ${a / 100})`;

function create() {
  const from = genLch();
  const to = genLch();
  // Ensure a big enough distance between two hues.
  to.h = from.h + r(70, 160) * rsign();

  const gr = {
    start: Date.now(),
    deg: r(0, 360),
    from,
    to,
  };

  const el = document.createElement("div");
  el.className = "layer gradient";
  el.setAttribute("data-gr", JSON.stringify(gr));
  canvas.appendChild(el);
}

const r = (min, max) => Math.round(min + Math.random() * (max - min));
const rbool = () => Math.random() > 0.5;
const rsign = () => rbool() ? 1 : -1;
const genHsl = () => ({
  h: r(0, 360),
  s: r(70, 95),
  l: r(50, 70)
});
const genLch = () => ({
  l: 70,
  c: 0.17,
  h: r(0, 360),
})

// Create an initial gradient
create();
// Start a new gradient every 4s
setInterval(() => create(), 4000);
// Progress and repaint at small time steps.
setInterval(() =>
  document.querySelectorAll("[data-gr]")
  .forEach(paint), 100);

