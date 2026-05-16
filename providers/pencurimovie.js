/**
 * cinemacity - Built from src/cinemacity/
 * Generated: 2026-04-26T06:45:39.580Z
 */
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/cinemacity/constants.js
var MAIN_URL = "https://ww105.pencurimoviesubmalay.guru";
var HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "Cookie": "starstruck_190fe508139b417479c63b112781c8e7=6b72ea42f54a6cc0067373f7906e256b; cf_clearance=24S6uyuUe_MWmFo8BUTs8oAqOJEKjZPS2bB8D.42pZo-1778944537-1.2.1.1-a7QmgdoXgLJ_K3GNg_vBQ14IpMzKYDgHPz1ikpIL05T5Q6cWP1Ia4Mt7_awC6_V9UeXJQVwJi4fpeh_swKGMToXn0INrYPuLl6qFAI.Q.qMHFahVaj3YvkfC6A_h1oOk4IYg_KoIvCsRr5KCFt0ijgjTz9yOtjQra9rgr180vR9VnjmTXAL7n.uNy1AMgTx6bqXXlj6e8ywZJeXx3LR1JkWnsQ.lYfHz4jEuLzhXR81Un7xGe8LmsusaN4LqZj_izpO6OFXbydpetIvMB2CQ2OQ665TqaFX3wE1p8uKl5JJtD.C_YM1vW4o2EWdEpL1mcxmSHX8jxGMo.9C8T.jYLQ",
  "Referer": "https://ww105.pencurimoviesubmalay.guru/"
};
var TMDB_API_KEY = "1865f43a0549ca50d341dd9ab8b29f49";

// src/cinemacity/utils.js
var atobPolyfill = (str) => {
  try {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    str = String(str).replace(/[=]+$/, "");
    if (str.length % 4 === 1)
      return "";
    for (let bc = 0, bs = 0, buffer, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
      buffer = chars.indexOf(buffer);
    }
    return output;
  } catch (e) {
    return "";
  }
};
function fetchText(_0) {
  return __async(this, arguments, function* (url, options = {}) {
    const response = yield fetch(url, __spreadValues({
      headers: options.headers || HEADERS,
      skipSizeCheck: true
    }, options));
    return yield response.text();
  });
}
function extractQuality(url) {
  const low = (url || "").toLowerCase();
  if (low.includes("2160p") || low.includes("4k"))
    return "4K";
  if (low.includes("1080p"))
    return "1080p";
  if (low.includes("720p"))
    return "720p";
  if (low.includes("480p"))
    return "480p";
  if (low.includes("360p"))
    return "360p";
  return "HD";
}

