export const parseArgv = (argv: string[]) => {
  const args = []
  const options = new Set<string>()
  for (let i = 2; i < argv.length; ++i) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      options.add(arg.slice(2))
    } else {
      args.push(arg)
    }
  }

  const help = args.includes('help') || options.has('help')
  const photos = options.has('photos') || !options.has('videos')
  const videos = options.has('videos') || !options.has('photos')

  return { args, options, photos, videos, help }
}
