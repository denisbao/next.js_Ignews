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
          db.If(
            db.Not(
              db.Exists(
                db.Match(
                  db.Index('user_by_email'),
                  db.Casefold(user.email)
                )
              )
            ),
            db.Create (
              db.Collection('users'),
              {data: { email }}
            ),
            db.Get(
              db.Match(
                db.Index('user_by_email'),
                db.Casefold(user.email)
              )
            )
          )
        )
        return true
      } catch {
        return false
      }
    },
  }
})