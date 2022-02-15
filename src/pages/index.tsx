import { GetServerSideProps} from 'next'
import Head from 'next/head';
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';


interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}


export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.contectContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, Welcome!</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get access to all the publications <br/>
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId}/>
        </section>
        <img src="/images/avatar.svg" alt="girl coding" />
      </main>
    </>
  )
}

// NEXT.JS: SERVER SIDE RENDERING (SSR)

// a função precisa obrigatoriamente possuir esse nome
export const getServerSideProps: GetServerSideProps = async () => {

  // chamada para a api do Stripe (serviço de pagamento)
  const price = await stripe.prices.retrieve('price_1KTPNTH7YPkY1ILwBv9ZgRY9')

  const product = {
    price: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    }
  }
}
