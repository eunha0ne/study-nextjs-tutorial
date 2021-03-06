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

You can access all the pages via client side since the app loads the relevant JavaScript content. But when you try to load it directly, it has no HTML content to serve.

That's because we asked Next.js to export only the index (/) page.


### Exporting Other pages
```javascript
const fetch = require('isomorphic-unfetch');

module.exports = {
  exportPathMap: async function() {
    const paths = {
      '/': { page: '/' },
      '/about': { page: '/about' }
    };
    const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
    const data = await res.json();
    const shows = data.map(entry => entry.show);

    // The page /show/[id] will then use the query object to get the id and fetch more info about the show.
    shows.forEach(show => {
      paths[`/show/${show.id}`] = { page: '/show/[id]', query: { id: show.id } };
    });

    return paths;
  }
};
```
Next.js won't build the app when running the next export command. **In this case, the page /show/[id] already exists in the build, and there's no need to build the whole app again.**

But if we've made any changes to the app, we need to build the app again to get those changes.

### Deploying the App

```bash
cd out
now
```

if you need to create pages dynamically after you've deploy the app, this is not the solution. For that, you need to build the app and start it with next start


## TypeScript

Next.js has support for TypeScript out of the box, making it possible to have type checking and other amazing features like:
* Types for Next.js internals like next/head, next/router and pages
* Almost no setup, Next.js will do all the heavy lifting for you
* You can leverage all the power of TypeScript in your app without limitations, this includes a better developer experience, the amazing VS Code ecosystem and more

```
npm init -y
npm install --save react react-dom next
mkdir pages
npm install --save-dev typescript @types/react @types/react-dom @types/node
```

create pages/index.tsx with the following content:
```javascript
import { NextPage } from 'next';

const Home: NextPage<{ userAgent: string }> = ({ userAgent }) => (
  <h1>Hello world! - user agent: {userAgent}</h1>
);

Home.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] || '' : navigator.userAgent;
  return { userAgent };
};

export default Home;
```

next-env.d.ts
```javascript
/// <reference types="next" />
/// <reference types="next/types/global" />
```

tsconfing.json
 ```javascript
 {
  "compilerOptions": {
    "target": "es5",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve"
  },
  "exclude": [
    "node_modules"
  ],
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx"
  ]
}
 ```

 ## Lazy Loading Modules

 **Next.js does automatic code splitting and it is based on the pages in your app. For example, if one of your modules is used at-least in half of your pages, then it moves into the main JavaScript bundle.** If not, that module stays inside the page's bundle.

This is a pretty decent default setup. But sometimes, we need much better control for loading modules. For example, have a look at the following scenario, where:
* We are building a hacker news clone based on the official firebase API,
* We fetch the data on the server to do SSR,
* We also fetch data in the client side when needed (when switching pages).

Firebase is a pretty big module (more than the size of react, react-dom and next.js all combined), so we're importing only firebase/app and firebase/database that our app needs.

**When it comes to client side, we only need firebase modules when the user starts navigating into a different page. So, if we can load the modules at that time, we can improve the initial loading of our app.**

### Analyze
```bash
npm run analyze:browser
```

### Lazy Loading
We use the firebase modules only when the user is trying to navigate into a different page. So, if we can load the modules at that time, that is a huge win for our app.

Luckily, we can easily do that with Next.js's dynamic import functionality.

```javascript
export default async function loadDb() {
  // const firebase = require('firebase/app');
  // require('firebase/database');
  const firebase = await import('firebase/app');
  await import('firebase/database');

  try {
    firebase.initializeApp({
      databaseURL: 'https://hacker-news.firebaseio.com'
    });
  } catch (err) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(err.message)) {
      console.error('Firebase initialization error', err.stack);
    }
  }

  return firebase.database().ref('v0');
}
```

```bash
npm run build
npm run dev
```

### Test Result
As you have witnessed, it only loads when you navigate a page for the first time. Here is what is actually happening.

At the first time, getInitialProps of the pages/post.js page imports the firebase/app and firebase/databasemodules (vialib/load-db.js). So, the app loads the bundle.

Even the second time, pages/index.js page imports the firebase/app and firebase/database modules. But at that time, they are already loaded and there is no reason to load them again.
* You need the firebase/app and firebase/database modules in all of the pages.
* **Lazy loaded modules reduce the size of the main JavaScript bundle app.js, but they don't affect the initial page loading time** since the page is server rendered.
* Loading of the main JavaScript bundle doesn't block the initial HTML rendering
The only benefit this gives us, is the quick JavaScript interactivity because the app.js loads faster due to the reduced size.

## Lazy Loading Components

We use a lot of React components in our applications. We include them in our main JavaScript bundle (app.js) or in one of the page's JavaScript bundles. Sometimes some of these components are pretty big.

For example, this is a pretty simple blog site we built with Next.js based on markdown. It also supports syntax highlighting. For that, we use react-highlight, and it's a pretty big module.

Since it's used in almost all of the pages, react-highlight is included in our main JavaScript bundle.

**But we don't need to use the syntax highlighter on every page. It's only needed when there's a code sample in the blog post.**

```bash
npm install --save @zeit/next-bundle-analyzer
npm install --save-dev cross-env
npm install -g marked
npm install react-highlight --save
```

