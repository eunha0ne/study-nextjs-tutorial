# Next.js Tutorial Summary

> Next.js 튜토리얼을 따라가며 중요한 부분을 추출하고 정리한 내용을 담고 있습니다.

* [Tutorial](https://nextjs.org/learn/basics/getting-started)
* **Feature**
  * Sever Rendering
  * Static Exporting
  * CSS-in-JS
  * Zero Setup
  * Fully Extensible
  * Rready for Production

## Table of Contents
* Getting Started
  * Handling errors
* Navigate Between pages
  * Client-side History Support
  * `Link` is Just a Higher Order Component (HOC)
  * `Link` Works with Anything
* Using Shared components
  * The Component directory
  * The `Layout` Component
  * Rendering Child Components
* Create Dynamic pages
  * Adding a list of posts
  * padding Data via Query Strings
* Clean URLs with Route Masking
  * Route Masking
  * History Awareness
  * Reload
* Sever Side Support for Clean URLs
  * create a Custom Server
  * Information on URL
* Fetching Data for pages
  * Fetching shows
  * Implement the Post Page
  * Fetch Data in Clinet Side
* Styling Components (with `styled-jsx`)
  * No Effect for Nested Component
  * Global Style


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

```javascript
// components/MyLayout.js
import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const withLayout = Page => {
  return () => (
    <div style={layoutStyle}>
      <Header />
      <Page />
    </div>
  );
};

export default withLayout;

// pages/index.js
import withLayout from '../components/MyLayout';

const Page = () => <p>Hello Next.js</p>;

export default withLayout(Page);
```

```javascript
// components/MyLayout.js
import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const Layout = props => (
  <div style={layoutStyle}>
    <Header />
    {props.content}
  </div>
);

export default Layout;

// pages/index.js
import Layout from '../components/MyLayout.js';

const indexPageContent = <p>Hello Next.js</p>;

export default function Index() {
  return <Layout content={indexPageContent} />;
}
```

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

* Reload(F5):
When navigated to the post page. the Reload(F5) **gives us a 404 error. That's because there is no such page to load on the server.** The server will try to load the page p/hello-nextjs, but we only have three pages: index.js, about.js and post.js.

## Sever Side Support for Clean URLs
* create a Custom Sever:
```
npm install --save express
```
Then create a file called server.js in the root folder of your app and add following content:
```javascript
const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
```

**On Windows, NODE_ENV=production will not work by default.** One solution is to install the npm module [cross-env](https://www.npmjs.com/package/cross-env) into your app. Then update the start script like this: "start": "cross-env NODE_ENV=production node server.js"
```
npm install --save-dev cross-env
```

* Information on URL:
Our **/post page accepts the title via the query string parameter title. In client side routing**, we can easily give it a proper value with URL masking. (via the as prop in Link).
```javascript
<Link as={`/p/${props.id}`} href={`/post?title=${props.title}`}>
  <a>{props.title}</a>
</Link>
```
**But in the server route, we don't have that title because we only have an ID for the blog post in the URL**. So, in that case, we set the ID as the server side query string param.

## Fetching Data for pages

> we are going to fetch them from a remote server.

```
npm install --save isomorphic-unfetch
```
```javascript
Index.getInitialProps = async function() {
  const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
  const data = await res.json();

  console.log(`Show data fetched. Count: ${data.length}`);

  return {
    shows: data.map(entry => entry.show)
  };
};
```
* Fetching Shows:
That's `a static async function` you can add into any page in your app. Using that, **we can fetch data and send them as props to our page.**

* Implement the Post Page:
```javascript
Post.getInitialProps = async function(context) {
  const { id } = context.query;
  const res = await fetch(`https://api.tvmaze.com/shows/${id}`);
  const show = await res.json();

  console.log(`Fetched show: ${show.name}`);

  return { show };
};
```
the first argument of the function is the `context` object. **It has a query field that we can use to fetch information.**

* Fetch Data in Client Side:
Here we can only see the message on the browser console. **That's because we navigated to the post page via the client side. If you just visit a post page directly (eg:- http://localhost:3000/p/975) you'll be able to see the message printed on the server** but not in the client.

## Styling Components
**Next.js comes preloaded with a CSS in JS framework called `styled-jsx`**, specifically designed to make your life easier. It allows you to write familiar CSS rules for your components; **rules will have no impact on anything other than the components**

> That means, your CSS rules are scoped.

```
<style jsx>
  a {
    text-decoration: none;
    color: blue;
  }

  a:hover {
    opacity: 0.6;
  }
</style>
```
Styled jsx works as a babel plugin. It will parse all of the CSS and apply it in the build process.

* No Effect for Nested Component:
**CSS rules have no effect on elements inside of a child component.** This feature of **styled-jsx helps you to manage styles for bigger apps.**

* Global Style:
```
<style jsx global>{`
  .markdown {
    font-family: 'Arial';
  }

  .markdown a {
    text-decoration: none;
    color: blue;
  }

  .markdown a:hover {
    opacity: 0.6;
  }
`}</style>
```

## Deploying a Next.js app
* Run two instances:
```javascript
"scripts": {
  "start": "next start -p %PORT%"
}
```

```
npm i -g cross-env
npm run build
cross-env PORT=8000 npm start
cross-env PORT=9000 npm start
```

## Deploying to ZEIT Now
* Deploying a Next.js App:

  1. Using `ZEIT Now`, add the following scripts to the package.json file:
  ```
  "scripts": {
    "build": "next build",
    "now-build": "next build"
  }
  ```

  2. Next, create a next.config.js file in the root of the project and specify target as 'serverless':
  ```javascript
  module.exports = {
    target: 'serverless'
  };
  ```

  3. Then, create a now.json file in the root of your project with the following contents:
  ```javascript
  {
    "version": 2,
    "builds": [{ "src": "package.json", "use": "@now/next" }]
  }
  ```
  The now.json file achieves a few things:
  version - specifies which Now platform version to use for the deployment
  alias - used to alias deployments when using a Git integration
  name - provides a prefix for your deployments

  4. Using the -y flag will initialize the created package.json file with these default settings.
  ```
  yarn init -y

  npm install -g now
  ```

[Create a Next.js Application and Deploy with Now](https://zeit.co/guides/deploying-nextjs-with-now/)
[Getting Started with Next.js and Now](https://zeit.co/guides/deploying-nextjs-with-now#creating-the-project)

Even if you start your app on port 8000, **once deployed to now, you can access it with port 443** (the default port for "https" websites).

* Build Your App Locally:
Now will build your app inside it's build infrastructure. But, **not every hosting provider will have something like that. In that case, you can build your app locally** with:
```
npm run build
```


## Export into a Static HTML App

The best way to deploy your web app is as a static HTML app, if that's possible. With a static app, **you can use a fast and efficient web server like `NGINX` or a cost-effective static hosting service like `ZEIT now` or `GitHub pages`.**

**But not every app can be deployed as a static app.** If your app needs to generate dynamic pages at the runtime, you can't deploy it as a static app.

### Export the index Page
* next.config.js
```javascript
module.exports = {
  exportsPathMap: function () {
    return {
      '/': { page: '/' }
    };
  }
};
```
* package.json
```javascript
"scripts": {
  "build": "next build",
  "export": "next export"
}
```
* commands
```bash
npm run build
npm run export

# You can see the exported HTML content on a directory called out inside your project.

npm install -g serve
cd out
serve -p 8080
```

