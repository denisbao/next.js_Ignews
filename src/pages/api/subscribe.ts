/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { query as db } from 'faunadb'
import { getSession } from 'next-auth/react'
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {

    const session = await getSession({ req })

    // recuperando todos dados do usuario logado
    const user = await fauna.query<User>(
      db.Get(
        db.Match(
          db.Index('user_by_email'),
          db.Casefold(session.user.email)
        )
      )
    )

    // recupera o id do usuário no stripe
    let customerId = user.data.stripe_customer_id

    // se o usuário não tiver cadastro no stripe, faz o cadastro e atualiza no faunadb
    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
      })

      await fauna.query (
        db.Update(
          db.Ref(db.Collection('users'), user.ref.id),
          {
            data:{
              stripe_customer_id: stripeCustomer.id,
            }
          }
        )
      )
      customerId = stripeCustomer.id
    }

    const stripeChechoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {price: 'price_1KTPNTH7YPkY1ILwBv9ZgRY9', quantity: 1}
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL
    })
    return res.status(200).json({ sessionId: stripeChechoutSession.id})
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}