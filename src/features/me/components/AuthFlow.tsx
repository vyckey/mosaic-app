import { useState } from 'react';
import { View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { MosaicIconButton } from '@/components/mosaic';
import { useI18n } from '@/i18n/useI18n';

import { type InputType } from '../utils/validation';

import { AccountStep } from './steps/AccountStep';
import { CredentialStep, type CredentialMethod } from './steps/CredentialStep';
import { ForgotAccountStep } from './steps/ForgotAccountStep';
import { ForgotCodeStep } from './steps/ForgotCodeStep';
import { ForgotPasswordStep } from './steps/ForgotPasswordStep';

type FlowState =
  | { step: 'account'; account: string }
  | { step: 'credential'; account: string; inputType: InputType; method: CredentialMethod }
  | { step: 'forgot-account'; account: string; inputType: InputType }
  | { step: 'forgot-code'; account: string; inputType: InputType; contact: string }
  | { step: 'forgot-password'; account: string; inputType: InputType; contact: string };

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
        ? { step: 'credential', account: prev.account, inputType, method: 'password' }
        : prev,
    );
  };

  const handleSwitchMethod = (method: CredentialMethod) => {
    // 用户名账号不支持验证码登录
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
      // 手机号/邮箱账号直接进入验证码验证；用户名需先输入绑定的手机号/邮箱
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
    // TODO: 校验验证码
    console.log('verify forgot code:', state.contact);
    setState((prev) =>
      prev.step === 'forgot-code'
        ? { step: 'forgot-password', account: prev.account, inputType: prev.inputType, contact: prev.contact }
        : prev,
    );
  };

  const handleResetPassword = (password: string) => {
    if (state.step !== 'forgot-password') return;
    // TODO: 调用后端重置密码
    console.log('reset password:', state.account, state.contact);
    setState((prev) =>
      prev.step === 'forgot-password'
        ? { step: 'credential', account: prev.account, inputType: prev.inputType, method: 'password' }
        : prev,
    );
  };

  const backToLogin = () => {
    setState((prev) =>
      prev.step === 'forgot-account' ||
      prev.step === 'forgot-code' ||
      prev.step === 'forgot-password'
        ? { step: 'credential', account: prev.account, inputType: prev.inputType, method: 'password' }
        : prev,
    );
  };

  const handleSubmit = (value: string) => {
    if (state.step !== 'credential') return;
    // TODO: 登录/注册统一由后端根据账号是否存在判定（密码/验证码不写入日志）
    console.log('login:', state.account, state.method);
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
        style={{ paddingTop: insets.top + 4 }}
      >
        {backAction && (
          <MosaicIconButton
            variant="ghost"
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
