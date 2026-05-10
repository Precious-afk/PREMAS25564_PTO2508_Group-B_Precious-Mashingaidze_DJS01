import { createPodcastCard } from "../components/createPodcastCard.js";
import { genres } from "../data.js";

/**
 * Grid View — renders the collection of podcast preview cards.
 *
 * Also wires the two filter <select> dropdowns ("All Genres" and
 * "Recently Updated") to live-filter and sort the rendered grid.
 *
 * @principle SRP — Single Responsibility:
 *   Owns the grid container's contents and its filter/sort state. It does
 *   NOT know how to build a single card (delegated to createPodcastCard) or
 *   how a podcast is shaped beyond passing it through.
 * @principle DIP — Depends on the createPodcastCard abstraction, not on a
 *   specific card implementation.
 * @principle Functional — `createGrid` is a closure-based view object with a
 *   single public `render` method.
 *
 * @returns {{ render: (podcasts: import("../data.js").Podcast[]) => void }}
 */
export function createGrid() {
  const gridEl       = document.getElementById("podcastGrid");
  const genreSelect  = document.getElementById("genreFilter");
  const sortSelect   = document.getElementById("sortFilter");

  if (!gridEl) {
    throw new Error(
      'createGrid: #podcastGrid element not found in the document.'
    );
  }

  /** @type {import("../data.js").Podcast[]} */
  let allPodcasts = [];

  /**
   * Apply the current dropdown values to the master list and re-render.
   */
  function applyFiltersAndRender() {
    const genreVal = genreSelect ? genreSelect.value : "all";
    const sortVal  = sortSelect ? sortSelect.value : "recent";

    let list = allPodcasts.slice();

    // ----- Filter by genre -----
    if (genreVal !== "all") {
      const id = Number(genreVal);
      list = list.filter((p) => Array.isArray(p.genres) && p.genres.includes(id));
    }

    // ----- Sort -----
    switch (sortVal) {
      case "popular":
        // Proxy "popularity" with total season count (no real metric in seed data).
        list.sort((a, b) => (b.seasons || 0) - (a.seasons || 0));
        break;
      case "newest":
      case "recent":
      default:
        // Both "Recently Updated" and "Newest" sort by `updated` desc here;
        // the dropdown is wired so behaviour can diverge later if needed.
        list.sort(
          (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
        break;
    }

    paint(list);
  }

  /**
   * Renders the given list into the grid. Uses a DocumentFragment so we
   * touch the live DOM only once per render.
   *
   * @param {import("../data.js").Podcast[]} list
   */
  function paint(list) {
    gridEl.innerHTML = "";

    if (!Array.isArray(list) || list.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "No podcasts match your filters.";
      gridEl.appendChild(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    list.forEach((podcast) => {
      fragment.appendChild(createPodcastCard(podcast));
    });
    gridEl.appendChild(fragment);
  }

  /**
   * Populates the genre <select> with one <option> per known genre.
   * Idempotent: clears existing options (apart from the "All Genres" default)
   * before appending so repeated calls don't duplicate entries.
   */
  function populateGenreOptions() {
    if (!genreSelect) return;

    // Keep the first "All Genres" option, drop the rest.
    while (genreSelect.options.length > 1) {
      genreSelect.remove(1);
    }

    genres.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = String(g.id);
      opt.textContent = g.title;
      genreSelect.appendChild(opt);
    });
  }

  // Wire up filter change listeners exactly once, when the grid is created.
  if (genreSelect) {
    genreSelect.addEventListener("change", applyFiltersAndRender);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", applyFiltersAndRender);
  }

  return {
    /**
     * Render an array of podcasts into the grid (also captures it as the
     * master list that filters operate on).
     *
     * @param {import("../data.js").Podcast[]} podcasts
     */
    render(podcasts) {
      allPodcasts = Array.isArray(podcasts) ? podcasts.slice() : [];
      populateGenreOptions();
      applyFiltersAndRender();
    },
  };
}
