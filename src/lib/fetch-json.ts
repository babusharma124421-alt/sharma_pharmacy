export async function fetchJson<T>(input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]): Promise<T> {
  const response = await fetch(input, init);

  const raw = await response.text();
  let data: any = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? String(data.error)
        : typeof data === "string"
          ? data
          : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}