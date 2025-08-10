import authConfig from "@/auth.config";
import { NextAuth } from "@/auth-providers/next-auth";

const providers = {
  NEXT_AUTH: NextAuth,
};
const activeProvider = Object.keys(providers)[0];

export type Session = {
  expires: string;
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    type: string;
    workspaceId: string;
    avatarUrl: string;
  };
};

export async function getProvider() {
  if (authConfig.NEXT_AUTH) {
    return NextAuth();
  }
  return null;
}

export async function auth(sessionToken?: string) {
  if (!authConfig[activeProvider as keyof typeof authConfig]) {
    return { data: null };
  }

  const Provider = providers[activeProvider as keyof typeof providers];
  const authProvider = Provider();

  const { data: session } = await authProvider(sessionToken);
  return session;
}
