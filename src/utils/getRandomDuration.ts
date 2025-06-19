export function getRandomDuration(minSeconds: number, maxSeconds: number): number {
  return Math.round((minSeconds + Math.random() * (maxSeconds - minSeconds)) * 1000);
}
