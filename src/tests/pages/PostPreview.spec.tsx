import { render, screen } from '@testing-library/react'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { mocked } from 'jest-mock'
import { getPrismicClient } from '../../services/prismic'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'


jest.mock('../../services/prismic')
jest.mock('next-auth/react')
jest.mock('next/router')
const post = { slug: 'my-fake-post', title: 'My Fake Post', content: '<p>post content</p>', updatedAt: '07 de Março' };


describe('Post preview page', () => {

  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'})

    render(
      <Post post={post}/>
    )
    expect(screen.getByText('My Fake Post')).toBeInTheDocument()
    expect(screen.getByText('post content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'Fulano de Tal', 
          email: 'fulano.de.tal@gmai.com'
        },
        activeSubscription: 'fake-subscription',
        expires: 'fake-expiration',
      }, 
      status: 'authenticated'
    })

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    render(
      <Post post={post}/>
    )

    expect(pushMocked).toHaveBeenCalledWith('/posts/my-fake-post')
  });

  it('loads initial data',async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My Fake Post'}
          ],
          content: [
            { type: 'paragraph', text: 'Post fake content'}
          ], 
        },
        last_publication_date: '03-07-2022'
      })
    } as any)

    const response = await getStaticProps({
      params: {
        slug: 'my-fake-post'
      }
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-fake-post',
            title: 'My Fake Post',
            content: '<p>Post fake content</p>',
            updatedAt: '07 de março de 2022'
          }
        }
      })
    )

  });

})