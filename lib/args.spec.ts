import { parseArgv } from './args'

describe('parseArgv', () => {
  const argv = ['.ts-node', 'command']

  it('should return generic boolean options and args', () => {
    const { options } = parseArgv([...argv, 'arg1', '--bla', '--blub', 'arg2'])
    expect(options.has('bla')).toBe(true)
    expect(options.has('blub')).toBe(true)
    expect(options.size).toBe(2)
  })

  it('should return args without options', () => {
    const { args } = parseArgv([...argv, 'arg1', '--bla', '--blub', 'arg2'])
    expect(args).toEqual(['arg1', 'arg2'])
  })

  it.each([
    ['', true],
    ['--videos', false],
    ['--photos --videos', true],
    ['--photos', true],
  ])('"%s" should set photos option to %s', (args, expected) => {
    const { photos } = parseArgv([...argv, ...args.split(' ')])
    expect(photos).toBe(expected)
  })

  it.each([
    ['', true],
    ['--photos', false],
    ['--photos --videos', true],
    ['--videos', true],
  ])('"%s" should set videos option to %s', (args, expected) => {
    const { videos } = parseArgv([...argv, ...args.split(' ')])
    expect(videos).toBe(expected)
  })

  it.each([
    ['help', true],
    ['--help', true],
    ['', false],
  ])('"%s" should set help option to %s', (args, expected) => {
    const { help } = parseArgv([...argv, ...args.split(' ')])
    expect(help).toBe(expected)
  })
})
