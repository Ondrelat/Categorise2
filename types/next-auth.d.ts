import "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }
}