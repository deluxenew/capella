export interface ReferralData {
  totalCount: number;
  referrals?: Array<{
    id: string;
    email: string;
    joinedAt: string;
    status: 'active' | 'pending';
  }>;
}

export interface SharingPlatform {
  name: string;
  title: string;
  bgColor: string;
  icon: string;
  pathProps: {
    d: string;
    stroke: string;
    'stroke-width': string;
    'stroke-linecap': string;
    'stroke-linejoin': string;
  };
}

export interface User {
  referralCode?: string;
  // other user properties
}

export interface AuthState {
  user: User | null;
  // other auth properties
}
