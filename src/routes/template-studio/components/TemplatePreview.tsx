interface TemplatePreviewProps {
  templateId: string | null;
}

export function TemplatePreview({ templateId }: TemplatePreviewProps) {
  if (!templateId) return null;
  return (
    <div className="p-4 text-slate-500 text-sm">
      Preview for template <code>{templateId}</code>
    </div>
  );
}
