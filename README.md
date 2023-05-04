# Cardboard

An OEmbed data fetch service and component for React.

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
import { Cardboard } from "@sarim.garden/cardboard";

<Cardboard url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />;
```

Here are the props:

```tsx
export interface EmbedProps {
  // the url to embed
  url: string;
  // the maximum width of the embed
  maxwidth?: string;
  // the maximum height of the embed
  maxheight?: string;
  // the placeholder to show while loading
  placeholder?: React.ReactNode;
  // the link to the server e.g. `https://cardboard-web.vercel.app/api/v1`
  providerService?: string;
}
```
