import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

import styles from './styles.module.scss'


type Post = {
  slug: string,
  title: string,
  excerpt: string,
  updatedAt: string,
}

interface PostsProps {
  posts: Post[]
}


export default function Posts( { posts }: PostsProps ) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>

          {posts.map(post => (
            <a key={post.slug} href="">
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}

        </div>
      </main>
    </>
  );
}

// Acesso a API do Prismic CMS via SSG
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  // buscando todos os posts do Prismic
  const response = await prismic.query<any>([
    Prismic.predicates.at('document.type', 'publication')
  ], {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100,
  })

  // Formatação dos dados recebidos do Prismic usando a lib prismic-dom
  // (a formatação deve ser feita antes de enviar os dados para a interface)
    // yarn add prismic-dom
    // yarn add @types/prismic-dom
  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  // visualização do retorno no formato enviado pelo Prismic:
  // console.log(JSON.stringify(response, null, 2))

  return {
    props: {
      posts
    }
  }
}