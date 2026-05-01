import { type ReactNode } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from './ErrorBoundary';

interface Props {
  children: ReactNode;
}

export function QueryAwareErrorBoundary({ children }: Props) {
  const { reset } = useQueryErrorResetBoundary();
  return <ErrorBoundary onReset={reset}>{children}</ErrorBoundary>;
}
