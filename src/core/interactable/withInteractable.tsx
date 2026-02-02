import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDesignSystemStore } from '@/store/design-system-store';
import type { ComponentMetadata } from './types';
import type { Component } from '@/types/design-system';

export interface InteractableConfig {
  id: string;
  type: string;
  metadata?: Partial<ComponentMetadata>;
}

export function withInteractable<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultMetadata: ComponentMetadata
) {
  function InteractableWrapper(
    props: P & InteractableConfig
  ) {
    const { id, type, metadata, ...componentProps } = props;
    const elementRef = useRef<HTMLElement>(null);
    const registerComponent = useDesignSystemStore((s) => s.registerComponent);
    const updateComponent = useDesignSystemStore((s) => s.updateComponent);
    const selectComponent = useDesignSystemStore((s) => s.selectComponent);
    const component = useDesignSystemStore((s) => s.components.get(id));
    const prevPropsRef = useRef<Record<string, unknown> | null>(null);

    // Register on mount
    useEffect(() => {
      registerComponent({
        id,
        type,
        props: componentProps as Record<string, unknown>,
        metadata: { ...defaultMetadata, ...metadata },
        element: elementRef.current,
      });
    }, [id, type, registerComponent, metadata]);

    // Animate when store props change (AI / inspector updates)
    useEffect(() => {
      const storeProps = component?.props;
      if (!storeProps || !elementRef.current) return;
      if (prevPropsRef.current === storeProps) return;
      prevPropsRef.current = storeProps;

      gsap.to(elementRef.current, {
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5)',
        duration: 0.2,
      });
      const t = setTimeout(() => {
        gsap.to(elementRef.current, {
          boxShadow: 'none',
          duration: 0.3,
        });
      }, 600);
      return () => clearTimeout(t);
    }, [component?.props]);

    const mergedProps = {
      ...componentProps,
      ...(component?.props ?? {}),
      ref: elementRef,
      'data-component-id': id,
      'data-component-type': type,
      onClick: (e: React.MouseEvent) => {
        selectComponent(id);
        (componentProps as Record<string, unknown>).onClick?.(e);
      },
    } as P & {
      ref: React.RefObject<HTMLElement | null>;
      'data-component-id': string;
      'data-component-type': string;
    };

    return <WrappedComponent {...mergedProps} />;
  }

  InteractableWrapper.displayName = `Interactable(${
    (WrappedComponent as React.ComponentType & { displayName?: string }).displayName ?? 'Component'
  })`;

  return InteractableWrapper;
}
