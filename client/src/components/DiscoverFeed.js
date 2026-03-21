import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import LoadIcon from "../images/loading.gif";
import { imageShow, videoShow } from "../utils/mediaShow";
import { Link } from "react-router-dom";

// --- CURATED CONSTANTS ---
const SAD_QUOTES = [
  { content: "The heart was made to be broken.", author: "Oscar Wilde" },
  { content: "Heavy hearts, like heavy clouds in the sky, are best relieved by letting a little water.", author: "Christopher Morley" },
  { content: "It's sad when someone you know becomes someone you knew.", author: "Henry Rollins" },
  { content: "The saddest thing is when you are feeling real down, you look around and realize that there is no shoulder for you.", author: "Unknown" }
];

const BREAKUP_POEMS = [
  { title: "The Final Page", content: "We were a story\nWritten in the stars,\nNow we are just\nA collection of scars.", emoji: "💔" },
  { title: "Shadows", content: "I see your ghost\nIn every hallway,\nA love once loud\nNow lost in always.", emoji: "🌫️" },
  { title: "Unfolding", content: "We untangled our fingers\nAnd let go of the thread,\nNow there's only silence\nIn the words we once said.", emoji: "🌑" }
];

const JOB_VACANCIES = [
  { title: "Senior Full Stack Developer", company: "TechNexus Global", desc: "Looking for experts in MERN stack. Remote friendly, great benefits.", link: "https://www.linkedin.com/jobs" },
  { title: "Data Scientist (AI/ML)", company: "Cognitive Systems", desc: "Join our core AI team to build next-gen predictive models.", link: "https://www.indeed.com" },
  { title: "Product Designer", company: "CreativeFlow", desc: "Lead the UI/UX design for our mobile social platform.", link: "https://www.dribbble.com/jobs" }
];

