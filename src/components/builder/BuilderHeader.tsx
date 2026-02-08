import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Undo2,
  Redo2,
  Eye,
  Save,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useBuilder, clearBuilderStorage } from '@/contexts/BuilderContext';
import type { DeviceType } from '@/types/builder.types';
import { toComponentId } from '@/types/builder.types';
import { downloadProjectZip } from '@/utils/website-builder-export';
import { toast } from 'sonner';

const devices: {
  type: DeviceType;
  icon: typeof Monitor;
  label: string;
}[] = [
  { type: 'desktop', icon: Monitor, label: 'Desktop' },
  { type: 'tablet', icon: Tablet, label: 'Tablet' },
  { type: 'mobile', icon: Smartphone, label: 'Mobile' },
];

export function BuilderHeader() {
  const { state, dispatch } = useBuilder();

  const handleZoom = (delta: number) => {
    dispatch({ type: 'SET_ZOOM', zoom: state.zoom + delta });
  };

  const handleSave = async () => {
    if (state.sections.length === 0) {
      toast.error('Add at least one section before exporting.');
      return;
    }
    try {
      await downloadProjectZip(
        state.sections.map((s) => ({ id: s.id, type: toComponentId(s.type) }))
      );
      toast.success('Project downloaded.');
    } catch (err) {
      console.error(err);
      toast.error('Export failed.');
    }
  };

  const handleClearCanvas = () => {
    clearBuilderStorage();
    dispatch({ type: 'RESET' });
    toast.success('Canvas cleared.');
  };

  return (
    <TooltipProvider>
      <div className="h-full flex items-center justify-between px-4 w-full">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{ backgroundColor: 'hsl(var(--builder-selection))' }}
            >
              <span className="text-xs font-bold text-white">P</span>
            </div>
            <span
              className="text-sm font-semibold"
              style={{ color: 'hsl(var(--builder-text-primary))' }}
            >
              Page Builder
            </span>
          </div>
          <Separator
            orientation="vertical"
            className="h-5"
            style={{ backgroundColor: 'hsl(var(--builder-panel-border))' }}
          />
          <div className="flex items-center gap-2">
            <span
              className="text-sm"
              style={{ color: 'hsl(var(--builder-text-secondary))' }}
            >
              Website
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  style={{ color: 'hsl(var(--builder-text-secondary))' }}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  style={{ color: 'hsl(var(--builder-text-secondary))' }}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <Separator
            orientation="vertical"
            className="h-5"
            style={{ backgroundColor: 'hsl(var(--builder-panel-border))' }}
          />

          <div className="flex items-center rounded-md p-0.5 bg-slate-800">
            {devices.map(({ type, icon: Icon, label }) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Button
                    variant={state.device === type ? 'default' : 'ghost'}
                    size="icon"
                    className={`h-7 w-7 ${
                      state.device === type
                        ? 'shadow-sm text-white'
                        : ''
                    }`}
                    style={
                      state.device === type
                        ? { backgroundColor: 'hsl(var(--builder-selection))' }
                        : {
                            color: 'hsl(var(--builder-text-secondary))',
                          }
                    }
                    onClick={() => dispatch({ type: 'SET_DEVICE', device: type })}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <Separator
            orientation="vertical"
            className="h-5"
            style={{ backgroundColor: 'hsl(var(--builder-panel-border))' }}
          />

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  style={{ color: 'hsl(var(--builder-text-secondary))' }}
                  onClick={() => handleZoom(-10)}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom Out</TooltipContent>
            </Tooltip>
            <span
              className="text-xs font-medium w-10 text-center"
              style={{ color: 'hsl(var(--builder-text-secondary))' }}
            >
              {state.zoom}%
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  style={{ color: 'hsl(var(--builder-text-secondary))' }}
                  onClick={() => handleZoom(10)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zoom In</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                style={{ color: 'hsl(var(--builder-text-secondary))' }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                style={{ color: 'hsl(var(--builder-text-secondary))' }}
                onClick={handleClearCanvas}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear canvas</TooltipContent>
          </Tooltip>
          <Button
            size="sm"
            className="h-8 text-white"
            style={{
              backgroundColor: 'hsl(var(--builder-selection))',
            }}
            onClick={handleSave}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            style={{ color: 'hsl(var(--builder-text-secondary))' }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
}
