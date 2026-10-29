import { create } from 'zustand';

export type ThirdPartyProvider = 'apple' | 'google';

export interface AccountDevice {
  id: string;
  name: string;
  system: string;
  lastActive: string;
  /** The device the user is currently signed in on */
  current: boolean;
}

export interface AccountState {
  phone: string;
  email: string;
  /** ISO date of the last password change */
  passwordUpdatedAt: string;
  thirdParty: Record<ThirdPartyProvider, boolean>;
  devices: AccountDevice[];
  updatePhone: (phone: string) => void;
  updateEmail: (email: string) => void;
  markPasswordUpdated: (date?: string) => void;
  setThirdParty: (provider: ThirdPartyProvider, connected: boolean) => void;
  removeDevice: (id: string) => void;
  logoutOtherDevices: () => void;
  reset: () => void;
}

const initialAccount = {
  phone: '13800008888',
  email: 'mosaic@mail.com',
  passwordUpdatedAt: '2026-08-01',
  thirdParty: { apple: true, google: false },
  devices: [
    {
      id: 'pixel',
      name: 'Pixel 9 Pro',
      system: 'Android 16',
      lastActive: '2026-11-16 09:12',
      current: true,
    },
    {
      id: 'macbook',
      name: 'MacBook Pro',
      system: 'macOS 15.2',
      lastActive: '2026-11-15 21:40',
      current: false,
    },
  ] satisfies AccountDevice[],
};

/**
 * Signed-in account state: bound contacts, linked providers and devices.
 *
 * Kept in memory alongside the profile/settings stores; replace the seed data
 * with server responses once the account API exists.
 */
export const useAccountStore = create<AccountState>((set) => ({
  ...initialAccount,
  updatePhone: (phone) => set({ phone }),
  updateEmail: (email) => set({ email }),
  markPasswordUpdated: (date = new Date().toISOString().slice(0, 10)) =>
    set({ passwordUpdatedAt: date }),
  setThirdParty: (provider, connected) =>
    set((state) => ({
      thirdParty: { ...state.thirdParty, [provider]: connected },
    })),
  removeDevice: (id) =>
    set((state) => ({
      devices: state.devices.filter((device) => device.id !== id),
    })),
  logoutOtherDevices: () =>
    set((state) => ({
      devices: state.devices.filter((device) => device.current),
    })),
  reset: () => set(initialAccount),
}));

/** `13800008888` → `138****8888`; short numbers degrade to a plain mask. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) {
    return phone;
  }
  return `${digits.slice(0, 3)}****${digits.slice(-4)}`;
}

/** `mosaic@mail.com` → `m***@mail.com`. */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) {
    return email;
  }
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}
