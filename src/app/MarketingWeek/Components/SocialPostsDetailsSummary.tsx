import { LinkedInPost } from './LinkedInPost'
import { TwitterPost } from './TwitterPost'

export function SocialPostsDetailsSummary({
  socialPosts,
}: {
  socialPosts: { text: string }[]
}) {
  if (socialPosts.length === 0) {
    return (
      <details>
        <summary className="my-4 text-lg font-semibold text-gray-900 leading-6">
          0 Draft Tweets / Social Posts
        </summary>
        <div className="grid grid-cols-2 gap-2">
          No tweets for this time period
        </div>
      </details>
    )
  }
  return (
    <details>
      <summary className="my-4 text-lg font-semibold text-gray-900 leading-6">
        {socialPosts.length} Draft Tweets / Social Posts
      </summary>
      <div className="grid grid-cols-2 gap-2">
        {socialPosts?.map((post, index) => {
          if (index % 2 === 0) {
            return <LinkedInPost key={index} text={post.text} />
          }
          return <TwitterPost key={index} text={post.text} />
        })}
      </div>
    </details>
  )
}
