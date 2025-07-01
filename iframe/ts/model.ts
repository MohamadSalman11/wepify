import type Moveable from 'moveable';

export const state: {
  moveable: Moveable | null;
  target: HTMLElement | null;
  targetName: string | null;
  initRender: boolean;
  isSitePreviewMode: boolean;
} = {
  moveable: null,
  target: null,
  targetName: null,
  initRender: false,
  isSitePreviewMode: false
};

export const getTarget = (): HTMLElement => {
  if (!state.target) throw new Error('No current target set');
  return state.target;
};

export const getMoveableInstance = (): Moveable => {
  if (!state.moveable) throw new Error('No Moveable instance set');
  return state.moveable;
};

export const updateElement = (
  updates: { link?: string; type?: string; placeholder?: string },
  styles: Partial<CSSStyleDeclaration>
) => {
  const { link, type, placeholder } = updates;
  const currentTarget = getTarget();

  if (link && currentTarget instanceof HTMLAnchorElement) currentTarget.href = link;
  if (type && currentTarget instanceof HTMLInputElement) currentTarget.type = type;
  if (placeholder && currentTarget instanceof HTMLInputElement) currentTarget.placeholder = placeholder;
  if (link || type || placeholder) return;

  Object.assign(currentTarget.style, styles);
};

export const changeTarget = (newTarget: HTMLElement, name: string) => {
  state.target = null;
  state.targetName = null;

  if (state.moveable) {
    state.moveable.target = null;
  }

  state.target = newTarget;
  state.targetName = name;
};
