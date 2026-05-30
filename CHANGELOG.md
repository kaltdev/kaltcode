# Changelog

## [0.16.0](https://github.com/kaltdev/kaltcode/compare/v0.15.0...v0.16.0) (2026-05-30)


### Features

* activate buddy system in open build ([#346](https://github.com/kaltdev/kaltcode/issues/346)) ([d1a2df2](https://github.com/kaltdev/kaltcode/commit/d1a2df2f697d9f3806020f25e86cb554e6525a3b))
* activate coordinator mode in open build ([#647](https://github.com/kaltdev/kaltcode/issues/647)) ([99a1714](https://github.com/kaltdev/kaltcode/commit/99a17144ee285b892a0801acb6abcc9af68879af))
* activate local-only team memory in open build ([#648](https://github.com/kaltdev/kaltcode/issues/648)) ([24d485f](https://github.com/kaltdev/kaltcode/commit/24d485f42f5b1405d2fab13f2f497d5edd3b5300))
* activate message actions in open build ([#632](https://github.com/kaltdev/kaltcode/issues/632)) ([252808b](https://github.com/kaltdev/kaltcode/commit/252808bbd0a12a6ccf97e2cb09752a0212ea3acd))
* add /cache-probe diagnostic command ([#580](https://github.com/kaltdev/kaltcode/issues/580)) ([9ccaa7a](https://github.com/kaltdev/kaltcode/commit/9ccaa7a6759b6991f4a566b4118c06e68a2398fe)), closes [#515](https://github.com/kaltdev/kaltcode/issues/515)
* add /request-size context diagnostics ([f766c44](https://github.com/kaltdev/kaltcode/commit/f766c443d0cd4b22823fd38072fdd56d901ab4bd))
* add Alibaba Coding Plan (DashScope) provider support ([#509](https://github.com/kaltdev/kaltcode/issues/509)) ([43ac6db](https://github.com/kaltdev/kaltcode/commit/43ac6dba75537282da1e2ad8f855082bc4e25f1e))
* add allowBypassPermissionsMode setting ([#658](https://github.com/kaltdev/kaltcode/issues/658)) ([31be66d](https://github.com/kaltdev/kaltcode/commit/31be66d7645ea3473334c9ce89ea1a5095b8df6e))
* add auto-fix service — auto-lint and test after AI file edits ([#508](https://github.com/kaltdev/kaltcode/issues/508)) ([c385047](https://github.com/kaltdev/kaltcode/commit/c385047abba4366866f4c87bfb5e0b0bd4dcbb9d))
* Add codexplan alias and update spinner tips ([a69cd8b](https://github.com/kaltdev/kaltcode/commit/a69cd8b179351a982e8d780348141d7590156d81))
* add Docker image build and push to GHCR on release ([#656](https://github.com/kaltdev/kaltcode/issues/656)) ([658d076](https://github.com/kaltdev/kaltcode/commit/658d076909e14eb0459bcb98aee9aa0472118265))
* add Gemini ADC and access token auth ([#312](https://github.com/kaltdev/kaltcode/issues/312)) ([ea335ae](https://github.com/kaltdev/kaltcode/commit/ea335aeddc4b7adafb6a45d5371e5c6f1adcb43e))
* Add Gemini support with thought_signature fix  ([#404](https://github.com/kaltdev/kaltcode/issues/404)) ([5012c16](https://github.com/kaltdev/kaltcode/commit/5012c160c9a2dff9418e7ee19dc9a4d29ef2b024))
* add headless gRPC server for external agent integration ([#278](https://github.com/kaltdev/kaltcode/issues/278)) ([26eef92](https://github.com/kaltdev/kaltcode/commit/26eef92fe72e9c3958d61435b8d3571e12bf2b74))
* Add initial project files ([e009776](https://github.com/kaltdev/kaltcode/commit/e0097769df69ff521b56d47ce35d957647c429b7))
* add knowledge graph storage providers and improve test isolation ([180de3c](https://github.com/kaltdev/kaltcode/commit/180de3cc2932df76efc21d413b51c02ae5dea7f1))
* add knowledge graph storage providers and improve test isolation ([#6](https://github.com/kaltdev/kaltcode/issues/6)) ([180de3c](https://github.com/kaltdev/kaltcode/commit/180de3cc2932df76efc21d413b51c02ae5dea7f1))
* Add local OpenAI-compatible model discovery to /model ([#201](https://github.com/kaltdev/kaltcode/issues/201)) ([c534aa5](https://github.com/kaltdev/kaltcode/commit/c534aa5771fb9e75c87270ecded2fd7da199259e))
* add model caching and benchmarking utilities ([#671](https://github.com/kaltdev/kaltcode/issues/671)) ([2b15e16](https://github.com/kaltdev/kaltcode/commit/2b15e16421f793f954a92c53933a07094544b29d))
* add model-specific tokenizers and compression ratio detection ([#799](https://github.com/kaltdev/kaltcode/issues/799)) ([e92e527](https://github.com/kaltdev/kaltcode/commit/e92e5274b223d935d380b1fbd234cb631ab03211))
* add NVIDIA NIM and MiniMax provider support ([#552](https://github.com/kaltdev/kaltcode/issues/552)) ([51191d6](https://github.com/kaltdev/kaltcode/commit/51191d61326e1f8319d70b3a3c0d9229e185a564))
* add OPENCLAUDE_DISABLE_STRICT_TOOLS env var to opt out of strict MCP tool schema normalization ([#770](https://github.com/kaltdev/kaltcode/issues/770)) ([e6e8d9a](https://github.com/kaltdev/kaltcode/commit/e6e8d9a24897e4c9ef08b72df20fabbf8ef27f38))
* add OPENCLAUDE_DISABLE_TOOL_REMINDERS env var to suppress hidden tool-output reminders ([#837](https://github.com/kaltdev/kaltcode/issues/837)) ([28de94d](https://github.com/kaltdev/kaltcode/commit/28de94df5dcd7718cb334e2e793e9472f5b291c5)), closes [#809](https://github.com/kaltdev/kaltcode/issues/809)
* add Opus 4.7 as default model and fix alias/thinking bugs ([#928](https://github.com/kaltdev/kaltcode/issues/928)) ([4c93a9f](https://github.com/kaltdev/kaltcode/commit/4c93a9f9f168217d4bdd53d103337e43f28be074))
* add ripgrep to Dockerfile for faster file searching ([#688](https://github.com/kaltdev/kaltcode/issues/688)) ([12dd375](https://github.com/kaltdev/kaltcode/commit/12dd3755c619cc27af3b151ae8fdb9d425a7b9a2))
* Add startup logo palette picker ([#1072](https://github.com/kaltdev/kaltcode/issues/1072)) ([ed7b697](https://github.com/kaltdev/kaltcode/commit/ed7b6972f9cd7d36cd604738f5160064061ab254))
* add streaming optimizer and structured request logging ([#703](https://github.com/kaltdev/kaltcode/issues/703)) ([5b9cd21](https://github.com/kaltdev/kaltcode/commit/5b9cd21e373823a77fd552d6e02f5d4b68ae06b1))
* add streaming token counter ([#797](https://github.com/kaltdev/kaltcode/issues/797)) ([0ca4333](https://github.com/kaltdev/kaltcode/commit/0ca43335375beec6e58711b797d5b0c4bb5019b8))
* add thinking token extraction ([#798](https://github.com/kaltdev/kaltcode/issues/798)) ([268c039](https://github.com/kaltdev/kaltcode/commit/268c0398e4bf1ab898069c61500a2b3c226a0322))
* add wiki mvp commands ([#532](https://github.com/kaltdev/kaltcode/issues/532)) ([c328fdf](https://github.com/kaltdev/kaltcode/commit/c328fdf9e2fe59ad101b049301298ce9ff24caca))
* add xAI as official provider ([#865](https://github.com/kaltdev/kaltcode/issues/865)) ([2586a9c](https://github.com/kaltdev/kaltcode/commit/2586a9cddbd2512826bca81cb5deb3ec97f00f0f))
* **agent:** add active session agent controls ([94d48f0](https://github.com/kaltdev/kaltcode/commit/94d48f06ae6a74d0b9b94d84e6bf4ccbfcea0da3))
* **agent:** support custom subagent models ([15c9840](https://github.com/kaltdev/kaltcode/commit/15c9840445d28cef6e3e1a67220444adfbcee8fd))
* **api:** add local fast path optimization for local providers ([bfe156c](https://github.com/kaltdev/kaltcode/commit/bfe156c7da03e40d4cb24cfaa29206548393b09d))
* **api:** classify openai-compatible provider failures ([#708](https://github.com/kaltdev/kaltcode/issues/708)) ([80a00ac](https://github.com/kaltdev/kaltcode/commit/80a00acc2c6dc4657a78de7366f7a9ebc920bfbb))
* **api:** compress old tool_result content for small-context providers ([#801](https://github.com/kaltdev/kaltcode/issues/801)) ([a6a3de5](https://github.com/kaltdev/kaltcode/commit/a6a3de5ac155fe9d00befbfcab98d439314effd8))
* **api:** deterministic request-body serialization via stableStringify ([#882](https://github.com/kaltdev/kaltcode/issues/882)) ([6ea3eb6](https://github.com/kaltdev/kaltcode/commit/6ea3eb64830ccfec1436bcebe2406158e14a7e81))
* **api:** expose cache metrics in REPL + normalize across providers ([#813](https://github.com/kaltdev/kaltcode/issues/813)) ([9e23c2b](https://github.com/kaltdev/kaltcode/commit/9e23c2bec43697187762601db5b1585c9b0fb1a3))
* **api:** improve local provider reliability with readiness and self-healing ([#738](https://github.com/kaltdev/kaltcode/issues/738)) ([4cb963e](https://github.com/kaltdev/kaltcode/commit/4cb963e660dbd6ee438c04042700db05a9d32c59))
* **api:** smart model routing primitive (cheap-for-simple, strong-for-hard) ([#785](https://github.com/kaltdev/kaltcode/issues/785)) ([e908864](https://github.com/kaltdev/kaltcode/commit/e908864da7e7c987a98053ac5d18d702e192db2b))
* **build:** gate feature flags with bun:bundle feature() ([1f47f5e](https://github.com/kaltdev/kaltcode/commit/1f47f5e7a6f6e39cf4b89250036604e2d4789825))
* **build:** gate feature flags with bun:bundle feature() ([#10](https://github.com/kaltdev/kaltcode/issues/10)) ([44dc05e](https://github.com/kaltdev/kaltcode/commit/44dc05ec44105e6142f8dfbf426eae1ead00b8d9))
* clean up timeout abort signal ([#7](https://github.com/kaltdev/kaltcode/issues/7)) ([2c496ff](https://github.com/kaltdev/kaltcode/commit/2c496ff395db74d74b6646e40e2b1871dd5f292c))
* **cli:** honor --model alone without requiring --provider ([#854](https://github.com/kaltdev/kaltcode/issues/854)) ([7cfc8d5](https://github.com/kaltdev/kaltcode/commit/7cfc8d5dad1aa3be247c3197e3442d9f70691db1))
* **cli:** improve SSH interactivity detection via SSH_TTY and SSH_CONNECTION ([#946](https://github.com/kaltdev/kaltcode/issues/946)) ([aae96aa](https://github.com/kaltdev/kaltcode/commit/aae96aa52a1241661116d62aac884ddeafd7835b))
* **codex:** Add plaintext fallback storage handling ([4756f4e](https://github.com/kaltdev/kaltcode/commit/4756f4ed7f7eb00eab59c8ad9275fde45e7f5796))
* **commands:** Add isCommand type guard and filter invalid entries ([13b1962](https://github.com/kaltdev/kaltcode/commit/13b1962d4fa82071538db56be91cc182742ae7c2))
* **commit-message:** Add default reset test ([e5378b3](https://github.com/kaltdev/kaltcode/commit/e5378b374e32eb0a5f136890d14d147ad5208f6d))
* configure API retry backoff ([d40c2cf](https://github.com/kaltdev/kaltcode/commit/d40c2cfa522c714589e49d336dbe518707a1dfb3))
* context partitioning and relevance-based pruning ([#849](https://github.com/kaltdev/kaltcode/issues/849)) ([ca676af](https://github.com/kaltdev/kaltcode/commit/ca676affc47dca7f2a65fa867410931e27ae4969))
* context preloading and hybrid context strategy ([#860](https://github.com/kaltdev/kaltcode/issues/860)) ([92d297e](https://github.com/kaltdev/kaltcode/commit/92d297e50efcc7225f57f0d3cb0ba989dc40d624))
* enable 15 additional feature flags in open build ([#667](https://github.com/kaltdev/kaltcode/issues/667)) ([6a62e3f](https://github.com/kaltdev/kaltcode/commit/6a62e3ff76ba9ba446b8e20cf2bb139ee76a9387))
* expose flicker-free mode as a /config toggle (closes [#260](https://github.com/kaltdev/kaltcode/issues/260)) ([#265](https://github.com/kaltdev/kaltcode/issues/265)) ([19c00e6](https://github.com/kaltdev/kaltcode/commit/19c00e67edc6b032847a34361b8853852b46fd5f))
* fix open-source build and add Ollama model picker ([#302](https://github.com/kaltdev/kaltcode/issues/302)) ([280c973](https://github.com/kaltdev/kaltcode/commit/280c9732f5a39c090feebf08de2004bb98914173))
* GitHub provider lifecycle and onboarding hardening ([#351](https://github.com/kaltdev/kaltcode/issues/351)) ([ff7d499](https://github.com/kaltdev/kaltcode/commit/ff7d49990de515825ddbe4099f3a39b944b61370))
* **groq:** Discover and filter Groq models ([735f85a](https://github.com/kaltdev/kaltcode/commit/735f85aa5b5470a22fcc29bf7839f9fe6522bab7))
* **grpc:** Add headless gRPC server and CLI ([573d4dc](https://github.com/kaltdev/kaltcode/commit/573d4dcf56c6f3cc6099fe0698605f5502a88117))
* implement /loop command with fixed and dynamic scheduling ([#621](https://github.com/kaltdev/kaltcode/issues/621)) ([64298a6](https://github.com/kaltdev/kaltcode/commit/64298a663f1391b16aa1f5a49e8a877e1d3742f2))
* implement Hook Chains runtime integration for self-healing agent mesh MVP ([#711](https://github.com/kaltdev/kaltcode/issues/711)) ([44a2c30](https://github.com/kaltdev/kaltcode/commit/44a2c30d5f9b98027e454466c680360f6b4625fc))
* implement Monitor tool for streaming shell output ([#649](https://github.com/kaltdev/kaltcode/issues/649)) ([b818dd5](https://github.com/kaltdev/kaltcode/commit/b818dd5958f4e8428566ce25a1a6be5fd4fe66f8))
* incremental and cached token counting ([#795](https://github.com/kaltdev/kaltcode/issues/795)) ([4b1e516](https://github.com/kaltdev/kaltcode/commit/4b1e516fc70c07da6ad678df35030fa114cc8918))
* **integrations:** add Kaltcode API key env var ([6cd317d](https://github.com/kaltdev/kaltcode/commit/6cd317d1e2bba88b9f86f533e2e7a3108a5a5220))
* **integrations:** Add Xiaomi MiMo and OpenGateway handling ([07c1076](https://github.com/kaltdev/kaltcode/commit/07c10769daf190d0a27c571e0abb9b6d28a2539f))
* **knowledge:** introduce local Orama persistence (feature-flagged) ([#1015](https://github.com/kaltdev/kaltcode/issues/1015)) ([5873bc6](https://github.com/kaltdev/kaltcode/commit/5873bc67141b6345d0630112a84d7fcfb149b584))
* local feature flag overrides via ~/.claude/feature-flags.json ([#639](https://github.com/kaltdev/kaltcode/issues/639)) ([0e48884](https://github.com/kaltdev/kaltcode/commit/0e48884f56c6c008f047a7926d3b2cb924170625))
* **lsp:** add first-class code intelligence setup ([#950](https://github.com/kaltdev/kaltcode/issues/950)) ([677d29f](https://github.com/kaltdev/kaltcode/commit/677d29ffd42410710150f1eb8942190c8d317fe0))
* mask provider api key input ([#772](https://github.com/kaltdev/kaltcode/issues/772)) ([13e9f22](https://github.com/kaltdev/kaltcode/commit/13e9f22a83a2b0f85f557b1e12c9442ba61241e4))
* **memory:** implement persistent project-level Knowledge Graph and RAG ([#899](https://github.com/kaltdev/kaltcode/issues/899)) ([29f7579](https://github.com/kaltdev/kaltcode/commit/29f757937732be0f8cca2bc0627a27eeafc2a992))
* **minimax:** add /usage support and fix MiniMax quota parsing ([#869](https://github.com/kaltdev/kaltcode/issues/869)) ([26413f6](https://github.com/kaltdev/kaltcode/commit/26413f6d307928a4f14c9c61c9860a28f8d81358))
* **minimax:** Switch MiniMax to Anthropic transport ([ba15e5d](https://github.com/kaltdev/kaltcode/commit/ba15e5d4c5cb5782820a89082c681d8d452e1a08))
* **model:** add GPT-5.5 support for Codex provider ([#880](https://github.com/kaltdev/kaltcode/issues/880)) ([038f715](https://github.com/kaltdev/kaltcode/commit/038f715b7ab9714340bda421b73a86d8590cf531))
* **model:** merge active profile model options ([d6f6f2e](https://github.com/kaltdev/kaltcode/commit/d6f6f2e9314c46128150b5f32e382cf7f8a6b7a8))
* native Anthropic API mode for Claude models on GitHub Copilot ([#579](https://github.com/kaltdev/kaltcode/issues/579)) ([fdef4a1](https://github.com/kaltdev/kaltcode/commit/fdef4a1b4ce218ded4937ca83b30acce7c726472))
* **nvidia:** Add new NIM model options ([21dda81](https://github.com/kaltdev/kaltcode/commit/21dda8138a81c419b3e3bc67f8cdd62472c88aa1))
* open useful USER_TYPE-gated features to all users ([#644](https://github.com/kaltdev/kaltcode/issues/644)) ([c1beea9](https://github.com/kaltdev/kaltcode/commit/c1beea98676a413c54152a45a6b9fbe7fb9ed028))
* **openaiShim:** Parse Gemini raw tool-call text ([a312c31](https://github.com/kaltdev/kaltcode/commit/a312c311c2086289c871f6e6d3d77d6e3f30c225))
* **osc:** Add Windows clipboard fallback ([d007f4b](https://github.com/kaltdev/kaltcode/commit/d007f4b8ddacc5d7dad2c88c20a4361e9faad6a8))
* **osc:** Add Windows clipboard fallback ([c5492d1](https://github.com/kaltdev/kaltcode/commit/c5492d1c0812a6ff7a743d498e39f15f7dbd4ced))
* per-agent model routing — route different agents to different providers ([#238](https://github.com/kaltdev/kaltcode/issues/238)) ([fb32e3f](https://github.com/kaltdev/kaltcode/commit/fb32e3f829eafa4ee4039b938f0c9b033fcb00ca))
* **prompt:** handle drag-and-drop file paths ([7491ecf](https://github.com/kaltdev/kaltcode/commit/7491ecf0099b79de4e357a689c60ffe971d218c8))
* **provider:** add free KaltCode Opengateway as default fallback ([e3e5ba3](https://github.com/kaltdev/kaltcode/commit/e3e5ba3f750bfd63795162ae042535cb4f6efac1))
* **provider:** add Venice AI provider support ([9362c74](https://github.com/kaltdev/kaltcode/commit/9362c74a3bde6330099f993a47ca98e066a64de5))
* **provider:** Add Xiaomi MiMo support ([8cc74f0](https://github.com/kaltdev/kaltcode/commit/8cc74f02ae5e776f76fbc68088945b9e63477712))
* **provider:** align provider and model workflows ([#324](https://github.com/kaltdev/kaltcode/issues/324)) ([ef881b2](https://github.com/kaltdev/kaltcode/commit/ef881b247f1283912c10ce593b9c92911cbcef05))
* **provider:** allow OpenGateway no-auth validation ([6159240](https://github.com/kaltdev/kaltcode/commit/61592401951c1597a0349c3514b418aa470ea5af))
* **provider:** expose Atomic Chat in /provider picker with autodetect ([#810](https://github.com/kaltdev/kaltcode/issues/810)) ([ee19159](https://github.com/kaltdev/kaltcode/commit/ee19159c17b3de3b4a8b4a4541a6569f4261d54e))
* **provider:** Streamline preset setup flow ([1c7aabe](https://github.com/kaltdev/kaltcode/commit/1c7aabe4330cd7d85db314b99f4b1f32483671bf))
* **provider:** zero-config autodetection primitive ([#784](https://github.com/kaltdev/kaltcode/issues/784)) ([a5bfcbb](https://github.com/kaltdev/kaltcode/commit/a5bfcbbadf8e9a1fd42f3e103d295524b8da64b0))
* **query:** Add tool failure loop guard ([7b1e8fc](https://github.com/kaltdev/kaltcode/commit/7b1e8fc2eea6410aa6895a29f931a3133ddcb7ca))
* **query:** robust multi-lingual and structural continuation nudge ([23ce3ae](https://github.com/kaltdev/kaltcode/commit/23ce3aee0dd2fa6217e1a7890cb9095244cd2435))
* **repl:** Add input suppression util and tests ([0b582ae](https://github.com/kaltdev/kaltcode/commit/0b582ae308c64be79cedb4cf046cb14dfc060dd7))
* rework release notes around GitHub releases ([#981](https://github.com/kaltdev/kaltcode/issues/981)) ([d948769](https://github.com/kaltdev/kaltcode/commit/d948769dd59c5533fa9769c0f16de783010b4620))
* **safety:** warn at startup when 3P provider + permissive mode skip ([db481b6](https://github.com/kaltdev/kaltcode/commit/db481b688815674c7f554732d82fc8cc1e861859))
* SDK Core — Permission System, Async Context, and Engine Extensions ([#951](https://github.com/kaltdev/kaltcode/issues/951)) ([a46b31c](https://github.com/kaltdev/kaltcode/commit/a46b31c3ec1840a712b9ad2cdd4f9d0f359544c9))
* SDK Foundation — Type Declarations, Errors, and Utilities ([#866](https://github.com/kaltdev/kaltcode/issues/866)) ([91f93ce](https://github.com/kaltdev/kaltcode/commit/91f93ce61533a9cadd1d107e09a442451c09f5db))
* SDK Runtime — Query Engine, Sessions, and Build Pipeline ([#984](https://github.com/kaltdev/kaltcode/issues/984)) ([60c76b6](https://github.com/kaltdev/kaltcode/commit/60c76b6599f691781ad5ae7dfeb6e4029b679d0a))
* **settings:** Batch change and skill reload events ([131728e](https://github.com/kaltdev/kaltcode/commit/131728e7f96da23f3e3df35fa92617610cfc9762))
* support self-hosted Firecrawl via FIRECRAWL_API_URL ([#949](https://github.com/kaltdev/kaltcode/issues/949)) ([a133e76](https://github.com/kaltdev/kaltcode/commit/a133e7631a7c0b6eeb624d60567147cab1257ff0))
* **sync:** add upstream sync automation implementation plan ([9d515a5](https://github.com/kaltdev/kaltcode/commit/9d515a53a98f8c51e4270de3ffc30446cb64b609))
* **sync:** add upstream sync automation implementation plan ([#3](https://github.com/kaltdev/kaltcode/issues/3)) ([ac1d10f](https://github.com/kaltdev/kaltcode/commit/ac1d10fe5c92ebd3e7a62594dbc77190ac83c02a))
* **test:** Add shared lock and config-dir tests ([8fc2669](https://github.com/kaltdev/kaltcode/commit/8fc2669c559edc9a0c7f02e18488b1426dc799b5))
* **tools:** Normalize tool inputs for validation ([fe10730](https://github.com/kaltdev/kaltcode/commit/fe1073084e1e0afd687fd31f261777ad50707f0d))
* **tools:** resilient web search and fetch across all providers ([#836](https://github.com/kaltdev/kaltcode/issues/836)) ([531e3f1](https://github.com/kaltdev/kaltcode/commit/531e3f10592a73d81f26675c2479d46a3d5b55f5))
* **ui:** replace hardcoded product name with constant ([fbc35ac](https://github.com/kaltdev/kaltcode/commit/fbc35acd002aa59e8ce0b5ce91457d5cc2543ab7))
* **vscode:** add full chat interface to OpenClaude extension ([#608](https://github.com/kaltdev/kaltcode/issues/608)) ([fbcd928](https://github.com/kaltdev/kaltcode/commit/fbcd928f7f8511da795aea3ad318bddf0ab9a1a7))
* **vscode:** redesign control center ([#236](https://github.com/kaltdev/kaltcode/issues/236)) ([6987a54](https://github.com/kaltdev/kaltcode/commit/6987a54a7147859975957f3d1d431674366ea23e))
* **websearch:** add first-class Brave adapter; fix Google + Brave presets; restore Exa snippets ([#1044](https://github.com/kaltdev/kaltcode/issues/1044)) ([402cd3d](https://github.com/kaltdev/kaltcode/commit/402cd3dbe81835cc6a658b31355d16697f9e6346))
* **xai:** add grok-4.3 model and update defaults ([7aef0d5](https://github.com/kaltdev/kaltcode/commit/7aef0d56fe7da0d6eddd6ceecd0a9dffac64ee7c))
* **xai:** add xAI/Grok OAuth provider (browser + device-code) ([e67628a](https://github.com/kaltdev/kaltcode/commit/e67628a074409104dc6c51b40b70cf037414a12d))
* **zai:** add Z.AI GLM Coding Plan provider preset ([#896](https://github.com/kaltdev/kaltcode/issues/896)) ([a0d657e](https://github.com/kaltdev/kaltcode/commit/a0d657ee188f52f8a4ceaad1658c81343a32fdad))


### Bug Fixes

* **abort:** Clean up timeout abort signals ([0912226](https://github.com/kaltdev/kaltcode/commit/09122268112052d5c2822d0e60afcf7c89c9aed1))
* add File polyfill for Node &lt; 20 to prevent startup deadlock with proxy ([#442](https://github.com/kaltdev/kaltcode/issues/442)) ([85aa8b0](https://github.com/kaltdev/kaltcode/commit/85aa8b0985c8f3cb8801efa5141114a0ab0f6a83))
* add GitHub Copilot model context windows and output limits ([#576](https://github.com/kaltdev/kaltcode/issues/576)) ([a7f5982](https://github.com/kaltdev/kaltcode/commit/a7f5982f6438ab0ddc3f0daae31ea68ac7ac206c)), closes [#515](https://github.com/kaltdev/kaltcode/issues/515)
* add LiteLLM-style aliases for GitHub Copilot context windows ([#606](https://github.com/kaltdev/kaltcode/issues/606)) ([2e0e14d](https://github.com/kaltdev/kaltcode/commit/2e0e14d71313e0e501efaa9e55c6c56f2742fb10))
* add missing o1-series and Ollama models to context window table ([#250](https://github.com/kaltdev/kaltcode/issues/250)) ([60d3d89](https://github.com/kaltdev/kaltcode/commit/60d3d8961a4b4db7558533734f9b870cd5292911))
* add store:false to Chat Completions and /responses fallback ([#578](https://github.com/kaltdev/kaltcode/issues/578)) ([8aaa4f2](https://github.com/kaltdev/kaltcode/commit/8aaa4f22ac5b942d82aa9cad54af30d56034515a))
* Add type annotations and format with consistent style ([df6e39d](https://github.com/kaltdev/kaltcode/commit/df6e39d8694179eb75abc8c92871682673ff02ee))
* address code scanning alerts ([#240](https://github.com/kaltdev/kaltcode/issues/240)) ([7c0ea68](https://github.com/kaltdev/kaltcode/commit/7c0ea68b65ce93964332022f5be1bf2c1a1694e0))
* address code scanning alerts ([#434](https://github.com/kaltdev/kaltcode/issues/434)) ([e365cb4](https://github.com/kaltdev/kaltcode/commit/e365cb4010becabacd7cbccb4c3e59ea23a41e90))
* address remaining CodeQL alerts ([#332](https://github.com/kaltdev/kaltcode/issues/332)) ([a0bdab2](https://github.com/kaltdev/kaltcode/commit/a0bdab24c09f304814b7120a97248800be8f381e))
* **agent:** ensure main agent waits for subagent completion ([#1032](https://github.com/kaltdev/kaltcode/issues/1032)) ([6af709e](https://github.com/kaltdev/kaltcode/commit/6af709e65ea61e9071cbccbdcd7c57fe87b0710e))
* **agent:** prevent mid-flight peeking and taking over of forks ([6809d3d](https://github.com/kaltdev/kaltcode/commit/6809d3df3abeb63141f38150b8aaee839c5d59d9))
* **agent:** provider-aware fallback for haiku/sonnet aliases ([#908](https://github.com/kaltdev/kaltcode/issues/908)) ([a3e728a](https://github.com/kaltdev/kaltcode/commit/a3e728a114f6379b80daefc8abcac17a752c5f96))
* **agents:** handle non-string whenToUse values gracefully ([a21ab37](https://github.com/kaltdev/kaltcode/commit/a21ab37c2692109b500354cf14f26a29df838b63))
* allow provider recovery during startup ([#765](https://github.com/kaltdev/kaltcode/issues/765)) ([f828171](https://github.com/kaltdev/kaltcode/commit/f828171ef1ab94e2acf73a28a292799e4e26cc0d))
* **api:** drop orphan tool results to satisfy strict role sequence ([#745](https://github.com/kaltdev/kaltcode/issues/745)) ([b786b76](https://github.com/kaltdev/kaltcode/commit/b786b765f01f392652eaf28ed3579a96b7260a53))
* **api:** ensure strict role sequence and filter empty assistant messages after interruption ([#745](https://github.com/kaltdev/kaltcode/issues/745) regression) ([#794](https://github.com/kaltdev/kaltcode/issues/794)) ([06e7684](https://github.com/kaltdev/kaltcode/commit/06e7684eb56df8e694ac784575e163641931c44c))
* **api:** Hint re-auth for expired OAuth tokens ([994f0a8](https://github.com/kaltdev/kaltcode/commit/994f0a854ee713f016f9067631eb57dc2f7720e6))
* **api:** Redact URLs in fetch errors ([a7e22d6](https://github.com/kaltdev/kaltcode/commit/a7e22d6f14a39a1001bcd0d9f5e3058076e124d9))
* **api:** replace phrase-based reasoning sanitizer with tag-based filter ([#779](https://github.com/kaltdev/kaltcode/issues/779)) ([336ddcc](https://github.com/kaltdev/kaltcode/commit/336ddcc50d59d79ebff50993f2673652aecb0d7d))
* **api:** Surface in-stream errors and truncation ([b70efb1](https://github.com/kaltdev/kaltcode/commit/b70efb153d414172e5a5e2964e1088aee3713528))
* apply provider flag before startup banner ([#322](https://github.com/kaltdev/kaltcode/issues/322)) ([cdbe016](https://github.com/kaltdev/kaltcode/commit/cdbe016e6f5154fe66c5ef0504ba8291b3da3ead))
* **attachments:** use correct MCP server name constant ([4bad2ea](https://github.com/kaltdev/kaltcode/commit/4bad2ea5f9a33101b74b4e9cca31c3d4f31d2165))
* **auth:** Use bracket access for storage key ([edcc560](https://github.com/kaltdev/kaltcode/commit/edcc560b53c23344028885cc273d68243d49194a))
* auto-allow safe read-only commands in acceptEdits mode ([#341](https://github.com/kaltdev/kaltcode/issues/341)) ([01acc4c](https://github.com/kaltdev/kaltcode/commit/01acc4c10e3f23771a8b4c6c255f3d78e25381f1))
* avoid legacy Windows PasswordVault reads by default ([#941](https://github.com/kaltdev/kaltcode/issues/941)) ([d321c8f](https://github.com/kaltdev/kaltcode/commit/d321c8fc6a0be6731c1ccfec0fca8023b1a8b67e))
* avoid sync github credential reads in provider manager ([#428](https://github.com/kaltdev/kaltcode/issues/428)) ([aff2bd8](https://github.com/kaltdev/kaltcode/commit/aff2bd87e4f2821992f74fb95481c505d0ba5d5d))
* **bash:** cap subcommand fanout in auto-allow ([48ebbe8](https://github.com/kaltdev/kaltcode/commit/48ebbe835d0d886a7ad669d3abed90c531a92d48))
* **bash:** preserve captured stdout in error message on non-zero exit ([6849f40](https://github.com/kaltdev/kaltcode/commit/6849f404fea3cb11489ca9a274f29212b9acb099))
* bugs ([#885](https://github.com/kaltdev/kaltcode/issues/885)) ([c6c5f06](https://github.com/kaltdev/kaltcode/commit/c6c5f0608cf6509b412b121954547d72b3f3a411))
* bump axios 1.14.0 → 1.15.0 (Dependabot [#4](https://github.com/kaltdev/kaltcode/issues/4), [#5](https://github.com/kaltdev/kaltcode/issues/5)) ([#670](https://github.com/kaltdev/kaltcode/issues/670)) ([a07e5ef](https://github.com/kaltdev/kaltcode/commit/a07e5ef990a5ed01a72e83fdbd1fcab36f515a08))
* change default config dir from ~/.claude to ~/.openclaude ([#280](https://github.com/kaltdev/kaltcode/issues/280)) ([c735233](https://github.com/kaltdev/kaltcode/commit/c735233f926f19470a7e04ed439347f700d595e0)), closes [#184](https://github.com/kaltdev/kaltcode/issues/184)
* change env for retries ([ec65bd3](https://github.com/kaltdev/kaltcode/commit/ec65bd3aabdb19829ff612f1adc96355562471e7))
* **ci:** Configure Claude config through env file ([bee55cc](https://github.com/kaltdev/kaltcode/commit/bee55ccf5bee51993e782949b179f5294ee5645b))
* **ci:** Update release repository references ([df260fb](https://github.com/kaltdev/kaltcode/commit/df260fb43a36393614eb32bf08f2fb364f08decc))
* **cli:** Relaunch with larger heap for long sessions ([0b2fa56](https://github.com/kaltdev/kaltcode/commit/0b2fa564f86e9bbc7260a301ef6491e8e59dee19))
* **cli:** replace createRequire with static import for teammate.js ([#1026](https://github.com/kaltdev/kaltcode/issues/1026)) ([#1033](https://github.com/kaltdev/kaltcode/issues/1033)) ([c873725](https://github.com/kaltdev/kaltcode/commit/c873725d901c9fd612140603da964894ef69e510))
* coalesce consecutive same-role messages for strict template models ([#241](https://github.com/kaltdev/kaltcode/issues/241)) ([d5852ca](https://github.com/kaltdev/kaltcode/commit/d5852ca73dd2c44f9f32ace7eda93058b57475e7)), closes [#202](https://github.com/kaltdev/kaltcode/issues/202)
* **codex-stream:** recover tool args delivered only via done events ([527673b](https://github.com/kaltdev/kaltcode/commit/527673ba148808098f2ad9e1fb85defd46cd2ca3))
* **codex:** infer type for untyped MCP tool schemas ([f7bd90f](https://github.com/kaltdev/kaltcode/commit/f7bd90f99e13cb4e9fdc3850c1d4e1319acd648e))
* Collapse all-text arrays to string for DeepSeek compatibility ([#806](https://github.com/kaltdev/kaltcode/issues/806)) ([761924d](https://github.com/kaltdev/kaltcode/commit/761924daa7e225fe8acf41651408c7cae639a511))
* **compact:** clear native tool results after time compaction ([5ddcf2f](https://github.com/kaltdev/kaltcode/commit/5ddcf2f2446248edfb3e0a511c3da51357d822c1))
* convert dragged file paths to [@mentions](https://github.com/mentions) for attachment ([#382](https://github.com/kaltdev/kaltcode/issues/382)) ([112df59](https://github.com/kaltdev/kaltcode/commit/112df5911791ea71ee9efbb98ea59c5ded1ea161))
* custom web search — WEB_URL_TEMPLATE not recognized, timeout too short, silent native fallback ([#537](https://github.com/kaltdev/kaltcode/issues/537)) ([32fbd0c](https://github.com/kaltdev/kaltcode/commit/32fbd0c7b4168b32dcb13a5b69342e2727269201))
* defer startup checks and suppress recommendation dialogs during startup window (issue [#363](https://github.com/kaltdev/kaltcode/issues/363)) ([#504](https://github.com/kaltdev/kaltcode/issues/504)) ([2caf2fd](https://github.com/kaltdev/kaltcode/commit/2caf2fd982af1ec845c50152ad9d28d1a597f82f))
* **dev:** Launch built CLI from bin ([abf535d](https://github.com/kaltdev/kaltcode/commit/abf535df555b2abfec053c582a6b66504e76a5f8))
* disable cache_control injection for third-party providers ([#276](https://github.com/kaltdev/kaltcode/issues/276)) ([8ce09ae](https://github.com/kaltdev/kaltcode/commit/8ce09ae7436053cc4f632d1a797ba503c3ee0fa3)), closes [#273](https://github.com/kaltdev/kaltcode/issues/273)
* disable experimental API betas by default, reduce side query token usage, standardize Headers type ([#281](https://github.com/kaltdev/kaltcode/issues/281)) ([70cfa61](https://github.com/kaltdev/kaltcode/commit/70cfa61582f0a12f8a9908939e9632af23bb11b3))
* display selected model in startup screen instead of hardcoded sonnet 4.6 ([#587](https://github.com/kaltdev/kaltcode/issues/587)) ([b126e38](https://github.com/kaltdev/kaltcode/commit/b126e38b1affddd2de83fcc3ba26f2e44b42a509))
* **effort:** persist xhigh and send reasoning_effort on chat_completions ([#857](https://github.com/kaltdev/kaltcode/issues/857)) ([feb5791](https://github.com/kaltdev/kaltcode/commit/feb579132016ef73dfaa5f20c073fcd3c91ecd80))
* enforce Bash path constraints after sandbox allow ([#777](https://github.com/kaltdev/kaltcode/issues/777)) ([7002cb3](https://github.com/kaltdev/kaltcode/commit/7002cb302b78ea2a19da3f26226de24e2903fa1d))
* enforce MCP OAuth callback state before errors ([#775](https://github.com/kaltdev/kaltcode/issues/775)) ([739b8d1](https://github.com/kaltdev/kaltcode/commit/739b8d1f40fde0e401a5cbd2b9a55d88bd5124ad))
* **errors:** show actual host in 404 message instead of Ollama hint ([#926](https://github.com/kaltdev/kaltcode/issues/926)) ([#931](https://github.com/kaltdev/kaltcode/issues/931)) ([4fab8b9](https://github.com/kaltdev/kaltcode/commit/4fab8b913f8b5301b98eb8dcf42dd75f095a3c60))
* extend provider guard to protect anthropic profiles from cross-terminal override ([#641](https://github.com/kaltdev/kaltcode/issues/641)) ([03e0b06](https://github.com/kaltdev/kaltcode/commit/03e0b06e0784e4ea46945b3950840b10b6e3ca49))
* flaky xAI OAuth profile regression test ([4769006](https://github.com/kaltdev/kaltcode/commit/4769006c97b1d0638a8e96a0eb4dcd21ad195127))
* focus "Done" option after completing provider manager actions ([#718](https://github.com/kaltdev/kaltcode/issues/718)) ([d6f5130](https://github.com/kaltdev/kaltcode/commit/d6f5130c204d8ffe582212466768706cd7fd6774))
* **gpt:** Lower GPT-5.5 context window for Codex ([5eb414a](https://github.com/kaltdev/kaltcode/commit/5eb414aaae97240e27c1b14b8dc8ce61b95ecb4b))
* **groq:** strip unsupported store field ([#983](https://github.com/kaltdev/kaltcode/issues/983)) ([6d0953a](https://github.com/kaltdev/kaltcode/commit/6d0953a79cb435b17ed231019fa0b660b770c914))
* guard rawBaseUrl against the literal string "undefined" from env vars ([#340](https://github.com/kaltdev/kaltcode/issues/340)) ([e4cf810](https://github.com/kaltdev/kaltcode/commit/e4cf810e147708077a370dd8cafb3d4caeb02dd6))
* handle missing skill parameter in SkillTool ([#485](https://github.com/kaltdev/kaltcode/issues/485)) ([f9ce81b](https://github.com/kaltdev/kaltcode/commit/f9ce81bfb384e909353813fb6f6760cadd508ae7))
* harden execFileNoThrow for CodeQL ([#338](https://github.com/kaltdev/kaltcode/issues/338)) ([4c3118e](https://github.com/kaltdev/kaltcode/commit/4c3118e0712b57a280eb009163a2c4913edd1b5f))
* harden knowledge graph reset cleanup ([42ae535](https://github.com/kaltdev/kaltcode/commit/42ae53541bd5d6e0725754401ebfe6e5ef01576a))
* harden resume after compaction failures ([#195](https://github.com/kaltdev/kaltcode/issues/195)) ([b0d796e](https://github.com/kaltdev/kaltcode/commit/b0d796e5c3ca79259f6f67b2927592087c57b9f3))
* harden XAA OAuth callback state handling ([537c1b7](https://github.com/kaltdev/kaltcode/commit/537c1b7ddc18ee0bf6a4d142279e74991ba83db8))
* **help:** prevent /help tab crash from undefined descriptions ([#732](https://github.com/kaltdev/kaltcode/issues/732)) ([3d1979f](https://github.com/kaltdev/kaltcode/commit/3d1979ff066db32415e0c8321af916d81f5f2621))
* improve fetch diagnostics for bootstrap and session requests ([#646](https://github.com/kaltdev/kaltcode/issues/646)) ([df2b9f2](https://github.com/kaltdev/kaltcode/commit/df2b9f2b7b4c661ee3d9ed5dc58b3064de0599d1))
* include MCP tool results in microcompact to reduce token waste ([#348](https://github.com/kaltdev/kaltcode/issues/348)) ([52d33a8](https://github.com/kaltdev/kaltcode/commit/52d33a87a047b943aedaaaf772cd48636c263509))
* include retry timing in 429 error messages ([#366](https://github.com/kaltdev/kaltcode/issues/366)) ([4ac7367](https://github.com/kaltdev/kaltcode/commit/4ac73677339da333e22c853066fcd5c57e537cec))
* **ink:** restore host prop updates in React 19 reconciler ([#589](https://github.com/kaltdev/kaltcode/issues/589)) ([6e94dd9](https://github.com/kaltdev/kaltcode/commit/6e94dd913688b2d6433a9abe62a245c5f031b776))
* **input:** strip leading ! when entering bash mode ([#947](https://github.com/kaltdev/kaltcode/issues/947)) ([5943c5c](https://github.com/kaltdev/kaltcode/commit/5943c5c269cdeba45879dac0d8da0082e28cc2a2)), closes [#662](https://github.com/kaltdev/kaltcode/issues/662)
* **json-schema:** support top-level non-object roots via wrap/unwrap ([3a4b23f](https://github.com/kaltdev/kaltcode/commit/3a4b23f272fe4cae9dfda9560360cd7d87e36d3e))
* let saved provider profiles win on restart ([#513](https://github.com/kaltdev/kaltcode/issues/513)) ([cb8f8b7](https://github.com/kaltdev/kaltcode/commit/cb8f8b7ac2e3e74516ee219a3a48156db7c6ed78))
* make OpenAI fallback context window configurable + support external model lookup ([#861](https://github.com/kaltdev/kaltcode/issues/861)) ([b750e9e](https://github.com/kaltdev/kaltcode/commit/b750e9e97d15926d094d435772b2d6d12e5e545c))
* **mcp:** allow third-party providers to approve project-scope .mcp.json servers ([#696](https://github.com/kaltdev/kaltcode/issues/696)) ([#937](https://github.com/kaltdev/kaltcode/issues/937)) ([dc3c065](https://github.com/kaltdev/kaltcode/commit/dc3c065c4a70663978f965d50846ba6a0692e59d))
* **mcp:** disable MCP_SKILLS feature flag — source not mirrored ([#872](https://github.com/kaltdev/kaltcode/issues/872)) ([dcbe295](https://github.com/kaltdev/kaltcode/commit/dcbe29558ab9c74d335b138488005a6509aa906a))
* **mcp:** sync required array with properties in tool schemas ([#754](https://github.com/kaltdev/kaltcode/issues/754)) ([002a8f1](https://github.com/kaltdev/kaltcode/commit/002a8f1f6de2fcfc917165d828501d3047bad61f))
* **model:** codex/nvidia-nim/minimax now read OPENAI_MODEL env ([#815](https://github.com/kaltdev/kaltcode/issues/815)) ([4581208](https://github.com/kaltdev/kaltcode/commit/458120889f6ce54cc9f0b287461d5e38eae48a20))
* **models:** prevent /models crash from non-string saved model values ([#691](https://github.com/kaltdev/kaltcode/issues/691)) ([6b2121d](https://github.com/kaltdev/kaltcode/commit/6b2121da12189fa7ce1f33394d18abd24cf8a01b))
* normalize /provider multi-model selection and semicolon parsing ([#841](https://github.com/kaltdev/kaltcode/issues/841)) ([c4cb98a](https://github.com/kaltdev/kaltcode/commit/c4cb98a4f092062da02a4728cf59fed0fc3a6d3f))
* normalize malformed Bash tool arguments from OpenAI-compatible providers ([#385](https://github.com/kaltdev/kaltcode/issues/385)) ([b4bd95b](https://github.com/kaltdev/kaltcode/commit/b4bd95b47715c9896240d708c106777507fd26ec))
* OAuth tokens secure storage for Windows & Linux ([#215](https://github.com/kaltdev/kaltcode/issues/215)) ([c3c60b7](https://github.com/kaltdev/kaltcode/commit/c3c60b7bab71ebe783b4043243639699d16cdc2b))
* **oauth:** skip refresh for third-party providers ([#955](https://github.com/kaltdev/kaltcode/issues/955)) ([208c896](https://github.com/kaltdev/kaltcode/commit/208c896c07b878e2859fbae7e0f31697d59943ce))
* **openai-shim:** don't label transport failures as HTTP 503 ([#971](https://github.com/kaltdev/kaltcode/issues/971)) ([#975](https://github.com/kaltdev/kaltcode/issues/975)) ([cc0dab6](https://github.com/kaltdev/kaltcode/commit/cc0dab60a3721921f949165b93c8c997b1aae4a2))
* **openai-shim:** echo reasoning_content on assistant tool-call messages for Moonshot ([#828](https://github.com/kaltdev/kaltcode/issues/828)) ([67de6bd](https://github.com/kaltdev/kaltcode/commit/67de6bd2cffc3381f0f28fd3ffce043970611667))
* **openai-shim:** preserve tool result images and local token caps ([#659](https://github.com/kaltdev/kaltcode/issues/659)) ([30c866d](https://github.com/kaltdev/kaltcode/commit/30c866d31ad8538496460667d86ed5efbd4a8547))
* **openai-shim:** strip `store` for local providers (vLLM, custom) ([#1048](https://github.com/kaltdev/kaltcode/issues/1048)) ([4830d6f](https://github.com/kaltdev/kaltcode/commit/4830d6f778c57ae83c12aeda65108e1f5e23acaf))
* **openai-shim:** strip `store` when baseUrl points at Cerebras ([#1040](https://github.com/kaltdev/kaltcode/issues/1040)) ([0adf97d](https://github.com/kaltdev/kaltcode/commit/0adf97dc14f149eb4bcdd0cefcf45dd87eae4f2a))
* **openai-shim:** strip `store` when baseUrl points at Gemini ([#959](https://github.com/kaltdev/kaltcode/issues/959)) ([0f0fd26](https://github.com/kaltdev/kaltcode/commit/0f0fd266dbe9363b0ea1db29d8c10ed0b9b18413)), closes [#664](https://github.com/kaltdev/kaltcode/issues/664)
* **openai:** Allow Ollama endpoints without API key ([0e76872](https://github.com/kaltdev/kaltcode/commit/0e76872b4af5356d0a72d6b837115ce09e2792c9))
* patch providerProfile so the test creates and activates the xAI OAuth profile through the ([ede64fc](https://github.com/kaltdev/kaltcode/commit/ede64fc3e8254ae94ae5f55511e760599e9d544e))
* **plugins:** Prevent plugin path traversal ([79d404c](https://github.com/kaltdev/kaltcode/commit/79d404cef2e83ac9bd05b78feb903ec8643105ac))
* **plugins:** sanitize env before spawning git so /plugin marketplace add works ([#751](https://github.com/kaltdev/kaltcode/issues/751)) ([#934](https://github.com/kaltdev/kaltcode/issues/934)) ([5c4fdca](https://github.com/kaltdev/kaltcode/commit/5c4fdca21743f82071d0ee22534d61c9ad677efe))
* preserve only originally-required properties in strict tool schemas ([#471](https://github.com/kaltdev/kaltcode/issues/471)) ([ccaa193](https://github.com/kaltdev/kaltcode/commit/ccaa193eec5761f0972ffb58eb3189a81a9244b0))
* preserve unicode in Windows clipboard fallback ([#388](https://github.com/kaltdev/kaltcode/issues/388)) ([c193497](https://github.com/kaltdev/kaltcode/commit/c1934974aaf64db460cc850a044bd13cc744cce7))
* prevent crash in commands tab when description is undefined ([#730](https://github.com/kaltdev/kaltcode/issues/730)) ([eed77e6](https://github.com/kaltdev/kaltcode/commit/eed77e6579866a98384dcc948a0ad6406614ede3))
* prevent cross-provider model env var leaks and sync Codex detection ([#243](https://github.com/kaltdev/kaltcode/issues/243)) ([fbf3385](https://github.com/kaltdev/kaltcode/commit/fbf33853956471f737e466583a2f17a598007818))
* prevent infinite auto-compact loop for unknown 3P models ([#635](https://github.com/kaltdev/kaltcode/issues/635)) ([#636](https://github.com/kaltdev/kaltcode/issues/636)) ([aeaa658](https://github.com/kaltdev/kaltcode/commit/aeaa658f776fb8df95721e8b8962385f8b00f66a))
* **pr:** Increase git diff output buffer ([4280cbe](https://github.com/kaltdev/kaltcode/commit/4280cbeafa9a79439b1e5cbb8358126884723b56))
* **provider:** add recovery guidance for missing OpenAI API key ([#616](https://github.com/kaltdev/kaltcode/issues/616)) ([9419e8a](https://github.com/kaltdev/kaltcode/commit/9419e8a4a21b3771d9ddb10f7072e0a8c5b5b631))
* **provider:** apply Codex OAuth session switch correctly ([#974](https://github.com/kaltdev/kaltcode/issues/974)) ([95a817f](https://github.com/kaltdev/kaltcode/commit/95a817fdb08a97b6293c6c7f87457bcd98283714))
* **provider:** Handle default profile paths correctly ([c4880f5](https://github.com/kaltdev/kaltcode/commit/c4880f5ad698a59c1a216cb6991a096093190906))
* **provider:** saved profile ignored when stale CLAUDE_CODE_USE_* in shell ([#807](https://github.com/kaltdev/kaltcode/issues/807)) ([13de4e8](https://github.com/kaltdev/kaltcode/commit/13de4e85df7f5fadc8cd15a76076374dc112360b))
* **query:** Preserve auto-compact cooldown state ([7327d41](https://github.com/kaltdev/kaltcode/commit/7327d416d11af42cf59fb039a633735acb4a000d))
* **query:** restore system prompt structure and add missing config import ([#907](https://github.com/kaltdev/kaltcode/issues/907)) ([818689b](https://github.com/kaltdev/kaltcode/commit/818689b2ee71cb6966cb4dc5a5ebd90fd22b0fcb))
* **read/edit:** make compact line prefix unambiguous for tab-indented files ([#613](https://github.com/kaltdev/kaltcode/issues/613)) ([08cc6f3](https://github.com/kaltdev/kaltcode/commit/08cc6f328711cd93ce9fa53351266c29a0b0a341))
* rebrand prompt identity to openclaude ([#496](https://github.com/kaltdev/kaltcode/issues/496)) ([598651f](https://github.com/kaltdev/kaltcode/commit/598651f42389ce76311ec00e8a9c701c939ead27))
* **recovery:** keep thinking blocks on resume for reasoning-echo ([83d402c](https://github.com/kaltdev/kaltcode/commit/83d402c32b7d561c5dea93def60d437bf170a27a))
* register built-in agents in grpc server ([5d8c888](https://github.com/kaltdev/kaltcode/commit/5d8c888b8eb4eb111adc2a7411fbcd22b66ece21))
* remove cached mcpClient in diagnostic tracking to prevent stale references ([#727](https://github.com/kaltdev/kaltcode/issues/727)) ([2c98be7](https://github.com/kaltdev/kaltcode/commit/2c98be700274a4241963b5f43530bf3bd8f8963f))
* remove internal Anthropic tooling from external build ([#345](https://github.com/kaltdev/kaltcode/issues/345)) ([75d2543](https://github.com/kaltdev/kaltcode/commit/75d2543854f26a8f04204115827a46e587946d8c))
* rename .claude.json to .openclaude.json with legacy fallback ([#582](https://github.com/kaltdev/kaltcode/issues/582)) ([4d4fb28](https://github.com/kaltdev/kaltcode/commit/4d4fb2880e4d0e3a62d8715e1ec13d932e736279))
* rename internal executable identifiers ([ff8e0fa](https://github.com/kaltdev/kaltcode/commit/ff8e0faf3cf3919b85eeb434bb472e7bf2058f62))
* repair broken branding identifiers ([f3d9928](https://github.com/kaltdev/kaltcode/commit/f3d99288414ef26d8d2f7a5653e57149b8adeb03))
* replace broken bun:bundle shim with source pre-processing ([#657](https://github.com/kaltdev/kaltcode/issues/657)) ([adbe391](https://github.com/kaltdev/kaltcode/commit/adbe391e63721918b5d147f4f845111c1a3143db))
* replace discontinued gemini-2.5-pro-preview-03-25 with stable gemini-2.5-pro ([#802](https://github.com/kaltdev/kaltcode/issues/802)) ([64582c1](https://github.com/kaltdev/kaltcode/commit/64582c119d5d0278195271379da4a68d59a89c1f)), closes [#398](https://github.com/kaltdev/kaltcode/issues/398)
* replace isDeepStrictEqual with navigation-aware options comparison ([#507](https://github.com/kaltdev/kaltcode/issues/507)) ([537c469](https://github.com/kaltdev/kaltcode/commit/537c469c3a2f7cb0eed05fa2f54dca57b6bc273f)), closes [#472](https://github.com/kaltdev/kaltcode/issues/472)
* replace unsupported Unicode glyphs with widely available alternatives ([#1088](https://github.com/kaltdev/kaltcode/issues/1088)) ([e1e277a](https://github.com/kaltdev/kaltcode/commit/e1e277a3af7217822d41e5b9dc919033d0839db8))
* **repl:** Focus critical input dialogs immediately ([c0404b0](https://github.com/kaltdev/kaltcode/commit/c0404b01b66c760aeee7a4d47ca19b51a24deb28))
* **repl:** queue prompt guidance for next turn ([#333](https://github.com/kaltdev/kaltcode/issues/333)) ([cdc92d1](https://github.com/kaltdev/kaltcode/commit/cdc92d16e4f0c61cf416f67d0b2ae50e93f0380c)), closes [#328](https://github.com/kaltdev/kaltcode/issues/328)
* report cache reads in streaming and correct cost calculation ([#577](https://github.com/kaltdev/kaltcode/issues/577)) ([f4ac709](https://github.com/kaltdev/kaltcode/commit/f4ac709fa6eda732bf45204fcab625ba6c5674b9))
* require trusted approval for sandbox override ([#778](https://github.com/kaltdev/kaltcode/issues/778)) ([aab4890](https://github.com/kaltdev/kaltcode/commit/aab489055c53dd64369414116fe93226d2656273))
* resolve 12 bugs across API, MCP, agent tools, web search, and context overflow ([#674](https://github.com/kaltdev/kaltcode/issues/674)) ([25ce2ca](https://github.com/kaltdev/kaltcode/commit/25ce2ca7bff8937b0b79ad7f85c6dc1c68432069))
* resolve keyboard freeze via sync render path and stable useAppState selectors ([#266](https://github.com/kaltdev/kaltcode/issues/266)) ([c1e5e36](https://github.com/kaltdev/kaltcode/commit/c1e5e363cd971b143a575d38441230916f8837ad))
* resolve keyboard input freeze on Windows and Mac at startup ([#285](https://github.com/kaltdev/kaltcode/issues/285)) ([afed73f](https://github.com/kaltdev/kaltcode/commit/afed73fa5a471cb913918578337e9057a8699347))
* resolve two bugs making interactive mode unusable with plugin ecosystems ([#825](https://github.com/kaltdev/kaltcode/issues/825)) ([#830](https://github.com/kaltdev/kaltcode/issues/830)) ([e438c89](https://github.com/kaltdev/kaltcode/commit/e438c89fbceefcfb86a8ecdaae6d5a119a92a33b))
* restore default context window for unknown 3p models ([#494](https://github.com/kaltdev/kaltcode/issues/494)) ([69ea1f1](https://github.com/kaltdev/kaltcode/commit/69ea1f1e4a99e9436215d8cb391a116a64442b94))
* restore Grep and Glob reliability on OpenAI paths ([#461](https://github.com/kaltdev/kaltcode/issues/461)) ([600c01f](https://github.com/kaltdev/kaltcode/commit/600c01faf761a080a2c7dede872ddbe05a132f23))
* restore image paste and image tool-result handling ([#308](https://github.com/kaltdev/kaltcode/issues/308)) ([c52245f](https://github.com/kaltdev/kaltcode/commit/c52245fc0aeef229e52de2410ca4c18b87a60da2))
* restore Ollama auto-detect in first-run setup ([#561](https://github.com/kaltdev/kaltcode/issues/561)) ([68c2968](https://github.com/kaltdev/kaltcode/commit/68c296833dcef54ce44cb18b24357230b5204dbc))
* **retry:** adjust max_tokens on OpenRouter 402 credit shortfall ([903d57e](https://github.com/kaltdev/kaltcode/commit/903d57ec886e10242c58f3d0febb644e0e3844a4))
* **retry:** prevent retries on quota-exhausted 429 errors ([#249](https://github.com/kaltdev/kaltcode/issues/249)) ([36d1c45](https://github.com/kaltdev/kaltcode/commit/36d1c45954840658aa13d3186e4604c0b08cb52d))
* **ripgrep:** use @vscode/ripgrep package as the builtin source ([#911](https://github.com/kaltdev/kaltcode/issues/911)) ([#932](https://github.com/kaltdev/kaltcode/issues/932)) ([ee0d930](https://github.com/kaltdev/kaltcode/commit/ee0d9300939db0c6178bfad4707a0be45f126d1f))
* route ask-user-question footer actions through useInput ([#229](https://github.com/kaltdev/kaltcode/issues/229)) ([72c6e97](https://github.com/kaltdev/kaltcode/commit/72c6e970946108937043a683706f70678d4c3ee4))
* route OpenAI Codex shortcuts to correct endpoint ([#566](https://github.com/kaltdev/kaltcode/issues/566)) ([7c8bdcc](https://github.com/kaltdev/kaltcode/commit/7c8bdcc3e2ac1ecb98286c705c85671044be3d6b))
* run dangerous path check before auto-allowing rm/rmdir in acceptEdits mode ([#246](https://github.com/kaltdev/kaltcode/issues/246)) ([0951c8b](https://github.com/kaltdev/kaltcode/commit/0951c8bc59f8679af1ee4589ef18e09b90503f71))
* scrub canonical Anthropic headers from 3P shim requests ([#499](https://github.com/kaltdev/kaltcode/issues/499)) ([07621a6](https://github.com/kaltdev/kaltcode/commit/07621a6f8d0918170281869a47b5dbff90e71594))
* **security-review:** Handle null shell output ([#231](https://github.com/kaltdev/kaltcode/issues/231)) ([f3a984d](https://github.com/kaltdev/kaltcode/commit/f3a984dde153cfb71c8f6045bae0f23f03d1d1f3)), closes [#165](https://github.com/kaltdev/kaltcode/issues/165)
* **security:** correct fc -e detection regex to avoid false positives ([f65f2b9](https://github.com/kaltdev/kaltcode/commit/f65f2b9cffc61e0e5a6fde8e51ea9e93ed4f1543))
* **security:** harden project settings trust boundary + MCP sanitization ([#789](https://github.com/kaltdev/kaltcode/issues/789)) ([ae3b723](https://github.com/kaltdev/kaltcode/commit/ae3b723f3b297b49925cada4728f3174aee8bf12))
* **shell:** recover when CWD path was replaced by a non-directory ([#871](https://github.com/kaltdev/kaltcode/issues/871)) ([a4c6757](https://github.com/kaltdev/kaltcode/commit/a4c67570238794317d049a225396672b465fdbfc))
* **shims:** strip x-anthropic-billing-header block before forwarding system prompt ([#1019](https://github.com/kaltdev/kaltcode/issues/1019)) ([40ae1e7](https://github.com/kaltdev/kaltcode/commit/40ae1e720034f00912762d5e723903d3170bc396))
* skip Anthropic MCP registry fetch for third-party providers ([#310](https://github.com/kaltdev/kaltcode/issues/310)) ([b4725c1](https://github.com/kaltdev/kaltcode/commit/b4725c19e0f1d3f57d792447035e2d55ebc40a94))
* skip Anthropic preconnect for third-party providers ([#309](https://github.com/kaltdev/kaltcode/issues/309)) ([08be518](https://github.com/kaltdev/kaltcode/commit/08be5181ab1896e379b7ec9ea912b39a127a7e11))
* **startup:** make CLAUDE logo D distinct ([#986](https://github.com/kaltdev/kaltcode/issues/986)) ([35f86a9](https://github.com/kaltdev/kaltcode/commit/35f86a9580aedd3f359dfc13992e49f2ec53757e))
* **startup:** show --model flag override on startup screen ([#898](https://github.com/kaltdev/kaltcode/issues/898)) ([d45628c](https://github.com/kaltdev/kaltcode/commit/d45628c41300b83b466e6a97983099615a50e7d7))
* **startup:** url authoritative over model name in banner provider detect ([#864](https://github.com/kaltdev/kaltcode/issues/864)) ([e346b8d](https://github.com/kaltdev/kaltcode/commit/e346b8d5ec2d58a4e8db337918d52d844ee52766)), closes [#855](https://github.com/kaltdev/kaltcode/issues/855)
* **status:** Separate warning icon from notice text ([3d6e69c](https://github.com/kaltdev/kaltcode/commit/3d6e69c364491b8c65d0f3654143f863be737c60))
* **stdin,mcp:** guard rawModeEnabledCount and defer MCP connections to ([dec767f](https://github.com/kaltdev/kaltcode/commit/dec767f87ccc9510b06f8120f12d72d2537cc9ed))
* strip Anthropic params from 3P resume paths ([#479](https://github.com/kaltdev/kaltcode/issues/479)) ([4975cfc](https://github.com/kaltdev/kaltcode/commit/4975cfc2e0ddbe34aa4e8e3f52ee5eba07fbe465))
* strip comments before scanning for missing imports ([#676](https://github.com/kaltdev/kaltcode/issues/676)) ([a00b792](https://github.com/kaltdev/kaltcode/commit/a00b7928de9662ffb7ef6abd8cd040afe6f4f122))
* suppress startup dialogs when input is buffered ([#423](https://github.com/kaltdev/kaltcode/issues/423)) ([8ece290](https://github.com/kaltdev/kaltcode/commit/8ece2900872dadd157e798ef501ddf126dac66c4))
* surface actionable error when DuckDuckGo web search is rate-limited ([#834](https://github.com/kaltdev/kaltcode/issues/834)) ([3c4d843](https://github.com/kaltdev/kaltcode/commit/3c4d8435c42e1ee04f9defd31c4c589017f524c5))
* **test:** add missing teammate exports to hookChains integration mock ([#840](https://github.com/kaltdev/kaltcode/issues/840)) ([23e8cfb](https://github.com/kaltdev/kaltcode/commit/23e8cfbd5b22179684276bef4131e26b830ce69c)), closes [#839](https://github.com/kaltdev/kaltcode/issues/839)
* **test:** autoCompact floor assertion is flag-sensitive ([#816](https://github.com/kaltdev/kaltcode/issues/816)) ([c13842e](https://github.com/kaltdev/kaltcode/commit/c13842e91c7227246520955de6ae0636b30def9a))
* **test:** Return full config from mocked provider profile ([508f279](https://github.com/kaltdev/kaltcode/commit/508f27992765770bd5663748747d91815f28ff75))
* **tests:** resolve flakiness due to module leak and env state leakage ([#988](https://github.com/kaltdev/kaltcode/issues/988)) ([990a5a2](https://github.com/kaltdev/kaltcode/commit/990a5a2afbb22b8f9274328783a6adbda1a3b62c))
* **test:** Stabilize test suite with proper isolation and timeouts ([9c9014d](https://github.com/kaltdev/kaltcode/commit/9c9014d6f05393d31c0d68c11701cad1f9c0b925))
* **theme:** remove stale memo wrappers from theme context hooks ([#534](https://github.com/kaltdev/kaltcode/issues/534)) ([094f04c](https://github.com/kaltdev/kaltcode/commit/094f04c8036200eb3c51b7b7b4ec3c75ee83b3a0))
* **thinking:** Disable thinking for Ollama models ([441e222](https://github.com/kaltdev/kaltcode/commit/441e222f4a6cc7ea3ee9f2e692defa84b76f71f3))
* **tui:** restore prompt rendering on startup ([#498](https://github.com/kaltdev/kaltcode/issues/498)) ([e30ad17](https://github.com/kaltdev/kaltcode/commit/e30ad17ae0056787273be2caafd6cf5340b6ab57))
* **typecheck:** make `bun run typecheck` actionable on main ([#473](https://github.com/kaltdev/kaltcode/issues/473)) ([#938](https://github.com/kaltdev/kaltcode/issues/938)) ([8106880](https://github.com/kaltdev/kaltcode/commit/8106880855ee0bb4b5bbca8827cfe97fe99558b8))
* **ui:** prevent provider manager lag by deferring sync I/O ([#803](https://github.com/kaltdev/kaltcode/issues/803)) ([85eab27](https://github.com/kaltdev/kaltcode/commit/85eab2751e7d351bb0ed6a3fe0e15461d241c9cb))
* **ui:** Remove overflowX from TaskListV2 ([218a365](https://github.com/kaltdev/kaltcode/commit/218a365270e25e32e49869175e9e76ff30878e28))
* **ui:** show correct endpoint URL in intro screen for custom Anthropic endpoints ([#735](https://github.com/kaltdev/kaltcode/issues/735)) ([3424663](https://github.com/kaltdev/kaltcode/commit/34246635fb9a09499047a52e7f96ca9b36c8a85a))
* update KaltCode release branding ([3cf1c06](https://github.com/kaltdev/kaltcode/commit/3cf1c06f4795d4fd1b8fbc1ffcc513cef2f153a4))
* update theme preview on focus change ([#562](https://github.com/kaltdev/kaltcode/issues/562)) ([6924718](https://github.com/kaltdev/kaltcode/commit/692471850fc789ee0797190089272407f9a4d953))
* **update:** show real package version and give actionable guidance ([#870](https://github.com/kaltdev/kaltcode/issues/870)) ([6e58b81](https://github.com/kaltdev/kaltcode/commit/6e58b819370128b923dda4fcc774bb556f4b951a))
* **upstream-sync:** Refine branding detection ([69656e2](https://github.com/kaltdev/kaltcode/commit/69656e225ce43ef2351aa45b99e78382d9df4113))
* use raw context window for auto-compact percentage display ([#748](https://github.com/kaltdev/kaltcode/issues/748)) ([55c5f26](https://github.com/kaltdev/kaltcode/commit/55c5f262a9a5a8be0aa9ae8dc6c7dafc465eb2c6))
* **utils:** Clean up combined abort signal handling ([1ae2cbd](https://github.com/kaltdev/kaltcode/commit/1ae2cbdb91cd06378df1d34acd9ac2eee128660b))
* **web-search:** close SSRF bypasses in custom provider hostname guard ([#610](https://github.com/kaltdev/kaltcode/issues/610)) ([a02c441](https://github.com/kaltdev/kaltcode/commit/a02c44143b257fbee7f38f1b93873cc0ea68a1f9))
* **web-search:** surface diagnostic when adapter returns 0 hits and no native fallback ([#1006](https://github.com/kaltdev/kaltcode/issues/1006)) ([1c74675](https://github.com/kaltdev/kaltcode/commit/1c746750f67d576b8272ba985b65c9c4406bdbc9))
* WebSearch providers + MCPTool bugs ([#593](https://github.com/kaltdev/kaltcode/issues/593)) ([91e4cfb](https://github.com/kaltdev/kaltcode/commit/91e4cfb15b62c04615834fd3c417fe38b4feb914))
* **websearch:** surface adapter errors and hints ([1654791](https://github.com/kaltdev/kaltcode/commit/16547917797118e764dc2aaea2dec17299d943f4))
* **worktree:** surface git stderr in rev-parse failure message ([#690](https://github.com/kaltdev/kaltcode/issues/690)) ([#954](https://github.com/kaltdev/kaltcode/issues/954)) ([7711dda](https://github.com/kaltdev/kaltcode/commit/7711ddae4807332526ea128c0246b479d5c0ed00))
* **xml:** tolerate null/undefined in escape helpers ([0b9057f](https://github.com/kaltdev/kaltcode/commit/0b9057f75f8692a9580a96f8bb81211b9f5dedcd))

## [0.15.0](https://github.com/kaltdev/kaltcode/compare/v0.14.0...v0.15.0) (2026-05-25)


### Features

* add /request-size context diagnostics ([f766c44](https://github.com/kaltdev/kaltcode/commit/f766c443d0cd4b22823fd38072fdd56d901ab4bd))
* **safety:** warn at startup when 3P provider + permissive mode skip ([db481b6](https://github.com/kaltdev/kaltcode/commit/db481b688815674c7f554732d82fc8cc1e861859))
* **xai:** add xAI/Grok OAuth provider (browser + device-code) ([e67628a](https://github.com/kaltdev/kaltcode/commit/e67628a074409104dc6c51b40b70cf037414a12d))


### Bug Fixes

* **bash:** preserve captured stdout in error message on non-zero exit ([6849f40](https://github.com/kaltdev/kaltcode/commit/6849f404fea3cb11489ca9a274f29212b9acb099))
* **compact:** clear native tool results after time compaction ([5ddcf2f](https://github.com/kaltdev/kaltcode/commit/5ddcf2f2446248edfb3e0a511c3da51357d822c1))
* harden XAA OAuth callback state handling ([537c1b7](https://github.com/kaltdev/kaltcode/commit/537c1b7ddc18ee0bf6a4d142279e74991ba83db8))
* **json-schema:** support top-level non-object roots via wrap/unwrap ([3a4b23f](https://github.com/kaltdev/kaltcode/commit/3a4b23f272fe4cae9dfda9560360cd7d87e36d3e))
* **recovery:** keep thinking blocks on resume for reasoning-echo ([83d402c](https://github.com/kaltdev/kaltcode/commit/83d402c32b7d561c5dea93def60d437bf170a27a))
* register built-in agents in grpc server ([5d8c888](https://github.com/kaltdev/kaltcode/commit/5d8c888b8eb4eb111adc2a7411fbcd22b66ece21))
* **retry:** adjust max_tokens on OpenRouter 402 credit shortfall ([903d57e](https://github.com/kaltdev/kaltcode/commit/903d57ec886e10242c58f3d0febb644e0e3844a4))

## [0.14.0](https://github.com/kaltdev/kaltcode/compare/v0.13.0...v0.14.0) (2026-05-21)


### Features

* Add codexplan alias and update spinner tips ([a69cd8b](https://github.com/kaltdev/kaltcode/commit/a69cd8b179351a982e8d780348141d7590156d81))
* **integrations:** Add Xiaomi MiMo and OpenGateway handling ([07c1076](https://github.com/kaltdev/kaltcode/commit/07c10769daf190d0a27c571e0abb9b6d28a2539f))
* **provider:** allow OpenGateway no-auth validation ([6159240](https://github.com/kaltdev/kaltcode/commit/61592401951c1597a0349c3514b418aa470ea5af))
* **query:** Add tool failure loop guard ([7b1e8fc](https://github.com/kaltdev/kaltcode/commit/7b1e8fc2eea6410aa6895a29f931a3133ddcb7ca))
* **tools:** Normalize tool inputs for validation ([fe10730](https://github.com/kaltdev/kaltcode/commit/fe1073084e1e0afd687fd31f261777ad50707f0d))


### Bug Fixes

* **stdin,mcp:** guard rawModeEnabledCount and defer MCP connections to ([dec767f](https://github.com/kaltdev/kaltcode/commit/dec767f87ccc9510b06f8120f12d72d2537cc9ed))
* **ui:** Remove overflowX from TaskListV2 ([218a365](https://github.com/kaltdev/kaltcode/commit/218a365270e25e32e49869175e9e76ff30878e28))
* **xml:** tolerate null/undefined in escape helpers ([0b9057f](https://github.com/kaltdev/kaltcode/commit/0b9057f75f8692a9580a96f8bb81211b9f5dedcd))

## [0.13.0](https://github.com/kaltdev/kaltcode/compare/v0.12.0...v0.13.0) (2026-05-17)


### Features

* **openaiShim:** Parse Gemini raw tool-call text ([a312c31](https://github.com/kaltdev/kaltcode/commit/a312c311c2086289c871f6e6d3d77d6e3f30c225))


### Bug Fixes

* **bash:** cap subcommand fanout in auto-allow ([48ebbe8](https://github.com/kaltdev/kaltcode/commit/48ebbe835d0d886a7ad669d3abed90c531a92d48))
* harden knowledge graph reset cleanup ([42ae535](https://github.com/kaltdev/kaltcode/commit/42ae53541bd5d6e0725754401ebfe6e5ef01576a))
* **websearch:** surface adapter errors and hints ([1654791](https://github.com/kaltdev/kaltcode/commit/16547917797118e764dc2aaea2dec17299d943f4))

## [0.12.0](https://github.com/kaltdev/kaltcode/compare/v0.11.0...v0.12.0) (2026-05-16)


### Features

* **build:** gate feature flags with bun:bundle feature() ([1f47f5e](https://github.com/kaltdev/kaltcode/commit/1f47f5e7a6f6e39cf4b89250036604e2d4789825))
* **build:** gate feature flags with bun:bundle feature() ([#10](https://github.com/kaltdev/kaltcode/issues/10)) ([44dc05e](https://github.com/kaltdev/kaltcode/commit/44dc05ec44105e6142f8dfbf426eae1ead00b8d9))
* **test:** Add shared lock and config-dir tests ([8fc2669](https://github.com/kaltdev/kaltcode/commit/8fc2669c559edc9a0c7f02e18488b1426dc799b5))


### Bug Fixes

* **api:** Surface in-stream errors and truncation ([b70efb1](https://github.com/kaltdev/kaltcode/commit/b70efb153d414172e5a5e2964e1088aee3713528))

## [0.11.0](https://github.com/kaltdev/kaltcode/compare/0.10.0...v0.11.0) (2026-05-14)


### Features

* Add initial project files ([e009776](https://github.com/kaltdev/kaltcode/commit/e0097769df69ff521b56d47ce35d957647c429b7))
* add knowledge graph storage providers and improve test isolation ([180de3c](https://github.com/kaltdev/kaltcode/commit/180de3cc2932df76efc21d413b51c02ae5dea7f1))
* add knowledge graph storage providers and improve test isolation ([#6](https://github.com/kaltdev/kaltcode/issues/6)) ([180de3c](https://github.com/kaltdev/kaltcode/commit/180de3cc2932df76efc21d413b51c02ae5dea7f1))
* clean up timeout abort signal ([#7](https://github.com/kaltdev/kaltcode/issues/7)) ([2c496ff](https://github.com/kaltdev/kaltcode/commit/2c496ff395db74d74b6646e40e2b1871dd5f292c))
* **commands:** Add isCommand type guard and filter invalid entries ([13b1962](https://github.com/kaltdev/kaltcode/commit/13b1962d4fa82071538db56be91cc182742ae7c2))
* **groq:** Discover and filter Groq models ([735f85a](https://github.com/kaltdev/kaltcode/commit/735f85aa5b5470a22fcc29bf7839f9fe6522bab7))
* **nvidia:** Add new NIM model options ([21dda81](https://github.com/kaltdev/kaltcode/commit/21dda8138a81c419b3e3bc67f8cdd62472c88aa1))
* **provider:** add free KaltCode Opengateway as default fallback ([e3e5ba3](https://github.com/kaltdev/kaltcode/commit/e3e5ba3f750bfd63795162ae042535cb4f6efac1))
* **provider:** Add Xiaomi MiMo support ([8cc74f0](https://github.com/kaltdev/kaltcode/commit/8cc74f02ae5e776f76fbc68088945b9e63477712))
* **provider:** Streamline preset setup flow ([1c7aabe](https://github.com/kaltdev/kaltcode/commit/1c7aabe4330cd7d85db314b99f4b1f32483671bf))


### Bug Fixes

* **abort:** Clean up timeout abort signals ([0912226](https://github.com/kaltdev/kaltcode/commit/09122268112052d5c2822d0e60afcf7c89c9aed1))
* Add type annotations and format with consistent style ([df6e39d](https://github.com/kaltdev/kaltcode/commit/df6e39d8694179eb75abc8c92871682673ff02ee))
* **agent:** prevent mid-flight peeking and taking over of forks ([6809d3d](https://github.com/kaltdev/kaltcode/commit/6809d3df3abeb63141f38150b8aaee839c5d59d9))
* **api:** Hint re-auth for expired OAuth tokens ([994f0a8](https://github.com/kaltdev/kaltcode/commit/994f0a854ee713f016f9067631eb57dc2f7720e6))
* **api:** Redact URLs in fetch errors ([a7e22d6](https://github.com/kaltdev/kaltcode/commit/a7e22d6f14a39a1001bcd0d9f5e3058076e124d9))
* **codex:** infer type for untyped MCP tool schemas ([f7bd90f](https://github.com/kaltdev/kaltcode/commit/f7bd90f99e13cb4e9fdc3850c1d4e1319acd648e))
* **gpt:** Lower GPT-5.5 context window for Codex ([5eb414a](https://github.com/kaltdev/kaltcode/commit/5eb414aaae97240e27c1b14b8dc8ce61b95ecb4b))
* **pr:** Increase git diff output buffer ([4280cbe](https://github.com/kaltdev/kaltcode/commit/4280cbeafa9a79439b1e5cbb8358126884723b56))
* rename internal executable identifiers ([ff8e0fa](https://github.com/kaltdev/kaltcode/commit/ff8e0faf3cf3919b85eeb434bb472e7bf2058f62))
* repair broken branding identifiers ([f3d9928](https://github.com/kaltdev/kaltcode/commit/f3d99288414ef26d8d2f7a5653e57149b8adeb03))
* **utils:** Clean up combined abort signal handling ([1ae2cbd](https://github.com/kaltdev/kaltcode/commit/1ae2cbdb91cd06378df1d34acd9ac2eee128660b))

## [0.10.0](https://github.com/kaltdev/kaltcode/compare/v0.9.2...v0.10.0) (2026-05-12)


### Features

* **providers:** add Venice as a first-class provider with dedicated route detection and `getAPIProvider()` support
* **plugins:** symlink boundary enforcement for skill directories — skills resolving outside the plugin root are now correctly filtered
* **security:** heredoc substitution hardening — nested heredoc blocks are detected and rejected to prevent shell injection


### Bug Fixes

* **plugins:** add missing `resolveExistingPluginComponentPath` import in skill loader, fixing empty skill lists for inline plugins
* **providers:** fix `getAPIProvider()` returning `"openai"` instead of `"venice"` when Venice route is active
* **security:** `stripSafeHeredocSubstitutions()` now returns `null` for nested heredoc patterns instead of incorrectly stripping them
* **integrations:** regenerate stale integration artifacts to match current vendor/gateway descriptors


## [0.9.2](https://github.com/Gitlawb/openclaude/compare/v0.9.1...v0.9.2) (2026-05-06)


### Bug Fixes

* **cli:** replace createRequire with static import for teammate.js ([#1026](https://github.com/Gitlawb/openclaude/issues/1026)) ([#1033](https://github.com/Gitlawb/openclaude/issues/1033)) ([c873725](https://github.com/Gitlawb/openclaude/commit/c873725d901c9fd612140603da964894ef69e510))

## [0.9.1](https://github.com/Gitlawb/openclaude/compare/v0.9.0...v0.9.1) (2026-05-05)


### Bug Fixes

* **theme:** remove stale memo wrappers from theme context hooks ([#534](https://github.com/Gitlawb/openclaude/issues/534)) ([094f04c](https://github.com/Gitlawb/openclaude/commit/094f04c8036200eb3c51b7b7b4ec3c75ee83b3a0))

## [0.9.0](https://github.com/Gitlawb/openclaude/compare/v0.8.0...v0.9.0) (2026-05-05)


### Features

* context partitioning and relevance-based pruning ([#849](https://github.com/Gitlawb/openclaude/issues/849)) ([ca676af](https://github.com/Gitlawb/openclaude/commit/ca676affc47dca7f2a65fa867410931e27ae4969))
* rework release notes around GitHub releases ([#981](https://github.com/Gitlawb/openclaude/issues/981)) ([d948769](https://github.com/Gitlawb/openclaude/commit/d948769dd59c5533fa9769c0f16de783010b4620))
* SDK Runtime — Query Engine, Sessions, and Build Pipeline ([#984](https://github.com/Gitlawb/openclaude/issues/984)) ([60c76b6](https://github.com/Gitlawb/openclaude/commit/60c76b6599f691781ad5ae7dfeb6e4029b679d0a))
* support self-hosted Firecrawl via FIRECRAWL_API_URL ([#949](https://github.com/Gitlawb/openclaude/issues/949)) ([a133e76](https://github.com/Gitlawb/openclaude/commit/a133e7631a7c0b6eeb624d60567147cab1257ff0))


### Bug Fixes

* **groq:** strip unsupported store field ([#983](https://github.com/Gitlawb/openclaude/issues/983)) ([6d0953a](https://github.com/Gitlawb/openclaude/commit/6d0953a79cb435b17ed231019fa0b660b770c914))
* **mcp:** allow third-party providers to approve project-scope .mcp.json servers ([#696](https://github.com/Gitlawb/openclaude/issues/696)) ([#937](https://github.com/Gitlawb/openclaude/issues/937)) ([dc3c065](https://github.com/Gitlawb/openclaude/commit/dc3c065c4a70663978f965d50846ba6a0692e59d))
* **shims:** strip x-anthropic-billing-header block before forwarding system prompt ([#1019](https://github.com/Gitlawb/openclaude/issues/1019)) ([40ae1e7](https://github.com/Gitlawb/openclaude/commit/40ae1e720034f00912762d5e723903d3170bc396))
* **startup:** make CLAUDE logo D distinct ([#986](https://github.com/Gitlawb/openclaude/issues/986)) ([35f86a9](https://github.com/Gitlawb/openclaude/commit/35f86a9580aedd3f359dfc13992e49f2ec53757e))
* **tests:** resolve flakiness due to module leak and env state leakage ([#988](https://github.com/Gitlawb/openclaude/issues/988)) ([990a5a2](https://github.com/Gitlawb/openclaude/commit/990a5a2afbb22b8f9274328783a6adbda1a3b62c))
* **web-search:** surface diagnostic when adapter returns 0 hits and no native fallback ([#1006](https://github.com/Gitlawb/openclaude/issues/1006)) ([1c74675](https://github.com/Gitlawb/openclaude/commit/1c746750f67d576b8272ba985b65c9c4406bdbc9))

## [0.8.0](https://github.com/Gitlawb/openclaude/compare/v0.7.0...v0.8.0) (2026-05-02)


### Features

* add Opus 4.7 as default model and fix alias/thinking bugs ([#928](https://github.com/Gitlawb/openclaude/issues/928)) ([4c93a9f](https://github.com/Gitlawb/openclaude/commit/4c93a9f9f168217d4bdd53d103337e43f28be074))
* add streaming token counter ([#797](https://github.com/Gitlawb/openclaude/issues/797)) ([0ca4333](https://github.com/Gitlawb/openclaude/commit/0ca43335375beec6e58711b797d5b0c4bb5019b8))
* **api:** deterministic request-body serialization via stableStringify ([#882](https://github.com/Gitlawb/openclaude/issues/882)) ([6ea3eb6](https://github.com/Gitlawb/openclaude/commit/6ea3eb64830ccfec1436bcebe2406158e14a7e81))
* **cli:** improve SSH interactivity detection via SSH_TTY and SSH_CONNECTION ([#946](https://github.com/Gitlawb/openclaude/issues/946)) ([aae96aa](https://github.com/Gitlawb/openclaude/commit/aae96aa52a1241661116d62aac884ddeafd7835b))
* context preloading and hybrid context strategy ([#860](https://github.com/Gitlawb/openclaude/issues/860)) ([92d297e](https://github.com/Gitlawb/openclaude/commit/92d297e50efcc7225f57f0d3cb0ba989dc40d624))
* **lsp:** add first-class code intelligence setup ([#950](https://github.com/Gitlawb/openclaude/issues/950)) ([677d29f](https://github.com/Gitlawb/openclaude/commit/677d29ffd42410710150f1eb8942190c8d317fe0))
* SDK Core — Permission System, Async Context, and Engine Extensions ([#951](https://github.com/Gitlawb/openclaude/issues/951)) ([a46b31c](https://github.com/Gitlawb/openclaude/commit/a46b31c3ec1840a712b9ad2cdd4f9d0f359544c9))
* SDK Foundation — Type Declarations, Errors, and Utilities ([#866](https://github.com/Gitlawb/openclaude/issues/866)) ([91f93ce](https://github.com/Gitlawb/openclaude/commit/91f93ce61533a9cadd1d107e09a442451c09f5db))


### Bug Fixes

* avoid legacy Windows PasswordVault reads by default ([#941](https://github.com/Gitlawb/openclaude/issues/941)) ([d321c8f](https://github.com/Gitlawb/openclaude/commit/d321c8fc6a0be6731c1ccfec0fca8023b1a8b67e))
* **errors:** show actual host in 404 message instead of Ollama hint ([#926](https://github.com/Gitlawb/openclaude/issues/926)) ([#931](https://github.com/Gitlawb/openclaude/issues/931)) ([4fab8b9](https://github.com/Gitlawb/openclaude/commit/4fab8b913f8b5301b98eb8dcf42dd75f095a3c60))
* **input:** strip leading ! when entering bash mode ([#947](https://github.com/Gitlawb/openclaude/issues/947)) ([5943c5c](https://github.com/Gitlawb/openclaude/commit/5943c5c269cdeba45879dac0d8da0082e28cc2a2)), closes [#662](https://github.com/Gitlawb/openclaude/issues/662)
* **oauth:** skip refresh for third-party providers ([#955](https://github.com/Gitlawb/openclaude/issues/955)) ([208c896](https://github.com/Gitlawb/openclaude/commit/208c896c07b878e2859fbae7e0f31697d59943ce))
* **openai-shim:** don't label transport failures as HTTP 503 ([#971](https://github.com/Gitlawb/openclaude/issues/971)) ([#975](https://github.com/Gitlawb/openclaude/issues/975)) ([cc0dab6](https://github.com/Gitlawb/openclaude/commit/cc0dab60a3721921f949165b93c8c997b1aae4a2))
* **openai-shim:** strip `store` when baseUrl points at Gemini ([#959](https://github.com/Gitlawb/openclaude/issues/959)) ([0f0fd26](https://github.com/Gitlawb/openclaude/commit/0f0fd266dbe9363b0ea1db29d8c10ed0b9b18413)), closes [#664](https://github.com/Gitlawb/openclaude/issues/664)
* **plugins:** sanitize env before spawning git so /plugin marketplace add works ([#751](https://github.com/Gitlawb/openclaude/issues/751)) ([#934](https://github.com/Gitlawb/openclaude/issues/934)) ([5c4fdca](https://github.com/Gitlawb/openclaude/commit/5c4fdca21743f82071d0ee22534d61c9ad677efe))
* **provider:** apply Codex OAuth session switch correctly ([#974](https://github.com/Gitlawb/openclaude/issues/974)) ([95a817f](https://github.com/Gitlawb/openclaude/commit/95a817fdb08a97b6293c6c7f87457bcd98283714))
* **ripgrep:** use @vscode/ripgrep package as the builtin source ([#911](https://github.com/Gitlawb/openclaude/issues/911)) ([#932](https://github.com/Gitlawb/openclaude/issues/932)) ([ee0d930](https://github.com/Gitlawb/openclaude/commit/ee0d9300939db0c6178bfad4707a0be45f126d1f))
* **typecheck:** make `bun run typecheck` actionable on main ([#473](https://github.com/Gitlawb/openclaude/issues/473)) ([#938](https://github.com/Gitlawb/openclaude/issues/938)) ([8106880](https://github.com/Gitlawb/openclaude/commit/8106880855ee0bb4b5bbca8827cfe97fe99558b8))
* **worktree:** surface git stderr in rev-parse failure message ([#690](https://github.com/Gitlawb/openclaude/issues/690)) ([#954](https://github.com/Gitlawb/openclaude/issues/954)) ([7711dda](https://github.com/Gitlawb/openclaude/commit/7711ddae4807332526ea128c0246b479d5c0ed00))

## [0.7.0](https://github.com/Gitlawb/openclaude/compare/v0.6.0...v0.7.0) (2026-04-26)


### Features

* add model-specific tokenizers and compression ratio detection ([#799](https://github.com/Gitlawb/openclaude/issues/799)) ([e92e527](https://github.com/Gitlawb/openclaude/commit/e92e5274b223d935d380b1fbd234cb631ab03211))
* add OPENCLAUDE_DISABLE_TOOL_REMINDERS env var to suppress hidden tool-output reminders ([#837](https://github.com/Gitlawb/openclaude/issues/837)) ([28de94d](https://github.com/Gitlawb/openclaude/commit/28de94df5dcd7718cb334e2e793e9472f5b291c5)), closes [#809](https://github.com/Gitlawb/openclaude/issues/809)
* add streaming optimizer and structured request logging ([#703](https://github.com/Gitlawb/openclaude/issues/703)) ([5b9cd21](https://github.com/Gitlawb/openclaude/commit/5b9cd21e373823a77fd552d6e02f5d4b68ae06b1))
* add xAI as official provider ([#865](https://github.com/Gitlawb/openclaude/issues/865)) ([2586a9c](https://github.com/Gitlawb/openclaude/commit/2586a9cddbd2512826bca81cb5deb3ec97f00f0f))
* **api:** expose cache metrics in REPL + normalize across providers ([#813](https://github.com/Gitlawb/openclaude/issues/813)) ([9e23c2b](https://github.com/Gitlawb/openclaude/commit/9e23c2bec43697187762601db5b1585c9b0fb1a3))
* implement Hook Chains runtime integration for self-healing agent mesh MVP ([#711](https://github.com/Gitlawb/openclaude/issues/711)) ([44a2c30](https://github.com/Gitlawb/openclaude/commit/44a2c30d5f9b98027e454466c680360f6b4625fc))
* **memory:** implement persistent project-level Knowledge Graph and RAG ([#899](https://github.com/Gitlawb/openclaude/issues/899)) ([29f7579](https://github.com/Gitlawb/openclaude/commit/29f757937732be0f8cca2bc0627a27eeafc2a992))
* **minimax:** add /usage support and fix MiniMax quota parsing ([#869](https://github.com/Gitlawb/openclaude/issues/869)) ([26413f6](https://github.com/Gitlawb/openclaude/commit/26413f6d307928a4f14c9c61c9860a28f8d81358))
* **model:** add GPT-5.5 support for Codex provider ([#880](https://github.com/Gitlawb/openclaude/issues/880)) ([038f715](https://github.com/Gitlawb/openclaude/commit/038f715b7ab9714340bda421b73a86d8590cf531))
* **tools:** resilient web search and fetch across all providers ([#836](https://github.com/Gitlawb/openclaude/issues/836)) ([531e3f1](https://github.com/Gitlawb/openclaude/commit/531e3f10592a73d81f26675c2479d46a3d5b55f5))
* **zai:** add Z.AI GLM Coding Plan provider preset ([#896](https://github.com/Gitlawb/openclaude/issues/896)) ([a0d657e](https://github.com/Gitlawb/openclaude/commit/a0d657ee188f52f8a4ceaad1658c81343a32fdad))


### Bug Fixes

* **agent:** provider-aware fallback for haiku/sonnet aliases ([#908](https://github.com/Gitlawb/openclaude/issues/908)) ([a3e728a](https://github.com/Gitlawb/openclaude/commit/a3e728a114f6379b80daefc8abcac17a752c5f96))
* bugs ([#885](https://github.com/Gitlawb/openclaude/issues/885)) ([c6c5f06](https://github.com/Gitlawb/openclaude/commit/c6c5f0608cf6509b412b121954547d72b3f3a411))
* make OpenAI fallback context window configurable + support external model lookup ([#861](https://github.com/Gitlawb/openclaude/issues/861)) ([b750e9e](https://github.com/Gitlawb/openclaude/commit/b750e9e97d15926d094d435772b2d6d12e5e545c))
* **mcp:** disable MCP_SKILLS feature flag — source not mirrored ([#872](https://github.com/Gitlawb/openclaude/issues/872)) ([dcbe295](https://github.com/Gitlawb/openclaude/commit/dcbe29558ab9c74d335b138488005a6509aa906a))
* normalize /provider multi-model selection and semicolon parsing ([#841](https://github.com/Gitlawb/openclaude/issues/841)) ([c4cb98a](https://github.com/Gitlawb/openclaude/commit/c4cb98a4f092062da02a4728cf59fed0fc3a6d3f))
* **openai-shim:** echo reasoning_content on assistant tool-call messages for Moonshot ([#828](https://github.com/Gitlawb/openclaude/issues/828)) ([67de6bd](https://github.com/Gitlawb/openclaude/commit/67de6bd2cffc3381f0f28fd3ffce043970611667))
* **query:** restore system prompt structure and add missing config import ([#907](https://github.com/Gitlawb/openclaude/issues/907)) ([818689b](https://github.com/Gitlawb/openclaude/commit/818689b2ee71cb6966cb4dc5a5ebd90fd22b0fcb))
* **shell:** recover when CWD path was replaced by a non-directory ([#871](https://github.com/Gitlawb/openclaude/issues/871)) ([a4c6757](https://github.com/Gitlawb/openclaude/commit/a4c67570238794317d049a225396672b465fdbfc))
* **startup:** show --model flag override on startup screen ([#898](https://github.com/Gitlawb/openclaude/issues/898)) ([d45628c](https://github.com/Gitlawb/openclaude/commit/d45628c41300b83b466e6a97983099615a50e7d7))
* **startup:** url authoritative over model name in banner provider detect ([#864](https://github.com/Gitlawb/openclaude/issues/864)) ([e346b8d](https://github.com/Gitlawb/openclaude/commit/e346b8d5ec2d58a4e8db337918d52d844ee52766)), closes [#855](https://github.com/Gitlawb/openclaude/issues/855)
* surface actionable error when DuckDuckGo web search is rate-limited ([#834](https://github.com/Gitlawb/openclaude/issues/834)) ([3c4d843](https://github.com/Gitlawb/openclaude/commit/3c4d8435c42e1ee04f9defd31c4c589017f524c5))
* **test:** add missing teammate exports to hookChains integration mock ([#840](https://github.com/Gitlawb/openclaude/issues/840)) ([23e8cfb](https://github.com/Gitlawb/openclaude/commit/23e8cfbd5b22179684276bef4131e26b830ce69c)), closes [#839](https://github.com/Gitlawb/openclaude/issues/839)
* **update:** show real package version and give actionable guidance ([#870](https://github.com/Gitlawb/openclaude/issues/870)) ([6e58b81](https://github.com/Gitlawb/openclaude/commit/6e58b819370128b923dda4fcc774bb556f4b951a))

## [0.6.0](https://github.com/Gitlawb/openclaude/compare/v0.5.2...v0.6.0) (2026-04-22)


### Features

* add model caching and benchmarking utilities ([#671](https://github.com/Gitlawb/openclaude/issues/671)) ([2b15e16](https://github.com/Gitlawb/openclaude/commit/2b15e16421f793f954a92c53933a07094544b29d))
* add thinking token extraction ([#798](https://github.com/Gitlawb/openclaude/issues/798)) ([268c039](https://github.com/Gitlawb/openclaude/commit/268c0398e4bf1ab898069c61500a2b3c226a0322))
* **api:** compress old tool_result content for small-context providers ([#801](https://github.com/Gitlawb/openclaude/issues/801)) ([a6a3de5](https://github.com/Gitlawb/openclaude/commit/a6a3de5ac155fe9d00befbfcab98d439314effd8))
* **api:** improve local provider reliability with readiness and self-healing ([#738](https://github.com/Gitlawb/openclaude/issues/738)) ([4cb963e](https://github.com/Gitlawb/openclaude/commit/4cb963e660dbd6ee438c04042700db05a9d32c59))
* **api:** smart model routing primitive (cheap-for-simple, strong-for-hard) ([#785](https://github.com/Gitlawb/openclaude/issues/785)) ([e908864](https://github.com/Gitlawb/openclaude/commit/e908864da7e7c987a98053ac5d18d702e192db2b))
* enable 15 additional feature flags in open build ([#667](https://github.com/Gitlawb/openclaude/issues/667)) ([6a62e3f](https://github.com/Gitlawb/openclaude/commit/6a62e3ff76ba9ba446b8e20cf2bb139ee76a9387))
* native Anthropic API mode for Claude models on GitHub Copilot ([#579](https://github.com/Gitlawb/openclaude/issues/579)) ([fdef4a1](https://github.com/Gitlawb/openclaude/commit/fdef4a1b4ce218ded4937ca83b30acce7c726472))
* **provider:** expose Atomic Chat in /provider picker with autodetect ([#810](https://github.com/Gitlawb/openclaude/issues/810)) ([ee19159](https://github.com/Gitlawb/openclaude/commit/ee19159c17b3de3b4a8b4a4541a6569f4261d54e))
* **provider:** zero-config autodetection primitive ([#784](https://github.com/Gitlawb/openclaude/issues/784)) ([a5bfcbb](https://github.com/Gitlawb/openclaude/commit/a5bfcbbadf8e9a1fd42f3e103d295524b8da64b0))


### Bug Fixes

* **api:** ensure strict role sequence and filter empty assistant messages after interruption ([#745](https://github.com/Gitlawb/openclaude/issues/745) regression) ([#794](https://github.com/Gitlawb/openclaude/issues/794)) ([06e7684](https://github.com/Gitlawb/openclaude/commit/06e7684eb56df8e694ac784575e163641931c44c))
* Collapse all-text arrays to string for DeepSeek compatibility ([#806](https://github.com/Gitlawb/openclaude/issues/806)) ([761924d](https://github.com/Gitlawb/openclaude/commit/761924daa7e225fe8acf41651408c7cae639a511))
* **model:** codex/nvidia-nim/minimax now read OPENAI_MODEL env ([#815](https://github.com/Gitlawb/openclaude/issues/815)) ([4581208](https://github.com/Gitlawb/openclaude/commit/458120889f6ce54cc9f0b287461d5e38eae48a20))
* **provider:** saved profile ignored when stale CLAUDE_CODE_USE_* in shell ([#807](https://github.com/Gitlawb/openclaude/issues/807)) ([13de4e8](https://github.com/Gitlawb/openclaude/commit/13de4e85df7f5fadc8cd15a76076374dc112360b))
* rename .claude.json to .openclaude.json with legacy fallback ([#582](https://github.com/Gitlawb/openclaude/issues/582)) ([4d4fb28](https://github.com/Gitlawb/openclaude/commit/4d4fb2880e4d0e3a62d8715e1ec13d932e736279))
* replace discontinued gemini-2.5-pro-preview-03-25 with stable gemini-2.5-pro ([#802](https://github.com/Gitlawb/openclaude/issues/802)) ([64582c1](https://github.com/Gitlawb/openclaude/commit/64582c119d5d0278195271379da4a68d59a89c1f)), closes [#398](https://github.com/Gitlawb/openclaude/issues/398)
* **security:** harden project settings trust boundary + MCP sanitization ([#789](https://github.com/Gitlawb/openclaude/issues/789)) ([ae3b723](https://github.com/Gitlawb/openclaude/commit/ae3b723f3b297b49925cada4728f3174aee8bf12))
* **test:** autoCompact floor assertion is flag-sensitive ([#816](https://github.com/Gitlawb/openclaude/issues/816)) ([c13842e](https://github.com/Gitlawb/openclaude/commit/c13842e91c7227246520955de6ae0636b30def9a))
* **ui:** prevent provider manager lag by deferring sync I/O ([#803](https://github.com/Gitlawb/openclaude/issues/803)) ([85eab27](https://github.com/Gitlawb/openclaude/commit/85eab2751e7d351bb0ed6a3fe0e15461d241c9cb))

## [0.5.2](https://github.com/Gitlawb/openclaude/compare/v0.5.1...v0.5.2) (2026-04-20)


### Bug Fixes

* **api:** replace phrase-based reasoning sanitizer with tag-based filter ([#779](https://github.com/Gitlawb/openclaude/issues/779)) ([336ddcc](https://github.com/Gitlawb/openclaude/commit/336ddcc50d59d79ebff50993f2673652aecb0d7d))

## [0.5.1](https://github.com/Gitlawb/openclaude/compare/v0.5.0...v0.5.1) (2026-04-20)


### Bug Fixes

* enforce Bash path constraints after sandbox allow ([#777](https://github.com/Gitlawb/openclaude/issues/777)) ([7002cb3](https://github.com/Gitlawb/openclaude/commit/7002cb302b78ea2a19da3f26226de24e2903fa1d))
* enforce MCP OAuth callback state before errors ([#775](https://github.com/Gitlawb/openclaude/issues/775)) ([739b8d1](https://github.com/Gitlawb/openclaude/commit/739b8d1f40fde0e401a5cbd2b9a55d88bd5124ad))
* require trusted approval for sandbox override ([#778](https://github.com/Gitlawb/openclaude/issues/778)) ([aab4890](https://github.com/Gitlawb/openclaude/commit/aab489055c53dd64369414116fe93226d2656273))

## [0.5.0](https://github.com/Gitlawb/openclaude/compare/v0.4.0...v0.5.0) (2026-04-20)


### Features

* add OPENCLAUDE_DISABLE_STRICT_TOOLS env var to opt out of strict MCP tool schema normalization ([#770](https://github.com/Gitlawb/openclaude/issues/770)) ([e6e8d9a](https://github.com/Gitlawb/openclaude/commit/e6e8d9a24897e4c9ef08b72df20fabbf8ef27f38))
* mask provider api key input ([#772](https://github.com/Gitlawb/openclaude/issues/772)) ([13e9f22](https://github.com/Gitlawb/openclaude/commit/13e9f22a83a2b0f85f557b1e12c9442ba61241e4))


### Bug Fixes

* allow provider recovery during startup ([#765](https://github.com/Gitlawb/openclaude/issues/765)) ([f828171](https://github.com/Gitlawb/openclaude/commit/f828171ef1ab94e2acf73a28a292799e4e26cc0d))
* **api:** drop orphan tool results to satisfy strict role sequence ([#745](https://github.com/Gitlawb/openclaude/issues/745)) ([b786b76](https://github.com/Gitlawb/openclaude/commit/b786b765f01f392652eaf28ed3579a96b7260a53))
* **help:** prevent /help tab crash from undefined descriptions ([#732](https://github.com/Gitlawb/openclaude/issues/732)) ([3d1979f](https://github.com/Gitlawb/openclaude/commit/3d1979ff066db32415e0c8321af916d81f5f2621))
* **mcp:** sync required array with properties in tool schemas ([#754](https://github.com/Gitlawb/openclaude/issues/754)) ([002a8f1](https://github.com/Gitlawb/openclaude/commit/002a8f1f6de2fcfc917165d828501d3047bad61f))
* remove cached mcpClient in diagnostic tracking to prevent stale references ([#727](https://github.com/Gitlawb/openclaude/issues/727)) ([2c98be7](https://github.com/Gitlawb/openclaude/commit/2c98be700274a4241963b5f43530bf3bd8f8963f))
* use raw context window for auto-compact percentage display ([#748](https://github.com/Gitlawb/openclaude/issues/748)) ([55c5f26](https://github.com/Gitlawb/openclaude/commit/55c5f262a9a5a8be0aa9ae8dc6c7dafc465eb2c6))

## [0.4.0](https://github.com/Gitlawb/openclaude/compare/v0.3.0...v0.4.0) (2026-04-17)


### Features

* add Alibaba Coding Plan (DashScope) provider support ([#509](https://github.com/Gitlawb/openclaude/issues/509)) ([43ac6db](https://github.com/Gitlawb/openclaude/commit/43ac6dba75537282da1e2ad8f855082bc4e25f1e))
* add NVIDIA NIM and MiniMax provider support ([#552](https://github.com/Gitlawb/openclaude/issues/552)) ([51191d6](https://github.com/Gitlawb/openclaude/commit/51191d61326e1f8319d70b3a3c0d9229e185a564))
* add ripgrep to Dockerfile for faster file searching ([#688](https://github.com/Gitlawb/openclaude/issues/688)) ([12dd375](https://github.com/Gitlawb/openclaude/commit/12dd3755c619cc27af3b151ae8fdb9d425a7b9a2))
* **api:** classify openai-compatible provider failures ([#708](https://github.com/Gitlawb/openclaude/issues/708)) ([80a00ac](https://github.com/Gitlawb/openclaude/commit/80a00acc2c6dc4657a78de7366f7a9ebc920bfbb))
* **vscode:** add full chat interface to OpenClaude extension ([#608](https://github.com/Gitlawb/openclaude/issues/608)) ([fbcd928](https://github.com/Gitlawb/openclaude/commit/fbcd928f7f8511da795aea3ad318bddf0ab9a1a7))


### Bug Fixes

* focus "Done" option after completing provider manager actions ([#718](https://github.com/Gitlawb/openclaude/issues/718)) ([d6f5130](https://github.com/Gitlawb/openclaude/commit/d6f5130c204d8ffe582212466768706cd7fd6774))
* **models:** prevent /models crash from non-string saved model values ([#691](https://github.com/Gitlawb/openclaude/issues/691)) ([6b2121d](https://github.com/Gitlawb/openclaude/commit/6b2121da12189fa7ce1f33394d18abd24cf8a01b))
* prevent crash in commands tab when description is undefined ([#730](https://github.com/Gitlawb/openclaude/issues/730)) ([eed77e6](https://github.com/Gitlawb/openclaude/commit/eed77e6579866a98384dcc948a0ad6406614ede3))
* strip comments before scanning for missing imports ([#676](https://github.com/Gitlawb/openclaude/issues/676)) ([a00b792](https://github.com/Gitlawb/openclaude/commit/a00b7928de9662ffb7ef6abd8cd040afe6f4f122))
* **ui:** show correct endpoint URL in intro screen for custom Anthropic endpoints ([#735](https://github.com/Gitlawb/openclaude/issues/735)) ([3424663](https://github.com/Gitlawb/openclaude/commit/34246635fb9a09499047a52e7f96ca9b36c8a85a))

## [0.3.0](https://github.com/Gitlawb/openclaude/compare/v0.2.3...v0.3.0) (2026-04-14)


### Features

* activate coordinator mode in open build ([#647](https://github.com/Gitlawb/openclaude/issues/647)) ([99a1714](https://github.com/Gitlawb/openclaude/commit/99a17144ee285b892a0801acb6abcc9af68879af))
* activate local-only team memory in open build ([#648](https://github.com/Gitlawb/openclaude/issues/648)) ([24d485f](https://github.com/Gitlawb/openclaude/commit/24d485f42f5b1405d2fab13f2f497d5edd3b5300))
* activate message actions in open build ([#632](https://github.com/Gitlawb/openclaude/issues/632)) ([252808b](https://github.com/Gitlawb/openclaude/commit/252808bbd0a12a6ccf97e2cb09752a0212ea3acd))
* add allowBypassPermissionsMode setting ([#658](https://github.com/Gitlawb/openclaude/issues/658)) ([31be66d](https://github.com/Gitlawb/openclaude/commit/31be66d7645ea3473334c9ce89ea1a5095b8df6e))
* add Docker image build and push to GHCR on release ([#656](https://github.com/Gitlawb/openclaude/issues/656)) ([658d076](https://github.com/Gitlawb/openclaude/commit/658d076909e14eb0459bcb98aee9aa0472118265))
* implement /loop command with fixed and dynamic scheduling ([#621](https://github.com/Gitlawb/openclaude/issues/621)) ([64298a6](https://github.com/Gitlawb/openclaude/commit/64298a663f1391b16aa1f5a49e8a877e1d3742f2))
* implement Monitor tool for streaming shell output ([#649](https://github.com/Gitlawb/openclaude/issues/649)) ([b818dd5](https://github.com/Gitlawb/openclaude/commit/b818dd5958f4e8428566ce25a1a6be5fd4fe66f8))
* local feature flag overrides via ~/.claude/feature-flags.json ([#639](https://github.com/Gitlawb/openclaude/issues/639)) ([0e48884](https://github.com/Gitlawb/openclaude/commit/0e48884f56c6c008f047a7926d3b2cb924170625))
* open useful USER_TYPE-gated features to all users ([#644](https://github.com/Gitlawb/openclaude/issues/644)) ([c1beea9](https://github.com/Gitlawb/openclaude/commit/c1beea98676a413c54152a45a6b9fbe7fb9ed028))


### Bug Fixes

* bump axios 1.14.0 → 1.15.0 (Dependabot [#4](https://github.com/Gitlawb/openclaude/issues/4), [#5](https://github.com/Gitlawb/openclaude/issues/5)) ([#670](https://github.com/Gitlawb/openclaude/issues/670)) ([a07e5ef](https://github.com/Gitlawb/openclaude/commit/a07e5ef990a5ed01a72e83fdbd1fcab36f515a08))
* extend provider guard to protect anthropic profiles from cross-terminal override ([#641](https://github.com/Gitlawb/openclaude/issues/641)) ([03e0b06](https://github.com/Gitlawb/openclaude/commit/03e0b06e0784e4ea46945b3950840b10b6e3ca49))
* improve fetch diagnostics for bootstrap and session requests ([#646](https://github.com/Gitlawb/openclaude/issues/646)) ([df2b9f2](https://github.com/Gitlawb/openclaude/commit/df2b9f2b7b4c661ee3d9ed5dc58b3064de0599d1))
* **openai-shim:** preserve tool result images and local token caps ([#659](https://github.com/Gitlawb/openclaude/issues/659)) ([30c866d](https://github.com/Gitlawb/openclaude/commit/30c866d31ad8538496460667d86ed5efbd4a8547))
* replace broken bun:bundle shim with source pre-processing ([#657](https://github.com/Gitlawb/openclaude/issues/657)) ([adbe391](https://github.com/Gitlawb/openclaude/commit/adbe391e63721918b5d147f4f845111c1a3143db))
* resolve 12 bugs across API, MCP, agent tools, web search, and context overflow ([#674](https://github.com/Gitlawb/openclaude/issues/674)) ([25ce2ca](https://github.com/Gitlawb/openclaude/commit/25ce2ca7bff8937b0b79ad7f85c6dc1c68432069))
* route OpenAI Codex shortcuts to correct endpoint ([#566](https://github.com/Gitlawb/openclaude/issues/566)) ([7c8bdcc](https://github.com/Gitlawb/openclaude/commit/7c8bdcc3e2ac1ecb98286c705c85671044be3d6b))

## [0.2.3](https://github.com/Gitlawb/openclaude/compare/v0.2.2...v0.2.3) (2026-04-12)


### Bug Fixes

* prevent infinite auto-compact loop for unknown 3P models ([#635](https://github.com/Gitlawb/openclaude/issues/635)) ([#636](https://github.com/Gitlawb/openclaude/issues/636)) ([aeaa658](https://github.com/Gitlawb/openclaude/commit/aeaa658f776fb8df95721e8b8962385f8b00f66a))

## [0.2.2](https://github.com/Gitlawb/openclaude/compare/v0.2.1...v0.2.2) (2026-04-12)


### Bug Fixes

* **read/edit:** make compact line prefix unambiguous for tab-indented files ([#613](https://github.com/Gitlawb/openclaude/issues/613)) ([08cc6f3](https://github.com/Gitlawb/openclaude/commit/08cc6f328711cd93ce9fa53351266c29a0b0a341))

## [0.2.1](https://github.com/Gitlawb/openclaude/compare/v0.2.0...v0.2.1) (2026-04-12)


### Bug Fixes

* **provider:** add recovery guidance for missing OpenAI API key ([#616](https://github.com/Gitlawb/openclaude/issues/616)) ([9419e8a](https://github.com/Gitlawb/openclaude/commit/9419e8a4a21b3771d9ddb10f7072e0a8c5b5b631))

## [0.2.0](https://github.com/Gitlawb/openclaude/compare/v0.1.8...v0.2.0) (2026-04-12)


### Features

* add /cache-probe diagnostic command ([#580](https://github.com/Gitlawb/openclaude/issues/580)) ([9ccaa7a](https://github.com/Gitlawb/openclaude/commit/9ccaa7a6759b6991f4a566b4118c06e68a2398fe)), closes [#515](https://github.com/Gitlawb/openclaude/issues/515)
* add auto-fix service — auto-lint and test after AI file edits ([#508](https://github.com/Gitlawb/openclaude/issues/508)) ([c385047](https://github.com/Gitlawb/openclaude/commit/c385047abba4366866f4c87bfb5e0b0bd4dcbb9d))
* Add Gemini support with thought_signature fix  ([#404](https://github.com/Gitlawb/openclaude/issues/404)) ([5012c16](https://github.com/Gitlawb/openclaude/commit/5012c160c9a2dff9418e7ee19dc9a4d29ef2b024))
* add headless gRPC server for external agent integration ([#278](https://github.com/Gitlawb/openclaude/issues/278)) ([26eef92](https://github.com/Gitlawb/openclaude/commit/26eef92fe72e9c3958d61435b8d3571e12bf2b74))
* add wiki mvp commands ([#532](https://github.com/Gitlawb/openclaude/issues/532)) ([c328fdf](https://github.com/Gitlawb/openclaude/commit/c328fdf9e2fe59ad101b049301298ce9ff24caca))
* GitHub provider lifecycle and onboarding hardening ([#351](https://github.com/Gitlawb/openclaude/issues/351)) ([ff7d499](https://github.com/Gitlawb/openclaude/commit/ff7d49990de515825ddbe4099f3a39b944b61370))


### Bug Fixes

* add File polyfill for Node &lt; 20 to prevent startup deadlock with proxy ([#442](https://github.com/Gitlawb/openclaude/issues/442)) ([85aa8b0](https://github.com/Gitlawb/openclaude/commit/85aa8b0985c8f3cb8801efa5141114a0ab0f6a83))
* add GitHub Copilot model context windows and output limits ([#576](https://github.com/Gitlawb/openclaude/issues/576)) ([a7f5982](https://github.com/Gitlawb/openclaude/commit/a7f5982f6438ab0ddc3f0daae31ea68ac7ac206c)), closes [#515](https://github.com/Gitlawb/openclaude/issues/515)
* add LiteLLM-style aliases for GitHub Copilot context windows ([#606](https://github.com/Gitlawb/openclaude/issues/606)) ([2e0e14d](https://github.com/Gitlawb/openclaude/commit/2e0e14d71313e0e501efaa9e55c6c56f2742fb10))
* add store:false to Chat Completions and /responses fallback ([#578](https://github.com/Gitlawb/openclaude/issues/578)) ([8aaa4f2](https://github.com/Gitlawb/openclaude/commit/8aaa4f22ac5b942d82aa9cad54af30d56034515a))
* address code scanning alerts ([#434](https://github.com/Gitlawb/openclaude/issues/434)) ([e365cb4](https://github.com/Gitlawb/openclaude/commit/e365cb4010becabacd7cbccb4c3e59ea23a41e90))
* avoid sync github credential reads in provider manager ([#428](https://github.com/Gitlawb/openclaude/issues/428)) ([aff2bd8](https://github.com/Gitlawb/openclaude/commit/aff2bd87e4f2821992f74fb95481c505d0ba5d5d))
* convert dragged file paths to [@mentions](https://github.com/mentions) for attachment ([#382](https://github.com/Gitlawb/openclaude/issues/382)) ([112df59](https://github.com/Gitlawb/openclaude/commit/112df5911791ea71ee9efbb98ea59c5ded1ea161))
* custom web search — WEB_URL_TEMPLATE not recognized, timeout too short, silent native fallback ([#537](https://github.com/Gitlawb/openclaude/issues/537)) ([32fbd0c](https://github.com/Gitlawb/openclaude/commit/32fbd0c7b4168b32dcb13a5b69342e2727269201))
* defer startup checks and suppress recommendation dialogs during startup window (issue [#363](https://github.com/Gitlawb/openclaude/issues/363)) ([#504](https://github.com/Gitlawb/openclaude/issues/504)) ([2caf2fd](https://github.com/Gitlawb/openclaude/commit/2caf2fd982af1ec845c50152ad9d28d1a597f82f))
* display selected model in startup screen instead of hardcoded sonnet 4.6 ([#587](https://github.com/Gitlawb/openclaude/issues/587)) ([b126e38](https://github.com/Gitlawb/openclaude/commit/b126e38b1affddd2de83fcc3ba26f2e44b42a509))
* handle missing skill parameter in SkillTool ([#485](https://github.com/Gitlawb/openclaude/issues/485)) ([f9ce81b](https://github.com/Gitlawb/openclaude/commit/f9ce81bfb384e909353813fb6f6760cadd508ae7))
* include MCP tool results in microcompact to reduce token waste ([#348](https://github.com/Gitlawb/openclaude/issues/348)) ([52d33a8](https://github.com/Gitlawb/openclaude/commit/52d33a87a047b943aedaaaf772cd48636c263509))
* **ink:** restore host prop updates in React 19 reconciler ([#589](https://github.com/Gitlawb/openclaude/issues/589)) ([6e94dd9](https://github.com/Gitlawb/openclaude/commit/6e94dd913688b2d6433a9abe62a245c5f031b776))
* let saved provider profiles win on restart ([#513](https://github.com/Gitlawb/openclaude/issues/513)) ([cb8f8b7](https://github.com/Gitlawb/openclaude/commit/cb8f8b7ac2e3e74516ee219a3a48156db7c6ed78))
* normalize malformed Bash tool arguments from OpenAI-compatible providers ([#385](https://github.com/Gitlawb/openclaude/issues/385)) ([b4bd95b](https://github.com/Gitlawb/openclaude/commit/b4bd95b47715c9896240d708c106777507fd26ec))
* preserve only originally-required properties in strict tool schemas ([#471](https://github.com/Gitlawb/openclaude/issues/471)) ([ccaa193](https://github.com/Gitlawb/openclaude/commit/ccaa193eec5761f0972ffb58eb3189a81a9244b0))
* preserve unicode in Windows clipboard fallback ([#388](https://github.com/Gitlawb/openclaude/issues/388)) ([c193497](https://github.com/Gitlawb/openclaude/commit/c1934974aaf64db460cc850a044bd13cc744cce7))
* rebrand prompt identity to openclaude ([#496](https://github.com/Gitlawb/openclaude/issues/496)) ([598651f](https://github.com/Gitlawb/openclaude/commit/598651f42389ce76311ec00e8a9c701c939ead27))
* replace isDeepStrictEqual with navigation-aware options comparison ([#507](https://github.com/Gitlawb/openclaude/issues/507)) ([537c469](https://github.com/Gitlawb/openclaude/commit/537c469c3a2f7cb0eed05fa2f54dca57b6bc273f)), closes [#472](https://github.com/Gitlawb/openclaude/issues/472)
* report cache reads in streaming and correct cost calculation ([#577](https://github.com/Gitlawb/openclaude/issues/577)) ([f4ac709](https://github.com/Gitlawb/openclaude/commit/f4ac709fa6eda732bf45204fcab625ba6c5674b9))
* restore default context window for unknown 3p models ([#494](https://github.com/Gitlawb/openclaude/issues/494)) ([69ea1f1](https://github.com/Gitlawb/openclaude/commit/69ea1f1e4a99e9436215d8cb391a116a64442b94))
* restore Grep and Glob reliability on OpenAI paths ([#461](https://github.com/Gitlawb/openclaude/issues/461)) ([600c01f](https://github.com/Gitlawb/openclaude/commit/600c01faf761a080a2c7dede872ddbe05a132f23))
* restore Ollama auto-detect in first-run setup ([#561](https://github.com/Gitlawb/openclaude/issues/561)) ([68c2968](https://github.com/Gitlawb/openclaude/commit/68c296833dcef54ce44cb18b24357230b5204dbc))
* scrub canonical Anthropic headers from 3P shim requests ([#499](https://github.com/Gitlawb/openclaude/issues/499)) ([07621a6](https://github.com/Gitlawb/openclaude/commit/07621a6f8d0918170281869a47b5dbff90e71594))
* strip Anthropic params from 3P resume paths ([#479](https://github.com/Gitlawb/openclaude/issues/479)) ([4975cfc](https://github.com/Gitlawb/openclaude/commit/4975cfc2e0ddbe34aa4e8e3f52ee5eba07fbe465))
* suppress startup dialogs when input is buffered ([#423](https://github.com/Gitlawb/openclaude/issues/423)) ([8ece290](https://github.com/Gitlawb/openclaude/commit/8ece2900872dadd157e798ef501ddf126dac66c4))
* **tui:** restore prompt rendering on startup ([#498](https://github.com/Gitlawb/openclaude/issues/498)) ([e30ad17](https://github.com/Gitlawb/openclaude/commit/e30ad17ae0056787273be2caafd6cf5340b6ab57))
* update theme preview on focus change ([#562](https://github.com/Gitlawb/openclaude/issues/562)) ([6924718](https://github.com/Gitlawb/openclaude/commit/692471850fc789ee0797190089272407f9a4d953))
* **web-search:** close SSRF bypasses in custom provider hostname guard ([#610](https://github.com/Gitlawb/openclaude/issues/610)) ([a02c441](https://github.com/Gitlawb/openclaude/commit/a02c44143b257fbee7f38f1b93873cc0ea68a1f9))
* WebSearch providers + MCPTool bugs ([#593](https://github.com/Gitlawb/openclaude/issues/593)) ([91e4cfb](https://github.com/Gitlawb/openclaude/commit/91e4cfb15b62c04615834fd3c417fe38b4feb914))
