import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    FormControl,
    IconButton,
    InputBase,
    InputLabel,
    MenuItem,
    Select,
    Skeleton,
    Slider,
    Stack,
    Typography,
    useMediaQuery,
    Tooltip
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArticleArtwork from "../../Graphics/ArticleArtwork";

const FEEDS = [
    { id: "nme", source: "NME", url: "https://www.nme.com/feed", category: "News" },
    { id: "rolling-stone", source: "Rolling Stone", url: "https://www.rollingstone.com/music/music-news/feed/", category: "News" },
    { id: "pitchfork", source: "Pitchfork", url: "https://pitchfork.com/rss/news/", category: "Reviews" },
    { id: "stereogum", source: "Stereogum", url: "https://www.stereogum.com/feed/", category: "Indie" },
    { id: "fader", source: "The FADER", url: "https://www.thefader.com/rss", category: "Culture" },
    { id: "billboard", source: "Billboard", url: "https://www.billboard.com/feed/", category: "Charts" },
    { id: "variety", source: "Variety Music", url: "https://variety.com/v/music/feed/", category: "Industry" },
    { id: "hypebot", source: "Hypebot", url: "https://www.hypebot.com/hypebot/feed", category: "Industry" },
    { id: "edm", source: "EDM.com", url: "https://edm.com/.rss/full/", category: "EDM" },
    { id: "ra", source: "Resident Advisor", url: "https://ra.co/feed/news", category: "EDM" },
];

const READ_KEY = "news_read_map_v3";
const BOOKMARK_KEY = "news_bookmark_map_v3";
const HIGHLIGHT_KEY = "news_highlight_map_v3";
const COLLAPSE_KEY = "news_collapse_map_v3";
const PREF_KEY = "news_prefs_v3";
const ANALYTICS_KEY = "news_analytics_v3";
const STREAK_KEY = "news_streak_v3";
const SESSION_READ_KEY = "news_session_read_count_v3";

const PAGE_SIZE = 10;
const STOP_WORDS = new Set(["about", "after", "again", "their", "there", "would", "could", "should", "these", "those", "music", "with", "from", "this", "that", "have", "your", "will", "they", "them", "into", "when", "where", "what", "while", "been", "more", "than", "just"]);

const safeJsonParse = (value, fallback) => {
    try {
        return JSON.parse(value);
    } catch (_error) {
        return fallback;
    }
};

const stripHtml = (text = "") => String(text).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const extractImageFromHtml = (html = "") => {
    const match = String(html).match(/<img[^>]+src=["']([^"']+)["']/i);
    return match?.[1] || null;
};

const normalizeItem = (item, feed) => {
    const summary = stripHtml(item?.description || item?.content || item?.contentSnippet || "");
    const image = item?.thumbnail || item?.enclosure?.link || extractImageFromHtml(item?.description || item?.content || "");
    const tags = Array.isArray(item?.categories)
        ? item.categories.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean)
        : [];

    return {
        id: String(item?.guid || item?.id || item?.link || `${feed.id}-${item?.title || Date.now()}`),
        title: String(item?.title || "Untitled"),
        source: feed.source,
        sourceId: feed.id,
        category: feed.category,
        tags,
        summary,
        publishedAt: new Date(item?.pubDate || item?.published || Date.now()).getTime(),
        image: image || null,
        url: String(item?.link || "#"),
    };
};

const parseXmlFeed = (xmlText, feed) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const items = Array.from(xml.querySelectorAll("item"));
    return items.slice(0, 30).map((item) => {
        const title = item.querySelector("title")?.textContent || "";
        const link = item.querySelector("link")?.textContent || "";
        const guid = item.querySelector("guid")?.textContent || link;
        const description = item.querySelector("description")?.textContent || "";
        const pubDate = item.querySelector("pubDate")?.textContent || "";
        const mediaThumb = item.querySelector("media\\:thumbnail")?.getAttribute("url");
        const enclosure = item.querySelector("enclosure")?.getAttribute("url");
        const categories = Array.from(item.querySelectorAll("category")).map((cat) => cat.textContent || "");

        return normalizeItem({
            title,
            link,
            guid,
            description,
            pubDate,
            thumbnail: mediaThumb || enclosure || null,
            categories,
        }, feed);
    });
};

