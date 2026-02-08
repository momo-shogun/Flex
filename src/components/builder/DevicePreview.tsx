import { useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBuilder } from '@/contexts/BuilderContext';
import { CanvasPreview } from '@/components/builder/CanvasPreview';
import { cn } from '@/lib/utils';

interface DeviceFrame {
  name: 'desktop' | 'tablet' | 'mobile';
  width: number;
  height: number;
  icon: React.ReactNode;
  scale: number;
}

const DEVICES: DeviceFrame[] = [
  { name: 'desktop', width: 1920, height: 1080, icon: <Monitor className="w-4 h-4" />, scale: 0.35 },
  { name: 'tablet', width: 768, height: 1024, icon: <Tablet className="w-4 h-4" />, scale: 0.5 },
  { name: 'mobile', width: 375, height: 667, icon: <Smartphone className="w-4 h-4" />, scale: 0.85 },
];

export function DevicePreview() {
  const [activeDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showAllDevices, setShowAllDevices] = useState(false);
  const { state, dispatch } = useBuilder();

  const currentDevice = DEVICES.find((d) => d.name === activeDevice) ?? DEVICES[0];

  if (showAllDevices) {
    return (
      <div className="grid grid-cols-3 gap-4 p-4 overflow-auto">
        {DEVICES.map((device) => (
          <div
            key={device.name}
            className="border rounded-lg p-4 flex flex-col"
            style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
          >
            <div className="flex items-center gap-2 mb-2">
              {device.icon}
              <span className="font-semibold capitalize text-sm" style={{ color: 'hsl(var(--builder-text-secondary))' }}>
                {device.name}
              </span>
              <span className="text-xs" style={{ color: 'hsl(var(--builder-text-muted))' }}>
                {device.width}×{device.height}
              </span>
            </div>
            <div
              className="border overflow-auto rounded bg-[hsl(var(--builder-canvas-bg))]"
              style={{
                width: device.width * device.scale,
                height: Math.min(device.height * device.scale, 400),
                borderColor: 'hsl(var(--builder-panel-border))',
              }}
            >
              <div
                style={{
                  width: device.width,
                  height: device.height,
                  transform: `scale(${device.scale})`,
                  transformOrigin: 'top left',
                }}
              >
                <div onClick={() => dispatch({ type: 'SET_DEVICE', device: device.name })}>
                  <CanvasPreview />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="col-span-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowAllDevices(false)}>
            Single view
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className={cn('flex items-center justify-between p-2 border-b gap-2')}
        style={{ borderColor: 'hsl(var(--builder-panel-border))' }}
      >
        <div className="flex gap-1">
          {DEVICES.map((device) => (
            <Button
              key={device.name}
              variant={state.device === device.name ? 'default' : 'ghost'}
              size="sm"
              onClick={() => dispatch({ type: 'SET_DEVICE', device: device.name })}
            >
              {device.icon}
              <span className="ml-1.5 capitalize text-xs">{device.name}</span>
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowAllDevices(true)}>
          All devices
        </Button>
      </div>
      <div
        className="flex-1 flex items-center justify-center p-4 overflow-auto"
        style={{ backgroundColor: 'hsl(var(--builder-canvas-bg))' }}
      >
        <div
          className="border-4 rounded-lg overflow-auto shadow-xl"
          style={{
            width: currentDevice.width * currentDevice.scale,
            height: currentDevice.height * currentDevice.scale,
            borderColor: 'hsl(var(--builder-panel-border))',
          }}
        >
          <div
            style={{
              width: currentDevice.width,
              height: currentDevice.height,
              transform: `scale(${currentDevice.scale})`,
              transformOrigin: 'top left',
            }}
          >
            <CanvasPreview />
          </div>
        </div>
      </div>
      <div
        className="p-2 border-t text-xs flex justify-between"
        style={{ borderColor: 'hsl(var(--builder-panel-border))', color: 'hsl(var(--builder-text-muted))' }}
      >
        <span>Viewport: {currentDevice.width}×{currentDevice.height}px</span>
        <span>Scale: {(currentDevice.scale * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
