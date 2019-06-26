// Method 1 - Layout as a Higher Order Component
import withLayout from '../components/Layout';

const Page = () => <p>This is the about page.</p>;
export default withLayout(Page);

// Method 2 - Page content as a prop
/*
import Layout from '../components/Layout';

export default function About() {
  return (
    <Layout>
      <p>This is the about page.</p>
    </Layout>
  )
}
*/