In this app, we've isolated markdown rendering into a React Higher Order Component (HOC). It's located at lib/with-post.js. Here's the content of that file:
```javascript
import React from 'react';
import MyLayout from '../components/MyLayout';
import marked from 'marked';

// Now we are trying to convert the above Highlight component into a dynamic component. Dynamic components are powered by the dynamic imports in Next.js

// import Highlight from 'react-highlight';
import dynamic from 'next/dynamic';

const Highlight = dynamic(import('react-highlight'));

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: true
});

export default function WithPost(options) {
  return class PostPage extends React.Component {
    renderMarkdown() {
      // If a code snippet contains in the markdown content
      // then use Highlight component
      if (/~~~/.test(options.content)) {
        return (
          <div>
            <Highlight innerHTML>{marked(options.content)}</Highlight>
          </div>
        );
      }

      // If not, simply render the generated HTML from markdown
      return <div dangerouslySetInnerHTML={{ __html: marked(options.content) }} />;
    }

    render() {
      return (
        <MyLayout>
          <h1>{options.title}</h1>
          {this.renderMarkdown()}
        </MyLayout>
      );
    }
  };
}
```

Lazy loading dynamic components are pretty important for a high performing app. It allows you to load components whenever you need to. If you do this wisely, **you can reduce the amount of JavaScript that needs to be downloaded and make your app load faster.**

Next.js supports server-side rendering (SSR) for these dynamic components by default. So, you don't lose anything by using dynamic components.

We've only used the basic functionality of dynamic components. You can learn more about them by referring to [documentation](https://nextjs.org/docs/#dynamic-import).

## Create AMP Pages

You can create an AMP only page by exporting amp: true in the config object, here's how:
```javascript
// pages/index.js
export const config = { amp: true };

export default function Index(props) {
  return <p>Welcome to the AMP only Index page!!</p>;
}
```

You can also create a hybrid AMP page by addding amp: 'hybrid':
```javascript
// pages/index.js
import { useAmp } from 'next/amp';

export const config = { amp: 'hybrid' };

export default function Index(props) {
  const isAmp = useAmp();
  return <p>Welcome to the {isAmp ? 'AMP' : 'normal'} version of the Index page!!</p>;
}
```
Then to view the AMP version of the page add ?amp=1 to the URL. useAmp() is a hook to know if any component, not only the page, is being used for AMP.

## Automatic Prerendering

Before **Next.js 9**, when you ran `next build`, server/serverless bundles would be created along with the client bundles. Then if you wanted to create static HTML versions of your pages you would need to run `next export`.

This could be sub-optimal if you need both dynamic and static pages. Since **Next.js 9, next build comes with Automatic Prerendering which can decide the build output per page, allowing your app to leverage static files and lambdas in the same app.**

* [Next.js 9](https://nextjs.org/blog/next-9)

```bash
npm i next@latest react@latest react-dom@latest
npm run build
```

### Static Build
```javascript
// index.js
const Index = () => <h1>Hello World</h1>;
export default Index;
```
**handled by ⚡/, it was compiled to a static HTML file** because it doesn't require Server Side Rendering (SSR). **_app, _document and _error are internal pages of Next.js.**

### Sever Side Rendering

Let's add a new page called pages/agent.js that uses SSR to retrieve the user agent:
```javascript
const Agent = ({ userAgent }) => <h1>Your user agent is: {userAgent}</h1>;

Agent.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
  return { userAgent };
};

export default Agent;
```
Our new page is very similar to pages/index.js **but now we're also adding getInitialProps, which will add dynamic data to the page before render.** Now let's build our app again:

### Serverless

We can have static and SSR pages in the same app by only using next build. **Static HTML should always be fast since it can be cached very well, although there are still cases where you need to handle dynamic data. For these cases you can create lambda functions for each page.** We don't need a server if we can create a lambda per page, pages are independent after all, let's add the file next.config.js in the root folder with the following content:
```javascript
module.exports = {
  target: 'serverless'
};
```
Now when building the app again serverless bundles will be created for non-static pages: It was compiled to λ (Lambda) 

* lambda expressions
  * lambda expressions are **abstractions which enable a function to be passed around like data. In JavaScript, everything can be treated as an object, this means that a function can be sent into another function as a parameter and can also be retrieved from the called function as a return value.** An example of lambda expression is as shown below.
  ```javascript
  function traverseArray(arr, func) {
      let result = '';
      for (const value of arr) {
          result += func(value) + ' ';
      }
  }

  const arr = [1, 2, 3, 4, 5];
  const doubler = value => value * 2;

  traverseArray(arr, doubler); // 2 4 6 8 10 
  ```
  
  
* Now you know how `next build` works and how it can **automatically choose what the ideal build output for each page is.** Here are some good tips to help make sure the ideal output is chosen:
  * In most cases you don't need a custom server, so **try to add `target: 'serverless'` whenever possible**
  * `getInitialProps` is the main deciding factor for **whether a page is static or not, don't add it if you don't need SSR**
  * Not all dynamic data has to have SSR, e.g if it's behind a login, or **if you don't need SEO on it, for cases like that it can be better to do the fetching outside getInitialProps** and get the benefits of static HTML