// src/cinemacity/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    try {
      const tmdbUrl = `https://api.themoviedb.org/3/${mediaType === "tv" ? "tv" : "movie"}/${tmdbId}?api_key=${TMDB_API_KEY}`;
      const tmdbRes = yield fetch(tmdbUrl, { skipSizeCheck: true });
      const mediaInfo = yield tmdbRes.json();
      const animeTitle = mediaInfo.title || mediaInfo.name;
      if (!animeTitle)
        return [];
      const searchUrl = `${MAIN_URL}/?do=search&subaction=search&search_start=0&full_search=0&story=${encodeURIComponent(animeTitle)}`;
      const searchHtml = yield fetchText(searchUrl);
      const $search = cheerio.load(searchHtml);
      let mediaUrl = null;
      $search("div.dar-short_item").each((i, el) => {
        if (mediaUrl)
          return;
        const anchor = $search(el).find("a").filter((idx, a) => ($search(a).attr("href") || "").includes(".html")).first();
        if (!anchor.length)
          return;
        const foundTitle = anchor.text().split("(")[0].trim();
        const href = anchor.attr("href");
        if (foundTitle.toLowerCase() === animeTitle.toLowerCase() || foundTitle.toLowerCase().includes(animeTitle.toLowerCase()) || animeTitle.toLowerCase().includes(foundTitle.toLowerCase())) {
          mediaUrl = href;
        }
      });
      if (!mediaUrl) {
        const homeHtml = yield fetchText(MAIN_URL);
        const $home = cheerio.load(homeHtml);
        $home("div.dar-short_item").each((i, el) => {
          if (mediaUrl)
            return;
          const anchor = $home(el).find("a").filter((idx, a) => ($home(a).attr("href") || "").includes(".html")).first();
          if (!anchor.length)
            return;
          const foundTitle = anchor.text().split("(")[0].trim();
          const href = anchor.attr("href");
          if (foundTitle.toLowerCase() === animeTitle.toLowerCase())
            mediaUrl = href;
        });
      }
      if (!mediaUrl)
        return [];
      const pageHtml = yield fetchText(mediaUrl);
      const $page = cheerio.load(pageHtml);
      let fileData = null;
      $page("script").each((i, el) => {
        if (fileData)
          return;
        const html = $page(el).html();
        if (html && html.includes("atob")) {
          const regex = /atob\s*\(\s*(['"])(.*?)\1\s*\)/g;
          let match;
          while ((match = regex.exec(html)) !== null) {
            const decoded = atobPolyfill(match[2]);
            const fileMatch = decoded.match(new RegExp(`file\\s*:\\s*(['"])(.*?)\\1`, "s")) || decoded.match(new RegExp("file\\s*:\\s*(\\[.*?\\])", "s"));
            if (fileMatch) {
              let rawFile = fileMatch[2] || fileMatch[1];
              if (rawFile && rawFile.length > 5) {
                if (rawFile.startsWith("[") || rawFile.startsWith("{")) {
                  try {
                    const unescaped = rawFile.replace(/\\(.)/g, "$1");
                    fileData = JSON.parse(unescaped);
                  } catch (e) {
                    try {
                      fileData = JSON.parse(rawFile);
                    } catch (e2) {
                      fileData = rawFile;
                    }
                  }
                } else {
                  fileData = rawFile;
                }
                if (fileData)
                  break;
              }
            }
          }
        }
      });
      if (!fileData)
        return [];
      const streams = [];
      const addStream = (url, title, quality) => {
        if (!url || !url.startsWith("http") || url.length < 15)
          return;
        streams.push({
          name: "CinemaCity",
          title,
          url,
          quality: quality || extractQuality(url),
          headers: __spreadProps(__spreadValues({}, HEADERS), {
            // Re-include cookies as they may be required for the CDN
            Referer: "https://ww105.pencurimoviesubmalay.guru/"
          })
        });
      };
      const processStr = (str, title) => {
        if (str.includes(".urlset/master.m3u8")) {
          addStream(str, title, "Auto");
        } else {
          const urls = str.includes("[") ? str.split(",") : [str];
          urls.forEach((u) => {
            const m = u.match(/\[(.*?)\](.*)/);
            if (m)
              addStream(m[2], title, m[1]);
            else
              addStream(u, title, extractQuality(u));
          });
        }
      };
      if (mediaType === "movie") {
        if (Array.isArray(fileData)) {
          const obj = fileData.find((f) => !f.folder && f.file) || fileData[0];
          if (obj && obj.file)
            processStr(obj.file, animeTitle);
        } else if (typeof fileData === "string") {
          processStr(fileData, animeTitle);
        }
      } else {
        if (Array.isArray(fileData)) {
          const sLabel = `Season ${season}`;
          const sObj = fileData.find((s) => (s.title || "").includes(sLabel) || (s.title || "").includes(`S${season}`));
          if (sObj && sObj.folder) {
            const eLabel = `Episode ${episode}`;
            const eObj = sObj.folder.find((e) => (e.title || "").includes(eLabel) || (e.title || "").includes(`E${episode}`));
            if (eObj && eObj.file)
              processStr(eObj.file, `${animeTitle} S${season}E${episode}`);
          }
        }
      }
      return streams;
    } catch (error) {
      return [];
    }
  });
}
module.exports = { getStreams };
