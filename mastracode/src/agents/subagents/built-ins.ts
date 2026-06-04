import type { HarnessSubagent } from '@mastra/core/harness';

import { auditTestsSubagent } from './audit-tests.js';
import { executeSubagent } from './execute.js';
import { exploreSubagent } from './explore.js';
import { planSubagent } from './plan.js';

export type BuiltInSubagentModeId = 'build' | 'plan' | 'fast';

export const builtInSubagents: HarnessSubagent[] = [
  exploreSubagent,
  planSubagent,
  executeSubagent,
  auditTestsSubagent,
];

export const builtInSubagentModeMap: Record<string, BuiltInSubagentModeId> = {
  explore: 'fast',
  plan: 'plan',
  execute: 'build',
  'audit-tests': 'plan',
};

export const builtInSubagentTypes = builtInSubagents.map(subagent => ({
  id: subagent.id,
  label: subagent.name,
  description: subagent.description,
}));
