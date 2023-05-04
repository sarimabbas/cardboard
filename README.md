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

```jsx
import { Cardboard } from "@sarim.garden/cardboard";

<Cardboard url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />;
```

You must set `process.env.EMBED_PROVIDER` to the URL of the service, otherwise the component will not work.
