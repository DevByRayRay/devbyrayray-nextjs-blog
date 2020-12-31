import fs from 'fs'
import matter from 'gray-matter'
import Link from 'next/link'
import Head from 'next/head'
import path from 'path'
import Layout from '../../components/Layout'
import { postFilePaths, POSTS_PATH } from '../../utils/mdxUtils'
import Image from 'next/image'
import { formatDate } from '../../lib/index'
import Footer from '../../components/footer'
import Header from '../../components/header'
import { coverImage } from '../../components/social-image'
import { ArticleJsonLd } from 'next-seo';
import { CloudwaysSquareGridItem } from '../../components/ads/cloudways'
import { GrammarlySquareGridItem } from '../../components/ads/grammarly'
import { NameCheapSquareGridItem } from '../../components/ads/namecheap'
import { useRouter } from 'next/router'

import styles from '../../styles/Index.module.css'
import { PostItem } from '../../components/post-item'

export default function Tag(props) {
    const router = useRouter()
    const { tag } = router.query
    const { tags } = props
    console.log("🚀 ~ file: [tag].js ~ line 26 ~ Tag ~ tags", tags.length)


    const date = new Date()
    const latestUpdate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }).format(date)

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
                    <strong>Tag: {tag}</strong>
                    {tags?.map((post, index) => {
                        return (
                            <PostItem post={post}></PostItem>
                        )
                    })}
                </div>
            </div>
            <Footer />
        </Layout>
    )
}

export function getStaticProps(ctx) {
    const { tag } = ctx.params
    const tags = postFilePaths.map((filePath) => {
        const source = fs.readFileSync(path.join(POSTS_PATH, filePath))
        const { content, data } = matter(source)
        data.date = formatDate(data.date)

        return {
            content,
            data,
            filePath,
            slug: filePath.replace(/\.mdx?$/, '')
        }
    }).filter((postItem) => findTagsInPost(tag, postItem.data.tags) && postItem.data.published)


    return { props: { tags } }
}

const findTagsInPost = (tag, tags) => tags.map((item) => item.toLowerCase()).includes(tag)

export async function getStaticPaths() {
    return {
        paths: [
            // String variant:
            '/tag/first-post',
        ],
        fallback: true,
    }
}