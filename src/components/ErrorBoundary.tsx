import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Erreur capturée par ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      const reset = () => this.setState({ error: null });
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, reset);
      }
      return (
        <div className="p-4 text-center text-destructive">
          <h2>Une erreur est survenue</h2>
          <pre>{this.state.error.message}</pre>
          <button onClick={reset} className="mt-2">
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}