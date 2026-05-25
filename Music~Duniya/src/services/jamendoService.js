import { jamendoApi } from './apiClient'

export async function getJamendoTracks({ query = '', limit = 18 } = {}) {
  const { data } = await jamendoApi.get('tracks/', {
    params: {
      limit,
      search: query || undefined,
      include: 'musicinfo',
      audioformat: 'mp32',
      order: 'popularity_total',
    },
  })
  return data.results ?? []
}
