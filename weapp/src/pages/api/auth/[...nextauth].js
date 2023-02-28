import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            httpOptions: {
                timeout: 40000,
              }
        })
        // ...add more providers here
    ],
    session: {
        keepAlive: 60
    },
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
              else if(res1.status == 200) session.isregister = true
            let res2 = await fetch(process.env.NEXTAUTH_URL + '/api/getEmail?email=' + session.user.email, {
                method: 'GET'
            })
            let res = await res2.json()
            if(res.length > 0) {
                session.user.privateKey = res[0].privateKey
                session.user.address = res[0].address
                session.user.keyIndex = "0"
            }
            
            return session
        }
    }
})