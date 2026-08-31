import { describe, expect, test } from 'bun:test'
import gateway, { mapGatewayModel } from './kaltcode-gateway.js'

describe('kaltcode-gateway live model mapping', () => {
  test('uses hybrid discovery against the public models list', () => {
    expect(gateway.catalog?.source).toBe('hybrid')
    expect(gateway.catalog?.discovery).toEqual(
      expect.objectContaining({
        kind: 'openai-compatible',
        requiresAuth: false,
      }),
    )
    expect(gateway.catalog?.discovery?.mapModel).toBe(mapGatewayModel)
    expect(gateway.startup?.probeReadiness).toBeUndefined()
  })

  test('maps gateway routes including auto and free models', () => {
    expect(
      mapGatewayModel({
        id: 'auto',
        name: 'Auto (smart routing)',
        description: 'picks the cheapest capable model',
      }),
    ).toEqual({
      id: 'auto',
      apiName: 'auto',
      label: 'Auto (smart routing)',
    })

    expect(
      mapGatewayModel({
        id: 'xiaomi/mimo-v2.5-pro',
        name: 'MiMo V2.5-Pro',
        context_window: 262144,
      }),
    ).toEqual({
      id: 'mimo-v2.5-pro',
      apiName: 'mimo-v2.5-pro',
      label: 'MiMo V2.5-Pro',
      contextWindow: 262144,
    })

    expect(
      mapGatewayModel({
        id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        name: 'Nemotron 3 Ultra free',
        context_window: 128000,
      }),
    ).toEqual({
      id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      apiName: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      label: 'Nemotron 3 Ultra free',
      contextWindow: 128000,
      notes: 'Free',
    })
  })

  test('drops known non-coding ids', () => {
    expect(
      mapGatewayModel({
        id: 'whisper-1',
        name: 'Whisper',
      }),
    ).toBeNull()
    expect(mapGatewayModel({})).toBeNull()
    expect(mapGatewayModel({ id: '   ' })).toBeNull()
    expect(mapGatewayModel(null)).toBeNull()
  })

  test('falls back to display_name and title for labels', () => {
    expect(mapGatewayModel({ id: 'a/b', display_name: 'B' })?.label).toBe(
      'B',
    )
    expect(mapGatewayModel({ id: 'c/d', title: 'D' })?.label).toBe('D')
  })
})
