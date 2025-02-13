import searchRole from "@/utils/searchRole";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {              
                const authorizeUser =await searchRole(user.email)
                if(authorizeUser && authorizeUser.role && authorizeUser.cantVoices){
                    user.role=authorizeUser.role;
                    user.cantVoices=authorizeUser.cantVoices;
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error en signIn:", error);
                return false;
            }
        },
        async jwt({ token,user, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            if(user){
                token.role=user.role;
                token.cantVoices=user.cantVoices;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.image=token.picture||session.user.image
            session.user.token = token.accessToken;
            session.user.role=token.role;
            session.user.cantVoices=token.cantVoices;
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
        error: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
});