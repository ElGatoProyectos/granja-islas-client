import { backend_url } from "@/constants/config";
import CredentialsProvider from "next-auth/providers/credentials";
import { signOut } from "next-auth/react";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "correo@gmail.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "*******",
        },
      },
      async authorize(credentials) {
        try {
          if (!credentials) throw new Error("No insertaste los datos");

          const { email, password } = credentials;

          const response = await fetch(`${backend_url}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ credential: email, password }),
          });

          const data = await response.json();

          if (data.error) {
            throw new Error("Error en la identificacion");
          }

          const { id, role, full_name } = data.payload.user;

          return { id, role, full_name, tokenBack: data.payload.token };
        } catch (error) {
          console.error("->", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.full_name = user.full_name;
        token.tokenBack = user.tokenBack;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.full_name = token.full_name;
        session.user.tokenBack = token.tokenBack;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin", // redireccion de login
    signOut: "/signin", // redireccion despues del logout
  },
};
