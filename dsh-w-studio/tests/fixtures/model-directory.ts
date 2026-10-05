/** Deterministic external model directory for the authenticated catalog composition. */
import type { Context } from '@deepseek-ai/cordis'
import { LlmAdapter } from '@deepseek-ai/dsh-llm'
import type { LlmModelInfo, StreamChunk } from '@deepseek-ai/dsh-llm'

class Directory extends LlmAdapter {
  override listModels(provider: string): Promise<readonly LlmModelInfo[]> {
    return Promise.resolve([{ provider, id: 'fixture-deepseek', name: 'Fixture DeepSeek' }])
  }
  async *stream(): AsyncIterable<StreamChunk> {
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}
/** Loader fixture name. */
export const name = 'studio-model-directory'
/** The runtime owns adapter registration and disposal. */
export const inject = ['llm']
/** Register external directory data without a network request.
 * @param ctx - Model registry owner.
 */
export function apply(ctx: Context): void {
  ctx.llm.registerAdapter(['deepseek-official'], new Directory())
}
