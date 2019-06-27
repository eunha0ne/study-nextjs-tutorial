import Layout from '../components/Layout';
import Link from 'next/link';

function getPosts() {
  return [
    { id: 'hello-nextjs', title: 'Next.js' },
    { id: 'learn-nextjs', title: 'Learn Next.js is awesom' },
    { id: 'deploy-nextjs', title: 'Depoly apps with ZEIT' }
  ];
}

const PostLink = ({ post }) => (
  <li>
    <Link as={`/${post}`} href={`/post?title=${post.title}`}>
      <a>{post.title}</a>
    </Link>
    <style jsx>{`
    li {
      list-style: none;
      margin: 5px 0;
    }

    a {
      text-decoration: none;
      color: blue;
      font-family: 'Arial';
    }

    a:hover {
      opacity: 0.6
    }
    `}</style>
  </li>

);

export default function Blog() {
  return (
    <Layout>
      <h1>Next Blog</h1>
      <ul>
        {getPosts().map(post => (
          <PostLink key={post.id} post={post} />
        ))}
      </ul>
      <style jsx>{`
      h1, a {
        font-family: 'Arial',
        color: #eee
      }
      ul {
        padding: 0
      }
      `}</style>
    </Layout>
  );
}
