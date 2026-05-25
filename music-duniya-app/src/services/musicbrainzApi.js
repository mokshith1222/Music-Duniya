import axios from 'axios';
import { musicbrainzClient } from './apiClient';

const COVER_ART_API_BASE_URL = 'https://coverartarchive.org';

// Function to get cover art from Cover Art Archive
const getCoverArt = async (releaseId) => {
  try {
    const response = await axios.get(`${COVER_ART_API_BASE_URL}/release/${releaseId}`);
    if (response.data.images && response.data.images.length > 0) {
      return response.data.images[0].thumbnails.large || response.data.images[0].image;
    }
  } catch (error) {
    // Cover art not found is a common case, so we can ignore 404 errors
    if (error.response && error.response.status !== 404) {
      console.error('Error fetching cover art:', error);
    }
  }
  return null;
};

export const searchArtists = async (query, limit = 8) => {
  const response = await musicbrainzClient.get('/artist', {
    params: {
      query: query,
      limit,
    },
  });
  return response.data.artists;
};

export const searchAlbums = async (query, limit = 12) => {
  const response = await musicbrainzClient.get('/release', {
    params: {
      query: query,
      limit,
    },
  });
  const albums = await Promise.all(response.data.releases.map(async (album) => {
    const coverArt = await getCoverArt(album.id);
    return { ...album, coverArt };
  }));
  return albums;
};

export const searchSongs = async (query, limit = 20) => {
  const response = await musicbrainzClient.get('/recording', {
    params: {
      query: query,
      limit,
    },
  });
  const songs = await Promise.all(response.data.recordings.map(async (song) => {
    const release = song.releases?.[0];
    if (release) {
      const coverArt = await getCoverArt(release.id);
      return { ...song, coverArt };
    }
    return song;
  }));
  return songs;
};

export const getArtistDetails = async (artistId) => {
  const response = await musicbrainzClient.get(`/artist/${artistId}`, {
    params: {
      inc: 'releases+tags+ratings',
    },
  });
  const artist = response.data;
  const releasesWithCoverArt = await Promise.all(artist.releases.map(async (release) => {
    const coverArt = await getCoverArt(release.id);
    return { ...release, coverArt };
  }));
  artist.releases = releasesWithCoverArt;
  return artist;
};

export const getAlbumDetails = async (albumId) => {
  const response = await musicbrainzClient.get(`/release/${albumId}`, {
    params: {
      inc: 'artist-credits+recordings+tags+ratings',
    },
  });
  const album = response.data;
  const coverArt = await getCoverArt(album.id);
  return { ...album, coverArt };
};

export const getSongMetadata = async (songId) => {
    const response = await musicbrainzClient.get(`/recording/${songId}`, {
        params: {
            inc: 'artist-credits+releases+tags+ratings',
        },
    });
    const song = response.data;
    if (song.releases && song.releases.length > 0) {
        const coverArt = await getCoverArt(song.releases[0].id);
        song.coverArt = coverArt;
    }
    return song;
};

export const getNewReleases = async (limit = 12) => {
  const response = await musicbrainzClient.get('/release', {
    params: {
      query: 'date:[2023-01-01 TO *] AND primarytype:album',
      limit,
    },
  });
  const albums = await Promise.all(response.data.releases.map(async (album) => {
    const coverArt = await getCoverArt(album.id);
    return { ...album, coverArt };
  }));
  return albums;
};

export const searchArtistsByGenre = async (genre, limit = 8) => {
  const response = await musicbrainzClient.get('/artist', {
    params: {
      query: `tag:${genre}`,
      limit,
    },
  });
  return response.data.artists;
};
