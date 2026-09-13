'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Clock3, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Category, Digest } from '../schema';

type ArchiveEntry = Pick<Digest, 'date' | 'issue' | 'shortDate' | 'displayDate'>;

const categories: { id: Category | 'all'; label: string; short: string }[] = [
  { id: 'all', label: 'All signals', short: 'ALL' },
  { id: 'industry', label: 'Industry', short: 'IND' },
  { id: 'release', label: 'Products & models', short: 'REL' },
  { id: 'engineering', label: 'Engineering & research', short: 'ENG' },
  { id: 'community', label: 'Community practice', short: 'COM' },
];

const categoryLabel: Record<Category, string> = {
  industry: 'Industry',
  release: 'Products & models',
  engineering: 'Engineering & research',
  community: 'Community practice',
};

function displayTime(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(value)) + ' ET';
}

export function DigestView({ digest, archives }: { digest: Digest; archives: ArchiveEntry[] }) {
  const router = useRouter();
  const editionIndex = archives.findIndex((entry) => entry.date === digest.date);
  const olderEdition = archives[editionIndex + 1];
  const newerEdition = archives[editionIndex - 1];
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState('');
  const [contentsOpen, setContentsOpen] = useState(false);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return digest.items.filter((item) => {
      const inSearch = !needle || `${item.title} ${item.summary} ${item.why} ${item.source}`.toLowerCase().includes(needle);
      return inSearch;
    });
  }, [digest, query]);

  const groups = categories.slice(1).map((category) => ({
    ...category,
    items: visible.filter((item) => item.category === category.id),
  }));

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reading-target]'));
      let current = '';
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= 160) current = target.id;
        else break;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [visible]);

  return (
    <main className="site-shell">
      <header className="masthead">
        <Link className="wordmark" href="/" aria-label="Signal Desk home">SIGNAL<span>/</span>DESK</Link>
        <div className="masthead-note"><span>AI INDUSTRY FIELD NOTES</span><span>CURATED FROM YOUR X TIMELINE</span></div>
        <div className="issue-stamp"><span>ISSUE {String(digest.issue).padStart(3, '0')}</span><strong>{digest.stamp}</strong></div>
      </header>

      <nav className="edition-nav" aria-label="Browse daily briefs">
        {olderEdition
          ? <Link className="edition-step" href={`/archive/${olderEdition.date}`} aria-label={`Previous issue: ${olderEdition.displayDate}`}><span aria-hidden="true">←</span><span>Previous issue<small>{olderEdition.shortDate}</small></span></Link>
          : <span className="edition-step is-disabled" aria-disabled="true"><span aria-hidden="true">←</span><span>Previous issue<small>Oldest available</small></span></span>}
        <label className="edition-picker"><span>READING {editionIndex === 0 ? 'THE LATEST ISSUE' : 'AN ARCHIVED ISSUE'}</span><select aria-label="Choose brief date" value={digest.date} onChange={(event) => router.push(`/archive/${event.target.value}`)}>{archives.map((entry, index) => <option key={entry.date} value={entry.date}>{entry.displayDate}{index === 0 ? ' · Latest' : ''}</option>)}</select></label>
        <div className="edition-forward">{newerEdition
          ? <Link className="edition-step" href={`/archive/${newerEdition.date}`} aria-label={`Next issue: ${newerEdition.displayDate}`}><span>Next issue<small>{newerEdition.shortDate}</small></span><span aria-hidden="true">→</span></Link>
          : <span className="edition-step is-disabled" aria-disabled="true"><span>Next issue<small>You’re up to date</small></span><span aria-hidden="true">→</span></span>}{editionIndex > 0 && <Link className="latest-edition" href="/">Back to latest</Link>}</div>
      </nav>

      <div className="ticker" aria-label="Issue summary"><span>{digest.items.length} SIGNALS</span><span>4 SECTIONS</span><span>{digest.leadIds.length} PRIMARY STORIES</span><span>READ TIME {digest.readTime} MIN</span><span>{digest.shortDate} · NEW YORK</span></div>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">DAILY BRIEF / {digest.weekday}</p>
          <h1>{digest.headline[0]}<br /><em>{digest.headline[1]}</em></h1>
          <p className="dek">{digest.dek}</p>
        </div>
        <div className="signal-figure" aria-label="Today’s signal composition">
          <div className="figure-label">FIG.001 / SIGNAL COMPOSITION</div>
          <div className="signal-axis">
            {categories.slice(1).map((category, index) => {
              const count = digest.items.filter((item) => item.category === category.id).length;
              const width = digest.items.length ? Math.max(8, (count / digest.items.length) * 300) : 0;
              return <div className="axis-row" key={category.id}><span>0{index + 1}</span><b>{category.short}</b><div className="axis-track"><i style={{ width: `${Math.min(width, 100)}%` }} /></div><strong>{count}</strong></div>;
            })}
          </div>
          <p>Weighted by source credibility, industry impact, and relevance to your network.</p>
        </div>
      </section>

      <section className="lead-grid" aria-label="Today’s leading stories">
        {digest.leadIds.map((id, index) => {
          const item = digest.items.find((candidate) => candidate.id === id);
          if (!item) return null;
          return <article className={`lead-story lead-${index + 1}`} key={item.id}>
            <div className="story-index">0{index + 1}</div>
            <div><p className="story-meta">{categoryLabel[item.category]} · {item.source}</p><h2>{item.title}</h2><p>{item.summary}</p><div className="story-links">{item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noreferrer">Primary source <ArrowUpRight size={14} /></a>}<a href={item.xUrl} target="_blank" rel="noreferrer">X trail <ArrowUpRight size={14} /></a></div></div>
          </article>;
        })}
      </section>

      <section className="brief-layout">
        <aside className="archive-rail">
          <div className="rail-sticky">
          <button type="button" className="contents-toggle" aria-expanded={contentsOpen} aria-controls="issue-contents" onClick={() => setContentsOpen(!contentsOpen)}>CONTENTS <span>{contentsOpen ? '−' : '+'}</span></button>
          <nav id="issue-contents" aria-label="Issue contents" className={`contents-nav ${contentsOpen ? 'is-open' : ''}`}>
            <p className="rail-title">IN THIS ISSUE</p>
            <a className="contents-overview" href="#top" onClick={() => setContentsOpen(false)}>↑ Back to overview</a>
            {groups.map((group, groupIndex) => <div className="toc-group" key={group.id}>
              <a className={`toc-section ${activeId === `section-${group.id}` ? 'is-current' : ''}`} href={`#section-${group.id}`} aria-current={activeId === `section-${group.id}` ? 'location' : undefined} onClick={() => setContentsOpen(false)}><span>0{groupIndex + 1}</span><strong>{group.label}</strong><small>{group.items.length}</small></a>
              {group.items.map((item, itemIndex) => <a className={`toc-story ${activeId === `story-${item.id}` ? 'is-current' : ''}`} key={item.id} href={`#story-${item.id}`} aria-current={activeId === `story-${item.id}` ? 'location' : undefined} onClick={() => setContentsOpen(false)}><span>{groupIndex + 1}.{itemIndex + 1}</span><span>{item.title}</span></a>)}
            </div>)}
            <details className="archive-disclosure"><summary>PAST ISSUES ({archives.length})</summary>{archives.map((entry) => <Link className={entry.date === digest.date ? 'archive-active' : 'archive-link'} href={`/archive/${entry.date}`} key={entry.date} title={entry.displayDate}><span>{entry.shortDate}</span><strong>{String(entry.issue).padStart(3, '0')}</strong></Link>)}</details>
          </nav>
          </div>
        </aside>

        <div className="brief-body">
          <div className="controls">
            <span className="edition-label">THE BRIEF / FOUR SECTIONS</span>
            <label className="search-box"><Search size={16} /><input aria-label="Search the brief" onChange={(event) => setQuery(event.target.value)} placeholder="SEARCH THE BRIEF" value={query} /></label>
          </div>

          <div className="section-heading"><span>FIG.002 / INDEX OF SIGNALS</span><strong>{String(visible.length).padStart(2, '0')} ENTRIES</strong></div>
          {groups.map((group, groupIndex) => <section className="digest-section" key={group.id} id={`section-${group.id}`} aria-labelledby={`heading-${group.id}`} data-reading-target>
            <header className="category-heading"><span className="category-number">0{groupIndex + 1}</span><div><p>SECTION / {group.short}</p><h2 id={`heading-${group.id}`}>{group.label}</h2></div><span className="category-count">{group.items.length} {group.items.length === 1 ? 'STORY' : 'STORIES'}</span></header>
            {group.items.length === 0 && <p className="section-empty">{query ? 'No matching stories in this section.' : 'No selected stories in this section today.'}</p>}
          <div className="story-list">
            {group.items.map((item, index) => {
              return <article className="story-row" key={item.id} id={`story-${item.id}`} data-reading-target>
                <div className="row-number">{groupIndex + 1}.{index + 1}</div>
                <div className="row-content">
                  <div className="row-kicker"><span>{categoryLabel[item.category]}</span><span>{item.source}</span><span>{item.signal}</span></div>
                  <h3>{item.title}</h3><p className="summary">{item.summary}</p>
                  <div className="why"><span>WHY IT MATTERS</span><p>{item.why}</p></div>
                  <div className="source-context">
                    {item.provenance && <p><b>DISCOVERY</b> {item.provenance}</p>}
                    {(item.publishedAt || item.capturedAt) && <p className="source-times">{item.publishedAt && <span>X published <time dateTime={item.publishedAt}>{displayTime(item.publishedAt)}</time></span>}{item.capturedAt && <span>Captured <time dateTime={item.capturedAt}>{displayTime(item.capturedAt)}</time></span>}</p>}
                    {item.sourceNote && <p><b>SOURCE NOTE</b> {item.sourceNote}</p>}
                  </div>
                  <div className="row-links">{item.officialUrl && <a href={item.officialUrl} target="_blank" rel="noreferrer">READ SOURCE <ArrowUpRight size={13} /></a>}<a href={item.xUrl} target="_blank" rel="noreferrer">OPEN X <ArrowUpRight size={13} /></a>{item.previousIssueUrl && <Link href={item.previousIssueUrl}>EARLIER CONTEXT <ArrowUpRight size={13} /></Link>}</div>
                </div>
              </article>;
            })}
          </div>
          </section>)}
          {visible.length === 0 && <div className="empty-state">No matching signals. Try another search.</div>}
        </div>
      </section>

      {digest.coverage && <details className="coverage-note"><summary>COVERAGE & SOURCE NOTES</summary><p>{digest.coverage}</p></details>}
      <footer><div><span>SIGNAL/DESK</span><p>Distilled from your feed without creating another feed to manage.</p></div><div className="method"><Clock3 size={15} /><p>Generated {digest.generatedAt}. Facts prioritize primary sources; X links preserve discovery paths and social context. Why it matters is editorial interpretation.</p></div></footer>
    </main>
  );
}
