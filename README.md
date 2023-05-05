# Cardboard

An OEmbed data fetch service and component for React.

<img src="https://user-images.githubusercontent.com/3000809/236195433-4176f047-f2db-4348-9b40-aecd298abca4.png" width=300/>

## Features

- Fetches OEmbed data from a URL, e.g. YouTube, Twitter, etc.
- Implements discovery of OEmbed data from HTML pages
- Centralizes scripts in a provider to avoid duplicates

## Service

POST to `https://cardboard-web.vercel.app/api/v1` with a JSON body containing a `url` property with the URL to fetch.

Optional properties:

- `maxwidth` - The maximum width of the embed
- `maxheight` - The maximum height of the embed

Full request and response details can be found on the [OEmbed spec](https://oembed.com/).

You can deploy your own service by cloning this repository and deploying `packages/web`. Vercel is recommended.

## Component

NPM link: <https://www.npmjs.com/package/@sarim.garden/cardboard>

```
npm install @sarim.garden/cardboard
```

You can also use `yarn` or `pnpm`.

Use the component like so:

```jsx
import { Cardboard, CardboardBox } from "@sarim.garden/cardboard";

// put this anywhere in your app (preferably near the root) to manage scripts
<CardboardBox/>

// use the component
<Cardboard url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />;
```

Here are the props:

```tsx
export interface CardboardProps {
  // the url to embed
  url: string;
  // the max width of the embed
  maxwidth?: string;
  // the max height of the embed
  maxheight?: string;
  // the placeholder to show while loading
  placeholder?: React.ReactNode;
  // the error to show if the embed fails
  error?: React.ReactNode;
  // classes to apply to the embed
  className?: string;
  // the provider to use e.g. https://cardboard-web.vercel.app/api/v1
  providerService?: string;
}
```
