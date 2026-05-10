import { DateUtils } from "../utils/DateUtils.js";
import { GenreService } from "../utils/GenreService.js";
import { createModal } from "./createModal.js";

/**
 * Podcast Card Component — builds an interactive preview card for a podcast.
 *
 * Visual structure (matches reference design):
 *   [ cover image or placeholder ]
 *   Podcast Title
 *   📅 N seasons
 *   [ genre ] [ genre ]
 *   Updated <date>
 *
 * @principle SRP — Single Responsibility:
 *   Builds a single card DOM node. Does not own grid layout, data fetching,
 *   or modal rendering (it only triggers it).
 * @principle OCP — Open/Closed:
 *   Accepts any podcast object that conforms to the documented shape.
 * @principle Functional — Pure factory: same input → same output node.
 */

/**
 * Creates a podcast preview card element.
 *
 * @param {import("../data.js").Podcast} podcast - Podcast object.
 * @returns {HTMLButtonElement} A fully-built, interactive card element.
 */
export function createPodcastCard(podcast) {
  // <button> rather than <div>: free keyboard support, semantics, focus ring.
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.setAttribute(
    "aria-label",
    `${podcast.title}. ${podcast.seasons} season${
      podcast.seasons === 1 ? "" : "s"
    }. View details.`
  );

  const genreNames = GenreService.getNames(podcast.genres);

  // Cap visible tags to 2 so cards stay tidy (matches reference designs).
  const genreTagsHTML = genreNames
    .slice(0, 2)
    .map((name) => `<span class="genre-tag">${escapeHTML(name)}</span>`)
    .join("");

  // Cover: real image if provided, otherwise the "Podcast Cover" placeholder
  // shown in the reference designs. Using a placeholder by default makes the
  // app work fully offline (no Unsplash, no broken-image icons).
  const coverHTML = podcast.image
    ? `<img
         class="card-cover"
         src="${escapeAttr(podcast.image)}"
         alt="Cover art for ${escapeAttr(podcast.title)}"
         loading="lazy"
       />`
    : `<span class="card-cover-placeholder">Podcast Cover</span>`;

  card.innerHTML = `
    <div class="card-cover-wrap">
      ${coverHTML}
    </div>

    <h3 class="card-title">${escapeHTML(podcast.title)}</h3>

    <span class="card-seasons">
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      ${podcast.seasons} season${podcast.seasons === 1 ? "" : "s"}
    </span>

    <div class="card-genres" aria-label="Genres">
      ${genreTagsHTML}
    </div>

    <p class="card-meta">${escapeHTML(DateUtils.format(podcast.updated))}</p>
  `;

  // Open modal on click. Card is a <button>, so Enter/Space already trigger this.
  card.addEventListener("click", () => createModal.open(podcast));

  return card;
}

/* ---------- internal helpers ---------- */

/**
 * Escapes HTML-significant characters in text content.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Escapes a string for safe interpolation inside a double-quoted attribute.
 * @param {string} str
 * @returns {string}
 */
function escapeAttr(str) {
  return escapeHTML(str);
}
