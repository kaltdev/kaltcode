import { describe, expect, test } from 'bun:test'

import {
  getCatalogEntriesForRoute,
  getModel,
  getModelsForBrand,
} from './index.js'
import { resolveModelRuntimeLimits } from './runtimeMetadata.js'

describe('Macaron V1 Tall descriptor', () => {
  test('exposes the verified Macaron capabilities and limits to gateway catalogs', () => {
    const model = getModel('mindai/macaron-v1-tall')

    expect(model).toBeDefined()
    expect(model).toMatchObject({
      id: 'mindai/macaron-v1-tall',
      brandId: 'macaron',
      classification: ['chat', 'reasoning', 'coding'],
      contextWindow: 262_144,
      maxOutputTokens: 32_768,
      capabilities: {
        supportsVision: false,
        supportsStreaming: true,
        supportsFunctionCalling: true,
        supportsJsonMode: false,
        supportsReasoning: true,
      },
    })
    expect(getModelsForBrand('macaron').map(m => m.id)).toContain(
      'mindai/macaron-v1-tall',
    )

    const catalogEntry = getCatalogEntriesForRoute('kaltcode-gateway').find(
      entry => entry.apiName === 'mindai/macaron-v1-tall',
    )
    expect(catalogEntry?.id).toBe('kaltcode-gateway-macaron-v1-tall')
    expect(catalogEntry?.modelDescriptorId).toBe(model?.id)

    expect(
      resolveModelRuntimeLimits({
        model: 'mindai/macaron-v1-tall',
        baseUrl: 'https://kaltcode.my.id/v1',
        processEnv: {},
      }),
    ).toEqual({ contextWindow: 262_144, maxOutputTokens: 32_768 })
  })
})
