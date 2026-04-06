import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'
import axios from 'axios'

const originalEnv = { ...process.env }
let importCounter = 0

async function importFreshModule() {
  return import(`./utils.ts?test=${++importCounter}`)
}

beforeEach(() => {
  process.env = { ...originalEnv }
  mock.restore()
  mock.clearAllMocks()
})

afterEach(() => {
  process.env = { ...originalEnv }
  mock.restore()
  mock.clearAllMocks()
})

describe('checkDomainBlocklist', () => {
  test('returns allowed without API call in OpenAI mode', async () => {
    process.env.KALT_CODE_USE_OPENAI = '1'
    mock.module('../../utils/model/providers.js', () => ({
      getAPIProvider: () => 'openai',
    }))
    const getSpy = mock(() =>
      Promise.resolve({ status: 200, data: { can_fetch: true } }),
    )
    axios.get = getSpy as typeof axios.get

    const { checkDomainBlocklist } = await importFreshModule()
    const result = await checkDomainBlocklist('example.com')

    expect(result.status).toBe('allowed')
    expect(getSpy).not.toHaveBeenCalled()
  })

  test('returns allowed without API call in Gemini mode', async () => {
    process.env.KALT_CODE_USE_GEMINI = '1'
    mock.module('../../utils/model/providers.js', () => ({
      getAPIProvider: () => 'gemini',
    }))
    const getSpy = mock(() =>
      Promise.resolve({ status: 200, data: { can_fetch: true } }),
    )
    axios.get = getSpy as typeof axios.get

    const { checkDomainBlocklist } = await importFreshModule()
    const result = await checkDomainBlocklist('example.com')

    expect(result.status).toBe('allowed')
    expect(getSpy).not.toHaveBeenCalled()
  })

  test('calls Anthropic domain check in first-party mode', async () => {
    delete process.env.KALT_CODE_USE_OPENAI
    delete process.env.KALT_CODE_USE_GEMINI
    delete process.env.KALT_CODE_USE_GITHUB

    mock.module('../../utils/model/providers.js', () => ({
      getAPIProvider: () => 'firstParty',
    }))
    const getSpy = mock(() =>
      Promise.resolve({ status: 200, data: { can_fetch: true } }),
    )
    axios.get = getSpy as typeof axios.get

    const { checkDomainBlocklist } = await importFreshModule()
    const result = await checkDomainBlocklist('example.com')

    expect(result.status).toBe('allowed')
    expect(getSpy).toHaveBeenCalledTimes(1)
  })
})