const fetchFeed = async (feed) => {
    const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
    try {
        const response = await fetch(rss2jsonUrl);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data?.items)) {
                return data.items.slice(0, 30).map((item) => normalizeItem(item, feed));
            }
        }
    } catch (_error) {
        // Fallback below
    }

    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`;
    const fallback = await fetch(proxyUrl);
    if (!fallback.ok) return [];
    const xmlText = await fallback.text();
    return parseXmlFeed(xmlText, feed);
};

const dedupeArticles = (items) => {
    const map = new Map();
    items.forEach((item) => {
        if (!item?.id) return;
        map.set(item.id, item);
    });
    return Array.from(map.values());
};

const getDateKey = (timestamp) => new Date(timestamp).toISOString().slice(0, 10);

const getYesterdayKey = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().slice(0, 10);
};

export default function NewsFeedExperience() {
    const isMobile = useMediaQuery("(max-width:900px)", { noSsr: true });

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [sourceFilter, setSourceFilter] = useState("all");
    const [tagFilter, setTagFilter] = useState("all");
    const [sortBy, setSortBy] = useState("latest");
    const [availableSources, setAvailableSources] = useState(FEEDS);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [themeMode, setThemeMode] = useState("light");
    const [fontSize, setFontSize] = useState(15);
    const [readMap, setReadMap] = useState({});
    const [bookmarkMap, setBookmarkMap] = useState({});
    const [highlightMap, setHighlightMap] = useState({});
    const [collapseMap, setCollapseMap] = useState({});
    const [analytics, setAnalytics] = useState({ sourceViews: {}, tagViews: {}, articleViews: {} });
    const [sessionReadCount, setSessionReadCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [shareMessage, setShareMessage] = useState("");
    const isFetchingRef = useRef(false);
    const feedOffsetRef = useRef(0);

    useEffect(() => {
        const timer = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 250);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const prefs = safeJsonParse(window.localStorage.getItem(PREF_KEY) || "{}", {});
        setThemeMode(prefs.themeMode || "light");
        setFontSize(Number(prefs.fontSize) || 15);
        setReadMap(safeJsonParse(window.localStorage.getItem(READ_KEY) || "{}", {}));
        setBookmarkMap(safeJsonParse(window.localStorage.getItem(BOOKMARK_KEY) || "{}", {}));
        setHighlightMap(safeJsonParse(window.localStorage.getItem(HIGHLIGHT_KEY) || "{}", {}));
        setCollapseMap(safeJsonParse(window.localStorage.getItem(COLLAPSE_KEY) || "{}", {}));
        setAnalytics(safeJsonParse(window.localStorage.getItem(ANALYTICS_KEY) || "{}", { sourceViews: {}, tagViews: {}, articleViews: {} }));
        setSessionReadCount(Number(window.sessionStorage.getItem(SESSION_READ_KEY) || 0));
        const streakData = safeJsonParse(window.localStorage.getItem(STREAK_KEY) || "{}", {});
        setStreak(Number(streakData.streak) || 0);
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(PREF_KEY, JSON.stringify({ themeMode, fontSize }));
    }, [themeMode, fontSize]);

    const loadFeedPage = useCallback(async ({ reset = false } = {}) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        const requestOffset = reset ? 0 : feedOffsetRef.current;
        if (reset) {
            setLoading(true);
            setError("");
        } else {
            setLoadingMore(true);
        }

        try {
            const selectedFeedIds = sourceFilter !== "all" ? [sourceFilter] : [];
            const response = await fetch("/api/news/feed", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    limit: PAGE_SIZE,
                    offset: requestOffset,
                    selectedFeedIds,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || "Unable to load RSS feeds.");
            }

            const pageArticles = Array.isArray(data?.articles) ? data.articles : [];
            const nextOffset = requestOffset + pageArticles.length;
            feedOffsetRef.current = nextOffset;

            setAvailableSources(Array.isArray(data?.availableSources) ? data.availableSources : FEEDS);
            setArticles((prev) => {
                const merged = reset ? pageArticles : [...prev, ...pageArticles];
                return dedupeArticles(merged).sort((a, b) => b.publishedAt - a.publishedAt);
            });
            setHasMore(Boolean(data?.hasMore));
            setError("");
        } catch (_error) {
            if (!reset) {
                setError("Unable to load more articles right now.");
                return;
            }

            try {
                const fallbackFeeds = sourceFilter === "all"
                    ? FEEDS
                    : FEEDS.filter((feed) => feed.id === sourceFilter);
                const settled = await Promise.allSettled(fallbackFeeds.map((feed) => fetchFeed(feed)));
                const merged = settled
                    .filter((entry) => entry.status === "fulfilled")
                    .flatMap((entry) => entry.value || []);
                const normalized = dedupeArticles(merged).sort((a, b) => b.publishedAt - a.publishedAt);
                setArticles(normalized.slice(0, PAGE_SIZE));
                feedOffsetRef.current = PAGE_SIZE;
                setHasMore(normalized.length > PAGE_SIZE);
                setAvailableSources(FEEDS);
                setError("Using fallback feed mode.");
            } catch (_fallbackError) {
                setError("Unable to load RSS feeds. Try again.");
                setArticles([]);
                feedOffsetRef.current = 0;
                setHasMore(false);
            }
        } finally {
            if (reset) setLoading(false);
            setLoadingMore(false);
            isFetchingRef.current = false;
        }
    }, [sourceFilter]);

    useEffect(() => {
        feedOffsetRef.current = 0;
        setArticles([]);
        setHasMore(true);
        loadFeedPage({ reset: true });
    }, [sourceFilter, loadFeedPage]);

    useEffect(() => {
        const onScroll = () => {
            if (loading || loadingMore || !hasMore) return;
            const threshold = 280;
            const reachedBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold;
            if (reachedBottom) {
                loadFeedPage({ reset: false });
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [hasMore, loading, loadingMore, loadFeedPage]);

    const updateStorageMap = (key, nextState, setter) => {
        setter(nextState);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(nextState));
        }
    };

    const toggleMapFlag = (map, id, key, setter) => {
        const next = { ...map, [id]: !map[id] };
        updateStorageMap(key, next, setter);
    };

    const toggleCollapsed = (articleId, collapsed) => {
        const next = { ...collapseMap, [articleId]: !collapsed };
        updateStorageMap(COLLAPSE_KEY, next, setCollapseMap);
    };

    const markRead = (article, forceValue = null) => {
        const nextValue = forceValue !== null ? forceValue : !readMap[article.id];
        const nextRead = { ...readMap, [article.id]: nextValue };
        updateStorageMap(READ_KEY, nextRead, setReadMap);

        if (!nextValue || typeof window === "undefined") return;

        const nextSession = sessionReadCount + 1;
        setSessionReadCount(nextSession);
        window.sessionStorage.setItem(SESSION_READ_KEY, String(nextSession));

        const nextAnalytics = {
            sourceViews: { ...analytics.sourceViews, [article.source]: (analytics.sourceViews?.[article.source] || 0) + 1 },
            tagViews: { ...analytics.tagViews },
            articleViews: { ...analytics.articleViews, [article.id]: (analytics.articleViews?.[article.id] || 0) + 1 },
        };
        (article.tags || []).forEach((tag) => {
            nextAnalytics.tagViews[tag] = (nextAnalytics.tagViews[tag] || 0) + 1;
        });
        setAnalytics(nextAnalytics);
        window.localStorage.setItem(ANALYTICS_KEY, JSON.stringify(nextAnalytics));

        const today = getDateKey(Date.now());
        const yesterday = getYesterdayKey();
        const streakData = safeJsonParse(window.localStorage.getItem(STREAK_KEY) || "{}", {});
        let nextStreak = Number(streakData.streak) || 0;

        if (streakData.lastReadDate !== today) {
            nextStreak = streakData.lastReadDate === yesterday ? nextStreak + 1 : 1;
            const nextStreakData = { streak: nextStreak, lastReadDate: today };
            window.localStorage.setItem(STREAK_KEY, JSON.stringify(nextStreakData));
            setStreak(nextStreak);
        }
    };

    const shareArticle = async (article) => {
        try {
            if (navigator.share) {
                await navigator.share({ title: article.title, text: article.summary, url: article.url });
                return;
            }
            await navigator.clipboard.writeText(article.url);
            setShareMessage("Article link copied to clipboard.");
            setTimeout(() => setShareMessage(""), 1800);
        } catch (_error) {
            setShareMessage("Unable to share this article right now.");
            setTimeout(() => setShareMessage(""), 1800);
        }
    };

    const sourceOptions = useMemo(() => {
        const merged = new Map();

        (Array.isArray(availableSources) ? availableSources : []).forEach((feed) => {
            const id = String(feed?.id || "").trim();
            if (!id) return;
            merged.set(id, { id, label: String(feed?.source || id) });
        });

        articles.forEach((article) => {
            const id = String(article?.sourceId || article?.source || "").trim();
            if (!id || merged.has(id)) return;
            merged.set(id, { id, label: String(article?.source || id) });
        });

        return [{ id: "all", label: "All sources" }, ...Array.from(merged.values()).sort((a, b) => a.label.localeCompare(b.label))];
    }, [availableSources, articles]);

    useEffect(() => {
        if (sourceFilter === "all") return;
        if (!sourceOptions.some((option) => option.id === sourceFilter)) {
            setSourceFilter("all");
        }
    }, [sourceFilter, sourceOptions]);
    const tags = useMemo(() => {
        const set = new Set();
        articles.forEach((item) => (item.tags || []).forEach((tag) => set.add(tag)));
        return ["all", ...Array.from(set).sort()];
    }, [articles]);

    const filtered = useMemo(() => {
        const list = articles.filter((item) => {
            if (sourceFilter !== "all" && item.sourceId !== sourceFilter) return false;
            if (tagFilter !== "all" && !(item.tags || []).includes(tagFilter)) return false;
            if (search && !(`${item.title} ${item.summary}`.toLowerCase().includes(search))) return false;
            return true;
        });

        if (sortBy === "alpha") return list.sort((a, b) => a.title.localeCompare(b.title));
        if (sortBy === "oldest") return list.sort((a, b) => a.publishedAt - b.publishedAt);
        return list.sort((a, b) => b.publishedAt - a.publishedAt);
    }, [articles, sourceFilter, tagFilter, search, sortBy]);

    const displayed = filtered;

    const keywordCloud = useMemo(() => {
        const counts = new Map();
        articles.forEach((article) => {
            const words = `${article.title} ${article.summary}`.toLowerCase().match(/[a-z0-9#]{5,}/g) || [];
            words.forEach((word) => {
                if (STOP_WORDS.has(word)) return;
                counts.set(word, (counts.get(word) || 0) + 1);
            });
        });
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 16);
    }, [articles]);

    const topReadArticleIds = useMemo(() => {
        return Object.entries(analytics.articleViews || {})
            .sort((a, b) => Number(b[1]) - Number(a[1]))
            .slice(0, 5)
            .map(([id]) => id);
    }, [analytics.articleViews]);

    const palette = themeMode === "dark"
        ? { bg: "#0b1220", card: "#111a2c", text: "#e2e8f0", sub: "#9fb0cc", border: "#22304a" }
        : { bg: "#f4f7fb", card: "#ffffff", text: "#0f172a", sub: "#475569", border: "#dbe3ef" };

    return (
        <Box sx={{ background: palette.bg, minHeight: "100vh", color: palette.text, pt: 2, pb: 8, transition: "background 0.2s ease" }}>
            <Container maxWidth="xl">
                <Card sx={{ mb: 2, borderRadius: 3, background: palette.card, border: `1px solid ${palette.border}`, boxShadow: "none" }}>
                    <CardContent>
                        <Stack spacing={1.4}>
                            <Stack direction={isMobile ? "column" : "row"} spacing={1} alignItems={isMobile ? "stretch" : "center"}>
                                <Typography variant="h5" fontWeight={800}>Frontend RSS Hub</Typography>
                                <Chip icon={<DoneAllIcon />} label={`Session reads: ${sessionReadCount}`} />
                                <Chip icon={<AutoAwesomeIcon />} label={`Reading streak: ${streak} day${streak === 1 ? "" : "s"}`} />
                            </Stack>

                            <Stack direction={isMobile ? "column" : "row"} spacing={1} alignItems={isMobile ? "stretch" : "center"}>
                                <Box sx={{ flex: 1, display: "flex", alignItems: "center", border: `1px solid ${palette.border}`, borderRadius: 999, px: 1.2, background: themeMode === "dark" ? "#0f1a2d" : "#fff" }}>
                                    <SearchIcon fontSize="small" />
                                    <InputBase
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Search title and summary..."
                                        sx={{ ml: 1, flex: 1, color: palette.text }}
                                    />
                                </Box>

                                <FormControl size="small" sx={{ minWidth: 170 }}>
                                    <InputLabel>Source</InputLabel>
                                    <Select label="Source" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                                        {sourceOptions.map((source) => (
                                            <MenuItem key={source.id} value={source.id}>{source.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 160 }}>
                                    <InputLabel>Tag</InputLabel>
                                    <Select label="Tag" value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}>
                                        {tags.map((tag) => (
                                            <MenuItem key={tag} value={tag}>{tag === "all" ? "All tags" : `#${tag}`}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 165 }}>
                                    <InputLabel>Sort</InputLabel>
                                    <Select label="Sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <MenuItem value="latest">Latest</MenuItem>
                                        <MenuItem value="oldest">Oldest</MenuItem>
                                        <MenuItem value="alpha">Title A-Z</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>

                            <Stack direction={isMobile ? "column" : "row"} spacing={1} alignItems={isMobile ? "stretch" : "center"}>
                                <Button
                                    variant="outlined"
                                    startIcon={themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                                    onClick={() => setThemeMode((prev) => prev === "light" ? "dark" : "light")}
                                >
                                    {themeMode === "light" ? "Dark mode" : "Light mode"}
                                </Button>

                                <Box sx={{ width: 220, px: 1 }}>
                                    <Typography variant="caption" color={palette.sub}>Font size</Typography>
                                    <Slider value={fontSize} min={13} max={22} onChange={(_e, value) => setFontSize(Number(value))} />
                                </Box>

                                {shareMessage ? (
                                    <Typography variant="body2" color="text.secondary">{shareMessage}</Typography>
                                ) : null}
                            </Stack>

                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ pt: 0.5 }}>
                                {keywordCloud.map(([word, count]) => (
                                    <Chip key={word} label={`${word} (${count})`} size="small" onClick={() => setSearchInput(word)} />
                                ))}
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>

                {loading ? (
                    <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))", xl: "repeat(3,minmax(0,1fr))" } }}>
                        {Array.from({ length: 9 }).map((_, index) => (
                            <Card key={index} sx={{ borderRadius: 3, border: `1px solid ${palette.border}`, boxShadow: "none" }}>
                                <Skeleton variant="rectangular" height={180} />
                                <CardContent>
                                    <Skeleton height={26} width="92%" />
                                    <Skeleton height={20} width="70%" />
                                    <Skeleton height={20} width="100%" />
                                    <Skeleton height={20} width="88%" />
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ) : error ? (
                    <Card sx={{ borderRadius: 3, border: `1px solid ${palette.border}`, background: palette.card, boxShadow: "none" }}>
                        <CardContent>
                            <Typography variant="h6">Unable to load feeds</Typography>
                            <Typography color="text.secondary" sx={{ mb: 1.5 }}>{error}</Typography>
                            <Button variant="contained" onClick={() => window.location.reload()}>Retry</Button>
                        </CardContent>
                    </Card>
                ) : displayed.length === 0 ? (
                    <Card sx={{ borderRadius: 3, border: `1px solid ${palette.border}`, background: palette.card, boxShadow: "none" }}>
                        <CardContent>
                            <Typography variant="h6">No articles found</Typography>
                            <Typography color="text.secondary">Try changing source, tag, or search query.</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Box
                            sx={{
                                columnCount: { xs: 1, md: 2, xl: 3 },
                                columnGap: 1.5,
                            }}
                        >
                            {displayed.map((article) => {
                                const read = Boolean(readMap[article.id]);
                                const bookmarked = Boolean(bookmarkMap[article.id]);
                                const highlighted = Boolean(highlightMap[article.id]);
                                const collapsed = collapseMap[article.id] !== false;
                                const isMostRead = topReadArticleIds.includes(article.id);

                                return (
                                    <Card
                                        key={article.id}
                                        sx={{
                                            display: "inline-block",
                                            width: "100%",
                                            mb: 1.5,
                                            breakInside: "avoid",
                                            borderRadius: 3,
                                            border: `1px solid ${highlighted ? "#f59e0b" : palette.border}`,
                                            background: palette.card,
                                            boxShadow: highlighted ? "0 0 0 2px rgba(245,158,11,0.35)" : "none",
                                            opacity: read ? 0.85 : 1,
                                        }}
                                    >
                                        {article.image && (
                                            <ArticleArtwork
                                                article={{
                                                    slug: article.id,
                                                    title: article.title,
                                                    category: article.source || article.category,
                                                    image: article.image,
                                                }}
                                                height={210}
                                                compact
                                                preferSourceImage
                                            />
                                        )}
                                        <CardContent sx={{ pb: 1 }}>
                                            <Stack direction="row" spacing={0.8} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                                                <Chip size="small" label={article.source} />
                                                <Chip size="small" variant="outlined" label={article.category} />
                                                {bookmarked ? <Chip size="small" color="primary" label="Bookmarked" /> : null}
                                                {read ? <Chip size="small" color="success" label="Read" /> : null}
                                                {highlighted ? <Chip size="small" color="warning" label="Important" /> : null}
                                                {isMostRead ? <Chip size="small" color="secondary" label="Most read" /> : null}
                                            </Stack>

                                            <Typography variant="h6" sx={{ fontSize: `${fontSize + 2}px`, lineHeight: 1.3 }}>
                                                {article.title}
                                            </Typography>
                                            <Typography variant="caption" color={palette.sub}>
                                                {new Date(article.publishedAt).toLocaleString()}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: `${fontSize}px`,
                                                    mt: 1,
                                                    color: palette.sub,
                                                    display: collapsed ? "-webkit-box" : "block",
                                                    WebkitLineClamp: collapsed ? 3 : "unset",
                                                    WebkitBoxOrient: collapsed ? "vertical" : "unset",
                                                    overflow: collapsed ? "hidden" : "visible",
                                                }}
                                            >
                                                {article.summary || "No description available."}
                                            </Typography>
                                        </CardContent>

                                        <CardActions sx={{ px: 1.2, pb: 1.2, justifyContent: "space-between" }}>
                                            <Stack direction="row" spacing={0.5}>
                                                <Tooltip title={bookmarked ? "Remove bookmark" : "Bookmark"}>
                                                    <IconButton onClick={() => toggleMapFlag(bookmarkMap, article.id, BOOKMARK_KEY, setBookmarkMap)}>
                                                        {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={read ? "Mark unread" : "Mark read"}>
                                                    <IconButton onClick={() => markRead(article, !read)}>
                                                        <DoneAllIcon color={read ? "success" : "inherit"} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title={highlighted ? "Remove highlight" : "Highlight"}>
                                                    <IconButton onClick={() => toggleMapFlag(highlightMap, article.id, HIGHLIGHT_KEY, setHighlightMap)}>
                                                        <AutoAwesomeIcon color={highlighted ? "warning" : "inherit"} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Share">
                                                    <IconButton onClick={() => shareArticle(article)}>
                                                        <ShareIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>

                                            <Stack direction="row" spacing={0.8}>
                                                <Button
                                                    size="small"
                                                    onClick={() => toggleCollapsed(article.id, collapsed)}
                                                >
                                                    {collapsed ? "Expand" : "Collapse"}
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    endIcon={<OpenInNewIcon />}
                                                    href={article.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => markRead(article, true)}
                                                >
                                                    Open
                                                </Button>
                                            </Stack>
                                        </CardActions>
                                    </Card>
                                );
                            })}
                        </Box>

                        {hasMore ? (
                            <Box sx={{ textAlign: "center", mt: 2.2 }}>
                                <Button variant="outlined" onClick={() => loadFeedPage({ reset: false })} disabled={loadingMore}>
                                    {loadingMore ? "Loading..." : "Load more"}
                                </Button>
                            </Box>
                        ) : null}
                    </>
                )}
            </Container>
        </Box>
    );
}
