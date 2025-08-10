import authConfig from "@/auth.config";

const { baseUrl } = authConfig.NEXT_AUTH;

export function NextAuth() {
  return async (sessionToken?: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/session`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken && {
            Cookie: `__Secure-authjs.session-token=${sessionToken}`,
          }),
        },
        credentials: "include",
      });

      if (!response.ok) {
        return { data: null };
      }

      const sessionData = await response.json();

      if (!sessionData.user || sessionData.user.type === "guest") {
        return { data: null };
      }

      if (!sessionToken) {
        const sessionTokenCookie = await chrome.cookies.get({
          name: "__Secure-authjs.session-token",
          url: baseUrl,
        });

        if (sessionTokenCookie) {
          sessionData.token = sessionTokenCookie.value;
        }
      } else {
        sessionData.token = sessionToken;
      }

      return { data: sessionData };
    } catch (error) {
      console.error("Failed to fetch session:", error);
      return { data: null };
    }
  };
}
