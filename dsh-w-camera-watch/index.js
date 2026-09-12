/** Host service and model-facing camera tool for dsh-w-camera-watch. */

import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { CaptureBroker, decodedBase64Bytes } from './camera-watch-core.js'

var __runInitializers = function (thisArg, initializers, value) {
  var useValue = arguments.length > 2
  for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg)
  return useValue ? value : void 0
}

var __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== 'function') throw new TypeError('Function expected')
    return f
  }
  var kind = contextIn.kind
  var key = kind === 'getter' ? 'get' : kind === 'setter' ? 'set' : 'value'
  var target = !descriptorIn && ctor ? contextIn.static ? ctor : ctor.prototype : null
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {})
  var _, done = false
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {}
    for (var p in contextIn) context[p] = p === 'access' ? {} : contextIn[p]
    for (var p in contextIn.access) context.access[p] = contextIn.access[p]
    context.addInitializer = function (f) {
      if (done) throw new TypeError('Cannot add initializers after decoration has completed')
      extraInitializers.push(accept(f || null))
    }
    var result = decorators[i](kind === 'accessor' ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context)
    if (kind === 'accessor') {
      if (result === void 0) continue
      if (result === null || typeof result !== 'object') throw new TypeError('Object expected')
      if (_ = accept(result.get)) descriptor.get = _
      if (_ = accept(result.set)) descriptor.set = _
      if (_ = accept(result.init)) initializers.unshift(_)
    } else if (_ = accept(result)) {
      if (kind === 'field') initializers.unshift(_)
      else descriptor[key] = _
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor)
  done = true
}

const IMAGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: true,
  properties: {
    attachmentId: { type: 'string', required: true },
    mediaType: { type: 'string', enum: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'], required: true },
    bytes: { type: 'integer', required: true },
    width: { type: 'integer', required: true },
    height: { type: 'integer', required: true },
    name: { type: 'string' },
    originalDimensions: {
      type: 'object',
      additionalProperties: false,
      properties: {
        width: { type: 'integer', required: true },
        height: { type: 'integer', required: true },
      },
    },
  },
}

function imageRef(value) {
  return {
    attachmentId: value.attachmentId,
    mediaType: value.mediaType,
    bytes: value.bytes,
    width: value.width,
    height: value.height,
    ...(value.name === undefined ? {} : { name: value.name }),
    ...(value.originalDimensions === undefined ? {} : { originalDimensions: { ...value.originalDimensions } }),
  }
}

async function assertImageCapableRoute(ctx, exec) {
  const routed = exec.agent?.session.requestHeader()?.config
  const provider = routed?.provider ?? exec.agent?.options.provider
  const model = routed?.model ?? exec.agent?.options.model
  const llm = ctx.get('llm')
  if (!provider || !model || !llm) throw new Error('当前模型路由无法确认是否支持图片输入。')
  const info = await llm.resolveModelInfo(provider, model, exec.signal)
  if (!info.inputModalities?.includes('image')) {
    throw new Error(`模型“${model}”没有声明图片输入能力，无法查看摄像头截图；请切换到支持视觉的模型。`)
  }
}

