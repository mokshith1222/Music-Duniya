import { coverArtApi } from './apiClient'

export async function getReleaseGroupCover(releaseGroupId) {
  const { data } = await coverArtApi.get(`release-group/${releaseGroupId}`)
  return data.images?.[0]?.thumbnails?.large ?? data.images?.[0]?.image
}
