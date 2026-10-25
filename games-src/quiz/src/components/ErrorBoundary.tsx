import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans" dir="rtl">
          <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="flex items-center gap-3 text-red-600 mb-4 border-b pb-3 border-red-50">
              <svg className="w-8 h-8 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-xl font-bold">خطایی در برنامه رخ داده است</h1>
            </div>
            
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              متأسفانه خطایی در اجرای بخش کاربری رخ داده است. این مشکل می‌تواند به دلیل تداخل داده‌های بارگذاری شده باشد.
            </p>

            {this.state.error && (
              <div className="bg-red-50 text-red-900 p-4 rounded-xl text-xs font-mono mb-6 overflow-auto max-h-40 leading-relaxed text-left border border-red-100" dir="ltr">
                <strong className="block mb-1 font-sans text-right" dir="rtl">جزئیات خطا:</strong>
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack && (
                  <div className="mt-2 text-[10px] whitespace-pre opacity-80">
                    {this.state.errorInfo.componentStack}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 transition-all text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm text-center"
              >
                پاکسازی کش و تلاش مجدد
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 transition-all text-slate-700 font-bold rounded-xl text-xs cursor-pointer text-center"
              >
                بارگذاری مجدد صفحه
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
