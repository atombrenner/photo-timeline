import { spawn } from 'child_process'

// gets format data via  https://ffmpeg.org/ffprobe.html
export function ffprobe(path: string) {
  const ffprobe = spawn('ffprobe', ['-hide_banner', '-show_entries', 'format', '-of', 'json', path])

  return new Promise<{ duration: number; created: number }>((resolve, reject) => {
    let stdout = ''
    ffprobe.stdout.on('data', (data) => (stdout += data.toString()))

    let stderr = ''
    ffprobe.stderr.on('data', (data) => (stderr += data.toString()))

    ffprobe.on('close', (code) => {
      if (code) reject(Error(stderr))
      const json = JSON.parse(stdout)
      resolve({
        duration: Number(json.format.duration),
        created: Date.parse(json.format.tags.creation_time),
      })
    })
  })
}

// if called via npm run ffprobe
if (require.main === module) {
  ffprobe(process.argv[2] || '/home/christian/Videos/PXL_20210211_170142848.mp4')
    .then(console.log)
    .catch(console.error)
}
