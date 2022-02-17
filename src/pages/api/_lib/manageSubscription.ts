import { fauna } from "../../../services/fauna";
import { query as db } from 'faunadb'
import { stripe } from "../../../services/stripe";

export async function saveSubscription (subscriptionId: string, customerId: string) {

  // Recuperando REF do usuário do FaunaDB (FQL)
  const userRef = await fauna.query(
    db.Select(
      "ref",
      db.Get(
        db.Match(
          db.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  // Recuperando todos os dados da Subscription do Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Definindo o formato que a subscription deve ser salva no FaunaDB
  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  // Salvando informações no FaunaDB
  await fauna.query(
    db.Create(
      db.Collection('subscriptions'),
      { data: subscriptionData }
    )
  )
  
}