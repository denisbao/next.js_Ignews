import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'


jest.mock('next-auth/react');
jest.mock('next/router');


describe('SubscribeButton Component', () => {

  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null, 
      status: 'unauthenticated'
    })

    render( 
      <SubscribeButton />
    )
    
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  });

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null, 
      status: 'unauthenticated'
    })

    render(
      <SubscribeButton />
    )
  
    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  });

  it('redirects user to posts when alredy authenticated', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'Fulano de Tal', 
          email: 'fulano.de.tal@gmai.com'
        },
        activeSubscription: 'fake-subscription',
        expires: 'fake-expiration'
      }, 
      status: 'authenticated'
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any )

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')
    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalledWith('/posts')
  });

})

