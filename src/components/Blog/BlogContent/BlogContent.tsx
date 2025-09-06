export interface IBlogContent {
  children?: React.ReactNode
}

const BlogContent: React.FC<IBlogContent> = ({ children }) => {
  return <div itemProp="articleBody">{children}</div>
}

export default BlogContent
