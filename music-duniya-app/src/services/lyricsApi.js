import { lrclibClient } from './apiClient';

/**
 * Searches for lyrics.
 * @param {Object} params
 * @param {string} params.artist_name - The name of the artist.
 * @param {string} params.track_name - The name of the track.
 * @param {string} [params.album_name] - The name of the album.
 * @param {number} [params.duration] - The duration of the track in seconds.
 * @returns {Promise<Array>} A list of matching lyrics.
 */
export const searchLyrics = async (params) => {
  try {
    const response = await lrclibClient.get('/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching for lyrics:', error);
    return [];
  }
};

/**
 * Gets lyrics by track ID.
 * @param {number} id - The ID of the track on LRCGET.
 * @returns {Promise<Object|null>} The track with lyrics, or null if not found.
 */
export const getLyricsById = async (id) => {
  try {
    const response = await lrclibClient.get(`/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting lyrics for ID ${id}:`, error);
    return null;
  }
};

/**
 * A convenience function to get either synced or plain lyrics for a track.
 * It prioritizes synced lyrics.
 * @param {Object} params
 * @param {string} params.artistName - The name of the artist.
 * @param {string} params.trackName - The name of the track.
 * @param {string} [params.albumName] - The name of the album.
 * @param {number} [params.duration] - The duration of the track in seconds.
 * @returns {Promise<Object|null>} An object with `syncedLyrics` or `plainLyrics`, or null.
 */
export const getLyrics = async ({ artistName, trackName, albumName, duration }) => {
    try {
        const results = await searchLyrics({ 
            artist_name: artistName, 
            track_name: trackName, 
            album_name: albumName, 
            duration 
        });
        if (results.length > 0) {
            // Prefer synced lyrics
            const trackWithSyncedLyrics = results.find(track => track.syncedLyrics);
            if (trackWithSyncedLyrics) {
                return trackWithSyncedLyrics;
            }
            // Fallback to the first result's plain lyrics
            return results[0];
        }
        return null;
    } catch (error) {
        console.error('Error getting lyrics:', error);
        return null;
    }
};

/**
 * A convenience function to get only synced lyrics for a track.
 * @param {Object} params
 * @param {string} params.artistName - The name of the artist.
 * @param {string} params.trackName - The name of the track.
 * @param {string} [params.albumName] - The name of the album.
 * @param {number} [params.duration] - The duration of the track in seconds.
 * @returns {Promise<string|null>} The synced lyrics string, or null if not found.
 */
export const getSyncedLyrics = async ({ artistName, trackName, albumName, duration }) => {
    try {
        const results = await searchLyrics({ 
            artist_name: artistName, 
            track_name: trackName, 
            album_name: albumName, 
            duration 
        });
        const trackWithSyncedLyrics = results.find(track => track.syncedLyrics);
        return trackWithSyncedLyrics ? trackWithSyncedLyrics.syncedLyrics : null;
    } catch (error) {
        console.error('Error getting synced lyrics:', error);
        return null;
    }
};
