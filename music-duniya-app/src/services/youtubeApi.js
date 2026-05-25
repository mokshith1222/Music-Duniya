import axios from 'axios'

const youtube = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
})

const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY

function mapVideo(item) {
  return {
    id: item.id?.videoId ?? item.id,
    title: item.snippet?.title ?? 'Untitled video',
    artist: item.snippet?.channelTitle ?? 'YouTube',
    description: item.snippet?.description ?? '',
    cover: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.medium?.url,
    publishedAt: item.snippet?.publishedAt,
    source: 'YouTube',
  }
}

export async function searchYouTubeSongs(query, maxResults = 12) {
  if (!apiKey) return []
  const { data } = await youtube.get('search', {
    params: {
      key: apiKey,
      part: 'snippet',
      q: query,
      type: 'video',
      videoCategoryId: '10',
      maxResults,
      safeSearch: 'none',
    },
  })
  return (data.items ?? []).map(mapVideo).filter((item) => item.id)
}

export const getTrendingYouTubeSongs = (maxResults = 12) =>
  searchYouTubeSongs('latest trending songs official music video', maxResults)

export const getTeluguYouTubeSongs = (maxResults = 12) =>
  searchYouTubeSongs('latest Telugu songs official music videos', maxResults)

export const getYouTubeEmbedUrl = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
