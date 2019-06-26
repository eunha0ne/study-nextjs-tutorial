# Next.js Tutorial Summary
* [Learn](https://nextjs.org/learn/basics/getting-started)

## Getting Started
```
npm init -y
npm install --save react react-dom next
mkdir pages
```
* Handling Errors:
By default, Next.js will track errors like these and show it in the browser. This helps you identify errors and fix them quickly. **Once you fix the issue, the page will appear instantly without a full page reload.**

## Navigate Between pages
* Client-Side History Support:
When you hit the Back button, it navigates the page to the index page entirely via the client; **next/link does all the location.history handling for you.** You don't need to write even a single line of client-side routing code.

* Link is Just a Higher Order Component (HOC):
Actually, **the title prop on next/link component has no effect. That's because next/link is just a [higher order component](https://reactjs.org/docs/higher-order-components.html)** which only accepts the "href" and some similar props. In this case, the child of the next/link component is the anchor tag.

* Link Works With Anything:
Just like a button, **you can place any of your custom React components or even a  div within a Link.**

## Using Shared components
* The Component Directory:
We don't need to put our components in a special directory; **the directory can be named anything. The only special directory is the pages directory.** You can even create the Component inside the pages directory.

* The Layout Component:
In our app, we'll use a common style across various pages. For this purpose, **we can create a common Layout component and use it for each of our pages.**

* Rendering Child Components:
  - Method 1 - Layout as a Higher Order Component
  - Method 2 - Page content as a prop

## Create Dynamic pages
* Adding a list of posts:
```javascript
import Layout from '../components/MyLayout.js';
import Link from 'next/link';

const PostLink = props => (
  <li>
    <Link href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
);
export default function Blog() {
  return (
    <Layout>
      <h1>My Blog</h1>
      <ul>
        <PostLink title="Hello Next.js" />
        <PostLink title="Learn Next.js is awesome" />
        <PostLink title="Deploy apps with Zeit" />
      </ul>
    </Layout>
  );
}
```
* Passing Data via Query Strings:
```javascript
import { withRouter } from 'next/router';
import Layout from '../components/MyLayout.js';

const Page = withRouter(props => (
  <Layout>
    <h1>{props.router.query.title}</h1>
    <p>This is the blog post content.</p>
  </Layout>
));

export default Page;
```
  - We import and use the "withRouter" function from "next/router" which will inject the Next.js router as a property.
  - In this case, we are using the router's “query” object, which has the query string params.
  - Therefore, we get the title with props.router.query.title.
  - **`withRouter` can be used on any component** in your Next.js application.

## Clean URLs with Route Masking
```javascript
const PostLink = props => (
  <li>
    <Link as={`/p/${props.id}`} href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
);
```
* Route Masking:
In the <Link> element, we have used another prop called **“as”. That's the URL which we need to show on the browser.** The URL your app sees is mentioned in the “href” prop.

* History Awareness:
**Route masking works pretty nicely with the browser history.** All you have to do is just add the “as” prop for the link.
