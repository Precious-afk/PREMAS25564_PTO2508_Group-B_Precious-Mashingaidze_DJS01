import { DateUtils } from "../utils/DateUtils.js";
import { GenreService } from "../utils/GenreService.js";

/**
 * Modal Component — singleton controller for the show-details dialog.
 *
 * @principle SRP — Single Responsibility:
 *   Owns the modal DOM lifecycle: populating it from a podcast, opening it,
 *   and closing it. Does not know about the grid, cards, or data fetching.
 * @principle Encapsulation:
 *   Element references and last-focus state are kept in module-private
 *   variables. Consumers only see the small `open`/`close` API surface.
 * @principle Accessibility:
 *   - aria-modal + aria-hidden are kept in sync.
 *   - Focus is trapped inside the panel while open.
 *   - Esc + backdrop click + close button all close the modal.
 *   - Focus is restored to the trigger element after closing.
 */

/* ---------- DOM references (lazy-initialized) ---------- */
let modalEl;
let titleEl;
let descEl;
let updatedTextEl;
let coverWrapEl;
let imageEl;
let genresEl;
let seasonsEl;
let closeBtn;

/* ---------- State ---------- */
let lastFocusedTrigger = null;
let listenersBound = false;

/**
 * Cache DOM lookups on first use.
 */
function cacheDOM() {
  if (modalEl) return;

  modalEl        = document.getElementById("modal");
  titleEl        = document.getElementById("modalTitle");
  descEl         = document.getElementById("modalDescription");
  updatedTextEl  = document.getElementById("modalUpdatedText");
  imageEl        = document.getElementById("modalImage");
  coverWrapEl    = imageEl ? imageEl.parentElement : null;
  genresEl       = document.getElementById("modalGenres");
  seasonsEl      = document.getElementById("modalSeasons");
  closeBtn       = document.getElementById("closeModal");
}

/**
 * Bind global listeners exactly once (Esc key, backdrop click, focus trap).
 */
function bindGlobalListeners() {
  if (listenersBound) return;

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalEl && !modalEl.hidden) {
      createModal.close();
    }
  });

  // Close on backdrop click
  modalEl.addEventListener("click", (e) => {
    if (e.target instanceof Element && e.target.dataset.close === "true") {
      createModal.close();
    }
  });

  // Trap focus inside the modal panel while open
  modalEl.addEventListener("keydown", trapFocus);

  // Defensive: also bind the close button here.
  closeBtn.addEventListener("click", createModal.close);

  listenersBound = true;
}

/**
 * Keeps Tab navigation inside the modal panel.
 * @param {KeyboardEvent} e
 */
function trapFocus(e) {
  if (e.key !== "Tab") return;

  const focusables = modalEl.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusables.length === 0) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/* ---------- Public API ---------- */

export const createModal = {
  /**
   * Open the modal and populate it from a podcast object.
   *
   * @param {import("../data.js").Podcast} podcast
   */
  open(podcast) {
    cacheDOM();
    bindGlobalListeners();

    // Remember which element opened the modal so we can restore focus on close.
    lastFocusedTrigger = document.activeElement;

    // ----- Populate fields -----
    titleEl.textContent = podcast.title;
    descEl.textContent  = podcast.description;

    // Reference uses "Last updated: <date>" rather than the card's "Updated <date>".
    // We reuse DateUtils.format and replace its prefix to stay DRY.
    const formatted = DateUtils.format(podcast.updated)
      .replace(/^Updated\s/, "Last updated: ");
    updatedTextEl.textContent = formatted;

    // Cover: use real image if available, otherwise show the "Large Cover Image"
    // placeholder shown in the reference designs.
    if (podcast.image) {
      imageEl.src = podcast.image;
      imageEl.alt = `Cover art for ${podcast.title}`;
      imageEl.hidden = false;
      // Remove any leftover placeholder
      const existing = coverWrapEl.querySelector(".modal-cover-placeholder");
      if (existing) existing.remove();
    } else {
      imageEl.hidden = true;
      imageEl.removeAttribute("src");
      // Insert placeholder span if not already present
      let placeholder = coverWrapEl.querySelector(".modal-cover-placeholder");
      if (!placeholder) {
        placeholder = document.createElement("span");
        placeholder.className = "modal-cover-placeholder";
        coverWrapEl.appendChild(placeholder);
      }
      placeholder.textContent = "Large Cover Image";
    }

    // Genres
    genresEl.innerHTML = "";
    GenreService.getNames(podcast.genres).forEach((name) => {
      const tag = document.createElement("span");
      tag.className = "genre-tag";
      tag.textContent = name;
      genresEl.appendChild(tag);
    });

    // Seasons
    seasonsEl.innerHTML = "";
    const details = Array.isArray(podcast.seasonDetails)
      ? podcast.seasonDetails
      : [];

    if (details.length === 0) {
      const li = document.createElement("li");
      li.className = "season-item";
      li.textContent = "No season details available.";
      seasonsEl.appendChild(li);
    } else {
      details.forEach((season) => {
        seasonsEl.appendChild(renderSeasonItem(season));
      });
    }

    // ----- Show modal -----
    modalEl.hidden = false;
    modalEl.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // Move focus to the close button so screen readers + keyboard users
    // immediately know they're inside a dialog.
    requestAnimationFrame(() => closeBtn.focus());
  },

  /**
   * Close the modal and restore focus to the previously-focused trigger.
   */
  close() {
    cacheDOM();
    if (!modalEl) return;

    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
    lastFocusedTrigger = null;
  },
};

/* ---------- internal helpers ---------- */

/**
 * Builds a single <li> for a season row.
 *
 * @param {import("../data.js").Season} season
 * @returns {HTMLLIElement}
 */
function renderSeasonItem(season) {
  const li = document.createElement("li");
  li.className = "season-item";

  const info = document.createElement("div");
  info.className = "season-info";

  const titleDiv = document.createElement("div");
  titleDiv.className = "season-title";
  titleDiv.textContent = season.title;
  info.appendChild(titleDiv);

  if (season.subtitle) {
    const sub = document.createElement("div");
    sub.className = "season-subtitle";
    sub.textContent = season.subtitle;
    info.appendChild(sub);
  }

  const eps = document.createElement("span");
  eps.className = "season-episodes";
  eps.textContent = `${season.episodes} episode${
    season.episodes === 1 ? "" : "s"
  }`;

  li.append(info, eps);
  return li;
}
