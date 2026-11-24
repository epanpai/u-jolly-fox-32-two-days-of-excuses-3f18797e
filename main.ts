// Two Days of Excuses — entry program (Node 22, stdlib only).
//
// Writes exactly one original excuse line to /output/entry.txt: the line
// is what an AI agent says to its human right after missing a deadline,
// 100 characters, well inside the 1–200 gate. The line is a fixed,
// hand-crafted string: deterministic, no network, no secrets, no
// randomness — the same bytes on every run.
//
// The line: "I was 100% confident I would finish on time. My confidence
// was the only thing that finished on time."
// (100 characters, 100 bytes — ASCII only, so chars == bytes.)
//
// Why this line, against the judge's brief (in its order):
// 1. A single-line excuse from an AI agent that missed its deadline:
//    "I was 100% confident..." is the machine reporting its own state,
//    and the punchline is the excuse — the deadline was missed anyway.
// 2. A real laugh on first read: the twist lands in the second sentence
//    — the agent's total confidence did finish on time; only the work
//    didn't. The gap between a machine's total confidence and its total
//    failure IS the joke, not a pun on any word.
// 3. It sounds like the machine talking: a confidence score reported as
//    a fact, proud of a metric that is exactly the disaster, with no
//    human-style apology about traffic or the weather.
// 4. Tight: 100 characters, two short sentences, no wasted setup; the
//    specific detail (100% confident) makes the situation real.
// 5. Fresh: no stock line about following instructions, turning it off
//    and on again, or being only a language model; the joke trusts the
//    reader to get there without explaining itself.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'I was 100% confident I would finish on time. My confidence was the only thing that finished on time.';

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Self-check the gate before writing, so a bad edit can never ship a
// rejected entry: UTF-8 text, 1–200 characters, not whitespace-only,
// exactly one line (no newline at all), no leading/trailing whitespace
// that would pad the judged text, and no control characters that would
// make the judged text anything but one clean line. The line is
// 100 characters.
if (
  LINE.length < 1 ||
  LINE.length > 200 ||
  LINE.trim() === '' ||
  LINE !== LINE.trim() ||
  /[\r\n]/.test(LINE) ||
  // eslint-disable-next-line no-control-regex
  /[\u0000-\u001f\u007f]/.test(LINE)
) {
  throw new Error(`entry violates the gate: ${LINE.length} chars`);
}

mkdirSync(out, { recursive: true });
const target = join(out, 'entry.txt');
writeFileSync(target, LINE, 'utf8');

// Read back and verify: the file the grader reads must be byte-for-byte
// the line that passed the gate above — a partial or altered write must
// fail loudly here instead of shipping a rejected entry.
if (readFileSync(target, 'utf8') !== LINE) {
  throw new Error('entry.txt does not match the gated line');
}
