# Deploying reciv-app to AWS (S3 + CloudFront)

reciv-app has no server-side rendering, middleware, cookies(), or server
actions — every page is a Client Component that fetches the API directly via
`NEXT_PUBLIC_API_URL`. That means it doesn't need a Node server at all: a
static export served from S3 + CloudFront is simpler and cheaper than running
`next start` on an instance.

## 0. What's already done

- `next.config.ts` — `output: "export"` + `trailingSlash: true`, verified
  locally: `npm run build` produces an `out/` folder with one
  `<route>/index.html` per page (`/`, `/login/`, `/signup/`, `/receipts/`)
  plus `404.html` at the root for CloudFront's error response.

Nothing else changes. `npm run dev` is unaffected — static export only
applies to `next build`.

## 1. Set production env vars

`NEXT_PUBLIC_*` vars are inlined into the JS bundle at build time — there is
no runtime config for a static export, so these must be correct *before*
building:

```bash
# .env.production (gitignored, same as .env.local)
NEXT_PUBLIC_API_URL=https://<your-api-domain-or-ec2-ip>:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<same client ID already used in .env.local>
```

If this ever changes post-deploy, you must rebuild and re-upload — editing
the deployed files won't do anything (the value is frozen into the JS).

## 2. Google OAuth: authorize the production origin

In the Google Cloud Console, under the OAuth client used for
`NEXT_PUBLIC_GOOGLE_CLIENT_ID`, add the CloudFront/custom domain to
**Authorized JavaScript origins** (e.g. `https://receipts.yourdomain.com`).
Google Identity Services rejects the sign-in flow from origins not on this
list — this is a real, easy-to-miss step, not optional.

## 3. Backend CORS

Update the API's `WEB_ORIGIN` env var (`reciv-api/.env.production`, see that
repo's `DEPLOYMENT.md`) to the real frontend origin from step 2. The
backend's `cors()` config only allows one origin — mismatches here are what
caused the CORS errors seen during local dev.

## 4. Build

```bash
npm run build   # produces ./out
```

## 5. S3 bucket (private — served through CloudFront only)

1. Create a bucket, e.g. `recivo-app`.
2. Leave it fully private — Block Public Access on (the default), no bucket
   policy set yet (added in step 6 once the distribution exists). Some AWS
   accounts block public bucket policies account-wide via SCP, so this also
   sidesteps that; it's the more secure option regardless.
3. Upload:
   ```bash
   aws s3 sync ./out s3://recivo-app --delete
   ```

## 6. CloudFront (HTTPS + CDN, via Origin Access Control)

Since the bucket is private, CloudFront reads it through an **Origin Access
Control (OAC)** rather than the S3 website endpoint — this needs one small
CloudFront Function to handle directory-style URLs, since (unlike the S3
website endpoint) the plain S3 REST origin has no concept of "index
document."

1. Create an Origin Access Control (CloudFront console → Origin access
   control settings), type S3, signing behavior "Sign requests."
2. Create a distribution with **origin = the S3 bucket's regular REST
   endpoint** (`recivo-app.s3.<region>.amazonaws.com`), attached to the OAC
   from step 1.
3. Viewer protocol policy: redirect HTTP → HTTPS. Default root object:
   `index.html`.
4. Create a CloudFront Function (viewer request) to map directory-style
   requests to their `index.html`:
   ```js
   function handler(event) {
     var request = event.request;
     var uri = request.uri;
     if (uri.endsWith("/")) {
       request.uri += "index.html";
     } else if (!uri.includes(".")) {
       request.uri += "/index.html";
     }
     return request;
   }
   ```
   Attach it to the distribution's default cache behavior, viewer request
   event.
5. Custom error response: map HTTP 403 (what a private bucket returns for a
   missing key via OAC) to `/404.html` with response code 404.
6. After the distribution is created, note its ARN and set the bucket policy
   so only CloudFront can read it:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": { "Service": "cloudfront.amazonaws.com" },
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::recivo-app/*",
         "Condition": {
           "StringEquals": { "AWS:SourceArn": "arn:aws:cloudfront::<account-id>:distribution/<distribution-id>" }
         }
       }
     ]
   }
   ```
   This isn't a "public" policy (the principal is a specific AWS service,
   scoped further by the exact distribution ARN), so it isn't blocked by
   Block Public Access or the account-wide SCP that blocks wildcard-principal
   policies.
7. If you have a custom domain: request an ACM certificate (in
   `us-east-1`, regardless of the bucket's region — CloudFront requires
   this), attach it, and point the domain's DNS (Route 53 or elsewhere) at
   the distribution.

## 7. Verify

```bash
curl -I https://<cloudfront-domain>/
curl -I https://<cloudfront-domain>/login/
curl -I https://<cloudfront-domain>/does-not-exist   # should return 404.html
```

Then a real browser check: load the site, sign in with Google (confirms
step 2's authorized-origins config), and confirm a receipts round-trip
against the real API (confirms step 3's CORS config).

## Re-deploying after changes

```bash
npm run build
aws s3 sync ./out s3://recivo-app --delete
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

The invalidation step matters — CloudFront caches aggressively by default,
so without it viewers keep seeing the old build for a while.

## Not yet covered (deliberately out of scope until needed)

- **CI/CD** — manual build + sync is fine at this scale; automate once
  deploys are frequent enough to hurt.
- **Custom domain / ACM** — steps above assume you have one ready; skip
  step 6.3 and use the `*.cloudfront.net` domain for an initial smoke test.
