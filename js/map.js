/**
 * TrailQR Raksha — Interactive Global & Local Threat Map
 * Visualizes reported QR sticker swaps, phishing zones, and verified safe merchant stands.
 */
(function () {
  "use strict";

  var mapInstance = null;
  var markersLayer = null;
  var currentFilter = "all";

  // Known street threat hotspots & verified locations in Kolkata / West Bengal
  var HISTORICAL_THREAT_ZONES = [
    {
      id: "THREAT-KOL-01",
      lat: 22.5123,
      lng: 88.3564,
      locality: "Rabindra Sarobar, Kolkata",
      merchant: "Lake Tea Stall",
      status: "DANGEROUS",
      attackType: "QR Sticker-Swap (Fraudulent duplicate pasted over genuine stand)",
      score: 75,
      reportedPayee: "rk***@paytm",
      advisoryEn: "⚠️ High Risk: A previous sticker swap was reported here. Do NOT pay without verifying the merchant's physical name inside your payment app.",
      advisoryBn: "⚠️ উচ্চ ঝুঁকি: এখানে পূর্বে স্টিকার বদল করে জালিয়াতি নথিভুক্ত হয়েছে। সরাসরি দোকানদারকে না জানিয়ে টাকা দেবেন না।",
      advisoryHi: "⚠️ उच्च जोखिम: यहाँ पहले स्टिकर बदलकर धोखाधड़ी की शिकायत दर्ज की गई है। बिना पुष्टि किए भुगतान न करें।"
    },
    {
      id: "THREAT-KOL-02",
      lat: 22.5535,
      lng: 88.3524,
      locality: "Park Street, Kolkata",
      merchant: "Park Street Parking / Quick Pay",
      status: "DANGEROUS",
      attackType: "Quishing (Credential Harvesting Phishing Link claiming KYC)",
      score: 100,
      reportedPayee: "http://paytm.kyc-verify-login.ru",
      advisoryEn: "🚨 Critical Risk: Fake KYC phishing QR sticker reported on parking meters. Never enter bank credentials or OTPs.",
      advisoryBn: "🚨 মারাত্মক ঝুঁকি: পার্কিং মিটারে ভুয়ো কেওয়াইসি ফিশিং কিউআর পাওয়া গেছে। কোনো পিন বা ওটিপি দেবেন না।",
      advisoryHi: "🚨 गंभीर खतरा: पार्किंग मीटर पर फर्जी केवाईसी फ़िशिंग क्यूआर पाया गया है। कभी भी पिन या ओटीपी न डालें।"
    },
    {
      id: "SAFE-KOL-01",
      lat: 22.5760,
      lng: 88.4344,
      locality: "Salt Lake Sector V, Kolkata",
      merchant: "Techno Main Salt Lake (TMSL)",
      status: "SAFE",
      attackType: "Verified NPCI BharatQR Business Account",
      score: 0,
      reportedPayee: "MAB.037135003190033@AXISBANK",
      advisoryEn: "🛡️ Verified Authentic: Official campus merchant account verified against NPCI BharatQR specifications.",
      advisoryBn: "🛡️ যাচাইকৃত নিরাপদ: অফিসিয়াল ক্যাম্পাস ব্যবসায়ী অ্যাকাউন্ট এনপিসিআই মান অনুযায়ী সুরক্ষিত।",
      advisoryHi: "🛡️ प्रमाणित सुरक्षित: एनपीसीआई मानकों के तहत प्रमाणित आधिकारिक संस्थान खाता।"
    },
    {
      id: "SAFE-KOL-02",
      lat: 22.5744,
      lng: 88.3629,
      locality: "College Street, Kolkata",
      merchant: "College Street Coffee House",
      status: "SAFE",
      attackType: "Verified Heritage Merchant",
      score: 0,
      reportedPayee: "coffeehouse@sbi",
      advisoryEn: "🛡️ Clean Stand: Historic merchant stand verified against Cybersyn POI database.",
      advisoryBn: "🛡️ নিরাপদ দোকান: সাইবারসিন পিওআই ডেটাবেসের সাথে যাচাইকৃত আসল দোকান।",
      advisoryHi: "🛡️ प्रमाणित दुकान: साइबर्सिन डेटाबेस के तहत प्रमाणित सुरक्षित दुकान।"
    },
    {
      id: "CAUTION-KOL-01",
      lat: 22.5186,
      lng: 88.3656,
      locality: "Gariahat Crossing, Kolkata",
      merchant: "Gariahat Street Hawkers Corner",
      status: "CAUTION",
      attackType: "Name Discrepancy & Multiple Payee Overlays",
      score: 35,
      reportedPayee: "bo***@upi",
      advisoryEn: "⚠️ Elevated Caution: Multiple overlay stickers observed on counter. Ask shopkeeper to point directly to their current code.",
      advisoryBn: "⚠️ সতর্কতা: কাউন্টারে একাধিক ওভারলে স্টিকার রয়েছে। সঠিক কোডটি দোকানদারের কাছ থেকে জেনে নিন।",
      advisoryHi: "⚠️ सावधानी: काउंटर पर कई स्टिकर लगे हैं। दुकानदार से सही क्यूआर की पुष्टि अवश्य करें।"
    }
  ];

  function getActiveLang() {
    return (window.TrailQRI18n && window.TrailQRI18n.getLang()) || "en";
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
      // Default to Kolkata with global zoom capability
      mapInstance = L.map("threatMapContainer", {
        center: [22.5626, 88.3739],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Sleek dark CartoDB tiles matching the blueprint graphite theme
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19
      }).addTo(mapInstance);

      markersLayer = L.layerGroup().addTo(mapInstance);
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

  function getAllPoints() {
    var points = HISTORICAL_THREAT_ZONES.slice();

    // Also include genuine scans recorded locally in the registry!
    if (window.TrailQRRegistry && window.TrailQRRegistry.load) {
      var userScans = window.TrailQRRegistry.load();
      userScans.forEach(function (scan, idx) {
        if (!scan.coarse_area) return;
        var existing = points.find(function (p) {
          return p.locality.toLowerCase().includes(scan.coarse_area.toLowerCase());
        });
        if (existing) {
          if (scan.verdict === "DANGEROUS" || scan.reported) {
            existing.status = "DANGEROUS";
            existing.score = Math.max(existing.score, scan.score || 75);
          }
        } else {
          // Approximate offset around central Kolkata
          var lat = 22.53 + (idx * 0.015) % 0.08;
          var lng = 88.34 + (idx * 0.02) % 0.08;
          points.push({
            id: "USER-SCAN-" + idx,
            lat: lat,
            lng: lng,
            locality: scan.coarse_area,
            merchant: scan.display_name || "Community Scanned Target",
            status: scan.verdict || (scan.reported ? "DANGEROUS" : "SAFE"),
            attackType: scan.reported ? "Community Reported Fraudulent QR" : (scan.verdict === "DANGEROUS" ? "Scored High Risk Threat" : "Community Verified"),
            score: scan.score || 0,
            reportedPayee: scan.payee_masked || "Masked Handle",
            advisoryEn: scan.verdict === "DANGEROUS" ? "⚠️ Reported Red Flag in this locality. Verify merchant verbally." : "🛡️ Clean audit recorded.",
            advisoryBn: scan.verdict === "DANGEROUS" ? "⚠️ এই এলাকায় লাল সংকেত নথিভুক্ত হয়েছে।" : "🛡️ নিরাপদ অডিট নথিভুক্ত।",
            advisoryHi: scan.verdict === "DANGEROUS" ? "⚠️ इस इलाके में खतरे की शिकायत दर्ज की गई है।" : "🛡️ सुरक्षित ऑडिट दर्ज।"
          });
        }
      });
    }

    return points;
  }

  function renderMarkers() {
    if (!mapInstance || !markersLayer) return;
    markersLayer.clearLayers();

    var points = getAllPoints();
    var lang = getActiveLang();
    var dangerCount = 0, safeCount = 0;

    points.forEach(function (pt) {
      if (pt.status === "DANGEROUS") dangerCount++;
      if (pt.status === "SAFE") safeCount++;

      if (currentFilter === "danger" && pt.status !== "DANGEROUS") return;
      if (currentFilter === "safe" && pt.status !== "SAFE") return;

      var advisory = lang === "hi" ? pt.advisoryHi : (lang === "bn" ? pt.advisoryBn : pt.advisoryEn);
      var headerText = pt.status === "DANGEROUS" ? "🚨 RED FLAG WARNING: AVOID" : (pt.status === "CAUTION" ? "⚠️ CAUTION ZONE" : "🛡️ VERIFIED SAFE MERCHANT");
      var badgeClass = pt.status.toLowerCase();

      var popupHtml = '<div class="map-popup-card">' +
        '<div class="map-popup-header ' + badgeClass + '">' + headerText + '</div>' +
        '<div class="map-popup-body">' +
          '<div class="map-popup-loc">' + pt.locality + '</div>' +
          '<div class="map-popup-title">' + pt.merchant + '</div>' +
          '<div class="map-popup-meta">' +
            '<strong>Category / Issue:</strong> ' + pt.attackType + '<br>' +
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
  }

  function renderFallbackList() {
    var el = document.getElementById("fallbackThreatList");
    if (!el) return;
    var points = getAllPoints();
    var lang = getActiveLang();
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

  function panToLocality(query) {
    if (!query) return;
    query = query.toLowerCase().trim();
    var points = getAllPoints();
    var match = points.find(function (p) {
      return p.locality.toLowerCase().includes(query) || p.merchant.toLowerCase().includes(query);
    });
    if (match && mapInstance) {
      mapInstance.flyTo([match.lat, match.lng], 15, { duration: 1.2 });
    }
  }

  // Refresh on language switch
  window.addEventListener("trailqr:langchange", function () {
    renderMarkers();
    if (!mapInstance) renderFallbackList();
  });

  window.TrailQRMap = {
    init: initMap,
    renderMarkers: renderMarkers,
    setFilter: setFilter,
    panToLocality: panToLocality,
    getAllPoints: getAllPoints
  };
})();
