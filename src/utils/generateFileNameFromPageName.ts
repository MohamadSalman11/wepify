export const generateFileNameFromPageName = (pageName: string): string => {
  return (
    pageName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^\w_-]/g, '') + '.html'
  );
};
