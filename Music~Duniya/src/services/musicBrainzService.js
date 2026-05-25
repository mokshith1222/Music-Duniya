import { musicBrainzApi } from './apiClient'

export async function searchArtists(query, limit = 12) {
  const { data } = await musicBrainzApi.get('artist', {
    params: { query, limit },
  })
  return data.artists ?? []
}

export async function searchRecordings(query, limit = 16) {
  const { data } = await musicBrainzApi.get('recording', {
    params: { query, limit },
  })
  return data.recordings ?? []
}

export async function getArtist(id) {
  const { data } = await musicBrainzApi.get(`artist/${id}`, {
    params: { inc: 'url-rels+release-groups' },
  })
  return data
}

export async function getReleaseGroup(id) {
  const { data } = await musicBrainzApi.get(`release-group/${id}`, {
    params: { inc: 'artist-credits+releases' },
  })
  return data
}
