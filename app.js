(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var current = null, currentPlace = "";

  // -------------------------------------------------------------
  // Graphite Procedural Audio Engine (thtbee/graphite emulation)
  // Pure Web Audio API: Zero external files or CDNs required
  // -------------------------------------------------------------
  var audioCtx = null;
  var soundEnabled = true;

  function getAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Wooden pencil lead tap on paper
  function playPencilTap() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudio();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.035);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (e) {}
  }

  // Soft textured graphite friction sweep
  function playGraphiteSweep() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudio();
      if (!ctx) return;
      var bufferSize = Math.floor(ctx.sampleRate * 0.09);
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      var noise = ctx.createBufferSource();
      noise.buffer = buffer;
      var filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1600;
      filter.Q.value = 1.4;
      var gain = ctx.createGain();
      gain.gain.value = 0.05;
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Sound toggle button handling
  var soundToggle = $("soundToggle");
  if (soundToggle) {
    soundToggle.addEventListener("click", function () {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle("active", soundEnabled);
      var soundIcon = $("soundIcon");
      var soundLabel = $("soundLabel");
      var lang = (window.TrailQRI18n && window.TrailQRI18n.getLang()) || "en";
      if (soundIcon) soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
      if (soundLabel) {
        soundLabel.textContent = soundEnabled 
          ? (window.TrailQRI18n ? window.TrailQRI18n.t("audioActive", lang) : "Audio Active")
          : (window.TrailQRI18n ? window.TrailQRI18n.t("audioMuted", lang) : "Audio Muted");
      }
      if (soundEnabled) playPencilTap();
    });
  }

  // -------------------------------------------------------------
  // Left Sidebar View Switching Engine
  // -------------------------------------------------------------
  function switchView(viewId) {
    var navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    var targetNav = null;
    navItems.forEach(function (item) {
      var match = item.getAttribute("data-view") === viewId;
      item.classList.toggle("active", match);
      if (match) targetNav = item;
    });

    var views = document.querySelectorAll(".main-views-container .app-view");
    views.forEach(function (v) {
      v.classList.toggle("active", v.id === viewId);
    });

    if (targetNav) {
      var labelEl = targetNav.querySelector(".nav-label");
      if (labelEl && $("breadcrumbTitle")) {
        $("breadcrumbTitle").textContent = labelEl.textContent;
      }
    }

    // View-specific initializations
    if (viewId === "viewMap") {
      if (window.TrailQRMap) {
        window.TrailQRMap.init();
        setTimeout(function () {
          window.TrailQRMap.init();
          window.TrailQRMap.renderMarkers();
        }, 120);
      }
    } else if (viewId === "viewRegistry") {
      renderRegistry();
    } else if (viewId === "viewSnowflake") {
      renderSnowflakeIntelligence(window.TrailQRRegistry.load());
    }

    // Dismiss mobile drawer
    document.body.classList.remove("sidebar-open");
  }

  // Wire sidebar navigation items
  var navItems = document.querySelectorAll(".sidebar-nav .nav-item");
  navItems.forEach(function (item) {
    item.addEventListener("click", function () {
      playPencilTap();
      var viewId = item.getAttribute("data-view");
      if (viewId) switchView(viewId);
    });
  });

  // Mobile sidebar toggle & close
  var sidebarToggle = $("sidebarToggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      playPencilTap();
      document.body.classList.toggle("sidebar-open");
    });
  }

  var sidebarCloseBtn = $("sidebarCloseBtn");
  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener("click", function () {
      playPencilTap();
      document.body.classList.remove("sidebar-open");
    });
  }

  // -------------------------------------------------------------
  // Vernacular Language Switcher Engine (EN · বাংলা · हिन्दी)
  // -------------------------------------------------------------
  var langBtns = document.querySelectorAll(".lang-btn");
  langBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      playPencilTap();
      var lang = btn.getAttribute("data-lang");
      if (window.TrailQRI18n) {
        window.TrailQRI18n.setLang(lang);
      }

      // Update active breadcrumb title to match translated active nav label
      var activeNav = document.querySelector(".sidebar-nav .nav-item.active");
      if (activeNav) {
        var labelEl = activeNav.querySelector(".nav-label");
        if (labelEl && $("breadcrumbTitle")) {
          $("breadcrumbTitle").textContent = labelEl.textContent;
        }
      }

      // If active scan result is present, re-generate explanation in selected language
      if (current && window.TrailQRGemma) {
        var area = $("area") ? $("area").value.trim() : "";
        window.TrailQRGemma.explain(current, currentPlace || area).then(function (out) {
          if ($("explanation")) $("explanation").textContent = out.text;
          if ($("gemmaMode")) $("gemmaMode").textContent = (out.mode === "gemma-live" ? "Gemma 4 · Live via Gemini API" : "Gemma 4 · Scripted Local Fallback");
        });
        var quest = window.TrailQRGemma.quest(current, currentPlace || area);
        if ($("questBox")) $("questBox").hidden = !quest;
        if ($("quest")) $("quest").textContent = quest || "";
      }

      // Refresh map popups
      if (window.TrailQRMap) {
        window.TrailQRMap.renderMarkers();
      }
    });
  });

  // -------------------------------------------------------------
  // Threat Map Filters & Search Input
  // -------------------------------------------------------------
  var mapFilterBtns = document.querySelectorAll("[data-map-filter]");
  mapFilterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      playPencilTap();
      mapFilterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var f = btn.getAttribute("data-map-filter");
      if (window.TrailQRMap) {
        window.TrailQRMap.setFilter(f);
      }
    });
  });

  // Basemap switcher: Dark (old default) + Streets + Satellite
  var basemapBtns = document.querySelectorAll("[data-basemap]");
  basemapBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      playPencilTap();
      var name = btn.getAttribute("data-basemap");
      if (window.TrailQRMap && window.TrailQRMap.setBasemap) {
        window.TrailQRMap.setBasemap(name);
      } else {
        basemapBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
      }
    });
  });

  var mapSearchInput = $("mapSearchInput");
  if (mapSearchInput) {
    mapSearchInput.addEventListener("input", function (e) {
      if (window.TrailQRMap) {
        window.TrailQRMap.panToLocality(e.target.value);
      }
    });
    mapSearchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && window.TrailQRMap) {
        window.TrailQRMap.panToLocality(e.target.value);
      }
    });
  }

  var locateMeBtn = $("locateMeBtn");
  if (locateMeBtn) {
    locateMeBtn.addEventListener("click", function () {
      playPencilTap();
      if (window.TrailQRMap && window.TrailQRMap.locateUser) {
        window.TrailQRMap.locateUser();
      }
    });
  }

  // -------------------------------------------------------------
  // Sample Scenarios Rendering
  // -------------------------------------------------------------
  (window.TRAILQR_SAMPLES || []).forEach(function (s, idx) {
    var b = document.createElement("button");
    var icon = idx === 0 ? "🍵" : (idx === 1 ? "⚠️" : (idx === 2 ? "🚨" : "🏛️"));
    var parts = s.label.split(" — ");
    var title = parts[0] || s.label;
    var sub = parts[1] || "";
    
    b.className = "sample-btn";
    b.innerHTML = '<span style="font-weight:700;display:flex;align-items:center;gap:6px;">' + icon + ' ' + title + '</span>' +
      (sub ? '<span style="font-size:12px;color:var(--chalk-muted);margin-top:2px;">' + sub + '</span>' : '');
    
    b.addEventListener("click", function () {
      playPencilTap();
      var all = $("samples").querySelectorAll("button");
      for (var i = 0; i < all.length; i++) { all[i].classList.remove("active-sample"); }
      b.classList.add("active-sample");

      clearUploadedImage();
      $("payload").value = s.payload;
      $("expected").value = s.expectedName || "";
      $("area").value = s.area || "";
      currentPlace = s.place || "";
      run();
    });
    $("samples").appendChild(b);
  });

  // -------------------------------------------------------------
  // Input Micro-Actions
  // -------------------------------------------------------------
  var pasteBtn = $("pasteBtn");
  if (pasteBtn) {
    pasteBtn.addEventListener("click", async function () {
      playPencilTap();
      try {
        if (navigator.clipboard && navigator.clipboard.read) {
          try {
            var items = await navigator.clipboard.read();
            for (var i = 0; i < items.length; i++) {
              var item = items[i];
              for (var j = 0; j < item.types.length; j++) {
                var t = item.types[j];
                if (t.startsWith("image/")) {
                  var blob = await item.getType(t);
                  handleImageFile(blob, "Clipboard Image.png");
                  return;
                }
              }
            }
          } catch (clipErr) {
            // Fall back to readText
          }
        }
        var text = await navigator.clipboard.readText();
        if (text) {
          clearUploadedImage();
          $("payload").value = text;
          run();
        }
      } catch (e) {
        $("scanNote").textContent = "Clipboard permission denied. Please paste directly into the box or upload an image.";
      }
    });
  }

  var clearBtn = $("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      playPencilTap();
      clearUploadedImage();
      $("payload").value = "";
      $("expected").value = "";
      $("area").value = "";
      $("resultCard").hidden = true;
      var all = $("samples").querySelectorAll("button");
      for (var i = 0; i < all.length; i++) { all[i].classList.remove("active-sample"); }
    });
  }

  function updateStats(rows) {
    var totalAudits = rows.length;
    var threats = rows.filter(function (r) { return r.verdict === "DANGEROUS" || r.reported; }).length;
    var safe = rows.filter(function (r) { return r.verdict === "SAFE" && !r.reported; }).length;
    
    if ($("statTotalAudits")) $("statTotalAudits").textContent = totalAudits;
    if ($("statThreats")) $("statThreats").textContent = threats;
    if ($("statSafe")) $("statSafe").textContent = safe;
    if ($("sidebarAuditCount")) $("sidebarAuditCount").textContent = totalAudits;

    if (window.TrailQRMap && window.TrailQRMap.getAllPoints) {
      var allPts = window.TrailQRMap.getAllPoints();
      var dangerPts = allPts.filter(function (p) { return p.status === "DANGEROUS"; }).length;
      if ($("sidebarThreatCount")) $("sidebarThreatCount").textContent = dangerPts + " Flags";
    }
  }

  // -------------------------------------------------------------
  // Audit Registry Rendering (Zero Fake Data)
  // -------------------------------------------------------------
  function renderRegistry() {
    var rows = window.TrailQRRegistry.load();
    if ($("registryEmpty")) $("registryEmpty").hidden = rows.length > 0;
    var table = $("registryTable");
    if (table) {
      table.hidden = rows.length === 0;
      var tbody = table.querySelector("tbody");
      if (tbody) {
        tbody.innerHTML = "";
        rows.forEach(function (r) {
          var tr = document.createElement("tr");

          var tdHash = document.createElement("td");
          tdHash.innerHTML = '<span class="hash-cell">#' + (r.qr_hash ? r.qr_hash.slice(0, 8) : "") + '</span>';
          tr.appendChild(tdHash);

          var tdName = document.createElement("td");
          tdName.textContent = r.display_name || "—";
          tr.appendChild(tdName);

          var tdArea = document.createElement("td");
          tdArea.textContent = r.coarse_area || "—";
          tr.appendChild(tdArea);

          var tdVerdict = document.createElement("td");
          var vClass = (r.verdict || "").toLowerCase();
          tdVerdict.innerHTML = '<span class="verdict-pill ' + vClass + '">' + r.verdict + '</span>';
          tr.appendChild(tdVerdict);

          var tdScore = document.createElement("td");
          tdScore.textContent = r.score + "/100";
          tr.appendChild(tdScore);

          var tdRep = document.createElement("td");
          tdRep.innerHTML = r.reported 
            ? '<span style="color:var(--signal-danger);font-weight:700;">⚠️ Reported</span>' 
            : '<span style="color:var(--chalk-dim);">Clean</span>';
          tr.appendChild(tdRep);

          tbody.appendChild(tr);
        });
      }
    }

    updateStats(rows);
    renderSnowflakeIntelligence(rows);
  }

  // -------------------------------------------------------------
  // Snowflake Pipeline Intelligence (Zero Dummy Data Mode)
  // -------------------------------------------------------------
  function renderSnowflakeIntelligence(rows) {
    if (!window.TrailQRRegistry || !window.TrailQRRegistry.computeViews) return;
    var intel = window.TrailQRRegistry.computeViews(rows);

    // 1. Hotspots Table
    var hsTable = $("cocoHotspotsTable");
    if (hsTable) {
      var hsBody = hsTable.querySelector("tbody");
      if (hsBody) {
        hsBody.innerHTML = "";
        if (!intel.hotspots.length) {
          hsBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:24px;">No street scan telemetry recorded yet. Perform an audit in the Scanner or test a street sample to generate verified views. (Zero dummy data mode)</td></tr>';
        } else {
          intel.hotspots.forEach(function (h) {
            var tr = document.createElement("tr");
            var rateColor = h.fraudRate >= 50 ? "var(--signal-danger)" : (h.fraudRate >= 20 ? "var(--signal-caution)" : "var(--signal-safe)");
            tr.innerHTML = '<td><strong>' + h.area + '</strong></td>' +
              '<td>' + h.scans + '</td>' +
              '<td style="color:' + (h.threats > 0 ? "var(--signal-danger)" : "var(--signal-safe)") + ';font-weight:700;">' + h.threats + '</td>' +
              '<td style="color:' + rateColor + ';font-weight:700;">' + h.fraudRate.toFixed(1) + '%</td>' +
              '<td>' + h.avgScore.toFixed(1) + '/100</td>';
            hsBody.appendChild(tr);
          });
        }
      }
    }

    // 2. Anomalies Table
    var anTable = $("cocoAnomaliesTable");
    if (anTable) {
      var anBody = anTable.querySelector("tbody");
      if (anBody) {
        anBody.innerHTML = "";
        if (!intel.anomalies.length) {
          anBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:24px;">No scanned merchants to cross-reference against Cybersyn POI database yet.</td></tr>';
        } else {
          intel.anomalies.forEach(function (a) {
            var tr = document.createElement("tr");
            var pillClass = a.badgeClass || "dim";
            var verdictClass = pillClass === 'safe' ? 'safe' : (pillClass === 'danger' ? 'dangerous' : (pillClass === 'caution' ? 'caution' : ''));
            tr.innerHTML = '<td><strong>' + a.displayName + '</strong>' + (a.payeeMasked ? '<br><code style="font-size:11px;color:var(--text-secondary);">' + a.payeeMasked + '</code>' : '') + '</td>' +
              '<td>' + a.area + '</td>' +
              '<td>' + a.registeredMerchant + '</td>' +
              '<td><span class="verdict-pill ' + verdictClass + '">' + a.classification + '</span></td>';
            anBody.appendChild(tr);
          });
        }
      }
    }

    // 3. Gemma Brief Feed Cards
    var gemmaCards = $("cocoGemmaCards");
    if (gemmaCards) {
      gemmaCards.innerHTML = "";
      if (!intel.gemmaFeed.length) {
        gemmaCards.innerHTML = '<div style="color:var(--text-muted);font-size:13px;padding:24px;text-align:center;">No corridors available yet. Perform audits in the Scanner to feed Google Gemma intelligence.</div>';
      } else {
        intel.gemmaFeed.forEach(function (g) {
          var div = document.createElement("div");
          var riskClass = g.securityTier === "HIGH_RISK_CORRIDOR" ? "high-risk" : (g.securityTier === "ELEVATED_CAUTION" ? "caution-risk" : "safe-risk");
          div.className = "gemma-brief-card " + riskClass;
          div.innerHTML = '<div class="brief-card-title">' + g.area + '</div>' +
            '<div class="brief-card-meta">' +
              '<strong>Security Tier:</strong> <code>' + g.securityTier + '</code><br>' +
              '<strong>Threat Probability:</strong> ' + g.fraudRate + ' · Avg Risk: ' + g.avgScore + '<br>' +
              '<strong>Sticker-Swap Incidents:</strong> ' + g.swapIncidents + '<br>' +
              '<span style="display:inline-block;margin-top:6px;color:var(--chalk-dim);">Feeds Google Gemma vernacular debrief</span>' +
            '</div>';
          gemmaCards.appendChild(div);
        });
      }
    }
  }

  // Snowflake Subnav Tabs
  var subnavBtns = document.querySelectorAll(".coco-subnav .subnav-btn");
  subnavBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      playPencilTap();
      subnavBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var sub = btn.getAttribute("data-sub");
      var subs = {
        hotspots: $("cocoSubHotspots"),
        anomalies: $("cocoSubAnomalies"),
        gemma: $("cocoSubGemma"),
        sql: $("cocoSubSql")
      };
      Object.keys(subs).forEach(function (k) {
        if (subs[k]) subs[k].hidden = (k !== sub);
      });
    });
  });

  // Copy SQL Button
  var copySqlBtn = $("copySqlBtn");
  if (copySqlBtn) {
    copySqlBtn.addEventListener("click", async function () {
      playPencilTap();
      var code = $("sqlBox") ? $("sqlBox").innerText : "";
      try {
        await navigator.clipboard.writeText(code);
        copySqlBtn.textContent = "✓ Copied to Clipboard!";
        setTimeout(function () { copySqlBtn.textContent = "📋 Copy SQL"; }, 2000);
      } catch (e) {
        $("scanNote").textContent = "Could not copy SQL automatically.";
      }
    });
  }

  // -------------------------------------------------------------
  // Audit Analysis Execution
  // -------------------------------------------------------------
  async function run() {
    var raw = $("payload").value.trim();
    if (!raw) {
      $("scanNote").textContent = "Paste a QR payload, pick a street sample, or upload an image first.";
      return;
    }
    $("scanNote").textContent = "";

    var area = $("area").value.trim();
    current = window.TrailQR.analyse(raw, $("expected").value.trim(), area);
    var r = current;
    $("resultCard").hidden = false;

    playGraphiteSweep();

    // Verdict Badge
    var v = $("verdict");
    var vIcon = r.verdict === "SAFE" ? "🛡️ SAFE" : (r.verdict === "CAUTION" ? "⚠️ CAUTION" : "🚨 DANGEROUS");
    v.innerHTML = vIcon + ' <span style="font-size:16px;opacity:0.85;margin-left:8px;font-family:var(--font-mono);">' + r.score + '/100</span>';
    v.className = "verdict " + r.verdict.toLowerCase();

    // Threat Score Meter
    var scoreTrack = $("scoreTrack");
    var scoreFill = $("scoreFill");
    var scoreText = $("scoreText");
    if (scoreTrack && scoreFill) {
      var pct = Math.min(100, Math.max(0, r.score));
      scoreFill.style.width = pct + "%";
      scoreTrack.className = "score-track " + r.verdict.toLowerCase();
    }
    if (scoreText) {
      scoreText.textContent = r.score + " / 100 — " + r.verdict;
    }

    // Specifications Summary
    var kindBadge = "";
    if (r.kind === "upi_merchant") {
      kindBadge = '<span style="color:var(--signal-safe);font-weight:700;">OFFICIAL BHARATQR BUSINESS ACCOUNT</span>';
    } else if (r.kind === "upi") {
      kindBadge = '<span style="color:var(--signal-safe);font-weight:600;">UPI PEER / SHOP</span>';
    } else {
      kindBadge = '<span style="color:var(--text-primary);font-weight:600;">' + (r.kind || "text").toUpperCase() + '</span>';
    }

    var extraDetails = "";
    if (r.merchantCategory) {
      extraDetails += ' · <strong>Category:</strong> <span style="color:var(--text-primary);">' + r.merchantCategory + '</span>';
    }
    if (r.city || r.pin) {
      extraDetails += ' · <strong>Location:</strong> <span style="color:var(--text-secondary);">' + [r.city, r.pin].filter(Boolean).join(", ") + '</span>';
    }

    $("summary").innerHTML = '<strong>Kind:</strong> ' + kindBadge + ' · ' +
      '<strong>' + (r.kind === "upi_merchant" ? "Registered Business:" : "Decoded Name:") + '</strong> ' + (r.displayName ? '<strong>' + r.displayName + '</strong>' : '<em>(None)</em>') +
      (r.maskedPayee ? ' · <strong>Masked Payee:</strong> <code style="color:var(--signal-safe);">' + r.maskedPayee + '</code>' : '') +
      extraDetails;

    // Flags Breakdown
    var ul = $("flags");
    ul.innerHTML = "";
    if (!r.flags.length) {
      var li = document.createElement("li");
      li.className = "flag-empty";
      li.innerHTML = '<span class="flag-badge safe">SAFE 0</span> <span>No risk flags raised. Verified against authentic shop heuristics.</span>';
      ul.appendChild(li);
    } else {
      r.flags.forEach(function (f) {
        var li = document.createElement("li");
        var sev = (f.severity || "med").toLowerCase();
        li.className = "flag-item-" + sev;
        li.innerHTML = '<span class="flag-badge ' + sev + '">[' + sev.toUpperCase() + ' +' + f.points + ']</span> <span>' + f.detail + '</span>';
        ul.appendChild(li);
      });
    }

    // Gemma AI Vernacular Explanation
    var out = await window.TrailQRGemma.explain(r, currentPlace || area);
    $("explanation").textContent = out.text;
    $("gemmaMode").textContent = (out.mode === "gemma-live" ? "Gemma 4 · Live via Gemini API" : "Gemma 4 · Scripted Local Fallback");

    // Safe Quest
    var quest = window.TrailQRGemma.quest(r, currentPlace || area);
    $("questBox").hidden = !quest;
    if (quest) $("quest").textContent = quest;

    $("resultCard").scrollIntoView({ behavior: "smooth" });
  }

  $("analyse").addEventListener("click", function () {
    playPencilTap();
    run();
  });

  $("report").addEventListener("click", function () {
    playPencilTap();
    if (!current) return;
    window.TrailQRRegistry.add(current, true, window.TrailQRUserLocation);
    renderRegistry();
    if (window.TrailQRMap) window.TrailQRMap.renderMarkers();
    $("scanNote").textContent = "🚨 Reported! Real scan mapped to your live location — zero PII stored.";
  });

  $("saveSafe").addEventListener("click", function () {
    playPencilTap();
    if (!current) return;
    window.TrailQRRegistry.add(current, false, window.TrailQRUserLocation);
    renderRegistry();
    if (window.TrailQRMap) window.TrailQRMap.renderMarkers();
    $("scanNote").textContent = "🛡️ Verified safe find added to registry and mapped to your live location.";
  });

  $("exportCsv").addEventListener("click", function () {
    playPencilTap();
    var csv = window.TrailQRRegistry.toCSV(window.TrailQRRegistry.load());
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "trailqr_registry.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  var clearRegBtn = $("clearRegistryBtn");
  if (clearRegBtn) {
    clearRegBtn.addEventListener("click", function () {
      playPencilTap();
      window.TrailQRRegistry.clear();
      renderRegistry();
      if (window.TrailQRMap) window.TrailQRMap.renderMarkers();
      $("scanNote").textContent = "Community registry cleared.";
    });
  }

  // -------------------------------------------------------------
  // Camera QR Scanner Engine
  // -------------------------------------------------------------
  var activeStream = null, activeTick = null;
  function stopCamera() {
    if (activeTick) { clearInterval(activeTick); activeTick = null; }
    if (activeStream) { activeStream.getTracks().forEach(function (t) { t.stop(); }); activeStream = null; }
  }
  $("scan").addEventListener("click", async function () {
    playPencilTap();
    var cameraBox = $("cameraBox");
    var video = $("video");
    var canvas = $("qrCanvas");
    if (activeStream) {
      stopCamera();
      if (video) video.hidden = true;
      if (cameraBox) cameraBox.hidden = true;
      $("scanNote").textContent = "Camera stopped. Paste text, upload an image, or use a street sample above.";
      return;
    }
    clearUploadedImage();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      $("scanNote").textContent = "Camera needs a secure context — open via http://localhost:8000 (not file://), then allow camera. Upload an image or paste text meanwhile.";
      return;
    }
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      activeStream = stream;
      if (cameraBox) cameraBox.hidden = false;
      video.hidden = false;
      video.srcObject = stream;
      video.muted = true;
      await video.play();

      var useNative = ("BarcodeDetector" in window);
      var detector = null;
      if (useNative) {
        try { detector = new BarcodeDetector({ formats: ["qr_code"] }); }
        catch (e) { detector = null; useNative = false; }
      }
      var jsQRFn = (typeof jsQR !== "undefined") ? jsQR : (window.jsQR || null);
      if (!useNative && !jsQRFn) {
        $("scanNote").textContent = "Scanner library (js/jsQR.js) failed to load — upload an image, paste text, or use a street sample above.";
        return;
      }
      $("scanNote").textContent = useNative
        ? "Targeting QR reticle… point camera directly at code. Tap Scan again to stop."
        : "Targeting QR reticle (compatibility mode)… point camera directly at code. Tap Scan again to stop.";
      var ctx = canvas ? canvas.getContext("2d", { willReadFrequently: true }) : null;
      activeTick = setInterval(async function () {
        if (!video.videoWidth) return;
        try {
          if (useNative && detector) {
            try {
              var codes = await detector.detect(video);
              if (codes && codes.length && codes[0].rawValue) {
                stopCamera();
                video.hidden = true;
                if (cameraBox) cameraBox.hidden = true;
                $("payload").value = codes[0].rawValue;
                $("scanNote").textContent = "✓ QR captured via native detector.";
                run();
                return;
              }
            } catch (detErr) {}
          }

          if (ctx && canvas) {
            var w = video.videoWidth, h = video.videoHeight;
            var scale = Math.min(1, 1280 / Math.max(w, h));
            canvas.width = Math.floor(w * scale);
            canvas.height = Math.floor(h * scale);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            if (jsQRFn) {
              var img = ctx.getImageData(0, 0, canvas.width, canvas.height);
              var res = jsQRFn(img.data, img.width, img.height, { inversionAttempts: "attemptBoth" });
              if (res && res.data) {
                stopCamera();
                video.hidden = true;
                if (cameraBox) cameraBox.hidden = true;
                $("payload").value = res.data;
                $("scanNote").textContent = "✓ QR captured via camera.";
                run();
                return;
              }
            }

            if (window.ZXing && window.ZXing.QRCodeReader) {
              try {
                if (!window._zxingCamReader) window._zxingCamReader = new window.ZXing.QRCodeReader();
                var lum = new window.ZXing.HTMLCanvasElementLuminanceSource(canvas);
                var bmp = new window.ZXing.BinaryBitmap(new window.ZXing.HybridBinarizer(lum));
                var zx = window._zxingCamReader.decode(bmp);
                if (zx && zx.getText()) {
                  stopCamera();
                  video.hidden = true;
                  if (cameraBox) cameraBox.hidden = true;
                  $("payload").value = zx.getText();
                  $("scanNote").textContent = "✓ QR captured via camera (ZXing).";
                  run();
                  return;
                }
              } catch (zxErr) {}
            }
          }
        } catch (e) { /* continue polling */ }
      }, 250);
    } catch (e) {
      stopCamera();
      if (cameraBox) cameraBox.hidden = true;
      $("scanNote").textContent = "Camera permission denied — upload an image, paste, or choose a street sample above.";
    }
  });

  // -------------------------------------------------------------
  // QR Image File Upload & Robust Multi-Pass Decoder
  // -------------------------------------------------------------
  function clearUploadedImage() {
    var box = $("uploadPreviewBox");
    if (box) {
      box.hidden = true;
      box.style.display = "none";
      box.classList.remove("active");
    }
    var fileInput = $("qrFileInput");
    if (fileInput) fileInput.value = "";
    var previewImg = $("uploadPreviewImg");
    if (previewImg) {
      if (previewImg.src && previewImg.src.startsWith("blob:")) {
        URL.revokeObjectURL(previewImg.src);
      }
      previewImg.src = "";
    }
    var filenameEl = $("uploadFilename");
    if (filenameEl) filenameEl.textContent = "";
    var badge = $("uploadStatusBadge");
    if (badge) {
      badge.className = "upload-preview-status";
      badge.textContent = "";
    }
    var metaEl = $("uploadMeta");
    if (metaEl) metaEl.textContent = "";
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return "0 B";
    var k = 1024;
    var sizes = ["B", "KB", "MB"];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
  }

  async function decodeQRFromImageSource(imgElement) {
    if ("BarcodeDetector" in window) {
      try {
        var detector = new BarcodeDetector({ formats: ["qr_code"] });
        var codes = await detector.detect(imgElement);
        if (codes && codes.length > 0 && codes[0].rawValue) {
          return { text: codes[0].rawValue, engine: "BarcodeDetector" };
        }
      } catch (e) {}
    }

    var origW = imgElement.naturalWidth || imgElement.width;
    var origH = imgElement.naturalHeight || imgElement.height;
    if (!origW || !origH) throw new Error("Invalid image dimensions.");

    var jsQRFn = (typeof jsQR !== "undefined") ? jsQR : (window.jsQR || null);
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas 2D context unavailable.");

    function tryJsQR(targetW, targetH, options) {
      if (!jsQRFn) return null;
      var imgData = ctx.getImageData(0, 0, targetW, targetH);
      if (options && options.enhanceContrast) {
        var d = imgData.data;
        var sum = 0, count = d.length / 4;
        for (var i = 0; i < d.length; i += 4) {
          sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        }
        var threshold = sum / count;
        for (var j = 0; j < d.length; j += 4) {
          var lum = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
          var val = lum < threshold ? 0 : 255;
          d[j] = val; d[j + 1] = val; d[j + 2] = val;
        }
      }
      var res = jsQRFn(imgData.data, imgData.width, imgData.height, {
        inversionAttempts: (options && options.inversionAttempts) || "attemptBoth"
      });
      return (res && res.data) ? res.data : null;
    }

    function tryZXing() {
      if (window.ZXing && window.ZXing.QRCodeReader) {
        try {
          var reader = new window.ZXing.QRCodeReader();
          var lum = new window.ZXing.HTMLCanvasElementLuminanceSource(canvas);
          var bmp = new window.ZXing.BinaryBitmap(new window.ZXing.HybridBinarizer(lum));
          var zx = reader.decode(bmp);
          if (zx && zx.getText()) return zx.getText();
        } catch (e1) {
          try {
            var bmp2 = new window.ZXing.BinaryBitmap(new window.ZXing.GlobalHistogramBinarizer(lum));
            var zx2 = reader.decode(bmp2);
            if (zx2 && zx2.getText()) return zx2.getText();
          } catch (e2) {}
        }
      }
      return null;
    }

    function scanAt(tw, th, options) {
      canvas.width = tw;
      canvas.height = th;
      ctx.drawImage(imgElement, 0, 0, tw, th);
      var text = tryJsQR(tw, th, options);
      if (text) return { text: text, engine: "jsQR" };
      text = tryZXing();
      if (text) return { text: text, engine: "ZXing" };
      return null;
    }

    var maxDim = Math.max(origW, origH);

    // Pass 1: Native resolution (vital for high density BharatQR)
    if (maxDim <= 1800) {
      var r = scanAt(origW, origH);
      if (r) return r;
    }

    // Pass 2: Scaled resolution (~1000px)
    var scale1 = Math.min(1, 1000 / maxDim);
    var w1 = Math.floor(origW * scale1);
    var h1 = Math.floor(origH * scale1);
    var r1 = scanAt(w1, h1);
    if (r1) return r1;

    // Pass 3: High resolution (~1600px)
    if (maxDim > 1000) {
      var scale3 = Math.min(1, 1600 / maxDim);
      var w3 = Math.floor(origW * scale3);
      var h3 = Math.floor(origH * scale3);
      var r3 = scanAt(w3, h3);
      if (r3) return r3;
    }

    // Pass 4: Lower scale (~600px for macro closeups)
    var scale4 = Math.min(1, 600 / maxDim);
    var w4 = Math.floor(origW * scale4);
    var h4 = Math.floor(origH * scale4);
    var r4 = scanAt(w4, h4);
    if (r4) return r4;

    // Pass 5: Contrast enhanced
    canvas.width = w1;
    canvas.height = h1;
    ctx.drawImage(imgElement, 0, 0, w1, h1);
    var textContrast = tryJsQR(w1, h1, { enhanceContrast: true });
    if (textContrast) return { text: textContrast, engine: "jsQR (High Contrast)" };

    // Pass 6: Center crop
    if (origW > 300 && origH > 300) {
      var cropW = Math.floor(origW * 0.75);
      var cropH = Math.floor(origH * 0.75);
      var cropX = Math.floor((origW - cropW) / 2);
      var cropY = Math.floor((origH - cropH) / 2);
      canvas.width = cropW;
      canvas.height = cropH;
      ctx.drawImage(imgElement, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      var cropText = tryJsQR(cropW, cropH);
      if (cropText) return { text: cropText, engine: "jsQR (Center Zoom)" };
      var cropZx = tryZXing();
      if (cropZx) return { text: cropZx, engine: "ZXing (Center Zoom)" };
    }

    return null;
  }

  async function handleImageFile(file, overrideName) {
    if (!file || (file.type && !file.type.match(/^image\//i))) {
      $("scanNote").textContent = "Please select a valid image file (PNG, JPG, WEBP, etc.).";
      return;
    }

    playPencilTap();

    if (activeStream) {
      stopCamera();
      if ($("video")) $("video").hidden = true;
      if ($("cameraBox")) $("cameraBox").hidden = true;
    }

    var fileName = overrideName || file.name || "uploaded-qr.png";
    var fileSize = file.size ? formatBytes(file.size) : "";

    var box = $("uploadPreviewBox");
    var imgEl = $("uploadPreviewImg");
    var filenameEl = $("uploadFilename");
    var statusBadge = $("uploadStatusBadge");
    var metaEl = $("uploadMeta");

    if (box) {
      box.hidden = false;
      box.style.display = "flex";
      box.classList.add("active");
    }
    if (filenameEl) filenameEl.textContent = fileName;
    if (statusBadge) {
      statusBadge.className = "upload-preview-status";
      statusBadge.textContent = "Scanning…";
    }
    if (metaEl) metaEl.textContent = fileSize ? fileSize : "Processing…";
    $("scanNote").textContent = "Decoding QR code from " + fileName + "…";

    var reader = new FileReader();
    reader.onerror = function () {
      if (statusBadge) {
        statusBadge.className = "upload-preview-status danger";
        statusBadge.textContent = "Read Error";
      }
      $("scanNote").textContent = "Could not read image file.";
    };
    reader.onload = function (evt) {
      var dataUrl = evt.target.result;
      var img = new Image();
      img.onload = async function () {
        if (imgEl) imgEl.src = dataUrl;
        var dims = img.naturalWidth + " × " + img.naturalHeight + " px";
        if (metaEl) metaEl.textContent = fileSize ? (dims + " · " + fileSize) : dims;

        try {
          var result = await decodeQRFromImageSource(img);
          if (result && result.text) {
            if (statusBadge) {
              statusBadge.className = "upload-preview-status safe";
              statusBadge.textContent = "✓ Decoded (" + result.engine + ")";
            }
            $("payload").value = result.text;
            $("scanNote").textContent = "✓ QR decoded from " + fileName + ". Running security audit…";
            playPencilTap();
            run();
          } else {
            if (statusBadge) {
              statusBadge.className = "upload-preview-status warning";
              statusBadge.textContent = "⚠️ No QR Code Found";
            }
            $("scanNote").textContent = "No readable QR code found in " + fileName + ". Please check lighting, crop closely, or try another image.";
          }
        } catch (err) {
          if (statusBadge) {
            statusBadge.className = "upload-preview-status danger";
            statusBadge.textContent = "Scan Error";
          }
          $("scanNote").textContent = "Error scanning image: " + (err.message || err);
        }
      };
      img.onerror = function () {
        if (statusBadge) {
          statusBadge.className = "upload-preview-status danger";
          statusBadge.textContent = "Invalid Image";
        }
        $("scanNote").textContent = "Could not load image file.";
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  // Trigger file input
  var qrFileInput = $("qrFileInput");
  var uploadBtn = $("uploadBtn");
  var uploadMicroBtn = $("uploadMicroBtn");

  if (uploadBtn) {
    uploadBtn.addEventListener("click", function () {
      playPencilTap();
      if (qrFileInput) qrFileInput.click();
    });
  }

  if (uploadMicroBtn) {
    uploadMicroBtn.addEventListener("click", function () {
      playPencilTap();
      if (qrFileInput) qrFileInput.click();
    });
  }

  if (qrFileInput) {
    qrFileInput.addEventListener("change", function (e) {
      if (e.target.files && e.target.files.length > 0) {
        handleImageFile(e.target.files[0]);
      }
    });
  }

  var removeUploadBtn = $("removeUploadBtn");
  if (removeUploadBtn) {
    removeUploadBtn.addEventListener("click", function () {
      playPencilTap();
      clearUploadedImage();
      $("payload").value = "";
      if ($("resultCard")) $("resultCard").hidden = true;
      $("scanNote").textContent = "Uploaded image removed.";
    });
  }

  // Drag and drop support
  var dropzoneWrap = $("dropzoneWrap");
  if (dropzoneWrap) {
    ["dragenter", "dragover"].forEach(function (evt) {
      dropzoneWrap.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzoneWrap.classList.add("drag-over");
      });
    });

    ["dragleave", "dragend"].forEach(function (evt) {
      dropzoneWrap.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzoneWrap.classList.remove("drag-over");
      });
    });

    dropzoneWrap.addEventListener("drop", function (e) {
      e.preventDefault();
      e.stopPropagation();
      dropzoneWrap.classList.remove("drag-over");
      var dt = e.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        var file = dt.files[0];
        if (file.type && file.type.indexOf("image") !== -1) {
          handleImageFile(file);
        } else {
          $("scanNote").textContent = "Dropped file is not an image. Please drop a QR code image.";
        }
      }
    });
  }

  // Global screenshot paste handler
  document.addEventListener("paste", function (e) {
    var items = (e.clipboardData || window.clipboardData) && (e.clipboardData || window.clipboardData).items;
    if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf("image") !== -1) {
        var blob = items[i].getAsFile();
        if (blob) {
          e.preventDefault();
          handleImageFile(blob, "Pasted Screenshot (" + new Date().toLocaleTimeString() + ").png");
          return;
        }
      }
    }
  });

  // Reset upload box state on load
  clearUploadedImage();

  // Apply initial translations & registry render
  if (window.TrailQRI18n) {
    window.TrailQRI18n.applyTranslations();
  }
  renderRegistry();

  // Initialize Threat Map silently
  if (window.TrailQRMap) {
    window.TrailQRMap.renderMarkers();
  }
})();
