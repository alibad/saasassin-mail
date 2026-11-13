# SaaSassin Mail

**Free, open-source Superhuman Mail alternative.** Move through email at keyboard speed while keeping search and assistance inspectable.

Premium email client for high-volume professionals who value speed, privacy, and provider choice.

- **Try it:** [mail.saasassin.net](https://mail.saasassin.net)
- **Research brief and product decision:** [saasassin.net/targets/superhuman-mail](https://saasassin.net/targets/superhuman-mail)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falibad%2Fsaasassin-mail&project-name=saasassin-mail&repository-name=saasassin-mail&env=NEXT_PUBLIC_FIREBASE_API_KEY%2CNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%2CNEXT_PUBLIC_FIREBASE_PROJECT_ID%2CNEXT_PUBLIC_FIREBASE_APP_ID%2CFIREBASE_PROJECT_ID%2CFIREBASE_CLIENT_EMAIL%2CFIREBASE_PRIVATE_KEY&envDescription=Firebase+web+app+config+and+service-account+credentials+%28see+the+README%29&envLink=https%3A%2F%2Fgithub.com%2Falibad%2Fsaasassin-mail%231-create-a-firebase-project)

Superhuman Mail is a trademark of its owner and is named here only to describe what this product
replaces. SaaSassin Mail is an independent, clean-room product and is not affiliated
with or endorsed by Superhuman Mail.

## What you can do today

| Area | Works end-to-end (Firestore, tenant-scoped, audited, exported) |
|------|------------------------------------------------------|
| Workspace | Create a mail workspace, switch workspaces, sign out |
| Import | Upload .eml files or an .mbox export → parsed server-side, threaded, deduplicated by Message-ID (re-import is safe), import history. A reply imported before its parent now takes the original subject once the parent arrives |
| Inbox | j/k navigate, Enter open, e archive (Done), # trash with Dialog confirm, s star, u read/unread, z undo, Esc back |
| **Filters** | Rules on from / to-cc / subject / List-Id / has-attachment (all or any) → label, archive, star, mark read, skip the inbox. Run on every import; **Test against existing mail** previews matching messages and threads before saving; **Apply to existing mail** is a separate, confirmed, audited step that never touches Trash; on/off switch; delete |
| **Contacts** | Address book derived from imported mail headers: header name, address, messages sent/received, first seen, last contacted, frequent correspondents (you excluded). Contact page lists every shared thread (click opens it) and lets writers set a display name (empty restores the header name) |
| **Bulk triage** | x selects, Shift+J/K extends the selection; e / # / s / u / l act on the whole selection (archive or restore, trash with Dialog confirm, star, read/unread, labels) from the keyboard or the selection bar. z undoes the bulk action exactly (server stores the prior field values per thread); all-or-nothing |
| **Mute + unsubscribe** | m mutes: the thread goes to Done and later replies never bring it back (it still shows unread); Unmute or z returns it. Newsletters show their List-Unsubscribe targets: the web page opens only when clicked (no referrer), a mailto target becomes an ordinary draft. Nothing is ever requested automatically, including RFC 8058 one-click |
| **Send later** | Send later (presets or a picked time) queues a draft; it stays editable (keeps its slot) and cancellable before its time; a Scheduled view lists the queue. Every scheduled draft says "will not send: no provider"; after its time it reads "due, not sent", and editing it returns it to Drafts |
| Splits | Rule-based split tabs with unread/total counts (sender domain/address, calendar invite, newsletter, label, subject); Calendar + News seeded; Tab cycles splits |
| Snooze / follow-ups | h snooze (hidden until the time, woken by new mail); f follow-up resurfaces only if nobody replied |
| Labels, drafts, snippets | l labels and label views; r reply / c compose with snippets; Send records `send_blocked` and shows "Sending provider not configured … nothing was sent" |
| **Search (faster)** | / with from:, to:, cc:, subject:, has:invite, has:attachment. Reads each message's stored token index, not every body; identical results to the old full scan. Mail imported before the index falls back to its body until a writer clicks **Build search index** |
| Safety | Email HTML is never rendered (text only, tracking pixels never load); unsubscribe links refuse javascript:/data:/credentialed URLs |
| Team / audit / export | admin/member/viewer roles (viewers read-only), append-only audit view, `GET /api/mail/tenants/{id}/export` → manifest + threads, messages, drafts, splits, snippets, filters, contact names, derived address book, bulk operations, import runs, settings, members, audit |
| Command palette / shortcuts | ⌘/Ctrl+K and ? cover the new actions (mute, contacts, filters, selection keys) |

Full status, verification and known gaps: [docs/STATUS.md](docs/STATUS.md).

## Self-host

SaaSassin Mail is a Next.js app backed by Firebase Authentication and Cloud Firestore.
You need Node.js 20.9 or newer, [pnpm](https://pnpm.io/installation) and a Firebase project of
your own.

### 1. Create a Firebase project

1. Create a project in the [Firebase console](https://console.firebase.google.com/).
2. **Firestore:** Build → Firestore Database → Create database.
3. **Authentication:** Build → Authentication → Get started. Mail signs people in with
   **Google** and **Email/Password**; step 2 below enables both, or enable them yourself under
   Authentication → Sign-in method.
4. **Web app config:** Project settings → General → Your apps → add a Web app. Copy its config
   into the `NEXT_PUBLIC_FIREBASE_*` variables.
5. **Service account:** Project settings → Service accounts → Generate new private key. From the
   downloaded JSON, set `FIREBASE_PROJECT_ID` (`project_id`), `FIREBASE_CLIENT_EMAIL`
   (`client_email`) and `FIREBASE_PRIVATE_KEY` (`private_key`). Never commit the key, and never
   give these variables a `NEXT_PUBLIC_` prefix.
6. Once you deploy, add your domain under Authentication → Settings → Authorized domains
   (`localhost` is already allowed).

### 2. Deploy the rules, indexes and sign-in providers

```bash
pnpm install
pnpm exec firebase login
pnpm exec firebase deploy --only firestore:rules,firestore:indexes,auth --project <your-project-id>
```

`firestore.rules` denies all browser access to product data: every read and write goes through the server routes, which check the session, tenant membership and role with the Firebase Admin SDK. `auth` enables the Google and email/password providers listed in `firebase.json`.

### 3. Run it

```bash
cp .env.example .env.local   # fill in the values from step 1
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). This repository serves SaaSassin
Mail at the root of every host: `next.config.ts` sets `STANDALONE_PRODUCT=mail`,
and `src/proxy.ts` maps `/` to the product (`/apps/mail`) and `/sign-in` to its sign-in page.

### 4. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Falibad%2Fsaasassin-mail&project-name=saasassin-mail&repository-name=saasassin-mail&env=NEXT_PUBLIC_FIREBASE_API_KEY%2CNEXT_PUBLIC_FIREBASE_AUTH_DOMAIN%2CNEXT_PUBLIC_FIREBASE_PROJECT_ID%2CNEXT_PUBLIC_FIREBASE_APP_ID%2CFIREBASE_PROJECT_ID%2CFIREBASE_CLIENT_EMAIL%2CFIREBASE_PRIVATE_KEY&envDescription=Firebase+web+app+config+and+service-account+credentials+%28see+the+README%29&envLink=https%3A%2F%2Fgithub.com%2Falibad%2Fsaasassin-mail%231-create-a-firebase-project)

The button copies this repository into your GitHub account, creates a Vercel project and asks for
the Firebase variables. To deploy an existing fork instead, import it in Vercel and add the
variables from `.env.example` under Project Settings → Environment Variables. Either way, add the
Vercel domain to your Firebase authorized domains afterwards.

## Tests

```bash
pnpm lint
pnpm typecheck
pnpm test        # unit tests
pnpm build
```

The Firestore suites run against the local Firestore emulator, which needs a Java 21+ JDK first on
your `PATH`:

```bash
export JAVA_HOME=/path/to/jdk-21   # macOS example: /Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home
export PATH="$JAVA_HOME/bin:$PATH"
pnpm test:rules      # Firestore security rules
pnpm test:emulator   # the golden workflow against a real Firestore emulator
```

## Contributing

Development happens in the SaaSassin monorepo,
[github.com/alibad/saasassin](https://github.com/alibad/saasassin), the single source of truth for
all ten SaaSassin products. This repository is generated from it by the monorepo's
`scripts/export-product.mjs`, so accepted changes land in the monorepo first and are then synced
here. Open issues and pull requests there or here.

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## Talk to us

Moving off Superhuman Mail, running Mail for your team, or want to help build it?
[Tell us on saasassin.net](https://saasassin.net/targets/superhuman-mail#interest).

## License

[GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0-only). Use it, self-host it and modify
it; if you run a modified version as a network service, publish your changes under the same
license.
