import { expect, test } from 'bun:test'
<<<<<<< HEAD
=======
import { z } from 'zod/v4'
import { getEmptyToolPermissionContext, type Tool, type Tools } from '../Tool.js'
import { SkillTool } from '../tools/SkillTool/SkillTool.js'
import { toolToAPISchema } from './api.js'
>>>>>>> upstream/main

test('api test file loads without entering Bun runtime crashes', () => {
  expect(true).toBe(true)
})

test('toolToAPISchema keeps skill required for SkillTool', async () => {
  const schema = await toolToAPISchema(SkillTool, {
    getToolPermissionContext: async () => getEmptyToolPermissionContext(),
    tools: [] as unknown as Tools,
    agents: [],
  })

  expect((schema as { input_schema: unknown }).input_schema).toMatchObject({
    type: 'object',
    required: ['skill'],
  })
})

test('toolToAPISchema removes extra required keys not in properties (MCP schema sanitization)', async () => {
  const schema = await toolToAPISchema(
    {
      name: 'mcp__test__create_object',
      inputSchema: z.strictObject({}),
      inputJSONSchema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name', 'attributes'],
      },
      prompt: async () => 'Create an object',
    } as unknown as Tool,
    {
      getToolPermissionContext: async () => getEmptyToolPermissionContext(),
      tools: [] as unknown as Tools,
      agents: [],
    },
  )

  const inputSchema = (schema as { input_schema: { required?: string[] } }).input_schema
  expect(inputSchema.required).toEqual(['name'])
})
