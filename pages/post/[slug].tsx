import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'

interface Props {
  post: Post
}
function Post({ post }: Props) {
  return (
    <main>
      <Header />
      <img
        src={urlFor(post.mainImage).url()!}
        alt="Post Main Image"
        className="h-40 w-full   object-cover "
      />
      <article className="mx-auto max-w-3xl p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="text-light text-xl text-gray-500">{post.description}</h2>
        <div className="my-1 flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            alt="Post Main Image"
            className="h-10 w-10 rounded-full  "
          />
          <p className="text-sm font-extralight">
            Blog post by{' '}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            className=""
            serializers={{
              h1: (props: any) => (
                <h1 className="my-5 text-2xl font-bold" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="my-5 text-xl font-bold" {...props} />
              ),
              li: (children: any) => (
                <li className="my-5 text-2xl font-bold">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
    </main>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
  _id,
  slug{
  current
}
}`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
  slug{
  current
},
author -> {
  name,
  image
},
description,
title,
mainImage,
body
}`
  const post = await sanityClient.fetch(query, { slug: params?.slug })
  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 60, //Update the cached page after 60 seconds
  }
}
