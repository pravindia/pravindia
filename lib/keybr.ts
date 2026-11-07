// Keybr's public profile uses the version 2 KEYB binary format:
// https://github.com/aradzie/keybr.com/blob/master/packages/keybr-result-io/lib/binary.ts
export type KeybrDay = { timestamp: number; wpm: number; lessons: number };
export type KeybrStats = { lessons: number; hours: number; days: KeybrDay[] };
export function parseKeybr(data: Uint8Array): KeybrStats {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (data.length < 8 || view.getUint32(0) !== 0x4b455942 || view.getUint32(4) !== 2) throw new Error('Unsupported Keybr data');
  let offset = 8, lessons = 0, totalTime = 0;
  const daily = new Map<number, { length: number; time: number; lessons: number }>();
  const byte = () => { if (offset >= data.length) throw new Error('Truncated Keybr data'); return data[offset++]; };
  const vlq = () => { let value = 0; for (let i = 0; i < 5; i++) { const b = byte(); value = value * 128 + (b & 127); if (!(b & 128)) return value; } throw new Error('Invalid Keybr data'); };
  while (offset < data.length) {
    byte(); byte();
    if (offset + 4 > data.length) throw new Error('Truncated Keybr data');
    const timestamp = view.getUint32(offset) * 1000; offset += 4;
    const time = vlq(), length = vlq(), errors = vlq(), samples = vlq();
    if (samples > 10000) throw new Error('Invalid Keybr data');
    for (let i = 0; i < samples; i++) { vlq(); vlq(); vlq(); vlq(); }
    if (length < 10 || time < 1000 || errors > length || samples < 1) continue;
    const day = Math.floor(timestamp / 86400000) * 86400000;
    const row = daily.get(day) || { length: 0, time: 0, lessons: 0 };
    row.length += length; row.time += time; row.lessons++; daily.set(day, row);
    lessons++; totalTime += time;
  }
  return { lessons, hours: totalTime / 3600000, days: [...daily.entries()].sort((a,b) => a[0] - b[0]).map(([timestamp, row]) => ({ timestamp, wpm: row.length / row.time * 12000, lessons: row.lessons })) };
}
