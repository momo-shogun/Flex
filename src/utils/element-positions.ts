export type ElementPosition = { x: number; y: number };
export type ElementPositions = Record<string, ElementPosition | undefined>;

export function parseElementPositions(raw: unknown): ElementPositions {
  if (!raw || typeof raw !== 'object') return {};
  const positions = raw as Record<string, unknown>;
  const out: ElementPositions = {};

  for (const [k, v] of Object.entries(positions)) {
    if (!v || typeof v !== 'object') continue;
    const pos = v as Record<string, unknown>;
    const x = typeof pos.x === 'number' && Number.isFinite(pos.x) ? pos.x : 0;
    const y = typeof pos.y === 'number' && Number.isFinite(pos.y) ? pos.y : 0;
    out[k] = { x, y };
  }

  return out;
}

export function setElementPosition(
  positions: ElementPositions,
  key: string,
  partial: Partial<ElementPosition>
): ElementPositions {
  const current = positions[key] ?? { x: 0, y: 0 };
  return {
    ...positions,
    [key]: {
      ...current,
      ...partial,
    },
  };
}
