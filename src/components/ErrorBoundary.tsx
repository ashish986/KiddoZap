/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    // If it's a MetaMask or browser extension injection error, do not break the UI
    const msg = error?.message || '';
    if (msg.includes('MetaMask') || msg.includes('ethereum')) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const msg = error?.message || '';
    if (msg.includes('MetaMask') || msg.includes('ethereum')) {
      return;
    }
    console.error('KiddoZap Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 text-center border-2 border-amber-200 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-800 font-display">
              ओह! खेल में रुकावट आई / Oops!
            </h2>
            <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">
              एक छोटी सी तकनीकी समस्या हुई है। खेल दोबारा शुरू करने के लिए नीचे बटन दबाएं।
            </p>
            <button
              onClick={this.handleReset}
              className="mt-5 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>पुनः शुरू करें (Restart App)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
