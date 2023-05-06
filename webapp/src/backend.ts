const baseUrl = 'http://localhost:9000'

export const photoUrl = (photo: number) => `${baseUrl}/${photo}`

export const loadPhotos = () => fetch(baseUrl + '/index.json').then((res) => res.json())

export const deletePhoto = (photo: number) => fetch(photoUrl(photo), { method: 'DELETE' })

export const rotatePhoto = (photo: number, rotation: number) =>
  fetch(photoUrl(photo), {
    method: 'POST',
    body: JSON.stringify({ rotation }),
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  })
