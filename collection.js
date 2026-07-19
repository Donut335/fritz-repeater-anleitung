/* ============================================================
   Reusable "newsletter-style" collection engine.
   Used by activities.html (Church Activities) and staff.html (Our Staff).

   Each page defines, BEFORE loading this file:
     window.COLLECTION_OPTS = { kind: "activities" | "staff" };
     window.COLLECTION = [ item, item, ... ];

   Each ITEM (every field is OPTIONAL except title):
     {
       title:   "Headline or Person's Name",   // required
       image:   "images/main.jpg",             // optional main/thumbnail image
       caption: "small caption under main image", // optional
       text:    "paragraph describing it",      // optional
       gallery: [                               // optional extra images (rows of 3)
         { src: "images/extra1.jpg", text: "optional caption" },
         { src: "images/extra2.jpg" }
       ]
     }
   ============================================================ */
(function () {
  var data = window.COLLECTION || [];
  var opts = window.COLLECTION_OPTS || {};
  var isStaff = opts.kind === "staff";
  var titleClass = isStaff ? "nl-name" : "nl-headline"; // staff: green name; activities: gold headline

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var listEl = document.getElementById("nl-list");
  var detailEl = document.getElementById("nl-detail");

  function renderList() {
    var html = "";
    for (var i = 0; i < data.length; i++) {
      var it = data[i];
      var link = '<a href="#" class="' + titleClass + '" onclick="return nlOpen(' + i + ')">'
        + esc(it.title) + '</a>';
      var img = it.image
        ? '<div><img class="nl-thumb" src="' + esc(it.image) + '" alt="' + esc(it.title)
          + '" onclick="nlOpen(' + i + ')"></div>'
        : '';
      // Activities: headline ABOVE image.  Staff: image ABOVE name.
      var block = isStaff ? (img + '<div>' + link + '</div>') : (link + img);
      html += '<div class="nl-item">' + block + '</div>';
    }
    listEl.innerHTML = html || '<p class="center"><i>Nothing here yet.</i></p>';
  }

  window.nlOpen = function (i) {
    var it = data[i];
    if (!it) return false;
    var h = '<div style="text-align:left;">'
      + '<a href="#" class="backbtn" onclick="return nlBack()">&#9664; Back</a></div>';
    h += '<h2 class="center">' + esc(it.title) + '</h2>';
    if (it.image) {
      h += '<div class="center"><img class="detail-img" src="' + esc(it.image)
        + '" alt="' + esc(it.title) + '"></div>';
      if (it.caption) h += '<p class="center cap">' + esc(it.caption) + '</p>';
    }
    if (it.text) {
      h += '<div class="goldbox"><p>' + esc(it.text) + '</p></div>';
    }
    if (it.gallery && it.gallery.length) {
      h += '<hr class="fancy"><div class="grid3">';
      for (var g = 0; g < it.gallery.length; g++) {
        var im = it.gallery[g];
        h += '<figure><img src="' + esc(im.src) + '" alt="" onclick="nlLightbox(' + i + ',' + g + ')">'
          + (im.text ? '<figcaption>' + esc(im.text) + '</figcaption>' : '')
          + '</figure>';
      }
      h += '</div>';
    }
    h += '<div class="center" style="margin-top:16px;">'
      + '<a href="#" class="backbtn" onclick="return nlBack()">&#9664; Back</a></div>';
    detailEl.innerHTML = h;
    listEl.style.display = "none";
    detailEl.style.display = "block";
    window.scrollTo(0, 0);
    return false;
  };

  window.nlBack = function () {
    detailEl.style.display = "none";
    detailEl.innerHTML = "";
    listEl.style.display = "block";
    return false;
  };

  window.nlLightbox = function (i, g) {
    var it = data[i];
    if (!it || !it.gallery) return;
    var im = it.gallery[g];
    if (!im) return;
    document.getElementById("nl-lightbox-img").src = im.src;
    document.getElementById("nl-lightbox-cap").innerHTML = im.text ? esc(im.text) : "";
    document.getElementById("nl-lightbox").className = "lightbox open";
  };

  window.nlCloseLightbox = function () {
    document.getElementById("nl-lightbox").className = "lightbox";
    document.getElementById("nl-lightbox-img").src = "";
    return false;
  };

  renderList();
})();
