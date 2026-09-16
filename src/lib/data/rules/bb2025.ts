import snapshot from '../../../../scraper/rules_2025.json';

export type RuleSectionContentType = 'text' | 'table' | 'figure' | 'faq-entry' | 'amendment';
export type RuleSectionStatus = 'approved' | 'reviewed' | 'needs-review';

export type RuleBlock =
	| { type: 'paragraph' | 'quote'; value: string }
	| { type: 'list'; value: string[] }
	| { type: 'table'; value: { caption?: string; headers: string[]; rows: string[][] } }
	| { type: 'figure'; value: { caption?: string; altText: string; mediaRef: string; placement: string } };

export interface RuleSection {
	id: string;
	ruleset: 'bb2025';
	snapshotId: string;
	family: 'core-rules' | 'faq' | 'spike';
	chapterId: string;
	chapterTitle: string;
	chapterSlug: string;
	title: string;
	slug: string;
	parentSectionId?: string | null;
	path: string[];
	sectionDepth: number;
	sectionOrder: number;
	contentType: RuleSectionContentType;
	body: RuleBlock[];
	relatedRuleSectionIds?: string[];
	relatedSkillIds?: string[];
	summary?: string;
	source: {
		url: string;
		heading: string;
		anchor: string;
		retrievalDate: string;
		contentHash: string;
		sourceRevision?: string;
	};
	review: {
		status: RuleSectionStatus;
		reviewedBy?: string;
		reviewedAt?: string;
	};
}

export interface RuleChapter {
	id: string;
	title: string;
	slug: string;
	family: RuleSection['family'];
	description: string;
	sourceUrl: string;
	sections: RuleSection[];
}

type ScrapedSnapshot = {
	ruleset: 'bb2025';
	snapshotId: string;
	chapters: Array<Omit<RuleChapter, 'description'> & { description: string | null; sections: RuleSection[] }>;
};

const scraped = snapshot as ScrapedSnapshot;

export const BB2025_RULES_SNAPSHOT_ID = scraped.snapshotId;
export const bb2025RuleChapters: RuleChapter[] = scraped.chapters.map((chapter) => ({
	...chapter,
	description: chapter.description ?? ''
}));
export const bb2025RuleSections = bb2025RuleChapters.flatMap((chapter) => chapter.sections);

export function searchRuleSections(query: string): RuleSection[] {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return bb2025RuleSections;

	return bb2025RuleSections.filter((ruleSection) =>
		[
			ruleSection.title,
			ruleSection.summary,
			...ruleSection.path,
			...ruleSection.body.flatMap((block) => {
				if (typeof block.value === 'string') return [block.value];
				if (Array.isArray(block.value)) return block.value;
				if ('rows' in block.value) return block.value.rows.flat();
				return [block.value.caption ?? '', block.value.altText];
			})
		]
			.filter((value): value is string => Boolean(value))
			.some((value) => value.toLowerCase().includes(normalized))
	);
}