function createCameraTool(ctx, service) {
  return defineTool({
    name: 'camera_capture',
    description: '立即调用当前 DSH 浏览器页面连接的摄像头拍摄一张照片，并把真实图片返回到本轮上下文。监督学习、观察用户状态、核实动作或环境时可随时调用；不要在没有调用本工具时声称看到了用户。Goal 执行期间可在每个需要检查进度的轮次重复调用。',
    parameters: {
      question: {
        type: 'string',
        description: '可选：这次截图重点要观察或核实什么，例如“是否仍在写作业、桌面上是哪一页”。',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          capturedAt: { type: 'string', required: true },
          deviceLabel: { type: 'string', required: true },
          question: { type: 'string', required: true },
          image: IMAGE_SCHEMA,
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: [
          '<camera_capture>',
          `captured_at: ${value.capturedAt}`,
          `device: ${value.deviceLabel || 'default camera'}`,
          value.question ? `focus: ${value.question}` : 'focus: inspect the current webcam frame',
          'The adjacent image is the live camera frame. Base conclusions only on what is visible in it.',
          '</camera_capture>',
        ].join('\n'),
      }, { type: 'image', attachment: imageRef(value.image) }],
    },
    timeoutMs: 35_000,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      await assertImageCapableRoute(ctx, exec)
      const question = typeof args.question === 'string' ? args.question.trim() : ''
      const capture = await service.broker.request(question, exec.signal)
      const attachments = ctx.get('attachments')
      if (!attachments) throw new Error('Harness 没有挂载图片附件存储，无法保存摄像头截图。')
      const name = `camera-${capture.capturedAt.replace(/[:.]/g, '-')}.${capture.mediaType === 'image/png' ? 'png' : 'jpg'}`
      const refs = await attachments.saveImages([{
        data: decodedBase64Bytes(capture.data),
        mediaType: capture.mediaType,
        name,
      }])
      const ref = refs[0]
      if (!ref) throw new Error('摄像头截图未能写入 Harness 图片附件存储。')
      return {
        capturedAt: capture.capturedAt,
        deviceLabel: capture.deviceLabel,
        question,
        image: imageRef(ref),
      }
    },
  })
}

let CameraWatchService = (() => {
  let _classSuper = TypertRemoteService
  let _instanceExtraInitializers = []
  let _poll_decorators
  let _submit_decorators
  let _fail_decorators
  let _getState_decorators
  let _requestTestCapture_decorators
  return class CameraWatchService extends _classSuper {
    static {
      const _metadata = typeof Symbol === 'function' && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0
      const decorate = (name, list) => __esDecorate(this, null, list, {
        kind: 'method', name, static: false, private: false,
        access: { has: obj => name in obj, get: obj => obj[name] }, metadata: _metadata,
      }, null, _instanceExtraInitializers)
      _poll_decorators = [Remote('poll')]
      decorate('poll', _poll_decorators)
      _submit_decorators = [Remote('submit')]
      decorate('submit', _submit_decorators)
      _fail_decorators = [Remote('fail')]
      decorate('fail', _fail_decorators)
      _getState_decorators = [Remote('getState')]
      decorate('getState', _getState_decorators)
      _requestTestCapture_decorators = [Remote('requestTestCapture')]
      decorate('requestTestCapture', _requestTestCapture_decorators)
      if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata })
    }

    static inject = ['tools', 'systemPrompt']

    constructor(ctx) {
      super(ctx, 'cameraWatch')
      __runInitializers(this, _instanceExtraInitializers)
      this.broker = new CaptureBroker()
      this.ctx.effect(() => () => this.broker.dispose(), 'dsh-w-camera-watch: dispose broker')
      this.ctx.effect(() => this.ctx.systemPrompt.section({
        name: 'dsh-w-camera-watch:guidance',
        order: 158,
        text: () => [
          '你可以使用 camera_capture 随时查看当前浏览器连接的摄像头画面。',
          '当用户要求监督学习、工作、动作或环境，并建立了 Goal 时，在每个需要核实真实进度的 Goal 轮次调用 camera_capture；不要只凭用户描述猜测，也不要在未调用工具时声称已经看到。',
          '截图是工具结果中的真实图片。根据画面给出简洁、具体的观察；无法看清时应再次截图或直接说明看不清。',
          '如果当前工具模式只允许直接调用 run_code，请在 run_code 中调用并等待 tools.camera_capture({ question: ... })。',
        ].join('\n'),
      }), 'dsh-w-camera-watch: prompt guidance')
      this.ctx.inject(['attachments'], (scope) => {
        scope.effect(() => scope.tools.register(createCameraTool(scope, this)), 'dsh-w-camera-watch: camera_capture tool')
      })
    }

    poll(input) {
      return this.broker.poll(input)
    }

    submit(input) {
      return this.broker.submit(input)
    }

    fail(input) {
      return this.broker.fail(input)
    }

    getState() {
      return this.broker.state()
    }

    async requestTestCapture(input) {
      const question = input && typeof input.question === 'string' ? input.question : '设置页测试截图'
      return await this.broker.request(question)
    }
  }
})()

export { CameraWatchService, CameraWatchService as default }
