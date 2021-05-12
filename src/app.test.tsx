import { render } from '@testing-library/preact'
import { h } from 'preact'
import { App } from './app'

describe('<App> with more than three images', () => {
  it('should render a photo', () => {
    const result = render(
      <App
        images={[
          '2000/2000-01-01.jpg',
          '2000/2000-01-02.jpg',
          '2000/2000-01-03.jpg',
          '2000/2000-01-04.jpg',
          '2000/2000-01-05.jpg',
        ]}
      />,
    )
    const photos = result.getAllByAltText(/photo/i)
    expect(photos).toHaveLength(1)
    expect(document.body.contains(photos[0]))
  })
})
