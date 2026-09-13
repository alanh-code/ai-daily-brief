export type Category = 'industry' | 'release' | 'engineering' | 'community';

export type DigestItem = {
  id: string;
  category: Category;
  title: string;
  summary: string;
  why: string;
  source: string;
  signal: string;
  officialUrl: string;
  xUrl: string;
  publishedAt?: string;
  capturedAt?: string;
  provenance?: string;
  sourceNote?: string;
  previousIssueUrl?: string;
};

export type Digest = {
  date: string;
  issue: number;
  stamp: string;
  shortDate: string;
  displayDate: string;
  weekday: string;
  headline: [string, string];
  dek: string;
  readTime: number;
  generatedAt: string;
  coverage?: string;
  leadIds: string[];
  items: DigestItem[];
};
