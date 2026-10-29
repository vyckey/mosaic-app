import { useState } from 'react';
import { View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { MosaicIconButton } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { type InputType } from '../utils/validation';

import { AccountStep } from './steps/AccountStep';
import {
  CredentialStep,
  type AuthMode,
  type CredentialMethod,
} from './steps/CredentialStep';
import { ForgotAccountStep } from './steps/ForgotAccountStep';
import { ForgotCodeStep } from './steps/ForgotCodeStep';
import { ForgotPasswordStep } from './steps/ForgotPasswordStep';

type FlowState =
  | { step: 'account'; account: string }
  | { step: 'credential'; account: string; inputType: InputType; method: CredentialMethod; mode: AuthMode }
  | { step: 'forgot-account'; account: string; inputType: InputType }
  | { step: 'forgot-code'; account: string; inputType: InputType; contact: string }
  | { step: 'forgot-password'; account: string; inputType: InputType; contact: string };

// Mock backend: accounts that already exist. Login and register share one
// entry — the real backend answers "exists?"; the prototype asks this list.
const EXISTING_ACCOUNTS = ['xisun2', '+8617521760213', '17521760213'];

/** Registered accounts log in, brand-new ones register (mock backend rule) */
const resolveMode = (account: string): AuthMode =>
  EXISTING_ACCOUNTS.includes(account.trim()) ? 'login' : 'register';

interface AuthFlowProps {
  onComplete?: () => void;
}

export function AuthFlow({ onComplete }: AuthFlowProps) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<FlowState>({ step: 'account', account: '' });

  const handleAccountChange = (account: string) => {
    setState({ step: 'account', account });
  };

  const handleNext = (inputType: InputType) => {
    setState((prev) =>
      prev.step === 'account'
        ? {
            step: 'credential',
            account: prev.account,
            inputType,
            // Default to verification-code login for phone/email accounts; a
            // username has no bound contact, so it falls back to the password
            method: inputType === 'username' ? 'password' : 'code',
            mode: resolveMode(prev.account),
          }
        : prev,
    );
  };

  const handleSwitchMethod = (method: CredentialMethod) => {
    // Username accounts only support password login (no code login)
    setState((prev) =>
      prev.step === 'credential' && prev.inputType !== 'username' ? { ...prev, method } : prev,
    );
  };

  const handleSwitchAccount = () => {
    setState((prev) =>
      prev.step === 'credential' ? { step: 'account', account: prev.account } : prev,
    );
  };

  const handleForgotPassword = () => {
    setState((prev) => {
      if (prev.step !== 'credential') return prev;
      // Phone/email accounts verify with a code directly; a username account
      // first asks for its bound phone/email
      return prev.inputType === 'username'
        ? { step: 'forgot-account', account: prev.account, inputType: prev.inputType }
        : { step: 'forgot-code', account: prev.account, inputType: prev.inputType, contact: prev.account };
    });
  };

  const handleForgotContactNext = (contact: string) => {
    setState((prev) =>
      prev.step === 'forgot-account'
        ? { step: 'forgot-code', account: prev.account, inputType: prev.inputType, contact }
        : prev,
    );
  };

  const handleForgotCodeVerified = (code: string) => {
    if (state.step !== 'forgot-code') return;
    // TODO: verify the code against the backend
    console.log('verify forgot code:', state.contact);
    setState((prev) =>
      prev.step === 'forgot-code'
        ? { step: 'forgot-password', account: prev.account, inputType: prev.inputType, contact: prev.contact }
        : prev,
    );
  };

  const handleResetPassword = (password: string) => {
    if (state.step !== 'forgot-password') return;
    // TODO: call the backend to reset the password
    console.log('reset password:', state.account, state.contact);
    setState((prev) =>
      prev.step === 'forgot-password'
        ? {
            step: 'credential',
            account: prev.account,
            inputType: prev.inputType,
            method: 'password',
            mode: resolveMode(prev.account),
          }
        : prev,
    );
  };

  const backToLogin = () => {
    setState((prev) =>
      prev.step === 'forgot-account' ||
      prev.step === 'forgot-code' ||
      prev.step === 'forgot-password'
        ? {
            step: 'credential',
            account: prev.account,
            inputType: prev.inputType,
            method: 'password',
            mode: resolveMode(prev.account),
          }
        : prev,
    );
  };

  const handleSubmit = (value: string) => {
    if (state.step !== 'credential') return;
    // TODO: login and register share one entry — the backend decides by account
    // existence (never log the password / code)
    console.log('submit:', state.mode, state.account, state.method);
    onComplete?.();
  };

  const handleBackFromForgotPassword = () => {
    setState((prev) =>
      prev.step === 'forgot-password'
        ? { step: 'forgot-code', account: prev.account, inputType: prev.inputType, contact: prev.contact }
        : prev,
    );
  };

  const backAction = (() => {
    switch (state.step) {
      case 'credential':
        return handleSwitchAccount;
      case 'forgot-account':
      case 'forgot-code':
        return backToLogin;
      case 'forgot-password':
        return handleBackFromForgotPassword;
      case 'account':
        return undefined;
    }
  })();

  return (
    <View className="flex-1">
      <View
        className="min-h-11 flex-row items-center px-2"
        style={{ paddingTop: insets.top }}
      >
        {backAction && (
          <MosaicIconButton
            variant="glass"
            size="md"
            onPress={backAction}
            accessibilityLabel={t('common.back')}
          >
            <Icon as={ChevronLeft} size="xl" className="text-text" />
          </MosaicIconButton>
        )}
      </View>

      <View className="flex-1 items-center justify-center px-6 pb-12">
        {state.step === 'account' && (
          <AccountStep
            account={state.account}
            onAccountChange={handleAccountChange}
            onNext={handleNext}
          />
        )}

        {state.step === 'credential' && (
          <CredentialStep
            account={state.account}
            inputType={state.inputType}
            method={state.method}
            mode={state.mode}
            onSwitchMethod={handleSwitchMethod}
            onSwitchAccount={handleSwitchAccount}
            onForgotPassword={handleForgotPassword}
            onSubmit={handleSubmit}
          />
        )}

        {state.step === 'forgot-account' && (
          <ForgotAccountStep
            onNext={handleForgotContactNext}
            onBackToLogin={backToLogin}
          />
        )}

        {state.step === 'forgot-code' && (
          <ForgotCodeStep
            contact={state.contact}
            onSubmit={handleForgotCodeVerified}
            onBackToLogin={backToLogin}
          />
        )}

        {state.step === 'forgot-password' && (
          <ForgotPasswordStep
            account={state.account}
            onSubmit={handleResetPassword}
            onBackToLogin={backToLogin}
          />
        )}
      </View>
    </View>
  );
}
