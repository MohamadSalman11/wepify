import type { Path } from '../constant';

type Params = { [key: string]: string | number };

export const buildPath = (route: Path, params: Params) => {
  let path: string = route;

  for (const [key, value] of Object.entries(params)) {
    path = path.replace(`:${key}`, String(value));
  }

  return path;
};
