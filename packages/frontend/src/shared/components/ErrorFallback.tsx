interface Props {
  error: Error;
  onReset: () => void;
}

export function ErrorFallback({ error, onReset }: Props) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Something went wrong</h2>
      <pre style={{ fontSize: 12, color: '#888', whiteSpace: 'pre-wrap' }}>
        {error.message}
      </pre>
      <button onClick={onReset}>Try again</button>
    </div>
  );
}
