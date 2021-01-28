import { h } from 'preact'
import { render } from '@testing-library/preact'
import { expect } from 'chai'
import { App } from './app'

describe('<App>', () => {
  it('renders learn react link', () => {
    const result = render(<App />)
    const photos = result.getAllByAltText(/photo/i)
    expect(photos).to.have.lengthOf(3)
    expect(document.body.contains(photos[0]))
  })
})
