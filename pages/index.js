import Layout from '../components/Layout';
import Link from 'next/link';

const PostLink = props => (
  <li>
    <Link
      as={`/${props.id}`}
      href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
);
const headingStyleTemp = { color: '#aaa' };

export default function Blog() {
  return (
    <Layout>
      <h1 style={headingStyleTemp}>Next.js</h1>
      <ul>
        <PostLink id="hello-nextjs" title="Hello Next.js" />
        <PostLink id="learn-nextjs" title="Learn Next.js is awesome" />
        <PostLink id="deploy-nextjs" title="Deploy apps with Zeit" />
      </ul>
    </Layout>
  );
}
