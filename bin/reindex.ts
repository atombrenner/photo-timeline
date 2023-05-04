#!/usr/bin/env -S npx ts-node -T

import { reindexCommand } from '../scripts/reindex'

console.log('reindex', process.argv.slice(2))
reindexCommand().catch(console.error)
