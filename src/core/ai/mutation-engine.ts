import type { AIResponse, Component } from '@/types';

export class MutationEngine {
  /**
   * Apply AI response mutations to current components; returns updates to apply to store.
   */
  applyMutations(
    response: AIResponse,
    components: Map<string, Component>
  ): Record<string, Partial<Component>> {
    const updates: Record<string, Partial<Component>> = {};

    for (const [id, mutation] of Object.entries(response.mutations)) {
      const component = components.get(id);
      if (!component) continue;

      const update: Partial<Component> = {};

      if (mutation.props) {
        update.props = { ...component.props, ...mutation.props };
      }
      if (mutation.styles) {
        update.styles = { ...(component.styles ?? {}), ...mutation.styles };
      }
      if (mutation.tokens) {
        update.tokens = { ...(component.tokens ?? {}), ...mutation.tokens };
      }

      if (Object.keys(update).length > 0) {
        updates[id] = update;
      }
    }

    return updates;
  }
}
