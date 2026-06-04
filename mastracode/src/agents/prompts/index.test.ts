import { describe, expect, it, vi } from 'vitest';

// Keep prompt tests independent from optional web-search package artifacts.
vi.mock('../../tools/index.js', () => ({
  hasTavilyKey: () => false,
}));

import { buildFullPrompt } from './index.js';

describe('buildFullPrompt task state', () => {
  it('includes Nova operating model and workflow-oriented subagent rules', () => {
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

    expect(prompt).toContain('## Nova Operating Model');
    expect(prompt).toContain('investigate the real code path before editing');
    expect(prompt).toContain('Use subagents when delegation materially improves rigor');
    expect(prompt).toContain('Fan in subagent outputs before claiming completion');
    expect(prompt).toContain('## Engineering presence');
  });

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
