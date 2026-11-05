(() => {
  const cfg = window.PORTFOLIO_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const safe = (value, fallback = "") => value ?? fallback;
  const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
  const setText = (key, value) => document.querySelectorAll(`[data-config="${key}"]`).forEach(el => el.textContent = value);

  setText("name", safe(cfg.name, "MAHIR MORSHED"));
  setText("firstName", safe(cfg.firstName, "Mahir"));
  setText("year", safe(cfg.year, "2026"));
  setText("availability", safe(cfg.availability, "OPEN TO WHAT'S NEXT"));
  setText("headline", safe(cfg.headline, "Developer. Problem solver. Perpetual builder."));
  setText("intro", safe(cfg.intro, ""));
  document.title = `${safe(cfg.name, "Mahir Morshed")} — Developer Portfolio`;

  const github = cfg.githubUrl || (cfg.githubUsername ? `https://github.com/${cfg.githubUsername}` : "");
  $("#heroGithub").href = github || "#contact";
  $("#githubLink").href = github || "#contact";
  $("#linkedinLink").href = cfg.linkedin || "#contact";
  $("#resumeLink").href = cfg.resume || "#contact";
  $("#emailLink").href = `mailto:${cfg.email || "hello@example.com"}`;
  $("#emailLink").innerHTML = `${escapeHTML(cfg.email || "hello@example.com")} <span>↗</span>`;

  // Dynamic theme-aware portrait loader
  const portraitEl = $("#portrait");
  const fallbackEl = $("#portraitFallback");
  
  function updatePortrait() {
    const isLight = document.documentElement.dataset.theme === "light";
    const currentImg = (isLight && cfg.portraitLight) ? cfg.portraitLight : cfg.portrait;

    if (currentImg) {
      portraitEl.src = currentImg;
      portraitEl.style.display = "block";
      fallbackEl.style.display = "none";
    } else {
      portraitEl.style.display = "none";
      fallbackEl.style.display = "flex";
    }
  }

  portraitEl.addEventListener("error", () => {
    portraitEl.style.display = "none";
    fallbackEl.style.display = "flex";
  });

  updatePortrait();

  const logo = (t, size) => t.slug
    ? `<img src="https://cdn.simpleicons.org/${encodeURIComponent(t.slug)}/${encodeURIComponent(t.color || "38BDF8")}" alt="" width="${size}" height="${size}" loading="lazy" onerror="this.outerHTML=this.dataset.f" data-f="${escapeHTML(t.icon || "✳")}">`
    : escapeHTML(t.icon || "✳");
  $("#toolGrid").innerHTML = (cfg.tools || []).map(tool => `
    <article class="tool-card">
      <div class="tool-icon">${logo(tool, 32)}</div>
      <h3>${escapeHTML(tool.name)}</h3>
      <p>${escapeHTML(tool.category)}</p>
    </article>`).join("");

  function renderProjects(projects, isGithub) {
    $("#projectGrid").innerHTML = projects.map((p, index) => `
      <article class="project-card">
        <div class="project-meta">PROJECT / ${String(index + 1).padStart(2, "0")} · ${isGithub ? "PUBLIC REPOSITORY" : "CONCEPT"}</div>
        <h3>${escapeHTML(p.name || p.full_name || "Untitled project")}</h3>
        <p>${escapeHTML(p.description || "A public project from my GitHub profile.")}</p>
        <div class="project-bottom">
          <span class="project-tag">${escapeHTML(p.language || "Open source")}</span>
          <a class="project-link" href="${escapeHTML(p.html_url || p.url || "#")}" target="_blank" rel="noreferrer">${isGithub ? "View repository ↗" : escapeHTML(p.label || "Editable sample")}</a>
        </div>
      </article>`).join("");
  }

  const samples = cfg.sampleProjects || [];
  renderProjects(samples, false);
  if (cfg.githubUsername) {
    $("#githubStatus").innerHTML = '<span class="status-dot"></span> LOADING / FETCHING PUBLIC REPOSITORIES';
    fetch(`https://api.github.com/users/${encodeURIComponent(cfg.githubUsername)}/repos?sort=updated&per_page=6`)
      .then(response => {
        if (!response.ok) throw new Error("GitHub profile could not be loaded");
        return response.json();
      })
      .then(repos => {
        const publicRepos = repos.filter(repo => !repo.fork).slice(0, 6);
        if (!publicRepos.length) throw new Error("No public repositories found");
        renderProjects(publicRepos, true);
        $("#githubStatus").innerHTML = '<span class="status-dot"></span> LIVE / LATEST PUBLIC GITHUB REPOSITORIES';
      })
      .catch(() => {
        renderProjects(samples, false);
        $("#githubStatus").innerHTML = '<span class="status-dot"></span> PREVIEW MODE / COULD NOT LOAD GITHUB — SHOWING SAMPLE PROJECTS';
      });
  }

  const spotlightList = $("#spotlightList");
  spotlightList.innerHTML = (cfg.spotlights || []).map((p, i) => `
    <article class="spotlight">
      <div class="spotlight-image">
        ${p.image ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)} screenshot" onerror="this.remove()">` : ""}
        <div class="image-placeholder"><strong>PROJECT ${String(i + 1).padStart(2, "0")} / SCREENSHOT</strong>[Replace this area with your project image]</div>
      </div>
      <div class="spotlight-content">
        <div class="spotlight-index">PROJECT ${String(i + 1).padStart(2, "0")} / CASE STUDY</div>
        <h3>${escapeHTML(p.name)}</h3>
        <p class="spotlight-meta">${escapeHTML(p.role)}</p>
        <p class="spotlight-stack">${escapeHTML(p.stack)}</p>
        ${[["THE PROBLEM", p.problem], ["MY CONTRIBUTION", p.contribution], ["TECHNICAL CHALLENGE", p.challenge], ["RESULT & LEARNING", p.result]].map(([label, text]) => `
          <div class="detail-block"><h4>${label}</h4><p>${escapeHTML(text)}</p></div>`).join("")}
        <div class="spotlight-actions">
          ${p.demo ? `<a href="${escapeHTML(p.demo)}" target="_blank" rel="noreferrer">LIVE DEMO ↗</a>` : `<span class="project-link">LIVE DEMO / ADD URL</span>`}
          ${p.source ? `<a href="${escapeHTML(p.source)}" target="_blank" rel="noreferrer">SOURCE CODE ↗</a>` : `<span class="project-link">SOURCE CODE / ADD URL</span>`}
        </div>
      </div>
    </article>`).join("");

  function renderTimeline(target, items) {
    $(target).innerHTML = (items || []).map(item => `
      <article class="timeline-item">
        <h3>${escapeHTML(item.role)}</h3>
        <div class="timeline-place">${escapeHTML(item.place)}</div>
        <div class="timeline-date">${escapeHTML(item.date)}</div>
        <p>${escapeHTML(item.description)}</p>
      </article>`).join("");
  }
  renderTimeline("#experienceList", cfg.experience);
  renderTimeline("#educationList", cfg.education);

  const root = document.documentElement, themeBtn = $("#themeToggle"), themeMeta = document.querySelector('meta[name="theme-color"]');
  const applyMeta = () => themeMeta && themeMeta.setAttribute("content", root.dataset.theme === "light" ? "#f4f5f0" : "#0b0f17");
  applyMeta();
  
  themeBtn.addEventListener("click", () => {
    root.classList.add("theme-anim");
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    applyMeta();
    updatePortrait(); // Swap the image source on theme toggle
    setTimeout(() => root.classList.remove("theme-anim"), 450);
  });

  const toggle = $("#menuToggle");
  const nav = $("#mobileNav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "☰";
  }));

  // ---------- 3D orbit of tools around the portrait ----------
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const orbitBox = $("#orbitItems");
  orbitBox.innerHTML = (cfg.tools || []).slice(0, 10).map(t => `<div class="orbit-item">${logo(t, 26)}<span>${escapeHTML(t.name)}</span></div>`).join("");
  const items = [...orbitBox.children];
  const scene = $("#scene");
  const rings = document.querySelectorAll(".orbit-ring");
  const st = { angle: 0, tilt: 0.34, tiltT: 0.34, spin: 0.0035, yaw: 0, yawT: 0 };
  function frame() {
    st.angle += st.spin;
    st.tilt += (st.tiltT - st.tilt) * 0.08;
    st.yaw += (st.yawT - st.yaw) * 0.08;
    const R = scene.offsetWidth * 0.46, n = items.length;
    items.forEach((el, i) => {
      const a = st.angle + (i / n) * Math.PI * 2;
      const z = Math.sin(a), depth = (z + 1) / 2;
      const x = Math.cos(a) * R;
      const y = z * R * st.tilt - Math.cos(a) * R * st.yaw * 0.35;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${0.62 + depth * 0.5})`;
      el.style.opacity = 0.35 + depth * 0.65;
      el.style.filter = `blur(${(1 - depth) * 1.4}px)`;
      el.style.zIndex = z > 0 ? 5 : 0;
    });
    rings.forEach(r => r.style.setProperty("--tilt", `${90 - st.tilt * 52}deg`));
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
  const hv = $(".hero-visual");
  hv.addEventListener("pointermove", e => {
    const r = hv.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    st.tiltT = 0.34 - py * 0.5; st.yawT = px; st.spin = 0.0035 + Math.abs(px) * 0.006;
  });
  hv.addEventListener("pointerleave", () => { st.tiltT = 0.34; st.yawT = 0; st.spin = 0.0035; });

  // ---------- typed headline ----------
  const h2 = document.querySelector(".hero h2");
  if (h2 && !reduce) {
    const full = h2.textContent, txt = document.createTextNode(""), caret = document.createElement("span");
    caret.className = "caret"; h2.textContent = ""; h2.append(txt, caret);
    let k = 0; const tick = () => { txt.textContent = full.slice(0, ++k); if (k < full.length) setTimeout(tick, 38); };
    setTimeout(tick, 600);
  }

  // ---------- scroll progress, card spotlight + tilt ----------
  const bar = $("#progress");
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }, { passive: true });

  document.querySelectorAll(".tool-card, .project-card").forEach(card => {
    const tilt = card.classList.contains("project-card");
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px"); card.style.setProperty("--my", y + "px");
      if (tilt && !reduce) card.style.transform = `perspective(700px) rotateX(${(0.5 - y / r.height) * 7}deg) rotateY(${(x / r.width - 0.5) * 7}deg) translateY(-5px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });
})();
