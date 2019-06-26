import Link from 'next/link';

const Index = () => (
  <div>
    <Link href="/about">
      {/* <a title="About Page">About</a> */}
      <button title="About Page">About</button>
    </Link>
    <p>Next.js</p>
  </div>
);

export default Index;
