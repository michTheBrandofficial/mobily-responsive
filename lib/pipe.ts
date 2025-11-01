/**
 * @dev function composition function to pipe functions
 * @example
 * const result = pipe(
 *   () => 2999,                    // returns number (5)
 *   (n) => n * 2,               // n is typed as number, returns number (10)
 *   (n) => n.toString(),        // n is typed as number, returns string ("10")
 *   (s) => s + "!",             // s is typed as string, returns string ("10!")
 *   (s) => s.length             // s is typed as string, returns number (3)
 * );
 * const result = pipe(
 *   props.isPremium,
 *   (isPremium) => // run code here,
 * );
 * @dev can take 8 functions at max
 */
function pipe<A>(fn1: A | (() => A)): A;
function pipe<A, B>(fn1: A | (() => A), fn2: (a: A) => B): B;
function pipe<A, B, C>(fn1: A | (() => A), fn2: (a: A) => B, fn3: (b: B) => C): C;
function pipe<A, B, C, D>(
  fn1: A | (() => A),
  fn2: (a: A) => B,
  fn3: (b: B) => C,
  fn4: (c: C) => D
): D;
function pipe<A, B, C, D, E>(
  fn1: A | (() => A),
  fn2: (a: A) => B,
  fn3: (b: B) => C,
  fn4: (c: C) => D,
  fn5: (d: D) => E
): E;
function pipe<A, B, C, D, E, F>(
  fn1: A | (() => A),
  fn2: (a: A) => B,
  fn3: (b: B) => C,
  fn4: (c: C) => D,
  fn5: (d: D) => E,
  fn6: (e: E) => F
): F;
function pipe<A, B, C, D, E, F, G>(
  fn1: A | (() => A),
  fn2: (a: A) => B,
  fn3: (b: B) => C,
  fn4: (c: C) => D,
  fn5: (d: D) => E,
  fn6: (e: E) => F,
  fn7: (f: F) => G
): G;
function pipe<A, B, C, D, E, F, G, H>(
  fn1: A | (() => A),
  fn2: (a: A) => B,
  fn3: (b: B) => C,
  fn4: (c: C) => D,
  fn5: (d: D) => E,
  fn6: (e: E) => F,
  fn7: (f: F) => G,
  fn8: (g: G) => H
): H;
function pipe(...fns: Array<(arg: any) => any>): any {
  let first = fns[0]
  let result = typeof first === 'function' ? (first as () => any)() : first;
  for (let i = 1; i < fns.length; i++) {
    result = fns[i](result);
  }
  return result;
}

export {
  pipe
}
