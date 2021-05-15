import { render, screen, waitFor } from '@testing-library/preact'
import { h } from 'preact'
import { mocked } from '../jest-utils'
import { App } from './app'
import { loadPhotos } from './backend'

jest.mock('./backend')
mocked(loadPhotos).mockResolvedValue([
  '2000/2000-01-01 001.jpg',
  '2000/2000-01-02 002.jpg',
  '2000/2000-01-03 003.jpg',
  '2000/2000-02-04 001.jpg',
  '2000/2000-02-05 002.jpg',
])

describe('<App> with more than three images', () => {
  it('should render a photo', async () => {
    render(<App />)
    await waitFor(() => screen.getAllByAltText(/photo/i))
    const photos = screen.getAllByAltText(/photo/i)
    expect(photos).toHaveLength(1)
    expect(document.body.contains(photos[0]))
  })
})
