import type { HttpError, RetryConfig } from '../types/dog';

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

export class HttpRequestError extends Error implements HttpError {
  constructor(
    message: string,
    public status?: number,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'HttpRequestError';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calculateDelay(attempt: number, config: RetryConfig, retryAfter?: number): number {
  if (retryAfter) {
    return Math.min(retryAfter * 1000, config.maxDelay);
  }
  
  const exponentialDelay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
  const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
  return Math.min(exponentialDelay + jitter, config.maxDelay);
}

function shouldRetry(error: HttpRequestError, attempt: number, config: RetryConfig): boolean {
  if (attempt >= config.maxAttempts) return false;
  
  // Retry on network errors (no status)
  if (!error.status) return true;
  
  // Retry on 5xx server errors and 429 rate limit
  if (error.status >= 500 || error.status === 429) return true;
  
  return false;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryConfig: Partial<RetryConfig> = {}
): Promise<Response> {
  const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
  let lastError: HttpRequestError;
  
  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const retryAfter = response.headers.get('retry-after');
        const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;
        
        throw new HttpRequestError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          retryAfterSeconds
        );
      }
      
      return response;
    } catch (error) {
      if (error instanceof HttpRequestError) {
        lastError = error;
      } else if (error instanceof Error) {
        lastError = new HttpRequestError(
          error.name === 'AbortError' ? 'Request timeout' : error.message
        );
      } else {
        lastError = new HttpRequestError('Unknown error occurred');
      }
      
      if (!shouldRetry(lastError, attempt, config)) {
        throw lastError;
      }
      
      if (attempt < config.maxAttempts) {
        const delay = calculateDelay(attempt, config, lastError.retryAfter);
        await sleep(delay);
      }
    }
  }
  
  throw lastError!;
}

export async function fetchJson<T>(
  url: string,
  options: RequestInit = {},
  retryConfig?: Partial<RetryConfig>
): Promise<T> {
  const response = await fetchWithRetry(url, options, retryConfig);
  
  try {
    return await response.json();
  } catch (error) {
    throw new HttpRequestError('Failed to parse JSON response');
  }
}
