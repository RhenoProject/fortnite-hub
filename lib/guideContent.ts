import { getDb } from './firestore';

export interface GuideSection {
  type: 'h2' | 'h3' | 'p' | 'ul' | 'note';
  text?: string;
  items?: string[];
}

export interface GuideContent {
  slug: string;
  title: string;
  description: string;
  sections: GuideSection[];
  keywords: string[];
  updatedAt: string;
  featuredImage?: string;
}

export async function getGuide(slug: string): Promise<GuideContent | null> {
  try {
    const db = getDb();
    const doc = await db.collection('guides').doc(slug).get();
    if (!doc.exists) return null;
    return doc.data() as GuideContent;
  } catch {
    return null;
  }
}

export async function saveGuide(guide: Omit<GuideContent, 'updatedAt'>): Promise<void> {
  const db = getDb();
  await db.collection('guides').doc(guide.slug).set({
    ...guide,
    updatedAt: new Date().toISOString(),
  });
}

export async function listGuides(): Promise<Pick<GuideContent, 'slug' | 'title' | 'description' | 'updatedAt' | 'featuredImage'>[]> {
  try {
    const db = getDb();
    const snapshot = await db.collection('guides').orderBy('updatedAt', 'desc').get();
    return snapshot.docs.map((doc) => {
      const d = doc.data() as GuideContent;
      return {
        slug: d.slug,
        title: d.title,
        description: d.description,
        updatedAt: d.updatedAt,
        featuredImage: d.featuredImage,
      };
    });
  } catch {
    return [];
  }
}
