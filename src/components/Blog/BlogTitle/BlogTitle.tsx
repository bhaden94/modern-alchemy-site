import PageTitle from '~/components/PageTitle/PageTitle'

import classes from './BlogTitle.module.css'

export interface IBlogTitle {
  title: string
}

const BlogTitle: React.FC<IBlogTitle> = ({ title }) => {
  return <PageTitle title={title} className={classes.blogTitle} />
}

export default BlogTitle
