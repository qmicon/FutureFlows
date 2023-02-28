import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        // ...add more providers here
    ],
    callbacks: {
        async session({ session, token, user }) {
            let data = {email: session.user.email}
            let res1 = await fetch(process.env.NEXTAUTH_URL + '/api/addEmail', {
                method: 'POST',
                headers: {
                  'Content-Type' : 'applicantion/json'
                },
                body: JSON.stringify(data)
              })
              if(res1.status == 422) session.isregister = false
              else session.isregister = true
            
            return session
        }
    }
})