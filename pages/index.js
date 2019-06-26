// Method 1 - Layout as a Higher Order Component
import withLayout from '../components/Layout';

const Page = () => <p>Next.js index</p>;
export default withLayout(Page);

// Method 2 - Page content as a prop
/*
import Layout from '../components/Layout';

export default function Index() {
  return (
    <Layout>
      <p>Next.js</p>
    </Layout>
  );
}
*/
