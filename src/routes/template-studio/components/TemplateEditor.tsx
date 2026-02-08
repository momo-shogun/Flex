interface TemplateEditorProps {
  templateId: string | null;
}

export function TemplateEditor({ templateId }: TemplateEditorProps) {
  if (!templateId) return null;
  return (
    <div className="p-6 text-slate-400 text-sm">
      Template editor for <code className="text-slate-300">{templateId}</code>. Use the AI to update templates.
    </div>
  );
}
