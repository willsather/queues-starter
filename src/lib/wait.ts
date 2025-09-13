export async function wait(): Promise<number> {
  const waitTime = Math.floor(Math.random() * 3000) + 2000;

  await new Promise((resolve) => setTimeout(resolve, waitTime));

  return waitTime;
}
