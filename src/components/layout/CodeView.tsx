import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  ComponentId,
  SplitTextProps,
  BlurTextProps,
  TextCursorProps,
  SilkProps,
  FloatingLinesProps,
  LightPillarProps,
} from '../../types/components';
import {
  getInstallCommand,
  generateComponentCode,
} from '../../utils/code-generator';

const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

interface CodeViewProps {
  selectedComponent: ComponentId;
  splitTextProps: SplitTextProps;
  blurTextProps: BlurTextProps;
  textCursorProps: TextCursorProps;
  silkProps?: SilkProps;
  floatingLinesProps?: FloatingLinesProps;
  lightPillarProps?: LightPillarProps;
  onCopy?: (text: string) => void;
}

function CopyButton({
  text,
  onCopy,
  className = '',
}: {
  text: string;
  onCopy?: (text: string) => void;
  className?: string;
}) {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    onCopy?.(text);
  }, [text, onCopy]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={`text-slate-400 hover:text-white hover:bg-slate-700 ${className}`}
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    </Button>
  );
}

export function CodeView({
  selectedComponent,
  splitTextProps,
  blurTextProps,
  textCursorProps,
  silkProps,
  floatingLinesProps,
  lightPillarProps,
  onCopy,
}: CodeViewProps) {
  const [packageManager, setPackageManager] = useState<PackageManager>('pnpm');

  const usageCode = generateComponentCode(
    selectedComponent,
    splitTextProps,
    blurTextProps,
    textCursorProps,
    silkProps,
    floatingLinesProps,
    lightPillarProps
  );

  return (
    <div className="space-y-8">
      {/* Install section */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Install</h2>
        <Tabs defaultValue="cli" className="w-full">
          <TabsList className="w-fit mb-3">
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="cli" className="mt-0">
            <Tabs
              value={packageManager}
              onValueChange={(v) => setPackageManager(v as PackageManager)}
              className="w-full"
            >
              <TabsList className="h-9 w-fit rounded-b-none border-b border-slate-700 bg-slate-900 p-0">
                {PACKAGE_MANAGERS.map((pm) => (
                  <TabsTrigger
                    key={pm}
                    value={pm}
                    className="rounded-t-md rounded-b-none border-b-0 border border-slate-700 border-b-transparent bg-transparent px-3 py-1.5 text-sm data-[state=active]:border-b-2 data-[state=active]:border-b-slate-800 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=inactive]:text-slate-400 hover:text-white"
                  >
                    {pm}
                  </TabsTrigger>
                ))}
              </TabsList>
              {PACKAGE_MANAGERS.map((pm) => (
                <TabsContent key={pm} value={pm} className="mt-0">
                  <div className="relative rounded-b-lg rounded-tr-lg border border-t-0 border-slate-700 bg-slate-900 overflow-hidden">
                    <pre className="p-4 pr-12 overflow-x-auto text-sm text-slate-200 font-mono">
                      <code>{getInstallCommand(pm)}</code>
                    </pre>
                    <div className="absolute top-2 right-2">
                      <CopyButton
                        text={getInstallCommand(pm)}
                        onCopy={onCopy}
                      />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
          <TabsContent value="manual" className="mt-0">
            <div className="rounded-lg bg-slate-900 border border-slate-700 p-4">
              <p className="text-slate-400 text-sm">
                Add <code className="text-slate-300">framer-motion</code> to your
                project with your preferred package manager.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Usage section */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Usage</h2>
        <div className="rounded-lg border border-slate-700 overflow-hidden bg-slate-900">
          <div className="relative h-[320px] min-h-[320px]">
            <Editor
              height="320px"
              defaultLanguage="typescript"
              value={usageCode}
              theme="vs-dark"
              options={{
                readOnly: true,
                minimap: { enabled: false },
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                fontSize: 13,
                fontFamily: 'ui-monospace, monospace',
                padding: { top: 12 },
                wordWrap: 'on',
              }}
            />
            <div className="absolute top-2 right-2 z-10">
              <CopyButton text={usageCode} onCopy={onCopy} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
