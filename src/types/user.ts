export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string | null;
}
