import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_PLAYBACK_RATE,
  MAX_PLAYBACK_RATE,
  MIN_PLAYBACK_RATE,
  classifyWallpaper,
  normalizePlaybackRate,
} from '../wallpaper-core.js'

test('classifies images and videos by MIME type or extension', () => {
  assert.equal(classifyWallpaper({ name: 'wallpaper.bin', type: 'image/png', size: 1 }), 'image')
  assert.equal(classifyWallpaper({ name: 'wallpaper.WEBP', type: '', size: 1 }), 'image')
  assert.equal(classifyWallpaper({ name: 'wallpaper.bin', type: 'video/mp4', size: 1 }), 'video')
  assert.equal(classifyWallpaper({ name: 'wallpaper.WEBM', type: '', size: 1 }), 'video')
})

test('rejects empty and unsupported wallpaper files', () => {
  assert.throws(() => classifyWallpaper({ name: 'empty.png', type: 'image/png', size: 0 }), /empty/u)
  assert.throws(() => classifyWallpaper({ name: 'notes.txt', type: 'text/plain', size: 10 }), /image or video/u)
})

test('normalizes video playback speed to the supported range', () => {
  assert.equal(normalizePlaybackRate('not-a-number'), DEFAULT_PLAYBACK_RATE)
  assert.equal(normalizePlaybackRate(0), MIN_PLAYBACK_RATE)
  assert.equal(normalizePlaybackRate(8), MAX_PLAYBACK_RATE)
  assert.equal(normalizePlaybackRate(1.75), 1.75)
})
