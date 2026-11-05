
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import client from "@/lib/mongodb";

const db = client.db(process.env.DB_NAME || "booknook");

const trustedOrigins = [
  "http://localhost:3000",
  process.env.BETTER_AUTH_URL,
].filter((origin): origin is string => Boolean(origin));

export const auth = betterAuth({
  appName: "BookNook",

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },

  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },

  plugins: [
    jwt(),
    nextCookies(),
  ],
});
