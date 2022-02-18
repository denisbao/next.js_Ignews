import Prismic from '@prismicio/client'

// yarn add @prismicio/client@5.1.1
export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(
    process.env.PRISMIC_ENDPOINT,
    {
      req,
      accessToken: process.env.PRISMIC_ACCESS_TOKEN
    }
  )
  return prismic;
}