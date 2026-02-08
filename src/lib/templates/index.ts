export type {
  WebsiteSection,
  WebsiteTemplate,
} from '@/lib/website-templates';
export {
  WEBSITE_TEMPLATES,
  findTemplateByCategory,
  findTemplateByTags,
  searchTemplates,
} from '@/lib/website-templates';

const CUSTOM_KEY = 'flex-custom-templates';
let customTemplates: import('@/lib/website-templates').WebsiteTemplate[] = [];

function loadCustom(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(CUSTOM_KEY);
    if (raw) customTemplates = JSON.parse(raw);
  } catch {
    customTemplates = [];
  }
}
function saveCustom(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(customTemplates));
  } catch {
    // ignore
  }
}
if (typeof window !== 'undefined') loadCustom();

export function getCustomTemplates(): import('@/lib/website-templates').WebsiteTemplate[] {
  return [...customTemplates];
}
export function addCustomTemplate(
  t: import('@/lib/website-templates').WebsiteTemplate
): void {
  customTemplates.push(t);
  saveCustom();
}
export function updateCustomTemplate(
  id: string,
  updates: Partial<import('@/lib/website-templates').WebsiteTemplate>
): boolean {
  const i = customTemplates.findIndex((x) => x.id === id);
  if (i < 0) return false;
  Object.assign(customTemplates[i], updates);
  saveCustom();
  return true;
}
