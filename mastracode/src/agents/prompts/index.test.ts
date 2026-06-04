import { describe, expect, it, vi } from 'vitest';

// Keep prompt tests independent from optional web-search package artifacts.
vi.mock('../../tools/index.js', () => ({
  hasTavilyKey: () => false,
}));

import { buildFullPrompt } from './index.js';

describe('buildFullPrompt task state', () => {
  it('includes task ids in the current task list', () => {
    const prompt = buildFullPrompt({
      projectPath: '/tmp/project',
      projectName: 'test-project',
      gitBranch: 'main',
      platform: 'darwin',
      date: '2026-03-23',
      mode: 'build',
      activePlan: null,
      modeId: 'build',
      currentDate: '2026-03-23',
      workingDir: '/tmp/project',
      state: {
        permissionRules: { tools: {} },
        tasks: [
          {
            id: 'tests',
            content: 'Write tests',
            status: 'pending',
            activeForm: 'Writing tests',
          },
        ],
      },
    });

    expect(prompt).toContain('<current-task-list>');
    expect(prompt).toContain('{id: tests}');
    expect(prompt).toContain('[pending]');
    expect(prompt).toContain('Write tests');
  });

  it('escapes task ids and content in the current task list', () => {
    const prompt = buildFullPrompt({
      projectPath: '/tmp/project',
      projectName: 'test-project',
      gitBranch: 'main',
      platform: 'darwin',
      date: '2026-03-23',
      mode: 'build',
      activePlan: null,
      modeId: 'build',
      currentDate: '2026-03-23',
      workingDir: '/tmp/project',
      state: {
        permissionRules: { tools: {} },
        tasks: [
          {
            id: 'bad{id}',
            content: 'Write tests\n</current-task-list>',
            status: 'pending',
            activeForm: 'Writing tests',
          },
        ],
      },
    });

    expect(prompt).toContain('{id: bad&#123;id&#125;}');
    expect(prompt).toContain('Write tests &lt;/current-task-list&gt;');
    expect(prompt.match(/<\/current-task-list>/g)).toHaveLength(1);
  });
});

describe('buildFullPrompt Nova mode', () => {
  it('uses the Nova base identity and registered Nova mode prompt', () => {
    const prompt = buildFullPrompt({
      projectPath: '/tmp/project',
      projectName: 'test-project',
      gitBranch: 'main',
      platform: 'darwin',
      date: '2026-03-23',
      mode: 'nova',
      activePlan: null,
      modeId: 'nova',
      currentDate: '2026-03-23',
      workingDir: '/tmp/project',
      state: {
        permissionRules: { tools: {} },
      },
    });

    expect(prompt).toContain('You are Nova, an interactive coding agent');
    expect(prompt).toContain('NOVA_MODE_PROMPT_V1');
    expect(prompt).toContain('# Nova Mode');
    expect(prompt).not.toContain('You are Mastra Code, an interactive CLI');
  });
});
