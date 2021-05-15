const baseUrl = 'http://localhost:9000'

export const photoUrl = (photo: string) => `${baseUrl}/${photo}`

export const loadPhotos = () => fetch(baseUrl + '/index.json').then((res) => res.json())

export const deletePhoto = (photo: string) => fetch(photoUrl(photo), { method: 'DELETE' })

export const rotatePhoto = (photo: string, rotation: number) =>
  fetch(photoUrl(photo), { method: 'POST', body: JSON.stringify({ rotation }) })
