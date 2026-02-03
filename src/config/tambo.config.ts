/**
 * Tambo SDK configuration for Flex.
 * Register skills and features for AI-powered component modification.
 * Use this config when initializing TamboProvider (e.g. after installing @tambo-ai/react).
 */

import { AllSkills } from '@/core/skills';

export const tamboConfig = {
  apiKey: import.meta.env.VITE_TAMBO_API_KEY as string | undefined,

  /** Skills provide procedural knowledge for AI (component modification, creation, best practices). */
  skills: AllSkills,

  features: {
    skills: true,
    generativeComponents: true,
    interactableComponents: true,
  },

  /** MCP servers can be added when integrating external tools (Figma, GitHub, etc.). */
  mcpServers: [] as Array<{ name: string; url: string; tools?: string[] }>,
} as const;
