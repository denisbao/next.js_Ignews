import { render, screen } from '@testing-library/react'
import { stripe } from '../../services/stripe'
import Home, { getStaticProps } from '../../pages'
import { mocked } from 'jest-mock'



jest.mock('next/router')
jest.mock('../../services/stripe')
jest.mock('next-auth/react', () => {
  return {
    useSession: () => [null, false]
  }
})


describe('Home page', () => {

  it('renders correctly', () => {
    render(
      <Home product={ { priceId: 'fake-price-id', amount: '$10.00' } }/>
    )
    expect(screen.getByText('for $10.00 month')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

    retrieveStripePricesMocked.mockResolvedValueOnce({  // mockResolvedValuedOnce: porque o método 'retrieve' é originalmente assíncrono
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any); // usado para que não seja necessário passar todos os valores necessários do método retrieve

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            price: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  });

})