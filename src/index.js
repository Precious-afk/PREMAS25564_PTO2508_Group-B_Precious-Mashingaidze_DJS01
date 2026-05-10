import { podcasts } from "./data.js";
import { createModal } from "./components/createModal.js";
import { createGrid } from "./views/createGrid.js";

/**
 * Initializes the podcast application.
 *
 * @principle SRP - Only responsible for application startup logic like event binding and rendering initial grid.
 */
function init() {
  // Defensive: only wire the close button if it exists. Some live-reload
  // setups can momentarily desync the DOM and JS, and a single missing
  // element should not prevent the rest of the app (the grid!) from rendering.
  const closeBtn = document.getElementById("closeModal");
  if (closeBtn) {
    closeBtn.addEventListener("click", createModal.close);
  } else {
    console.warn("closeModal button not found — modal close still works via Esc/backdrop.");
  }

  try {
    const grid = createGrid();
    grid.render(podcasts);
  } catch (err) {
    // Surface the real error in BOTH the console and on the page itself,
    // so a silent JS failure can't ever again leave the user staring at a
    // blank grid with no idea why.
    console.error("Failed to render grid:", err);
    const gridEl = document.getElementById("podcastGrid");
    if (gridEl) {
      gridEl.innerHTML = `
        <div style="grid-column:1/-1;padding:24px;border:1px solid #fca5a5;
                    background:#fef2f2;color:#991b1b;border-radius:12px;
                    font-family:system-ui,sans-serif;font-size:14px;">
          <strong>Couldn't render podcasts.</strong><br>
          <code style="font-size:13px;">${String(err && err.message || err)}</code>
        </div>`;
    }
  }
}

// Run as soon as the DOM is ready. Modules are deferred by default, so on a
// normal load this fires immediately. The DOMContentLoaded guard is a belt-
// and-braces fallback for unusual server / live-reload setups.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
