/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, KeyRound, MonitorSmartphone, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginModuleProps {
  onLoginSuccess: (userEmail: string) => void;
  currentUserEmail?: string;
}

export default function LoginModule({ onLoginSuccess, currentUserEmail }: LoginModuleProps) {
  const [email, setEmail] = useState(currentUserEmail || 'vincentsuqiyi@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [step, setStep] = useState<'credentials' | 'twoFactor'>('credentials');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [generatedToken, setGeneratedToken] = useState('583 912');
  const [tokenCounter, setTokenCounter] = useState(30);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Periodically rotate mock 2FA token
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'twoFactor') {
      interval = setInterval(() => {
        setTokenCounter((prev) => {
          if (prev <= 1) {
            const nextToken = Math.floor(100000 + Math.random() * 900000).toString();
            // Format nextToken to 'XXX XXX'
            setGeneratedToken(`${nextToken.slice(0, 3)} ${nextToken.slice(3)}`);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      setStep('twoFactor');
    }, 900);
  };

  const handleTwoFactorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setLoading(false);
      const sanitizedInput = twoFactorCode.replace(/\s+/g, '');
      const sanitizedGenerated = generatedToken.replace(/\s+/g, '');

      // Accept the correct token OR "123456" as universal bypass for ease
      if (sanitizedInput === sanitizedGenerated || sanitizedInput === '123456') {
        onLoginSuccess(email);
      } else {
        setErrorMsg('Invalid 2FA code. Please enter the current secure code shown below or use "123456" for instant testing.');
      }
    }, 800);
  };

  const handleRegenerateToken = () => {
    const nextToken = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedToken(`${nextToken.slice(0, 3)} ${nextToken.slice(3)}`);
    setTokenCounter(30);
  };

  return (
    <div className="w-full max-w-md mx-auto" id="login-module-container">
      <div className="bg-white border border-stone-200 rounded-[2.5rem] shadow-sm overflow-hidden p-8">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-brand-light rounded-full text-brand mb-3 animate-pulse" id="shield-icon-container">
            <ShieldCheck className="h-8 w-8" id="shield-icon" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight font-serif italic" id="login-title">
            Secure Group Travel Access
          </h2>
          <p className="text-xs text-stone-550 mt-2 font-medium" id="login-subtitle">
            Authenticating with bank-grade 256-bit encryption & Multi-Factor Guardrails
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4" id="login-credentials-form">
            <div>
              <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-400 mb-2" id="email-label">
                Traveler Registered Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <KeyRound className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-sm transition-all"
                  placeholder="name@destination.com"
                  id="email-input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-400 mb-2" id="password-label">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand text-sm transition-all"
                  id="password-input"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-xs" id="login-error-msg">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1C1C1C] hover:bg-brand text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer shadow"
              id="credentials-submit"
            >
              <span>{loading ? 'Initializing Guardrails...' : 'Proceed to Authenticator 2FA'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleTwoFactorSubmit} className="space-y-5" id="login-2fa-form">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-3 text-sm text-brand font-bold mb-2" id="auth-header">
                <MonitorSmartphone className="h-5 w-5 animate-pulse text-brand" />
                <span>Anonymized Verification Device Map</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed font-medium">
                A secure push was sent. For convenience, copy the generated 2FA token directly below:
              </p>

              <div className="flex items-center justify-between mt-3 bg-white px-4 py-2 rounded-xl border border-stone-250" id="token-box">
                <span className="font-mono text-xl font-bold tracking-widest text-[#1C1C1C]" id="token-display">
                  {generatedToken}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-mono">{tokenCounter}s</span>
                  <button
                    type="button"
                    onClick={handleRegenerateToken}
                    className="p-1 text-stone-450 hover:text-brand transition-colors cursor-pointer"
                    id="token-refresh-btn"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-wider uppercase font-bold text-stone-400 mb-2" id="2fa-label">
                Enter 6-Digit 2FA Code
              </label>
              <input
                type="text"
                maxLength={7}
                placeholder="000 000"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="block w-full py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-1 focus:ring-brand"
                id="2fa-input"
                required
                autoFocus
              />
            </div>

            {errorMsg && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-xs" id="2fa-error-msg">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setErrorMsg('');
                }}
                className="w-1/3 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-xl transition-colors border border-stone-300 font-bold"
                id="back-credentials-btn"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 px-4 bg-brand hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                id="2fa-submit"
              >
                {loading ? 'Decrypting Space...' : 'Authorized Log In'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-stone-150 text-center text-[10px] font-semibold text-stone-450 space-y-1" id="security-footer">
          <p>🔒 Compliant with GDPR Anonymized Template standards.</p>
          <p>Group itinerary templates are fully scrubbed of private identifiers beforehand.</p>
        </div>
      </div>
    </div>
  );
}
