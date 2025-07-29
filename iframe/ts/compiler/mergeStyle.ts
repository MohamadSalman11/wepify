export const mergeStyles = (style: Record<string, any>) => {
  const result = { ...style };

  for (const prop of ['padding', 'margin']) {
    const [top, right, bottom, left] = [
      style[`${prop}Top`],
      style[`${prop}Right`],
      style[`${prop}Bottom`],
      style[`${prop}Left`]
    ];

    if ([top, right, bottom, left].every((v) => v !== undefined)) {
      result[prop] =
        top === bottom && right === left
          ? top === right
            ? top
            : `${top} ${right}`
          : `${top} ${right} ${bottom} ${left}`;

      delete result[`${prop}Top`];
      delete result[`${prop}Right`];
      delete result[`${prop}Bottom`];
      delete result[`${prop}Left`];
    }
  }

  const sides = ['Top', 'Right', 'Bottom', 'Left'];
  const borderSides = sides.map((side) => style[`border${side}`]);

  if (borderSides.every((v) => v !== undefined) && borderSides.every((v) => v === borderSides[0])) {
    result.border = borderSides[0];
    for (const side of sides) delete result[`border${side}`];
  }

  return result;
};
