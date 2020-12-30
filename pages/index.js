import fs from 'fs'
import matter from 'gray-matter'
import Link from 'next/link'
import Head from 'next/head'
import path from 'path'
import Layout from '../components/Layout'
import { postFilePaths, POSTS_PATH } from '../utils/mdxUtils'
import Image from 'next/image'
import { formatDate } from '../lib/index'
import { generateRss } from '../lib/generate-rss'
import { generatePostsSitemap } from '../lib/generate-posts-sitemap'
import Footer from '../components/footer'
import Header from '../components/header'
import { socialImage } from '../components/social-image'
import { ArticleJsonLd } from 'next-seo';
import { CloudwaysSquareGridItem } from '../components/ads/cloudways'
import { GrammarlySquareGridItem } from '../components/ads/grammarly'
import { NameCheapSquareGridItem } from '../components/ads/namecheap'

import styles from '../styles/Index.module.css'

export default function Index({ posts }) {
  const date = new Date()
  const latestUpdate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date)

  // console.log('posts: ', posts)

  return (
    <Layout>
      <Head>
        <title>Dev By RayRay</title>
        <meta property="og:url" content="https://byrayray.dev" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Dev By RayRay"
        />
        <meta name="twitter:card" content="summary" />
        <meta
          property="og:description"
          content="Building awesome projects with HTML, CSS, JavaScript and a lot more"
        />
        <meta name="description" content="Building awesome projects with HTML, CSS, JavaScript and a lot more" />
        <meta property="og:image" content="https://res.cloudinary.com/raymons/image/upload/c_crop,h_612,w_800,x_490,y_270/v1608750035/devbyrayray/blog/Template.png" />
      </Head>
      <ArticleJsonLd
        url="https://byrayray.dev"
        title="Dev By RayRay | Building awesome projects with HTML, CSS, JavaScript and a lot more"
        images={[
          'https://res.cloudinary.com/raymons/image/upload/c_crop,h_612,w_800,x_490,y_270/v1608750035/devbyrayray/blog/Template.png'
        ]}
        datePublished={latestUpdate}
        dateModified={latestUpdate}
        authorName={['Dev By RayRay']}
        publisherName="Dev By RayRay"
        publisherLogo="https://res.cloudinary.com/raymons/image/upload/c_crop,h_612,w_800,x_490,y_270/v1608750035/devbyrayray/blog/Template.png"
        description="Building awesome projects with HTML, CSS, JavaScript and a lot more."
      />
      <Header header={true} />
      <div className={styles.posts__container}>
        <div className={styles.posts}>

          {posts.map((post, index) => (
            <>
              {index === 0 && <h2 className={styles.posts__heading}>Newest posts</h2>}
              <div className={styles.post__item} key={post.filePath}>
                <div className={styles.post__content_wrapper}>
                  <div className={styles.post__image}>
                    <Link
                      as={`/posts/${post.slug}`}
                      href={`/posts/[slug]`}
                    >
                      <a>
                      <Image width={1800} height={1100} layout="responsive" unoptimized={true} loading="lazy" className="h-56 w-full object-cover md:w-56" src={socialImage(post.data.title, post.data.description, post.data.image)} alt={post.data.title} />
                      </a>
                    </Link>
                  </div>
                  <div className={styles.post__content}>
                    <time>{post.data.date}</time> <br /> 
                    <strong>
                      <Link
                        as={`/posts/${post.slug}`}
                        href={`/posts/[slug]`}
                      >
                        <a>{post.data.title}</a>
                      </Link>
                    </strong>

                  </div>
                </div>
              </div>
              {index === 5 && <div className={styles.dailydev__banner}>
                <h3 className={styles.dailydev__title}>
                  The best Developer & Programming news
                </h3>
                <hr className={styles.dailydev__hr} />
                <a className="block" href="https://api.daily.dev/get?r=devbyrayray" target="_blank" rel="noopener noreferrer"><img src="https://res.cloudinary.com/raymons/image/upload/v1609161827/devbyrayray/blog/daily-dev.webp" width="1300" height="642" loading="lazy" />
                </a>
              </div>}
              {index === 5 && <h2 className={styles.posts__heading}>Archive</h2>}

              {index % 10 === 0 && index > 7 && <div className={styles.posts__ad_item}><CloudwaysSquareGridItem key={99998} ></CloudwaysSquareGridItem></div>}
              {index % 12 === 0 && index > 6 && <div className={styles.posts__ad_item}><GrammarlySquareGridItem height={48} key={9999}></GrammarlySquareGridItem></div>}
              {index % 15 === 0 && index > 6 && <>
                <div className={styles.posts__ad_item}><NameCheapSquareGridItem key={99997}></NameCheapSquareGridItem></div>
              </>}
            </>
          ))}
        </div>
      </div>
      <Footer />
    </Layout>
  )
}

export function getStaticProps() {
  const posts = postFilePaths.map((filePath) => {
    const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
    const { content, data } = matter(source)
    data.date = formatDate(data.date)

    return {
      content,
      data,
      filePath,
      slug: filePath.replace(/\.mdx?$/, '')
    }
  }).filter((postItem) => postItem.data.published).reverse()

  const rss = generateRss(posts)
  fs.writeFileSync('./public/rss.xml', rss);

  const postSitemap = generatePostsSitemap(posts)

  fs.writeFileSync("./public/sitemap-posts.xml", postSitemap, "utf8");


  return { props: { posts } }
}
