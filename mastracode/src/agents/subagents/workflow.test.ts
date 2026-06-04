import { describe, expect, it } from 'vitest';

import { auditTestsSubagent } from './audit-tests.js';
import { builtInSubagentModeMap, builtInSubagentTypes, builtInSubagents } from './built-ins.js';
import { executeSubagent } from './execute.js';
import { exploreSubagent } from './explore.js';
import { planSubagent } from './plan.js';

describe('workflow subagent instructions', () => {
  it('keeps built-in subagent registry and model mapping in one place', () => {
    expect(builtInSubagents.map(subagent => subagent.id)).toEqual([
      'explore',
      'plan',
      'execute',
      'audit-tests',
    ]);
    expect(builtInSubagentModeMap).toEqual({
      explore: 'fast',
      plan: 'plan',
      execute: 'build',
      'audit-tests': 'plan',
    });
    expect(builtInSubagentTypes).toContainEqual({
      id: 'audit-tests',
      label: 'Audit Tests',
      description: auditTestsSubagent.description,
    });
  });

  it('keeps explore evidence-first and read-only', () => {
    expect(exploreSubagent.allowedWorkspaceTools).toBeDefined();
    expect(exploreSubagent.instructions).toContain('READ-ONLY access');
    expect(exploreSubagent.instructions).toContain('confirmed facts from inferences');
    expect(exploreSubagent.instructions).toContain('file paths and line numbers');
  });

  it('requires planning output to include ownership, acceptance criteria, and verification', () => {
    expect(planSubagent.allowedWorkspaceTools).toBeDefined();
    expect(planSubagent.instructions).toContain('ownership boundaries');
    expect(planSubagent.instructions).toContain('Acceptance Criteria');
    expect(planSubagent.instructions).toContain('Verification');
    expect(planSubagent.instructions).toContain('Parallelization');
  });

  it('requires execute scope, forbidden files, verification, and fan-in notes', () => {
    expect(executeSubagent.instructions).toContain('owned files or modules');
    expect(executeSubagent.instructions).toContain('forbidden files or modules');
    expect(executeSubagent.instructions).toContain('acceptance criteria');
    expect(executeSubagent.instructions).toContain('Fan-in Notes');
    expect(executeSubagent.instructions).toContain('Exact command(s), result');
  });

  it('keeps audit-tests read-only and focused on actionable coverage gaps', () => {
    expect(auditTestsSubagent.allowedWorkspaceTools).toBeDefined();
    expect(auditTestsSubagent.instructions).toContain('READ-ONLY access');
    expect(auditTestsSubagent.instructions).toContain('Behavioral Coverage');
    expect(auditTestsSubagent.instructions).toContain('Distinguish confirmed coverage gaps from inferred risks');
    expect(auditTestsSubagent.instructions).toContain('actionable feedback');
  });
});
