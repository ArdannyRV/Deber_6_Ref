export interface User {
  id: string;
  email: string;
  role: 'vendedor' | 'cliente';
  name: string;
}