const SPORTS_NEWS = [
  { title: "Champions League Quarter-Finals set for thrilling clashes", url: "https://www.uefa.com", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400" },
  { title: "NBA: MVP Race heats up as regular season nears end", url: "https://www.nba.com", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400" }
];

const CONTENT_TYPES = {
  MEME: { label: "Meme", emoji: "😂", color: "#2ecc71" },
  NEWS: { label: "News", emoji: "📰", color: "#2980b9" },
  MOTIVATIONAL: { label: "Inspire", emoji: "✨", color: "#f39c12" },
  SAD: { label: "Reflect", emoji: "🌑", color: "#34495e" },
  POEM: { label: "Poem", emoji: "💔", color: "#9b59b6" },
  SPORTS: { label: "Sports", emoji: "🏀", color: "#e74c3c" },
  JOBS: { label: "Jobs", emoji: "💼", color: "#16a085" },
  USER: { label: "User Post", emoji: "👤", color: "#3498db" }
};

// --- AXIOS INSTANCE FOR EXTERNAL APIS (Fixes CORS with global credentials) ---
const externalApi = axios.create({
    withCredentials: false
});

const DiscoverFeed = () => {
    const { auth, theme } = useSelector((state) => state);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const hasMore = useRef(true);
    const isFetching = useRef(false);

    const fetchBatch = useCallback(async (pageNum) => {
        console.log("Fetching batch for page:", pageNum);
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);

        const myInterests = auth.user.interests || [];

        try {
            // Adjust limits based on page: Page 1 is smaller (~10-12), Page > 1 is ~20
            const userLimit = pageNum === 1 ? 5 : 10;
            const newsLimit = pageNum === 1 ? 3 : 6;

            const systemPromises = [
                (!myInterests.length || myInterests.includes('MOTIVATIONAL')) ? externalApi.get("https://dummyjson.com/quotes/random").catch(() => null) : Promise.resolve(null),
                (!myInterests.length || myInterests.includes('MEME')) ? externalApi.get("https://meme-api.com/gimme").catch(() => null) : Promise.resolve(null),
                (!myInterests.length || myInterests.includes('NEWS') || myInterests.includes('SPORTS')) ? externalApi.get(`https://api.spaceflightnewsapi.net/v4/articles?limit=${newsLimit}`).catch(() => null) : Promise.resolve(null),
                axios.get(`/api/post_discover?limit=${userLimit}&page=${pageNum}`, {
                    headers: { Authorization: auth.token }
                }).catch(() => null)
            ];

            const [quoteRes, memeRes, newsRes, userRes] = await Promise.all(systemPromises);

            const batch = [];
            if (memeRes?.data) batch.push({ ...memeRes.data, type: 'MEME' });
            if (quoteRes?.data) batch.push({ ...quoteRes.data, type: 'MOTIVATIONAL' });
            if (newsRes?.data?.results) {
                newsRes.data.results.forEach((n, i) => {
                    const type = i % 2 === 0 ? 'NEWS' : 'SPORTS';
                    if(!myInterests.length || myInterests.includes(type)) {
                        batch.push({ ...n, type });
                    }
                });
            } else if (pageNum === 1 && (!myInterests.length || myInterests.includes('SPORTS'))) {
                batch.push({ ...SPORTS_NEWS[Math.floor(Math.random() * SPORTS_NEWS.length)], type: 'SPORTS' });
            }

            // More fallbacks for larger batches
            if (pageNum > 1) {
                if(!myInterests.length || myInterests.includes('SAD')) {
                    batch.push({ ...SAD_QUOTES[Math.floor(Math.random() * SAD_QUOTES.length)], type: 'SAD' });
                }
                if(!myInterests.length || myInterests.includes('POEM')) {
                    batch.push({ ...BREAKUP_POEMS[Math.floor(Math.random() * BREAKUP_POEMS.length)], type: 'POEM' });
                }
            }
            
            if(!myInterests.length || myInterests.includes('JOBS')) {
                batch.push({ ...JOB_VACANCIES[Math.floor(Math.random() * JOB_VACANCIES.length)], type: 'JOBS' });
            }

            const userPosts = userRes?.data?.posts || [];
            const mixedBatch = [];
            const shuffledSystem = batch.sort(() => Math.random() - 0.5);

            let sIdx = 0, uIdx = 0;
            while(sIdx < shuffledSystem.length || uIdx < userPosts.length) {
                if(sIdx < shuffledSystem.length) {
                    mixedBatch.push({ ...shuffledSystem[sIdx], id: `sys-${Date.now()}-${sIdx}-${pageNum}` });
                    sIdx++;
                }
                if(uIdx < userPosts.length && (mixedBatch.length % 2 === 0)) {
                    mixedBatch.push({ ...userPosts[uIdx], type: 'USER' });
                    uIdx++;
                }
            }

            setPosts(prev => pageNum === 1 ? mixedBatch : [...prev, ...mixedBatch]);
            if (mixedBatch.length === 0) hasMore.current = false;

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    }, [auth.token, auth.user.interests]);

    useEffect(() => {
        fetchBatch(page);
    }, [page, fetchBatch]);

    const handleLoadMore = () => {
        if (!loading && hasMore.current) {
            setPage(prev => prev + 1);
        }
    };

    const renderPost = (post) => {
        const typeInfo = CONTENT_TYPES[post.type] || CONTENT_TYPES.NEWS;

        return (
            <div key={post.id || post._id} className="discover_post_card outer-shadow">
                <div className="post_badge" style={{ backgroundColor: typeInfo.color }}>
                    {typeInfo.emoji} {typeInfo.label}
                </div>

                {post.type === 'USER' ? (
                    <div className="user_post_content">
                        <div className="d-flex align-items-center mb-2">
                           <img src={post.user.avatar} alt="" className="user_mini_avatar" />
                           <Link to={`/profile/${post.user._id}`} className="ms-2 user_name_link">
                             {post.user.username}
                           </Link>
                        </div>
                        <p className="user_post_text">{post.content}</p>
                        <div className="user_post_images">
                            {post.images.length > 0 && (
                                post.images[0].url.match(/video/i) 
                                ? videoShow(post.images[0].url, theme)
                                : imageShow(post.images[0].url, theme)
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="system_post_content">
                        {post.type === 'MEME' && (
                            <>
                                <img src={post.url} alt="meme" className="discover_media" />
                                <p className="discover_title">{post.title}</p>
                            </>
                        )}
                        {(post.type === 'NEWS' || post.type === 'SPORTS') && (
                            <>
                                <img src={post.image_url || post.image} alt="news" className="discover_media" />
                                <h6 className="discover_title">{post.title}</h6>
                                <a href={post.url} target="_blank" rel="noreferrer" className="discover_link">
                                    Read Source ↗
                                </a>
                            </>
                        )}
                        {(post.type === 'MOTIVATIONAL' || post.type === 'SAD') && (
                            <div className="quote_wrap">
                                <p className="discover_quote">"{post.quote || post.content}"</p>
                                <span className="discover_author">- {post.author}</span>
                            </div>
                        )}
                        {post.type === 'POEM' && (
                            <div className="poem_wrap">
                                <h6 className="poem_title">{post.title}</h6>
                                <p className="discover_poem">{post.content}</p>
                            </div>
                        )}
                        {post.type === 'JOBS' && (
                            <div className="job_wrap">
                                <h6 className="discover_title" style={{color: '#16a085'}}>{post.title}</h6>
                                <span className="job_company">🏢 {post.company}</span>
                                <p className="discover_desc">{post.desc}</p>
                                <a href={post.link} target="_blank" rel="noreferrer" className="discover_link">
                                    Apply Now ↗
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="discover_feed_wrapper">
            <div className="discover_feed_container">
                {posts.length === 0 && !loading && (
                    <div className="text-center my-5">
                        <h4>Welcome to Discover! 🚀</h4>
                        <p className="text-muted">Start by adding some interests below to see content you love.</p>
                        <button 
                            className="btn btn-info text-white mt-3"
                            onClick={() => document.getElementById('add_more_section').scrollIntoView({behavior: 'smooth'})}
                        >
                            Customize Feed
                        </button>
                    </div>
                )}

                {posts.map((post) => renderPost(post))}
                
                {loading && (
                    <div className="text-center my-4">
                        <img src={LoadIcon} alt="loading" style={{ width: '40px' }} />
                    </div>
                )}
                
                {!loading && hasMore.current && posts.length > 0 && (
                    <div className="text-center my-4">
                        <button 
                            className="btn btn-outline-info color-c1 px-4" 
                            style={{ borderRadius: '20px', fontWeight: 'bold' }}
                            onClick={handleLoadMore}
                        >
                            Load More
                        </button>
                    </div>
                )}
                
                {!hasMore.current && posts.length > 0 && (
                    <p className="text-center text-muted my-4">You've reached the end of the world!</p>
                )}
            </div>
        </div>
    );
};

export default DiscoverFeed;
