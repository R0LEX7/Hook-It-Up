import { isAxiosError } from 'axios';

export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>> | any> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (err: any) {
      console.log(err);
      if (isAxiosError(err)) {
        console.log('Axios error:', err.response);
        return err.response; // return full response object
      } else if (err instanceof Error) {
        console.log('Caught error:', err.message);
        return undefined;
      } else {
        console.log('Unexpected error:', err);
        return undefined;
      }
    }
  };
}
