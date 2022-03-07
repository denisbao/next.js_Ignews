import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps } from '../../pages/posts'
import { mocked } from 'jest-mock'
import { getPrismicClient } from '../../services/prismic'


jest.mock('../../services/prismic')

const posts = [
  { slug: 'my-fake-post', title: 'My Fake Post', excerpt: 'post excerpt', updatedAt: '07 de Março' }
];


describe('Posts page', () => {

  it('renders correctly', () => {
    render(
      <Posts posts={posts}/>
    )
    expect(screen.getByText('My Fake Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-fake-post',
            data: {
              title: [
                { type: 'heading', text: 'My Fake Post'}
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt'}
              ],
            },
            last_publication_date: '03-07-2022'
          }
        ]
      })
    } as any) // usado para que não seja pecriso passar todos os valores necessários do método query

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-fake-post',
            title: 'My Fake Post',
            excerpt: 'Post excerpt',
            updatedAt: '07 de março de 2022'
          }]
        }
      })
    )
  });

})