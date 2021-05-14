// does not work in tests
// https://github.com/snowpackjs/create-snowpack-app/commit/c84d51bf5d10db82d6ff459dc9618710ea72f293

// @ts-expect-error env property injected by snowpack with magic
const baseUrl = import.meta.env.SNOWPACK_PUBLIC_MEDIA_URL || ''

export const photoUrl = (photo: string) => `${baseUrl}/${photo}`

export const loadPhotos = () => fetch(baseUrl + '/index.json').then((res) => res.json())

export const deletePhoto = (photo: string) => fetch(photoUrl(photo), { method: 'DELETE' })

export const rotatePhoto = (photo: string, rotation: number) =>
  fetch(photoUrl(photo), { method: 'POST', body: JSON.stringify({ rotation }) })
