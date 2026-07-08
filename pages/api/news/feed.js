const CURATED_FEEDS = [
    { source: "Pan African Music", url: "https://pan-african-music.com/en/feed/", category: "World" },
    { source: "Native Mag", url: "https://native-mag.com/feed/", category: "Culture" },
    { source: "Guardian Music NG", url: "https://guardian.ng/category/life/music/feed/", category: "News" },
    { source: "Music In Africa", url: "https://www.musicinafrica.net/rss", category: "Industry" },
    { source: "Afropop", url: "https://afropop.org/rss", category: "World" },
    { source: "NotJustOk", url: "https://notjustok.com/feed/", category: "Charts" },
    { source: "OkayAfrica", url: "https://www.okayafrica.com/rss/", category: "Culture" },
    { source: "Hypebot", url: "https://www.hypebot.com/hypebot/feed", category: "Industry" },
    { source: "Music Business Worldwide", url: "https://www.musicbusinessworldwide.com/feed/", category: "Industry" },
    { source: "NME", url: "https://www.nme.com/feed", category: "News" },
    { source: "Rolling Stone", url: "https://www.rollingstone.com/music/music-news/feed/", category: "News" },
    { source: "Pitchfork", url: "https://pitchfork.com/rss/news/", category: "Reviews" },
    { source: "Stereogum", url: "https://www.stereogum.com/feed/", category: "Indie" },
    { source: "Consequence", url: "https://consequence.net/feed/", category: "News" },
    { source: "The FADER", url: "https://www.thefader.com/rss", category: "Culture" },
    { source: "EDM.com", url: "https://edm.com/.rss/full/", category: "EDM" },
    { source: "Resident Advisor", url: "https://ra.co/feed/news", category: "EDM" },
    { source: "Billboard", url: "https://www.billboard.com/feed/", category: "Charts" },
    { source: "Variety Music", url: "https://variety.com/v/music/feed/", category: "Industry" },
    { source: "Complex Music", url: "https://www.complex.com/music.rss", category: "Culture" },
];

const GOOGLE_TOPICS = [
    "music+industry", "music+streaming", "spotify", "apple+music", "youtube+music", "bandcamp",
    "soundcloud", "live+music", "concert+tour", "festival+music", "coachella", "glastonbury",
    "grammys", "billboard+charts", "music+copyright", "music+licensing", "royalties+music",
    "record+label", "independent+artists", "afrobeats", "hip+hop", "rap+music", "pop+music",
    "jazz+music", "rock+music", "metal+music", "country+music", "latin+music", "kpop",
    "classical+music", "electronic+music", "house+music", "techno+music", "drum+and+bass",
    "music+production", "daw", "ableton", "fl+studio", "logic+pro", "pro+tools",
    "guitar+news", "music+gear", "synthesizer", "dj+news", "vinyl+records", "music+startup",
    "music+marketing", "artist+management", "music+publishing", "sync+licensing",
    "music+education", "music+therapy", "audio+engineering", "podcast+music", "tiktok+music",
    "instagram+music", "ai+music", "copyright+strike+music", "touring+industry", "ticketing",
    "music+venues", "orchestra+news", "choir+music", "songwriting", "beats+producer",
    "mixing+mastering", "radio+music", "music+awards", "brit+awards", "mtv+music",
    "music+documentary", "soundtrack", "film+score", "video+game+music", "music+law",
    "music+economy", "creator+economy+music", "blockchain+music", "nft+music", "music+analytics",
];

const DEFAULT_RSS_FEEDS = [
    ...CURATED_FEEDS.map((item, index) => ({ ...item, id: `curated-${String(index + 1).padStart(3, "0")}` })),
    ...GOOGLE_TOPICS.map((topic, index) => ({
        id: `google-${String(index + 1).padStart(3, "0")}`,
        source: `Google Music: ${topic.replace(/\+/g, " ")}`,
        url: `https://news.google.com/rss/search?q=${topic}&hl=en-US&gl=US&ceid=US:en`,
        category: "Search",
    })),
].slice(0, 100);

const CACHE_TTL_MS = 1000 * 60 * 5;
const feedCache = new Map();

const stripHtml = (text = "") => text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const hashToNumber = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = ((hash << 5) - hash) + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

