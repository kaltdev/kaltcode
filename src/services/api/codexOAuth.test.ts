import { afterEach, expect, mock, test } from 'bun:test'

const originalFetch = globalThis.fetch
const originalCallbackPort = process.env.CODEX_OAUTH_CALLBACK_PORT
const originalClientId = process.env.CODEX_OAUTH_CLIENT_ID

class MockBrowserResponse {
  destroyed = false
  headersSent = false
  writableEnded = false
  private statusCode = 200
  private headers: Record<string, string> = {}
  private body = ''
  private resolveResponse!: (response: Response) => void

  readonly response = new Promise<Response>(resolve => {
    this.resolveResponse = resolve
  })

  writeHead(statusCode: number, headers: Record<string, string> = {}): void {
    this.statusCode = statusCode
    this.headers = headers
    this.headersSent = true
  }

  end(body = ''): void {
    if (this.writableEnded) return
    this.body += body
    this.writableEnded = true
    this.resolveResponse(
      new Response(this.body, {
        status: this.statusCode,
        headers: this.headers,
      }),
    )
  }
}

const listenerInstances: MockAuthCodeListener[] = []

class MockAuthCodeListener {
  expectedState: string | null = null
  pendingResponse: MockBrowserResponse | null = null
  private promiseResolver: ((authorizationCode: string) => void) | null = null
  private promiseRejecter: ((error: Error) => void) | null = null
  private port = 0

  constructor(readonly callbackPath = '/callback') {
    listenerInstances.push(this)
  }

  async start(port?: number): Promise<number> {
    this.port = port ?? 1455
    return this.port
  }

  getPort(): number {
    return this.port
  }

  hasPendingResponse(): boolean {
    return this.pendingResponse !== null
  }

  waitForAuthorization(
    state: string,
    onReady: () => Promise<void>,
  ): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.promiseResolver = resolve
      this.promiseRejecter = reject
      this.expectedState = state
      void onReady()
    })
  }

  resolveAuthorization(authorizationCode: string): void {
    this.promiseResolver?.(authorizationCode)
    this.promiseResolver = null
    this.promiseRejecter = null
    this.expectedState = null
  }

  handleSuccessRedirect(
    scopes: string[],
    customHandler?: (res: MockBrowserResponse, scopes: string[]) => void,
  ): void {
    this.respondToPendingRequest(response => {
      customHandler?.(response, scopes)
    })
  }

  handleErrorRedirect(
    customHandler?: (res: MockBrowserResponse) => void,
  ): void {
    this.respondToPendingRequest(response => {
      customHandler?.(response)
    })
  }

  cancelPendingAuthorization(
    error: Error = new Error('OAuth authorization was cancelled.'),
  ): void {
    this.promiseRejecter?.(error)
    this.promiseResolver = null
    this.promiseRejecter = null
    this.expectedState = null
    this.close()
  }

  close(): void {
    this.pendingResponse = null
  }

  private respondToPendingRequest(
    handler: (response: MockBrowserResponse) => void,
  ): void {
    if (!this.pendingResponse) return

    const response = this.pendingResponse
    handler(response)
    if (!response.writableEnded && !response.destroyed) {
      response.end()
    }

    if (this.pendingResponse === response) {
      this.pendingResponse = null
    }
  }
}

afterEach(() => {
  mock.restore()
  globalThis.fetch = originalFetch
  listenerInstances.length = 0

  if (originalCallbackPort === undefined) {
    delete process.env.CODEX_OAUTH_CALLBACK_PORT
  } else {
    process.env.CODEX_OAUTH_CALLBACK_PORT = originalCallbackPort
  }

  if (originalClientId === undefined) {
    delete process.env.CODEX_OAUTH_CLIENT_ID
  } else {
    process.env.CODEX_OAUTH_CLIENT_ID = originalClientId
  }
})

async function importCodexOAuthService() {
  mock.module('../oauth/auth-code-listener.js', () => ({
    AuthCodeListener: MockAuthCodeListener,
  }))

  return await import(`./codexOAuth.js?ts=${Date.now()}-${Math.random()}`)
}

function completeAuthorization(authUrl: string): Promise<Response> {
  const authorizeUrl = new URL(authUrl)
  const redirectUri = authorizeUrl.searchParams.get('redirect_uri')
  const state = authorizeUrl.searchParams.get('state')
  const listener = listenerInstances.at(-1)

  if (!redirectUri || !state || !listener) {
    throw new Error('Codex OAuth test did not receive a valid authorization URL.')
  }

  const callbackUrl = new URL(redirectUri)
  expect(callbackUrl.hostname).toBe('localhost')
  expect(callbackUrl.pathname).toBe('/auth/callback')
  expect(callbackUrl.port).toBe(String(listener.getPort()))
  expect(state).toBe(listener.expectedState)

  const response = new MockBrowserResponse()
  listener.pendingResponse = response
  listener.resolveAuthorization('auth-code')
  return response.response
}

test('serves updated success copy after a successful Codex OAuth flow', async () => {
  process.env.CODEX_OAUTH_CALLBACK_PORT = '14550'
  process.env.CODEX_OAUTH_CLIENT_ID = 'test-client-id'

  globalThis.fetch = mock(async (input, init) => {
    const url = String(input)
    expect(url).toBe('https://auth.openai.com/oauth/token')
    expect(init?.method).toBe('POST')

    return new Response(
      JSON.stringify({
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }) as typeof fetch

  const { CodexOAuthService } = await importCodexOAuthService()
  const service = new CodexOAuthService()
  let callbackResponsePromise!: Promise<Response>

  const flowPromise = service.startOAuthFlow(async authUrl => {
    callbackResponsePromise = completeAuthorization(authUrl)
  })

  const tokens = await flowPromise
  const callbackResponse = await callbackResponsePromise
  const html = await callbackResponse.text()

  expect(tokens.accessToken).toBe('access-token')
  expect(tokens.refreshToken).toBe('refresh-token')
  expect(html).toContain('You can return to Kalt Code now.')
  expect(html).toContain(
    'Kalt Code will finish activating your new Codex OAuth login.',
  )
  expect(html).not.toContain('continue automatically')
})

test('cancellation during token exchange returns a cancelled page and rejects the flow', async () => {
  process.env.CODEX_OAUTH_CALLBACK_PORT = '14551'
  process.env.CODEX_OAUTH_CLIENT_ID = 'test-client-id'

  let resolveFetchStart!: () => void
  const fetchStarted = new Promise<void>(resolve => {
    resolveFetchStart = resolve
  })

  globalThis.fetch = mock((input, init) => {
    const url = String(input)
    expect(url).toBe('https://auth.openai.com/oauth/token')

    return new Promise<Response>((_resolve, reject) => {
      resolveFetchStart()

      const signal = init?.signal
      if (!signal) {
        return
      }

      if (signal.aborted) {
        reject(signal.reason)
        return
      }

      signal.addEventListener(
        'abort',
        () => {
          reject(signal.reason)
        },
        { once: true },
      )
    })
  }) as typeof fetch

  const { CodexOAuthService } = await importCodexOAuthService()
  const service = new CodexOAuthService()
  let callbackResponsePromise!: Promise<Response>

  const flowPromise = service.startOAuthFlow(async authUrl => {
    callbackResponsePromise = completeAuthorization(authUrl)
  })

  await fetchStarted
  service.cleanup()

  await expect(flowPromise).rejects.toThrow('Codex OAuth flow was cancelled.')

  const callbackResponse = await callbackResponsePromise
  const html = await callbackResponse.text()

  expect(html).toContain('Codex login cancelled')
  expect(html).toContain('retry in Kalt Code')
})
