import { Fragment } from 'react'

export function BlogPostsDetailsSummary({
  blogPosts,
}: {
  blogPosts: { text: string }[]
}) {
  if (blogPosts.length === 0) {
    return (
      <details>
        <summary className="my-4 text-lg font-semibold text-gray-900 leading-6">
          0 Draft Blog Posts
        </summary>
        <div className="grid grid-cols-2 gap-2">
          No posts for this time period
        </div>
      </details>
    )
  }

  return (
    <details>
      <summary className="my-4 text-lg font-semibold text-gray-900 leading-6">
        {blogPosts?.length || '0'} Draft Blog Posts
      </summary>

      {blogPosts?.map((post, index) => {
        return (
          <Fragment key={index}>
            <h3 className="my-4 mt-4 text-sm font-semibold text-gray-900 leading-6">
              Blog Post {index + 1}
            </h3>
            <pre className="whitespace-pre-wrap" key={index}>
              {post.text}
            </pre>
          </Fragment>
        )
      })}
    </details>
  )
}
