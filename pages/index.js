import Layout from '../components/Layout';
import Link from 'next/link';

function getPosts() {
  return [
    { id: 'hello-nextjs', title: 'Hext.js' },
    { id: 'learn-nextjs', title: 'Learn Next.js is awesom' },
    { id: 'deploy-nextjs', title: 'Depoly apps with ZEIT' }
  ];
}

export default function Blog() {
  return (
    <Layout>
      <h1>Next Blog</h1>
      <ul>
        {getPosts().map(post => (
          <li key={post.id}>
            <Link as={`/${post}`} href={`/post?title=${post.title}`}>
              <a>{post.title}</a>
            </Link>
          </li>
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
      li {
        list-style: none;
        margin: 5px 0;
      }
      a {
        text-decoration: none;
        color: blue;
      }
      a:hover {
        opacity: 0.6
      }
      `}</style>
    </Layout>
  );
}
