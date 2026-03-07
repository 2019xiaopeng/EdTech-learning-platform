type CacheEntry = {
  value: string;
  expiresAt: number;
};

const aiCache = new Map<string, CacheEntry>();

function buildKey(kind: "knowledge" | "similar", questionText: string) {
  return `${kind}:${questionText.trim()}`;
}

export function readAiCache(kind: "knowledge" | "similar", questionText: string) {
  const key = buildKey(kind, questionText);
  const current = aiCache.get(key);
  if (!current) {
    return null;
  }
  if (Date.now() > current.expiresAt) {
    aiCache.delete(key);
    return null;
  }
  return current.value;
}

export function writeAiCache(kind: "knowledge" | "similar", questionText: string, value: string, ttlMs = 1000 * 60 * 60 * 12) {
  const key = buildKey(kind, questionText);
  aiCache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}
