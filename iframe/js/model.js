export const state = {
  moveable: null,
  currentTarget: null,
  initRender: false
};

export const updateElement = (updates, styles) => {
  const { link, type, placeholder } = updates;

  if (link) state.currentTarget.href = link;
  if (type) state.currentTarget.type = type;
  if (placeholder) state.currentTarget.placeholder = placeholder;
  if (link || type || placeholder) return;

  Object.assign(state.currentTarget.style, styles);
};

export const changeTarget = (newTarget) => {
  state.currentTarget = null;
  state.moveable.target = null;

  state.currentTarget = newTarget;
};
