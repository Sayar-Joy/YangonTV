// Auto-generate breadcrumb based on URL and (optionally) page data
(function () {
  function getFileName() {
    let f = window.location.pathname.split("/").pop() || "index.html";
    // handle no extension cases
    if (!f.includes(".")) f = f + ".html";
    return f;
  }

  function ensureContainer() {
    let el = document.getElementById("breadcrumb");
    if (!el) {
      el = document.createElement("nav");
      el.id = "breadcrumb";
      el.className = "breadcrumb";
      el.setAttribute("aria-label", "Breadcrumb");
      // place after navbar if present, else at top of body
      const navHost = document.getElementById("navbar-container");
      if (navHost && navHost.parentNode) {
        navHost.parentNode.insertBefore(el, navHost.nextSibling);
      } else {
        document.body.insertBefore(el, document.body.firstChild);
      }
    }
    return el;
  }

  function q(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function buildCrumbs() {
    const file = getFileName();
    const type = q("type") === "series" ? "series" : "movies";

    const crumbs = [];
    // Home
    crumbs.push({ label: "Home", href: "index.html" });

    if (file === "index.html") {
      // Home only
      return crumbs.map((c, i) => ({ ...c, current: i === crumbs.length - 1 }));
    }

    const labels = {
      "popularMovies.html": "Popular Movies",
      "trendingMovies.html": "Trending Movies",
      "popularSeries.html": "Popular Series",
      "trendingSeries.html": "Trending Series",
      "movies.html": "Movies",
      "series.html": "Series",
      "genre.html": "Genres",
      "reachUs.html": "Reach Us",
    };

    if (file === "detail.html") {
      // Add section crumb
      const sectionLabel = type === "series" ? "Series" : "Movies";
      const sectionHref = type === "series" ? "series.html" : "movies.html";
      crumbs.push({ label: sectionLabel, href: sectionHref });

      // Title as current (prefer document.title, else id)
      const id = q("id") || "Detail";
      let title = document.title || id;
      // Clean default titles like "Movie Detail"
      if (/detail/i.test(title) && id) title = id;
      crumbs.push({ label: title, current: true });
      return crumbs;
    }

    const label = labels[file] || file.replace(/\.html$/, "");
    crumbs.push({ label, current: true });
    return crumbs;
  }

  function render() {
    const host = ensureContainer();
    const crumbs = buildCrumbs();

    // Build HTML with separators
    host.innerHTML = crumbs
      .map((c, idx) => {
        const part = c.current
          ? `<span class="current" aria-current="page">${c.label}</span>`
          : `<a href="${c.href || "#"}">${c.label}</a>`;
        const sep = idx < crumbs.length - 1 ? `<span class="sep">/</span>` : "";
        return part + (sep ? " " + sep + " " : "");
      })
      .join("");
  }

  // Expose an updater so pages can refresh breadcrumb after dynamic title changes
  window.updateBreadcrumb = render;

  document.addEventListener("DOMContentLoaded", render);
})();
