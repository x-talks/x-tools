import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
        // trackError(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Oops! Something went wrong</h1>
                                <p className="text-slate-600">We encountered an unexpected error</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-4 mb-6">
                            <p className="text-sm font-mono text-slate-700 mb-2">
                                {this.state.error?.message || 'Unknown error'}
                            </p>
                            {import.meta.env.MODE === 'development' && this.state.errorInfo && (
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-sm text-slate-600 hover:text-slate-900">
                                        View stack trace
                                    </summary>
                                    <pre className="mt-2 text-xs text-slate-600 overflow-auto max-h-64">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </details>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-all"
                            >
                                Go Home
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-500">
                                If this problem persists, please{' '}
                                <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                                    contact support
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
