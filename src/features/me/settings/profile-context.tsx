import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Gender = '' | 'male' | 'female' | 'other';

export interface ProfileContextValue {
  gender: Gender;
  setGender: (gender: Gender) => void;
  birthday: string;
  setBirthday: (birthday: string) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [gender, setGender] = useState<Gender>('');
  const [birthday, setBirthday] = useState('');

  const value = useMemo(
    () => ({ gender, setGender, birthday, setBirthday }),
    [gender, birthday],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
