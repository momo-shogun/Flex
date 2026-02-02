import React from 'react';
import { withInteractable } from '@/core/interactable/withInteractable';
import Button from './Button';

const InteractableButton = withInteractable(Button, {
  category: 'interactive',
  editableProps: ['variant', 'size', 'className', 'children'],
  a11yRules: ['color-contrast', 'button-name', 'focus-visible'],
});

export default InteractableButton;
