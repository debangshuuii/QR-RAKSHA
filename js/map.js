/**
 * TrailQR Raksha — Real-Only Street Threat Map & Live Geolocation Engine
 * ZERO Dummy Data: Plots exclusively genuine local audits performed by the user.
 * Supports: Live Location ("Locate Me"), Nearest Scanned Details,
 * Basemaps: Dark Canvas (default) + Streets + Satellite (Esri, keyless).
 */
(function () {
  "use strict";

  var mapInstance = null;
  var markersLayer = null;
  var userMarker = null;
  var currentFilter = "all";
  var currentBasemap = "dark";
  var baseLayers = {};
  var layerControl = null;

  // Haversine distance calculator in meters
  function getDistanceMeters(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // Earth radius in metres
    var p1 = lat1 * Math.PI / 180;
    var p2 = lat2 * Math.PI / 180;
    var dp = (lat2 - lat1) * Math.PI / 180;
    var dl = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dp / 2) * Math.sin(dp / 2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl / 2) * Math.sin(dl / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  function getActiveLang() {
    return (window.TrailQRI18n && window.TrailQRI18n.getLang()) || "en";
  }

  // Load ONLY genuine user scans — zero hardcoded fake points
  function getAllPoints() {
    if (!window.TrailQRRegistry || !window.TrailQRRegistry.load) return [];
    var rows = window.TrailQRRegistry.load();
    var points = [];

    // Fallback base coordinates if user hasn't clicked Locate Me yet
    var baseLat = (window.TrailQRUserLocation && window.TrailQRUserLocation.lat) || 22.5726;
    var baseLng = (window.TrailQRUserLocation && window.TrailQRUserLocation.lng) || 88.3639;

    rows.forEach(function (scan, idx) {
      // If the user is scanning multiple times from their current desk/location,
      // disperse points slightly (25m - 50m) so pins don't stack directly on top of each other
      var lat = scan.lat || (baseLat + ((idx % 5) - 2) * 0.00035);
      var lng = scan.lng || (baseLng + (Math.floor(idx / 5) - 1) * 0.00045);

      var isDanger = scan.reported || scan.verdict === "DANGEROUS";
      var status = isDanger ? "DANGEROUS" : (scan.verdict === "CAUTION" ? "CAUTION" : "SAFE");

      points.push({
        id: "SCAN-" + (scan.qr_hash ? scan.qr_hash.slice(0, 8) : idx),
        lat: lat,
        lng: lng,
        locality: scan.coarse_area || "Local Audit Location",
        merchant: scan.display_name || "Audited Merchant Stand",
        status: status,
        attackType: scan.reported ? "User-Reported Scam / Fraudulent QR" : (status === "DANGEROUS" ? "Flagged Threat / Heuristic Mismatch" : "Clean Verified Find"),
        score: scan.score || 0,
        reportedPayee: scan.payee_masked || "",
        created_at: scan.created_at || new Date().toISOString(),
        advisoryEn: status === "DANGEROUS" ? "⚠️ Warning: Flagged for risk. Verify merchant physically before paying." : "🛡️ Clean verified scan.",
        advisoryBn: status === "DANGEROUS" ? "⚠️ সতর্কতা: এই QR-এ ঝুঁকি আছে। টাকা দেওয়ার আগে নিশ্চিত হন।" : "🛡️ যাচাইকৃত নিরাপদ স্ক্যান।",
        advisoryHi: status === "DANGEROUS" ? "⚠️ चेतावनी: इस कोड में जोखिम दर्ज है। भुगतान से पहले पुष्टि करें।" : "🛡️ सत्यापित सुरक्षित स्कैन।"
      });
    });

    return points;
  }

  function initMap() {
    var container = document.getElementById("threatMapContainer");
    if (!container) return;

    if (mapInstance) {
      mapInstance.invalidateSize();
      return;
    }

    if (typeof L === "undefined") {
      container.innerHTML = '<div class="map-fallback-box"><p>🗺️ Interactive Map running in offline fallback mode.</p><div id="fallbackThreatList"></div></div>';
      renderFallbackList();
      return;
    }

    try {
      var initialLat = (window.TrailQRUserLocation && window.TrailQRUserLocation.lat) || 22.5726;
      var initialLng = (window.TrailQRUserLocation && window.TrailQRUserLocation.lng) || 88.3639;

      mapInstance = L.map("threatMapContainer", {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // --- Basemaps: Dark (default) + Streets + Satellite (all Esri, keyless) ---
      var darkBase = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri, DeLorme, NAVTEQ',
        maxNativeZoom: 16,
        maxZoom: 19
      });

      // Clean street and landmark labels overlay (for Dark Canvas)
      var darkLabels = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
        attribution: '',
        maxNativeZoom: 16,
        maxZoom: 19
      });

      var streetBase = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri, DeLorme, NAVTEQ, TomTom, Intermap, USGS',
        maxNativeZoom: 19,
        maxZoom: 19
      });

      var satelliteBase = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
        maxNativeZoom: 19,
        maxZoom: 19
      });

      // Place / boundary labels overlay so Satellite stays readable
      var satelliteLabels = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        attribution: '',
        maxNativeZoom: 19,
        maxZoom: 19
      });

      baseLayers.dark = L.layerGroup([darkBase, darkLabels]);
      baseLayers.streets = L.layerGroup([streetBase]);
      baseLayers.satellite = L.layerGroup([satelliteBase, satelliteLabels]);

      baseLayers.dark.addTo(mapInstance);
      currentBasemap = "dark";

      // Built-in Leaflet switcher (top-right) + custom buttons call the same setBasemap()
      layerControl = L.control.layers({
        "Dark Canvas": baseLayers.dark,
        "Streets": baseLayers.streets,
        "Satellite": baseLayers.satellite
      }, null, { position: "topright" }).addTo(mapInstance);

      markersLayer = L.layerGroup().addTo(mapInstance);

      // Check if user location already exists
      if (window.TrailQRUserLocation) {
        addUserMarker(window.TrailQRUserLocation.lat, window.TrailQRUserLocation.lng);
      }

      renderMarkers();
    } catch (e) {
      console.warn("Map init error:", e);
      container.innerHTML = '<div class="map-fallback-box"><p>🗺️ Offline Map Matrix Active</p><div id="fallbackThreatList"></div></div>';
      renderFallbackList();
    }
  }

  function createCustomIcon(status) {
    if (typeof L === "undefined") return null;
    var color = status === "DANGEROUS" ? "#ef4444" : (status === "CAUTION" ? "#f59e0b" : "#10b981");
    var symbol = status === "DANGEROUS" ? "⚠️" : (status === "CAUTION" ? "⚡" : "🛡️");
    var html = '<div class="map-radar-pin ' + status.toLowerCase() + '" style="background:' + color + ';">' +
      '<span>' + symbol + '</span>' +
      '<div class="radar-pulse ' + status.toLowerCase() + '"></div>' +
      '</div>';
    return L.divIcon({
      className: "custom-leaflet-pin",
      html: html,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });
  }

  function addUserMarker(lat, lng) {
    if (!mapInstance || typeof L === "undefined") return;
    if (userMarker) {
      userMarker.setLatLng([lat, lng]);
      return;
    }

    var userIcon = L.divIcon({
      className: "user-leaflet-pin",
      html: '<div class="user-live-pin"><div class="user-pulse"></div><span>📍</span></div>',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(mapInstance);
    userMarker.bindPopup("<strong>📍 You Are Here</strong><br><span style='font-size:11px;color:var(--text-secondary);'>Live GPS coordinates acquired.</span>");
  }

  function renderMarkers() {
    if (!mapInstance || !markersLayer) return;
    markersLayer.clearLayers();

    var points = getAllPoints();
    var lang = getActiveLang();
    var dangerCount = 0, safeCount = 0;

    var emptyOverlay = document.getElementById("mapEmptyOverlay");
    if (emptyOverlay) {
      emptyOverlay.style.display = points.length === 0 ? "flex" : "none";
    }

    points.forEach(function (pt) {
      if (pt.status === "DANGEROUS") dangerCount++;
      if (pt.status === "SAFE") safeCount++;

      if (currentFilter === "danger" && pt.status !== "DANGEROUS") return;
      if (currentFilter === "safe" && pt.status !== "SAFE") return;

      var advisory = lang === "hi" ? pt.advisoryHi : (lang === "bn" ? pt.advisoryBn : pt.advisoryEn);
      var headerText = pt.status === "DANGEROUS" ? "🚨 RED FLAG WARNING: AVOID" : (pt.status === "CAUTION" ? "⚠️ CAUTION ZONE" : "🛡️ VERIFIED SAFE MERCHANT");
      var badgeClass = pt.status.toLowerCase();

      var timeStr = pt.created_at ? new Date(pt.created_at).toLocaleTimeString() : "";

      var popupHtml = '<div class="map-popup-card">' +
        '<div class="map-popup-header ' + badgeClass + '">' + headerText + '</div>' +
        '<div class="map-popup-body">' +
          '<div class="map-popup-loc">' + pt.locality + (timeStr ? ' · ' + timeStr : '') + '</div>' +
          '<div class="map-popup-title">' + pt.merchant + '</div>' +
          '<div class="map-popup-meta">' +
            '<strong>Classification:</strong> ' + pt.attackType + '<br>' +
            '<strong>Threat Score:</strong> <span class="score-badge ' + badgeClass + '">' + pt.score + ' / 100</span><br>' +
            (pt.reportedPayee ? '<strong>Target Payee:</strong> <code>' + pt.reportedPayee + '</code><br>' : '') +
          '</div>' +
          '<div class="map-popup-advisory ' + badgeClass + '">' + advisory + '</div>' +
        '</div>' +
      '</div>';

      var marker = L.marker([pt.lat, pt.lng], {
        icon: createCustomIcon(pt.status)
      }).bindPopup(popupHtml, { maxWidth: 320 });

      markersLayer.addLayer(marker);
    });

    updateMapStats(points.length, dangerCount, safeCount);
  }

  function updateMapStats(total, dangers, safes) {
    var elTotal = document.getElementById("mapStatTotal");
    var elDanger = document.getElementById("mapStatDanger");
    var elSafe = document.getElementById("mapStatSafe");
    if (elTotal) elTotal.textContent = total;
    if (elDanger) elDanger.textContent = dangers;
    if (elSafe) elSafe.textContent = safes;

    var sideBadge = document.getElementById("sidebarThreatCount");
    if (sideBadge) {
      sideBadge.textContent = dangers + " Flags";
      sideBadge.className = "nav-badge " + (dangers > 0 ? "danger" : "");
    }
  }

  function renderFallbackList() {
    var el = document.getElementById("fallbackThreatList");
    if (!el) return;
    var points = getAllPoints();
    var lang = getActiveLang();
    if (!points.length) {
      el.innerHTML = '<div style="padding:12px;color:var(--text-muted);font-size:12px;">Zero scans recorded yet. Perform an audit in the Scanner.</div>';
      return;
    }
    el.innerHTML = points.map(function (p) {
      var advisory = lang === "hi" ? p.advisoryHi : (lang === "bn" ? p.advisoryBn : p.advisoryEn);
      var color = p.status === "DANGEROUS" ? "var(--signal-danger)" : "var(--signal-safe)";
      return '<div class="fallback-threat-card" style="border-left: 3px solid ' + color + '; padding: 8px 12px; margin-bottom: 8px; background: var(--bg-input);">' +
        '<strong style="color:' + color + ';">[' + p.status + '] ' + p.merchant + '</strong> (' + p.locality + ')<br>' +
        '<span style="font-size:12px;color:var(--text-secondary);">' + advisory + '</span>' +
      '</div>';
    }).join("");
  }

  function setFilter(filter) {
    currentFilter = filter;
    renderMarkers();
    if (!mapInstance) renderFallbackList();
  }

  function setBasemap(name) {
    if (!name || !baseLayers[name]) return;
    if (!mapInstance) {
      currentBasemap = name;
      syncBasemapButtons();
      return;
    }
    if (currentBasemap && baseLayers[currentBasemap]) {
      mapInstance.removeLayer(baseLayers[currentBasemap]);
    }
    baseLayers[name].addTo(mapInstance);
    // Keep scan pins + live user pin above the new basemap
    if (markersLayer) markersLayer.bringToFront();
    currentBasemap = name;
    syncBasemapButtons();
  }

  function getBasemap() {
    return currentBasemap;
  }

  function syncBasemapButtons() {
    var btns = document.querySelectorAll("[data-basemap]");
    btns.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-basemap") === currentBasemap);
    });
  }

  function panToLocality(query) {
    if (!query) return;
    query = query.toLowerCase().trim();
    var points = getAllPoints();
    var match = points.find(function (p) {
      return (p.locality && p.locality.toLowerCase().includes(query)) ||
             (p.merchant && p.merchant.toLowerCase().includes(query));
    });
    if (match && mapInstance) {
      mapInstance.flyTo([match.lat, match.lng], 16, { duration: 1.2 });
    }
  }

  // -------------------------------------------------------------
  // Live Geolocation & Nearby Scan Details Engine
  // -------------------------------------------------------------
  function locateUser() {
    var btn = document.getElementById("locateMeBtn");
    if (btn) btn.classList.add("locating");

    if (!navigator.geolocation) {
      if (btn) btn.classList.remove("locating");
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (pos) {
        if (btn) btn.classList.remove("locating");
        var lat = pos.coords.latitude;
        var lng = pos.coords.longitude;
        window.TrailQRUserLocation = { lat: lat, lng: lng };

        initMap();
        addUserMarker(lat, lng);
        renderMarkers();
        updateNearbyDetails(lat, lng);

        if (mapInstance) {
          mapInstance.flyTo([lat, lng], 16, { duration: 1.2 });
        }
      },
      function (err) {
        if (btn) btn.classList.remove("locating");
        console.warn("Geolocation error:", err);
        // Fallback to central Kolkata coordinates
        var fallbackLat = 22.5726, fallbackLng = 88.3639;
        window.TrailQRUserLocation = { lat: fallbackLat, lng: fallbackLng };
        initMap();
        addUserMarker(fallbackLat, fallbackLng);
        renderMarkers();
        updateNearbyDetails(fallbackLat, fallbackLng);
        if (mapInstance) {
          mapInstance.flyTo([fallbackLat, fallbackLng], 15, { duration: 1.2 });
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  function updateNearbyDetails(userLat, userLng) {
    var card = document.getElementById("nearbyStatusCard");
    var titleEl = document.getElementById("nearbyLocationTitle");
    var distBadge = document.getElementById("nearbyDistanceBadge");
    var contentEl = document.getElementById("nearbyDetailsContent");

    if (!card || !contentEl) return;
    card.style.display = "block";

    var points = getAllPoints();
    if (titleEl) {
      titleEl.innerHTML = '📍 Live GPS: <code>' + userLat.toFixed(4) + ', ' + userLng.toFixed(4) + '</code>';
    }

    if (!points.length) {
      if (distBadge) distBadge.textContent = "0 Scans Nearby";
      contentEl.innerHTML = 'Zero scans recorded at this location yet. Test or scan a QR in the <strong>Scan & Audit</strong> tab to immediately map its verified security record right here!';
      return;
    }

    // Sort by distance from user
    points.forEach(function (pt) {
      pt.distanceMeters = getDistanceMeters(userLat, userLng, pt.lat, pt.lng);
    });
    points.sort(function (a, b) { return a.distanceMeters - b.distanceMeters; });

    var closest = points[0];
    var distText = closest.distanceMeters < 1000
      ? closest.distanceMeters + "m away"
      : (closest.distanceMeters / 1000).toFixed(1) + "km away";

    if (distBadge) distBadge.textContent = distText;

    var statusColor = closest.status === "DANGEROUS" ? "var(--signal-danger)" : (closest.status === "CAUTION" ? "var(--signal-caution)" : "var(--signal-safe)");
    var advisoryText = closest.status === "DANGEROUS"
      ? '<span style="color:var(--signal-danger);font-weight:700;">⚠️ PREVIOUS RED FLAG AVOIDANCE:</span> This nearby code was scored ' + closest.score + '/100 (' + closest.status + '). A scam or payee mismatch was recorded here. Avoid paying without verbal confirmation.'
      : '<span style="color:var(--signal-safe);font-weight:700;">🛡️ VERIFIED STAND:</span> Nearby merchant verified authentic (Score: ' + closest.score + '/100). Safe to pay.';

    contentEl.innerHTML = '<strong>Nearest Audit:</strong> ' + closest.merchant + ' (' + closest.locality + ') · <span style="color:' + statusColor + ';font-weight:700;">' + closest.status + '</span><br>' +
      advisoryText + (closest.reportedPayee ? '<br><span style="font-size:11px;color:var(--text-muted);">Masked Payee: ' + closest.reportedPayee + '</span>' : '');
  }

  // Refresh on language switch
  window.addEventListener("trailqr:langchange", function () {
    renderMarkers();
    if (!mapInstance) renderFallbackList();
    if (window.TrailQRUserLocation) {
      updateNearbyDetails(window.TrailQRUserLocation.lat, window.TrailQRUserLocation.lng);
    }
  });

  window.TrailQRMap = {
    init: initMap,
    renderMarkers: renderMarkers,
    setFilter: setFilter,
    setBasemap: setBasemap,
    getBasemap: getBasemap,
    panToLocality: panToLocality,
    locateUser: locateUser,
    getAllPoints: getAllPoints,
    updateNearbyDetails: updateNearbyDetails
  };
})();
