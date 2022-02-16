import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna'
import { query as db } from 'faunadb'

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile}) {
      const { email } = user;

      try {
        await fauna.query (
          db.Create (
            db.Collection('users'),
            {data: { email }}
          )
        )
        return true
      } catch (error) {
        return false
      }

      
    },
  }
})