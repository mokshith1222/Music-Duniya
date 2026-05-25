import { radioApi } from './apiClient'

export async function getTopStations(limit = 24) {
  const { data } = await radioApi.get('stations/topclick', {
    params: { limit, hidebroken: true },
  })
  return data ?? []
}

export async function searchStations(query, limit = 24) {
  const { data } = await radioApi.get('stations/search', {
    params: { name: query, limit, hidebroken: true },
  })
  return data ?? []
}
