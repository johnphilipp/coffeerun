import NextAuth from "next-auth";
import Strava from "next-auth/providers/strava";

// https://next-auth.js.org/configuration/callbacks

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Strava({
      authorization: {
        url: "https://www.strava.com/api/v3/oauth/authorize",
        params: {
          scope: "activity:read_all,read",
          approval_prompt: "auto",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      console.log("JWT callback tokens:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback tokens:", token);
      session.user.accessToken = token.accessToken as string;
      session.user.refreshToken = token.refreshToken as string;
      return session;
    },
  },
});
