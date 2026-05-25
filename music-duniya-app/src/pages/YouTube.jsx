import { useMemo, useState } from 'react'
import { Play, Search } from 'lucide-react'
import LoadingSkeleton from '../components/LoadingSkeleton'
import SectionHeader from '../components/SectionHeader'
import { coverGradient } from '../assets/coverFallback'
import { useAsync } from '../hooks/useAsync'
import { getTeluguYouTubeSongs, getTrendingYouTubeSongs, getYouTubeEmbedUrl, searchYouTubeSongs } from '../services/youtubeApi'

export default function YouTube() {
  const [query, setQuery] = useState('ar rahman latest songs')
  const [activeVideo, setActiveVideo] = useState(null)
  const search = useAsync(() => searchYouTubeSongs(query, 12), [query], [])
  const trending = useAsync(() => getTrendingYouTubeSongs(10), [], [])
  const telugu = useAsync(() => getTeluguYouTubeSongs(10), [], [])
  const featured = activeVideo || search.data[0] || trending.data[0]
  const sections = useMemo(
    () => [
      ['Trending songs', trending],
      ['Telugu songs', telugu],
    ],
    [trending, telugu],
  )

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-orbit overflow-hidden rounded-[2.5rem] p-3">
          <div className="aspect-video overflow-hidden rounded-[2rem] bg-black">
            {featured ? (
              <iframe
                title={featured.title}
                src={getYouTubeEmbedUrl(featured.id)}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="grid h-full place-items-center text-muted">Search YouTube songs to start playback.</div>
            )}
          </div>
        </div>
        <div className="glass-orbit rounded-[2.5rem] p-6">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-200">YouTube signal</p>
          <h1 className="mt-3 text-4xl font-black">Official embeds, cinematic discovery.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300">Search music videos, Telugu songs, and trending tracks using the YouTube Data API.</p>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const value = new FormData(event.currentTarget).get('query')
              setQuery(value || 'latest songs')
            }}
            className="relative mt-6"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-100/60" size={18} />
            <input name="query" defaultValue={query} className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.07] pl-12 pr-4 outline-none focus:border-cyan-200/70" />
          </form>
        </div>
      </section>

      <section>
        <SectionHeader kicker="Song search" title={`Results for "${query}"`} />
        {search.loading ? <LoadingSkeleton /> : <VideoGrid videos={search.data} onPlay={setActiveVideo} />}
      </section>

      {sections.map(([title, state]) => (
        <section key={title}>
          <SectionHeader kicker="YouTube Music" title={title} />
          {state.loading ? <LoadingSkeleton count={6} /> : <VideoGrid videos={state.data} onPlay={setActiveVideo} />}
        </section>
      ))}
    </div>
  )
}

function VideoGrid({ videos, onPlay }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {videos.map((video) => (
        <button key={video.id} onClick={() => onPlay(video)} className="glass-orbit group rounded-[1.7rem] p-3 text-left">
          <div className="relative overflow-hidden rounded-[1.25rem]">
            <img src={video.cover || coverGradient} alt="" className="aspect-video w-full object-cover transition duration-700 group-hover:scale-110" />
            <span className="absolute bottom-3 right-3 grid size-11 place-items-center rounded-full bg-white text-black shadow-[0_0_30px_rgba(255,255,255,.24)]">
              <Play size={17} fill="currentColor" />
            </span>
          </div>
          <p className="mt-3 line-clamp-1 font-black">{video.title}</p>
          <p className="line-clamp-1 text-sm text-muted">{video.artist}</p>
        </button>
      ))}
    </div>
  )
}
