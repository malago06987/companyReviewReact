export const API_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
).replace(/\/+$/, '')

const API_ORIGIN = new URL(API_URL).origin

export function getAssetUrl(path) {
  if (!path) {
    return undefined
  }

  return new URL(path, `${API_ORIGIN}/`).toString()
}

export function getApiCollection(response) {
  const collection = response.data?.data ?? response.data

  if (!Array.isArray(collection)) {
    throw new TypeError('Expected the API response to contain a collection.')
  }

  return collection
}
