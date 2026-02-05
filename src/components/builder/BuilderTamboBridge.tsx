import { useEffect } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { useBuilderActionsRef } from '@/contexts/BuilderActionsRefContext';

/**
 * When mounted (inside BuilderProvider on the website builder page), sets the
 * builder actions ref so Tambo tools (add_builder_section, update_builder_section)
 * can mutate builder state. Clears the ref on unmount.
 */
export function BuilderTamboBridge() {
  const ref = useBuilderActionsRef();
  const { addSection, dispatch, getSection, state } = useBuilder();

  useEffect(() => {
    if (ref) {
      ref.current = { addSection, dispatch, getSection, state };
      return () => {
        ref.current = null;
      };
    }
  }, [ref, addSection, dispatch, getSection, state]);

  return null;
}
