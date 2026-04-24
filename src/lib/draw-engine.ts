/**
 * =============================================================
 * DRAW ENGINE — Golf Lottery Algorithm
 * =============================================================
 *
 * This module contains the core business logic for the monthly draw.
 *
 * ## How the Draw Works
 * 1. Collect all active, subscribed users who have at least 1 score.
 * 2. Generate 5 unique numbers between 1–45 (the "draw numbers").
 *    - Mode A (Random):     Pure random selection.
 *    - Mode B (Frequency):  Weighted towards how often each number
 *                           appears across ALL user scores. Numbers
 *                           submitted more frequently are LESS likely
 *                           to be drawn (reverse weighting = harder wins,
 *                           larger rollovers for full-house jackpot).
 * 3. For each eligible user, compare their latest ≤5 scores against
 *    the draw numbers using SET INTERSECTION (order doesn't matter).
 * 4. Categorise winners:
 *    - 3 matches → wins 25% of prize pool ("Match 3")
 *    - 4 matches → wins 35% of prize pool ("Match 4")
 *    - 5 matches → wins 40% of prize pool ("Match 5" jackpot)
 * 5. If no one hits 5 matches the 40% share rolls over to next month.
 * 6. Split each tier's prize equally among all winners in that tier.
 */

export type DrawMode = "random" | "frequency";

export interface DrawResult {
  drawNumbers: number[];
  winners: WinnerResult[];
  rollover: boolean; // true if no 5-match winner
}

export interface WinnerResult {
  userId: string;
  matchType: 3 | 4 | 5;
  matchedNumbers: number[];
  amount: number;
}

export interface UserTicket {
  userId: string;
  scores: number[]; // up to 5 latest Stableford scores
}

// ─────────────────────────────────────────────
// Number Generation
// ─────────────────────────────────────────────

/**
 * Generate 5 unique random draw numbers between 1 and 45.
 */
export function randomDraw(): number[] {
  const pool = Array.from({ length: 45 }, (_, i) => i + 1);
  const drawn: number[] = [];
  while (drawn.length < 5) {
    const idx = Math.floor(Math.random() * pool.length);
    drawn.push(pool.splice(idx, 1)[0]);
  }
  return drawn.sort((a, b) => a - b);
}

/**
 * Generate 5 unique numbers weighted INVERSELY by score frequency.
 * Scores that users submit the LEAST get higher draw probability —
 * making the jackpot harder to hit and driving rollover build-up.
 *
 * @param allScores  Every score value across every active user this month.
 */
export function frequencyDraw(allScores: number[]): number[] {
  // Count how often each number 1-45 appears across all user scores
  const freq = new Array(46).fill(0); // index = score value
  for (const s of allScores) {
    if (s >= 1 && s <= 45) freq[s]++;
  }

  // Maximum frequency for inverse weighting
  const maxFreq = Math.max(...freq.slice(1));

  // Build weighted pool: weight = (maxFreq - freq[i]) + 1
  // so least-frequent numbers have the highest weight
  const pool: number[] = [];
  for (let i = 1; i <= 45; i++) {
    const weight = maxFreq - freq[i] + 1;
    for (let w = 0; w < weight; w++) {
      pool.push(i);
    }
  }

  const drawn: number[] = [];
  const drawnSet = new Set<number>();
  while (drawn.length < 5) {
    const idx = Math.floor(Math.random() * pool.length);
    const num = pool[idx];
    if (!drawnSet.has(num)) {
      drawnSet.add(num);
      drawn.push(num);
    }
  }
  return drawn.sort((a, b) => a - b);
}

// ─────────────────────────────────────────────
// Match Calculation
// ─────────────────────────────────────────────

/**
 * Count how many of a user's scores appear in the draw numbers.
 */
export function countMatches(userScores: number[], drawNumbers: number[]): number {
  const drawSet = new Set(drawNumbers);
  return userScores.filter((s) => drawSet.has(s)).length;
}

/**
 * Get the actual matched numbers (for display / proof).
 */
export function getMatchedNumbers(userScores: number[], drawNumbers: number[]): number[] {
  const drawSet = new Set(drawNumbers);
  return userScores.filter((s) => drawSet.has(s));
}

// ─────────────────────────────────────────────
// Prize Pool Calculation
// ─────────────────────────────────────────────

export interface PrizeShares {
  match3Share: number; // 25%
  match4Share: number; // 35%
  match5Share: number; // 40%
}

export function calculatePrizeShares(totalPool: number): PrizeShares {
  return {
    match3Share: totalPool * 0.25,
    match4Share: totalPool * 0.35,
    match5Share: totalPool * 0.40,
  };
}

// ─────────────────────────────────────────────
// Full Draw Execution
// ─────────────────────────────────────────────

/**
 * Run the complete monthly draw logic.
 *
 * @param tickets     All eligible users with their latest scores.
 * @param totalPool   Total prize money available this month (in currency units).
 * @param mode        "random" or "frequency"
 * @param rolloverAmount  Any amount rolled over from a previous month's jackpot.
 */
export function executeDraw(
  tickets: UserTicket[],
  totalPool: number,
  mode: DrawMode = "random",
  rolloverAmount: number = 0
): DrawResult {
  const effectivePool = totalPool + rolloverAmount;
  const shares = calculatePrizeShares(effectivePool);

  // Collect all scores for frequency weighting
  const allScores = tickets.flatMap((t) => t.scores);

  // Generate draw numbers
  const drawNumbers =
    mode === "frequency" ? frequencyDraw(allScores) : randomDraw();

  // Categorise each user
  const match3Winners: string[] = [];
  const match4Winners: string[] = [];
  const match5Winners: string[] = [];
  const matchData: Map<string, number[]> = new Map();

  for (const ticket of tickets) {
    const matched = getMatchedNumbers(ticket.scores, drawNumbers);
    const count = matched.length;
    matchData.set(ticket.userId, matched);

    if (count === 5) match5Winners.push(ticket.userId);
    else if (count === 4) match4Winners.push(ticket.userId);
    else if (count === 3) match3Winners.push(ticket.userId);
  }

  const winners: WinnerResult[] = [];

  // Distribute match-3 prize
  if (match3Winners.length > 0) {
    const perWinner = shares.match3Share / match3Winners.length;
    for (const uid of match3Winners) {
      winners.push({
        userId: uid,
        matchType: 3,
        matchedNumbers: matchData.get(uid) ?? [],
        amount: perWinner,
      });
    }
  }

  // Distribute match-4 prize
  if (match4Winners.length > 0) {
    const perWinner = shares.match4Share / match4Winners.length;
    for (const uid of match4Winners) {
      winners.push({
        userId: uid,
        matchType: 4,
        matchedNumbers: matchData.get(uid) ?? [],
        amount: perWinner,
      });
    }
  }

  // Distribute match-5 jackpot (rolls over if no winner)
  const rollover = match5Winners.length === 0;
  if (!rollover) {
    const perWinner = shares.match5Share / match5Winners.length;
    for (const uid of match5Winners) {
      winners.push({
        userId: uid,
        matchType: 5,
        matchedNumbers: matchData.get(uid) ?? [],
        amount: perWinner,
      });
    }
  }

  return { drawNumbers, winners, rollover };
}
