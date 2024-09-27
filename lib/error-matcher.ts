type GlobalErrors = Extract<keyof typeof globalThis, `${string}Error`>;

/**
 * Should be used to match errors in a catch block
 */
export class ErrorMatcher {
  private static error: unknown;
  static use(error: unknown) {
    this.error = error;
    return this;
  }
  static match(
    errorConstructor: (typeof globalThis)[GlobalErrors],
    fn: VoidFunction
  ) {
    if (this.error) {
      if (Object.is((this.error as any).name, errorConstructor.name)) {
        fn();
        this.cleanup();
      }
    }
    return this;
  }
  private static cleanup() {
    this.error = null;
  }
}
