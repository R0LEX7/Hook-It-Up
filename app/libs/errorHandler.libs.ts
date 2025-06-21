export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(fn: T): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof Error) {
        console.log('Caught error:', err.message);
      } else {
        console.log('Unexpected error:', err);
      }
    }
  };
}
