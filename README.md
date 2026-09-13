# AI Daily Brief

Prompts and website templates for building an agent that turns your X (Twitter) timeline into a daily AI news brief. The agent finds relevant stories, summarizes why they matter, and saves each issue to a website with search and dated archives.

Give these templates to your coding agent to build your own version. Connect your browser session and configure a daily schedule to generate new briefs automatically.

## How to use

Give your agent access to this repository, then copy and send the section from “Build my daily AI brief” through “End of prompt” to have it build your daily AI brief website.

---

# Build my daily AI brief

Build a working daily AI brief website using the templates in this repository. Follow these instructions directly; this README is the build prompt.

1. **Source the news using [prompt.md](prompt.md).** Follow its collection, research, deduplication, and writing rules. Use my own signed-in browser session when available. If access is missing, finish the website with clearly labeled sample content and explain what is needed to generate a real issue. Never present sample content as current news.

2. **Use [app/](app/) for the website design.** Preserve the editorial layout, warm paper background, cobalt accent, serif story text, monospace labels, fine borders, and responsive layout. Use `app/globals.css` for the styles, `app/digest-view.tsx` for the page structure and interactions, and `app/layout.tsx` for fonts and metadata. Keep the existing branding unless I request another name.

3. **Use [schema.ts](schema.ts) and [sample.json](sample.json) for the data format.** The sample contains 15 historical stories from September 12, 2026. Personal discovery paths and collection timestamps have been removed. Use it only to demonstrate the interface. Preserve source attribution and uncertainty notes. Do not treat these summaries as an independently verified news dataset.

4. **Create the actual application in a separate project directory.** These files are reference templates, not an installable application. Choose a suitable stack and create its dependencies, configuration, routes, and data loader. The TSX references use React, Next-compatible routing and font APIs, and Lucide icons. Adapt those imports and font loading to the chosen stack while retaining the design. The stylesheet is plain CSS and does not require Tailwind or Shadcn. Update import paths when copying the templates. Use `public/favicon.svg` as the supplied icon.

5. **Store each issue independently.** Write generated issues to `data/YYYY-MM-DD.json` in the application. The homepage must show the newest date. Add `/archive/YYYY-MM-DD` routes, previous and next issue links, a date selector, and links to individual stories. Missing dates must show a not-found page. Preserve older issues. Keep the sample separate from real daily issues so it cannot displace a current issue or collide with its date.

6. **Make reading and navigation work.** Include the three leading stories when available, all four category sections, search, the sticky contents sidebar, and the mobile contents menu. Keep section and story anchors aligned with the sticky header. Handle empty data and no search results. Do not add bookmarking or read/unread tracking.

7. **Use consistent preferences.** Default to English and America/New_York unless I specify otherwise. Apply any change consistently to the prompt, date labels, timestamps, and interface. Routine daily updates should change data without redesigning the website.

8. **Keep personal data local.** Exclude credentials, cookies, browser session files, crawl state, and personal generated issues from version control. Only collect from sources I can access and am authorized to use. Do not publish the application or its data unless I explicitly request it.

9. **Verify the result.** Validate the generated data against the supplied types, including unique IDs, lead references, and earlier-story links. Run the project's build and relevant checks. Check the homepage, date switching, archives, search, source links, and desktop/mobile layout. If production data is bundled at build time, provide a rebuild and restart step for new issues.

10. **Hand over the working website.** Provide the local URL, project location, and exact commands to start it and generate the next issue. Explain any missing browser access. If I ask for automatic daily generation, configure it through the available scheduler; otherwise provide the setup instructions. Do not claim scheduling is active until it has been configured. Do not commit, push, or deploy without an explicit request.

**End of prompt.**

---

## License and credits

Template code and prompts are available under the [MIT license](LICENSE).

Visual inspiration: [Making Software](https://www.makingsoftware.com) by Dan Hollick.

Sample stories in [sample.json](sample.json) include links to their original sources.
