import { lrclibApi } from './apiClient'

export async function getLyrics({ trackName, artistName, albumName }) {
  const { data } = await lrclibApi.get('get', {
    params: { track_name: trackName, artist_name: artistName, album_name: albumName },
  })
  return data
}
