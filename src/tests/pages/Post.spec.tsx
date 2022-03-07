import { render, screen } from '@testing-library/react'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { mocked } from 'jest-mock'
import { getPrismicClient } from '../../services/prismic'
import { getSession } from 'next-auth/react'


jest.mock('../../services/prismic')
jest.mock('next-auth/react')
const post = { slug: 'my-fake-post', title: 'My Fake Post', content: '<p>post content</p>', updatedAt: '07 de Março' };


describe('Post page', () => {

  it('renders correctly', () => {
    render(
      <Post post={post}/>
    )
    expect(screen.getByText('My Fake Post')).toBeInTheDocument()
    expect(screen.getByText('post content')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any)

    const response = await getServerSideProps({
      params: { slug: 'my-fake-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
            destination: '/',
        })
      })
    )
  });

  it('redirects user when a subscriptin is active',async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

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

    const response = await getServerSideProps({
      params: { slug: 'my-fake-post' }
    } as any)

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