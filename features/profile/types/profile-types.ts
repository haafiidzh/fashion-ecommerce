export interface Profile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  pob?: string;
  dob?: Date | string;
  gender?: string;
  email_verified_at?: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  roles?: { name: string }[];
}

export interface UpdateProfileData {
  username: string;
  email: string;
  phone?: string;
  gender?: string;
  pob?: string;
  dob?: string;
}
