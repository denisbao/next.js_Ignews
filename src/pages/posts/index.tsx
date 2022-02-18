import Head from 'next/head';
import styles from './styles.module.scss'

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="">
            <time>12 de fevereiro de 2022</time>
            <strong>Mé faiz elementum girarzis, nisi eros vermeio</strong>
            <p>
               Mussum Ipsum, cacilds vidis litro abertis. Per aumento de cachacis, eu reclamis.Quem num gosta di mé, boa gentis num é.Paisis, filhis, espiritis santis.Suco de cevadiss, é um leite divinis, qui tem lupuliz, matis, aguis e fermentis.
            </p>
          </a>
          <a href="">
            <time>12 de fevereiro de 2022</time>
            <strong>A ordem dos tratores não altera o pão duris</strong>
            <p>
              Leite de capivaris, leite de mula manquis sem cabeça.Todo mundo vê os porris que eu tomo, mas ninguém vê os tombis que eu levo!Sapien in monti palavris qui num significa nadis i pareci latim.Tá deprimidis, eu conheço uma cachacis que pode alegrar sua vidis.
            </p>
          </a>
          <a href="">
            <time>12 de fevereiro de 2022</time>
            <strong>Tá deprimidis, eu conheço uma cachacis que pode alegrar sua vidis.</strong>
            <p>
              Mais vale um bebadis conhecidiss, que um alcoolatra anonimis.In elementis mé pra quem é amistosis quis leo.Si num tem leite então bota uma pinga aí cumpadi!Leite de capivaris, leite de mula manquis sem cabeça.
            </p>
          </a>
        </div>
      </main>
    </>
  );
}