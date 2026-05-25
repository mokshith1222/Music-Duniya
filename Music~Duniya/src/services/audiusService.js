import { audiusApi } from './apiClient'

export async function getTrendingTracks(limit = 12) {
  const { data } = await audiusApi.get('tracks/trending', { params: { limit } })
  return data.data ?? []
}

export async function searchAudiusTracks(query, limit = 12) {
  const { data } = await audiusApi.get('tracks/search', {
    params: { query, limit },
  })
  return data.data ?? []
}

export const getAudiusStreamUrl = (trackId) =>
  `https://discoveryprovider.audius.co/v1/tracks/${trackId}/stream`
