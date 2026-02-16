
import test, { after } from 'node:test';
import assert from 'node:assert';
import { getGeminiResponse } from './gemini.ts';

// Save original fetch
const originalFetch = global.fetch;

// Restore fetch after tests
after(() => {
  global.fetch = originalFetch;
});

test('getGeminiResponse handles successful response', async () => {
  const mockAgent = { name: 'Test Agent', role: 'Tester', division: 'QA', responsibilities: [] } as any;
  const mockHistory = [{ role: 'user', text: 'hello' }] as any;
  const mockResponse = { text: 'Hello there!', thought_process: 'Thinking...' };

  global.fetch = async () => ({
    ok: true,
    json: async () => mockResponse
  }) as any;

  const result = await getGeminiResponse(mockAgent, mockHistory);
  assert.deepStrictEqual(result, mockResponse);
});

test('getGeminiResponse handles non-ok JSON response', async () => {
  const mockAgent = {} as any;
  const mockHistory = [] as any;

  global.fetch = async () => ({
    ok: false,
    status: 500,
    json: async () => ({ error: 'Custom server error' })
  }) as any;

  await assert.rejects(
    () => getGeminiResponse(mockAgent, mockHistory),
    { message: 'Custom server error' }
  );
});

test('getGeminiResponse handles non-ok non-JSON response', async () => {
  const mockAgent = {} as any;
  const mockHistory = [] as any;

  global.fetch = async () => ({
    ok: false,
    status: 502,
    statusText: 'Bad Gateway',
    json: async () => { throw new Error('Unexpected token < in JSON at position 0'); }
  }) as any;

  await assert.rejects(
    () => getGeminiResponse(mockAgent, mockHistory),
    { message: 'HTTP error! status: 502 (Bad Gateway)' }
  );
});

test('getGeminiResponse handles invalid JSON in successful response', async () => {
  const mockAgent = {} as any;
  const mockHistory = [] as any;

  global.fetch = async () => ({
    ok: true,
    json: async () => { throw new Error('Invalid JSON'); }
  }) as any;

  await assert.rejects(
    () => getGeminiResponse(mockAgent, mockHistory),
    { message: 'Failed to parse response as JSON' }
  );
});

test('getGeminiResponse handles network failure', async () => {
  const mockAgent = {} as any;
  const mockHistory = [] as any;

  global.fetch = async () => {
    throw new Error('Network Error');
  };

  await assert.rejects(
    () => getGeminiResponse(mockAgent, mockHistory),
    { message: 'Network Error' }
  );
});
