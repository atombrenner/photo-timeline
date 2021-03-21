export function next(images: string[], index: number) {
  const i = index + 1
  return i >= images.length ? 0 : i
}

export function prev(images: string[], index: number) {
  return (index <= 0 ? images.length : index) - 1
}

export function nextDay(images: string[], index: number) {
  console.log('not implemented')
  return index
}

export function nextWeek(images: string[], index: number) {
  console.log('not implemented')
  return index
}

export function prevDay(images: string[], index: number) {
  console.log('not implemented')
  return index
}

export function prevWeek(images: string[], index: number) {
  console.log('not implemented')
  return index
}

export function getMonth(imagePath: string): string {
  return imagePath.substr(imagePath.lastIndexOf('/') + 1, 7)
}

export function nextMonth(images: string[], current: number) {
  const month = getMonth(images[current])
  for (let i = next(images, current); ; i = next(images, i)) {
    if (getMonth(images[i]) !== month || i === current) return i
  }
}

export function prevMonth(images: string[], current: number) {
  let i = prev(images, current)
  const month = getMonth(images[i])
  for (i = prev(images, i); ; i = prev(images, i)) {
    if (i === current) return 0
    if (getMonth(images[i]) !== month) return next(images, i)
  }
}

export function nextYear(images: string[], current: number) {
  const month = getMonth(images[current])
  const year = +month.substr(0, 4) + 1 + month.substr(4, 3)

  for (let i = next(images, current); ; i = next(images, i)) {
    if (i === 0) return current
    if (getMonth(images[i]) >= year) return i
  }
}

export function prevYear(images: string[], current: number) {
  const month = getMonth(images[current])
  const year = +month.substr(0, 4) - 1 + month.substr(4, 3)

  for (let i = prev(images, current); ; i = prev(images, i)) {
    if (i === 0) return current
    if (getMonth(images[i]) < year) return next(images, i)
  }
}
