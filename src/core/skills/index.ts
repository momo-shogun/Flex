/**
 * Skills index - exports all Flex skills for AI/Tambo integration.
 */

import { ComponentModificationSkill } from './component-modification.skill';
import { ComponentCreationSkill } from './component-creation.skill';
import { ReactBitsBestPracticesSkill } from './react-bits-best-practices.skill';

export { ComponentModificationSkill } from './component-modification.skill';
export { ComponentCreationSkill } from './component-creation.skill';
export { ReactBitsBestPracticesSkill } from './react-bits-best-practices.skill';

export type SkillDefinition =
  | typeof ComponentModificationSkill
  | typeof ComponentCreationSkill
  | typeof ReactBitsBestPracticesSkill;

export const AllSkills: SkillDefinition[] = [
  ComponentModificationSkill,
  ComponentCreationSkill,
  ReactBitsBestPracticesSkill,
];
