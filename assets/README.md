# Assets

Drop real images here. The site references the following filenames:

| Filename                   | Size         | Purpose                                                  |
| -------------------------- | ------------ | -------------------------------------------------------- |
| `app-icon.png`             | 512×512      | Favicon + apple-touch-icon (linked from `<head>`)        |
| `og-cover.png`             | 1200×630     | Open Graph / Twitter social share image                  |
| `app-screen-home.png`      | 828×1792     | Optional — swap into the hero phone mockup               |
| `app-screen-results.png`   | 828×1792     | Optional — swap into the results split visual            |
| `logo.png` / `logo.svg`    | SVG or 2x    | Optional standalone wordmark / logo mark                 |

Each reference in `index.html` is annotated with a comment like:

```html
<!-- ASSET: replace with a real /assets/app-screen-home.png -->
```

so they are easy to find with a search.

Until you swap in real screenshots, the hero renders a CSS phone mockup and
the results section shows stylized mock UI cards — both look intentional
and on-brand, so the site is fully shippable without any imagery.