const buildTags = (item, fallbackCategory) => {
    const categoryTags = Array.isArray(item?.categories) ? item.categories : [];
    const titleTags = String(item?.title || "")
        .split(/\s+/)
        .map((word) => word.replace(/[^a-zA-Z0-9#]/g, "").toLowerCase())
        .filter((word) => word.length > 4)
        .slice(0, 3);
    const tags = [fallbackCategory, ...categoryTags, ...titleTags].filter(Boolean);
    return Array.from(new Set(tags)).slice(0, 6);
};

const normalizeItem = (item, feedMeta) => {
    const summary = stripHtml(item?.description || item?.content || "");
    const publishedAt = new Date(item?.pubDate || Date.now()).getTime();
    const id = item?.guid || item?.link || `${feedMeta.source}-${item?.title || publishedAt}`;
    const readTime = Math.max(1, Math.round(summary.split(" ").length / 180));
    const views = 100 + (hashToNumber(String(id)) % 5000);

    return {
        id: String(id),
        title: String(item?.title || "Untitled"),
        summary: summary.slice(0, 280),
        source: feedMeta.source,
        sourceId: feedMeta.id,
        category: feedMeta.category,
        publishedAt,
        readTime,
        tags: buildTags(item, feedMeta.category),
        image: item?.thumbnail || item?.enclosure?.link || null,
        url: item?.link || "#",
        views,
    };
};

function sanitizeCustomFeeds(customFeeds) {
    if (!Array.isArray(customFeeds)) return [];

    const unique = new Map();
    customFeeds.forEach((entry, index) => {
        const source = String(entry?.source || entry?.name || "").trim();
        const url = String(entry?.url || "").trim();
        const category = String(entry?.category || "Custom").trim() || "Custom";

        if (!source || !url || !/^https?:\/\//i.test(url)) return;

        const key = url.toLowerCase();
        if (unique.has(key)) return;

        unique.set(key, {
            id: `custom-${String(index + 1).padStart(3, "0")}-${hashToNumber(url).toString(36).slice(0, 6)}`,
            source,
            url,
            category,
        });
    });

    return Array.from(unique.values());
}

async function fetchFeed(feedMeta) {
    const endpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedMeta.url)}`;
    const res = await fetch(endpoint, { method: "GET" });
    if (!res.ok) return [];

    const data = await res.json();
    if (!Array.isArray(data?.items)) return [];

    return data.items.map((item) => normalizeItem(item, feedMeta));
}

function createCacheKey(feeds) {
    const ids = feeds.map((item) => item.id).sort();
    return ids.join("|");
}

async function loadFeedData(selectedFeeds) {
    const now = Date.now();
    const cacheKey = createCacheKey(selectedFeeds);
    const cached = feedCache.get(cacheKey);

    if (cached && now - cached.timestamp < CACHE_TTL_MS && cached.data.length > 0) {
        return cached.data;
    }

    const results = await Promise.allSettled(selectedFeeds.map((feed) => fetchFeed(feed)));
    const merged = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value)
        .filter(Boolean)
        .sort((a, b) => b.publishedAt - a.publishedAt);

    feedCache.set(cacheKey, { timestamp: now, data: merged });
    return merged;
}

function parseRequestData(req) {
    const raw = req.method === "POST" ? (req.body || {}) : (req.query || {});

    const limit = Math.min(100, Math.max(1, Number(raw.limit || 10)));
    const offset = Math.max(0, Number(raw.offset || 0));

    const selectedFeedIds = Array.isArray(raw.selectedFeedIds)
        ? raw.selectedFeedIds.map(String)
        : String(raw.selectedFeedIds || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

    const customFeeds = sanitizeCustomFeeds(raw.customFeeds);
    return { limit, offset, selectedFeedIds, customFeeds };
}

export default async function handler(req, res) {
    if (!["GET", "POST"].includes(req.method)) {
        return res.status(405).json({ error: "Method not allowed." });
    }

    try {
        const { limit, offset, selectedFeedIds, customFeeds } = parseRequestData(req);
        const allFeeds = [...DEFAULT_RSS_FEEDS, ...customFeeds];

        const selectedIdSet = selectedFeedIds.length > 0
            ? new Set(selectedFeedIds)
            : new Set(allFeeds.map((feed) => feed.id));

        const selectedFeeds = allFeeds.filter((feed) => selectedIdSet.has(feed.id));
        if (selectedFeeds.length === 0) {
            return res.status(200).json({
                articles: [],
                offset,
                limit,
                total: 0,
                hasMore: false,
                availableSources: allFeeds,
            });
        }

        const data = await loadFeedData(selectedFeeds);
        const paged = data.slice(offset, offset + limit);
        const hasMore = offset + limit < data.length;

        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=300");
        return res.status(200).json({
            articles: paged,
            offset,
            limit,
            total: data.length,
            hasMore,
            availableSources: allFeeds,
        });
    } catch (_error) {
        return res.status(500).json({ error: "Unable to load feeds." });
    }
}
