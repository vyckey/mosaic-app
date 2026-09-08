import { createContext, useContext, type ReactNode } from 'react';

import type { MosaicGlassProps } from '@/components/mosaic';

/** Android blur sampling target shared by every glass control on the auth screens */
type AuthBlurTarget = MosaicGlassProps['blurTarget'];

const AuthBlurContext = createContext<AuthBlurTarget>(undefined);

interface AuthBlurProviderProps {
  /** Ref to the auth backdrop's BlurTargetView (the picture behind the glass) */
  target: AuthBlurTarget;
  children: ReactNode;
}

/**
 * Provides the auth backdrop (decorative blobs over the page canvas) as the
 * Android blur sampling target, so glass fields frost that picture instead of
 * showing a flat tint. iOS/Web sample their surroundings natively and ignore it.
 */
export function AuthBlurProvider({ target, children }: AuthBlurProviderProps) {
  return <AuthBlurContext.Provider value={target}>{children}</AuthBlurContext.Provider>;
}

/** Returns the auth backdrop blur target, or undefined outside the provider */
export function useAuthBlurTarget(): AuthBlurTarget {
  return useContext(AuthBlurContext);
}
