export const getVerticalBorderSum = (el: HTMLElement): number => {
  const styles = getComputedStyle(el);

  const topStyle = styles.borderTopStyle;
  const bottomStyle = styles.borderBottomStyle;

  const topWidth = topStyle === 'none' ? 0 : Number.parseFloat(styles.borderTopWidth);
  const bottomWidth = bottomStyle === 'none' ? 0 : Number.parseFloat(styles.borderBottomWidth);

  const top = Number.isNaN(topWidth) ? 0 : topWidth;
  const bottom = Number.isNaN(bottomWidth) ? 0 : bottomWidth;

  return top + bottom;
};
