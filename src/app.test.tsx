import { render } from '@testing-library/preact'
import { h } from 'preact'
import { App } from './app'

describe('<App> with more than three images', () => {
  it('should render at most three photo elements', () => {
    const result = render(<App images={['a', 'b', 'c', 'd', 'e']} />)
    const photos = result.getAllByAltText(/photo/i)
    expect(photos).toHaveLength(3)
    expect(document.body.contains(photos[0]))
  })
})
