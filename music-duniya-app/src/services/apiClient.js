import axios from 'axios'

const jsonHeaders = {
  Accept: 'application/json',
}

export const musicbrainzClient = axios.create({
  baseURL: 'https://musicbrainz.org/ws/2/',
  headers: jsonHeaders,
});

musicbrainzClient.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    fmt: 'json',
  };
  return config;
});

export const audiusApi = axios.create({
  baseURL: 'https://discoveryprovider.audius.co/v1/',
  headers: jsonHeaders,
})

export const lrclibClient = axios.create({
  baseURL: 'https://lrclib.net/api/',
  headers: jsonHeaders,
})

export const jamendoApi = axios.create({
  baseURL: 'https://api.jamendo.com/v3.0/',
  headers: jsonHeaders,
  params: {
    client_id: 'b4641868',
    format: 'json',
  },
})

export const radioApi = axios.create({
  baseURL: 'https://de1.api.radio-browser.info/json/',
  headers: jsonHeaders,
})

export const coverArtApi = axios.create({
  baseURL: 'https://coverartarchive.org/',
  headers: jsonHeaders,
})
