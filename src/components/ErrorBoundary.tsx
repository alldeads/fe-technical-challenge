import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error">
            <h2>Something went wrong</h2>
            <p>The application encountered an error. Please try refreshing the page.</p>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
            <details style={{ marginTop: '20px' }}>
              <summary>Error details</summary>
              <pre style={{ textAlign: 'left', fontSize: '12px', marginTop: '10px' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;