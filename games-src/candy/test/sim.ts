import { GRID_SIZE, checkMatches, createInitialBoard, hasValidMoves, shuffleBoard, createGemId, getRandomGemType } from '../src/utils/gameLogic';
type B = any[][];
const log: string[] = []; const errors: string[] = [];
const err = (m: string) => { errors.push(m); };
// Brute-force runs of >=3 same type
function runs(b: B): Set<string> {
  const s = new Set<string>();
  for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) {
    const t = b[r][c]?.type; if (!t) continue;
    let h = 0; while (c + h < GRID_SIZE && b[r][c + h]?.type === t) h++;
    if (h >= 3) for (let k = 0; k < h; k++) s.add(`${r},${c + k}`);
    let v = 0; while (r + v < GRID_SIZE && b[r + v][c]?.type === t) v++;
    if (v >= 3) for (let k = 0; k < v; k++) s.add(`${r + k},${c}`);
  }
  return s;
}
// Expected pops: runs + special chain effects
function expected(b: B): Set<string> {
  const s = runs(b); const done = new Set<string>(); const queue = [...s];
  while (queue.length) {
    const k = queue.shift()!; if (done.has(k)) continue; done.add(k);
    const [r, c] = k.split(',').map(Number); const g = b[r][c]; if (!g || g.special === 'none') continue;
    const add = (rr: number, cc: number) => { const kk = `${rr},${cc}`; if (!s.has(kk)) { s.add(kk); } queue.push(kk); };
    if (g.special === 'blaster_h') for (let x = 0; x < GRID_SIZE; x++) add(r, x);
    if (g.special === 'blaster_v') for (let x = 0; x < GRID_SIZE; x++) add(x, c);
    if (g.special === 'mega_5') for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) { const rr = r + dr, cc = c + dc; if (rr >= 0 && rr < GRID_SIZE && cc >= 0 && cc < GRID_SIZE) add(rr, cc); }
    if (g.special === 'supernova_6') for (let rr = 0; rr < GRID_SIZE; rr++) for (let cc = 0; cc < GRID_SIZE; cc++) if (b[rr][cc]?.type === g.type) add(rr, cc);
  }
  return s;
}
function checkPositions(b: B, where: string) {
  for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) {
    const g = b[r][c]; if (!g) { err(`${where}: empty cell ${r},${c}`); continue; }
    if (g.row !== r || g.col !== c) err(`${where}: gem at ${r},${c} thinks it is at ${g.row},${g.col}`);
  }
}
function gravity(b: B): B {
  const f = b.map((row) => row.map((g: any) => (g ? { ...g } : null)));
  for (let c = 0; c < GRID_SIZE; c++) {
    let e = GRID_SIZE - 1;
    for (let r = GRID_SIZE - 1; r >= 0; r--) if (f[r][c]) { if (r !== e) { f[e][c] = { ...f[r][c], row: e, col: c }; f[r][c] = null; } e--; }
    for (let r = e; r >= 0; r--) f[r][c] = { id: createGemId(), type: getRandomGemType(), special: 'none', row: r, col: c };
  }
  return f;
}
// One resolve step, same as GameBoard.processMatchesAndCascades
function resolve(b: B, oR?: number, oC?: number): { board: B; popped: number; created: string[] } {
  const res = checkMatches(b, oR, oC);
  const got = new Set(res.matchedGems.map((g: any) => `${g.row},${g.col}`));
  const exp = expected(b);
  for (const k of got) if (!exp.has(k)) err(`popped but should not: ${k} (${b[+k.split(',')[0]][+k.split(',')[1]].type})`);
  for (const k of exp) if (!got.has(k)) err(`should pop but did not: ${k}`);
  const n = b.map((row) => [...row]);
  res.matchedGems.forEach((g: any) => { n[g.row][g.col] = null; });
  const created: string[] = [];
  res.groups.forEach((grp: any) => { if (grp.specialCreated) { n[grp.centerRow][grp.centerCol] = { id: createGemId(), type: grp.type, special: grp.specialCreated, row: grp.centerRow, col: grp.centerCol }; created.push(grp.specialCreated); } });
  return { board: gravity(n), popped: got.size, created };
}
const stats = { games: 0, moves: 0, pops: 0, cascades: 0, specials: {} as Record<string, number>, rejected: 0, shuffles: 0 };
for (let game = 0; game < 300; game++) {
  stats.games++;
  let b: B = createInitialBoard();
  if (runs(b).size) err(`game ${game}: initial board has matches`);
  if (!hasValidMoves(b)) err(`game ${game}: initial board has no moves`);
  checkPositions(b, 'initial');
  for (let mv = 0; mv < 30; mv++) {
    // collect all swaps; check acceptance rule against brute force
    const valid: number[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) for (let c = 0; c < GRID_SIZE; c++) for (const [dr, dc] of [[0, 1], [1, 0]]) {
      const r2 = r + dr, c2 = c + dc; if (r2 >= GRID_SIZE || c2 >= GRID_SIZE) continue;
      const g1 = b[r][c], g2 = b[r2][c2];
      if (['mega_5', 'supernova_6'].includes(g1.special) || ['mega_5', 'supernova_6'].includes(g2.special)) continue;
      const s = b.map((row) => [...row]); s[r][c] = { ...g2, row: r, col: c }; s[r2][c2] = { ...g1, row: r2, col: c2 };
      const accept = checkMatches(s, r2, c2).matchedGems.length > 0;
      const shouldAccept = runs(s).size > 0;
      if (accept !== shouldAccept) err(`swap ${r},${c}<->${r2},${c2}: accepted=${accept} but brute=${shouldAccept}`);
      if (accept) valid.push([r, c, r2, c2]); else stats.rejected++;
    }
    if (!valid.length) { if (hasValidMoves(b)) err('hasValidMoves true but no plain valid swap (ok if specials)'); b = shuffleBoard(b); stats.shuffles++; checkPositions(b, 'shuffle'); if (runs(b).size) err('shuffle left matches'); continue; }
    const [r, c, r2, c2] = valid[Math.floor(Math.random() * valid.length)];
    const s = b.map((row) => [...row]); const g1 = b[r][c], g2 = b[r2][c2];
    s[r][c] = { ...g2, row: r, col: c }; s[r2][c2] = { ...g1, row: r2, col: c2 };
    stats.moves++;
    let step = resolve(s, r2, c2); stats.pops += step.popped; step.created.forEach((x) => (stats.specials[x] = (stats.specials[x] || 0) + 1));
    let depth = 0;
    while (runs(step.board).size && depth < 50) { depth++; stats.cascades++; step = resolve(step.board); stats.pops += step.popped; step.created.forEach((x) => (stats.specials[x] = (stats.specials[x] || 0) + 1)); }
    b = step.board; checkPositions(b, `game ${game} move ${mv}`);
    if (game === 0) log.push(`move ${mv + 1}: swap (${r},${c})<->(${r2},${c2}), cascades ${depth}`);
  }
}
console.log(log.slice(0, 10).join('\n'));
console.log(JSON.stringify(stats));
const uniq = [...new Set(errors.map((e) => e.replace(/\d+/g, 'N')))];
console.log('errors', errors.length, uniq.slice(0, 15), errors.slice(0, 5));
