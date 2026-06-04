import { describe, expect, it } from 'vitest';

import { buildToolGuidance } from './tool-guidance.js';

describe('buildToolGuidance task tools', () => {
  it('uses workflow-oriented subagent guidance', () => {
    const guidance = buildToolGuidance('build');

    expect(guidance).toContain('Use subagents when delegation materially improves rigor');
    expect(guidance).toContain('Prefer parallel subagents for independent work');
    expect(guidance).toContain('owned/forbidden files');
    expect(guidance).not.toContain('Only use subagents when you will spawn');
  });

  it('does not reference denied task patch tools from task_write guidance', () => {
    const guidance = buildToolGuidance('build', {
      deniedTools: new Set(['task_update', 'task_complete', 'task_check']),
    });

    expect(guidance).toContain('Use task_write with the full task list');
    expect(guidance).not.toContain('task_update');
    expect(guidance).not.toContain('task_complete');
    expect(guidance).not.toContain('task_check');
  });

  it('does not reference task_write when only patch tools are available', () => {
    const guidance = buildToolGuidance('build', {
      deniedTools: new Set(['task_write']),
    });

    expect(guidance).toContain('task_update');
    expect(guidance).toContain('task_complete');
    expect(guidance).not.toContain('task_write');
  });
});
