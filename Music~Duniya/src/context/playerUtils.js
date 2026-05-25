import { getAudiusStreamUrl } from '../services/audiusService'

export function normalizeTrack(track) {
  if (!track) return null
  return {
    id: track.id ?? track.uuid ?? track.url ?? crypto.randomUUID(),
    title: track.title ?? track.name ?? track.trackName ?? 'Untitled track',
    artist: track.artist ?? track.user?.name ?? track.artist_name ?? track.artistName ?? 'Unknown artist',
    album: track.album ?? track.release_title ?? track.albumName ?? 'Single',
    cover:
      track.cover ??
      track.artwork?.['480x480'] ??
      track.artwork?.['150x150'] ??
      track.album_image ??
      track.image,
    audio:
      track.audio ??
      track.audio_url ??
      track.audiodownload ??
      track.url_resolved ??
      (track.user ? getAudiusStreamUrl(track.id) : ''),
    source: track.source ?? (track.user ? 'Audius' : 'Music Duniya'),
    raw: track,
  }
}
