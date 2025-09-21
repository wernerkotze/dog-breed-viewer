import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';

// Mock timers for testing debounce behavior
beforeEach(() => {
  vi.useFakeTimers();
});

describe('useDebounce', () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 200));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes with default 200ms delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 200 } }
    );

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'updated', delay: 200 });

    // Value should not change immediately
    expect(result.current).toBe('initial');

    // Fast-forward time by 100ms (less than delay)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Value should still be the initial value
    expect(result.current).toBe('initial');

    // Fast-forward time by another 100ms (total 200ms)
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Now the value should be updated
    expect(result.current).toBe('updated');
  });

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 200),
      { initialProps: { value: 'initial' } }
    );

    // Change value multiple times rapidly
    rerender({ value: 'first' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'second' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'final' });

    // Value should still be initial after 200ms total
    expect(result.current).toBe('initial');

    // After another 200ms, should show the final value
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('final');
  });

  it('should work with custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // Should not update after 200ms (default delay)
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('initial');

    // Should update after 500ms (custom delay)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('updated');
  });
});
