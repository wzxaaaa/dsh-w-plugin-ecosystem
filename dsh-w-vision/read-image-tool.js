import {
  MAX_IMAGE_BYTES,
  buildLocalImageVisionContent,
  callVisionApi,
  imageMediaTypeForPath,
  normalizeLocalImage,
} from './vision-core.js'

function sessionResolveOptions(exec) {
  const cwd = exec && exec.agent && exec.agent.session && exec.agent.session.header
    ? exec.agent.session.header.cwd
    : undefined
  return {
    ...(typeof cwd === 'string' && cwd.length > 0 ? { cwd } : {}),
    ...(exec && exec.signal ? { signal: exec.signal } : {}),
  }
}

function createReadImageTool(service) {
  return {
    name: 'read_image',
    description: 'Analyze a local PNG/JPEG/WebP/GIF image or rendered screenshot through the configured dsh-w-vision relay and return a detailed text description. This works even when the current main model cannot accept image input. Use it whenever visual contents of a local image file need inspection.',
    parameters: {
      file_path: {
        type: 'string',
        required: true,
        description: 'Path to the local PNG, JPEG, WebP, or GIF file, resolved relative to the current task workspace.',
      },
      question: {
        type: 'string',
        description: 'Optional visual question or verification target, such as rendering defects, exact visible text, or whether a scene is blank.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: { type: 'string', required: true },
          analysis: { type: 'string', required: true },
          mediaType: { type: 'string', enum: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'], required: true },
          bytes: { type: 'integer', required: true },
          model: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: value.analysis }],
    },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const requestedPath = typeof args.file_path === 'string' ? args.file_path.trim() : ''
      const declaredMediaType = imageMediaTypeForPath(requestedPath)
      if (declaredMediaType === undefined) {
        throw new Error(`cannot read "${requestedPath}": read_image only accepts PNG/JPEG/WebP/GIF paths`)
      }
      const target = await service.ctx.fs.resolve(requestedPath, sessionResolveOptions(exec))
      const info = await service.ctx.fs.stat(target, exec && exec.signal ? exec.signal : undefined)
      if (info === undefined) {
        service.ctx.emit('fs/observed', target, { kind: 'absent' }, exec)
        throw new Error(`cannot read "${target.displayPath}": not found`)
      }
      if (info.type !== 'file') throw new Error(`cannot read "${target.displayPath}": not a regular file`)
      if (Number.isFinite(info.size) && info.size > MAX_IMAGE_BYTES) {
        throw new Error(`cannot read "${target.displayPath}": image exceeds the 5 MB limit`)
      }
      const bytes = await service.ctx.fs.readBytes(
        target,
        exec && exec.signal ? exec.signal : undefined,
        MAX_IMAGE_BYTES,
      )
      const image = normalizeLocalImage({
        filePath: requestedPath,
        question: args.question,
        bytes,
      })
      const config = await service.readConfig()
      const analysis = await callVisionApi(
        config,
        buildLocalImageVisionContent(image),
        { signal: exec && exec.signal ? exec.signal : undefined, maxTokens: 4000 },
      )
      service.ctx.emit('fs/observed', target, { kind: 'present', version: info.version }, exec)
      return {
        path: target.displayPath,
        analysis,
        mediaType: image.mediaType,
        bytes: image.bytes,
        model: config.modelname,
      }
    },
    presentCall(args) {
      return {
        card: 'generic',
        title: `Analyze image ${args.file_path}`,
        kind: 'read',
        locations: [{ path: args.file_path }],
      }
    },
  }
}

export { createReadImageTool }
