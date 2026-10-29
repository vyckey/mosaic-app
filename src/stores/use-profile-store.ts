import { create } from 'zustand';

export type Gender = '' | 'male' | 'female' | 'other';

export interface ProfileState {
  avatarUri: string;
  username: string;
  nickname: string;
  bio: string;
  registeredAt: string;
  /** ISO date of the last username change; used for the 30-day cooldown */
  usernameUpdatedAt: string;
  gender: Gender;
  birthday: string;
  setProfile: (patch: Partial<ProfileFields>) => void;
  setGender: (gender: Gender) => void;
  setBirthday: (birthday: string) => void;
  reset: () => void;
}

/** Editable profile fields (everything except the immutable registration date). */
export type ProfileFields = Pick<
  ProfileState,
  | 'avatarUri'
  | 'username'
  | 'nickname'
  | 'bio'
  | 'usernameUpdatedAt'
  | 'gender'
  | 'birthday'
>;

const initialState = {
  avatarUri: '',
  username: 'mosaic_user',
  nickname: '',
  bio: '',
  registeredAt: '2025-06-01',
  usernameUpdatedAt: '',
  gender: '' as Gender,
  birthday: '',
};

/** Username can only be changed once every 30 days. */
export const USERNAME_COOLDOWN_DAYS = 30;

/**
 * Global profile state for the signed-in user.
 *
 * Lives outside the settings route tree so any feature can read the profile
 * without rendering a provider. Persistence can be added later with zustand's
 * `persist` middleware once a storage adapter is wired up.
 */
export const useProfileStore = create<ProfileState>((set) => ({
  ...initialState,
  setProfile: (patch) => set(patch),
  setGender: (gender) => set({ gender }),
  setBirthday: (birthday) => set({ birthday }),
  reset: () => set(initialState),
}));

/** Remaining cooldown in whole days; 0 means the username can be changed now. */
export function getUsernameCooldownDays(
  usernameUpdatedAt: string,
  now: Date = new Date(),
): number {
  if (!usernameUpdatedAt) {
    return 0;
  }
  const updatedAt = new Date(`${usernameUpdatedAt}T00:00:00`);
  if (Number.isNaN(updatedAt.getTime())) {
    return 0;
  }
  const elapsedDays = Math.floor(
    (now.getTime() - updatedAt.getTime()) / (24 * 60 * 60 * 1000),
  );
  return Math.max(0, USERNAME_COOLDOWN_DAYS - elapsedDays);
}
