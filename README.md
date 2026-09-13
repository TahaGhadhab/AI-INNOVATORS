# AI INNOVATORS · "AI & Nature" website

The club's landing page (`index.html`) and membership form (`register.html`), in French and English.
It's plain HTML, CSS and JavaScript: no framework, no build step, nothing to install.

## Run it locally

Open `index.html` in a browser. To get the same behavior as a real host, run a small local server instead:

```bash
npx serve .
```

## Project structure

```
index.html            Landing page: hero, club, theme story, values, program, projects, join
register.html         Registration form
css/tokens.css        Colors, fonts, sizes → change the look here
css/base.css          Buttons, nav, footer, typography
css/motion.css        Animations: text reveals, word-by-word headings, language switch, hovers
css/home.css          Landing page sections
css/register.css      Form styling
js/translations.js    ALL the text of the site (FR + EN) → change the content here
js/i18n.js            Language switcher
js/atmosphere.js      Animated background (particles, mist) + hero parallax
js/veins.js           Flower → network scroll animation
js/motion.js          Splits headings into words, stat counters
js/site.js            Menu, scroll reveals, timeline, card effects, scroll progress
js/register.js        Form validation + sending to Google Sheets
apps-script/Code.gs   Google Apps Script that saves registrations to a Sheet
assets/               Fonts and images (club logo: assets/img/logo.webp; favicon-64.png, apple-touch-icon.png, og-image.jpg are made from it)
Verdance.html         Original design file (reference only, not used by the site)
```

## Common edits

| I want to…                             | Edit                                                                 |
| -------------------------------------- | -------------------------------------------------------------------- |
| Change any text                        | `js/translations.js` (update both `fr` and `en`)                     |
| Change dates or events in the program  | `program.seasons` in `js/translations.js`                            |
| Add or remove a project card           | `projects.items` in `js/translations.js` (source: `activities.md`)   |
| Change the certifications list         | `certs.items` in `js/translations.js`                                |
| Change colors                          | `--bio` (green) and `--accent` (lavender) in `css/tokens.css`        |
| Fewer or more background particles     | `data-density` on the `<canvas>` in the HTML (0–220, default 100)    |
| Change images                          | Replace `assets/img/forest.png` / `assets/img/flower.jpg`            |
| Only accept student emails             | `EMAIL_DOMAIN` at the top of `js/register.js`                        |

Values in `translations.js` can contain simple HTML. Words inside `<em>` show up in the italic serif highlight.

## Connect the Google Sheet

Until this is done, the form runs in **demo mode**: it validates and shows the success screen, but saves nothing. It prints a notice in the browser console.

1. Create a Google Sheet, e.g. "AI INNOVATORS · Members 2026-27", in the club's Google account.
2. In the Sheet, open **Extensions → Apps Script**.
3. Delete the sample code, paste the contents of `apps-script/Code.gs`, and save.
4. Click **Deploy → New deployment**, choose the type **Web app**, and set:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
5. Click **Deploy** and authorize the permissions.
6. Copy the **Web app URL** (it ends in `/exec`).
7. Paste it into `APPS_SCRIPT_URL` at the top of `js/register.js`.
8. Test by submitting the form. A **Members** tab appears with one row per registration.

Behavior of the script:
- It rejects emails that are already registered; the form shows a "déjà inscrit / already registered" message.
- It silently drops bot submissions, using a hidden honeypot field.
- It writes readable labels, e.g. "Computer science" instead of `cs`.

If you edit `Code.gs` later, go to **Deploy → Manage deployments → Edit → Version: New version** so the change goes live. The URL stays the same.

## Deploy

**GitHub Pages:** push the folder to a repository, then go to **Settings → Pages → Deploy from branch → main / root**.

**Netlify:** drag and drop the folder onto <https://app.netlify.com/drop>.

## TODO: replace the placeholders

Search for `TODO` in the project:

- [ ] College name: `footer.school` in `js/translations.js`
- [ ] Real numbers in `about.stats`
- [ ] Program dates and events in `program.seasons`
- [ ] Contact email and Instagram / LinkedIn / Discord links in the footer of `index.html`
- [ ] `APPS_SCRIPT_URL` in `js/register.js`
- [ ] (Optional) a club logo to replace the leaf icon in the nav and footer, and `assets/img/favicon.svg`
