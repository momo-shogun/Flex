import type {
  ComponentId,
  SplitTextProps,
  BlurTextProps,
  TextCursorProps,
  SilkProps,
  FloatingLinesProps,
  LightPillarProps,
} from '../../types/components';

interface CustomizePanelProps {
  selectedComponent: ComponentId;
  splitTextProps: SplitTextProps;
  blurTextProps: BlurTextProps;
  textCursorProps: TextCursorProps;
  silkProps: SilkProps;
  floatingLinesProps: FloatingLinesProps;
  lightPillarProps: LightPillarProps;
  onSplitTextPropsChange: (props: Partial<SplitTextProps>) => void;
  onBlurTextPropsChange: (props: Partial<BlurTextProps>) => void;
  onTextCursorPropsChange: (props: Partial<TextCursorProps>) => void;
  onSilkPropsChange: (props: Partial<SilkProps>) => void;
  onFloatingLinesPropsChange: (props: Partial<FloatingLinesProps>) => void;
  onLightPillarPropsChange: (props: Partial<LightPillarProps>) => void;
}

const inputClass =
  'w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-600 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500';
const labelClass = 'block text-sm font-medium text-slate-300 mb-1';
const sliderClass =
  'w-full h-2 rounded-full appearance-none bg-slate-700 accent-violet-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow';

export function CustomizePanel({
  selectedComponent,
  splitTextProps,
  blurTextProps,
  textCursorProps,
  silkProps,
  floatingLinesProps,
  lightPillarProps,
  onSplitTextPropsChange,
  onBlurTextPropsChange,
  onTextCursorPropsChange,
  onSilkPropsChange,
  onFloatingLinesPropsChange,
  onLightPillarPropsChange,
}: CustomizePanelProps) {
  return (
    <aside className="w-80 flex-shrink-0 min-h-0 bg-slate-900 border-l border-slate-700 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-bold text-white mb-4">Customize</h2>

        {selectedComponent === 'split-text' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="split-text" className={labelClass}>
                Text
              </label>
              <input
                id="split-text"
                type="text"
                value={splitTextProps.text}
                onChange={(e) => onSplitTextPropsChange({ text: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="split-animateBy" className={labelClass}>
                Split Type
              </label>
              <select
                id="split-animateBy"
                value={splitTextProps.animateBy}
                onChange={(e) =>
                  onSplitTextPropsChange({
                    animateBy: e.target.value as 'characters' | 'words',
                  })
                }
                className={inputClass}
              >
                <option value="characters">chars</option>
                <option value="words">words</option>
              </select>
            </div>
            <div>
              <label htmlFor="split-delay" className={labelClass}>
                Delay (s)
              </label>
              <input
                id="split-delay"
                type="number"
                min={0}
                step={0.1}
                value={splitTextProps.delay ?? 0}
                onChange={(e) =>
                  onSplitTextPropsChange({
                    delay: parseFloat(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="split-duration" className={labelClass}>
                Duration (s)
              </label>
              <input
                id="split-duration"
                type="number"
                min={0.1}
                step={0.1}
                value={splitTextProps.duration ?? 0.5}
                onChange={(e) =>
                  onSplitTextPropsChange({
                    duration: parseFloat(e.target.value) || 0.5,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="split-className" className={labelClass}>
                Class (Tailwind)
              </label>
              <input
                id="split-className"
                type="text"
                value={splitTextProps.className ?? ''}
                onChange={(e) =>
                  onSplitTextPropsChange({ className: e.target.value })
                }
                placeholder="e.g. text-4xl font-bold text-white"
                className={inputClass}
              />
            </div>
          </div>
        )}

        {selectedComponent === 'blur-text' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="blur-text" className={labelClass}>
                Text
              </label>
              <input
                id="blur-text"
                type="text"
                value={blurTextProps.text}
                onChange={(e) => onBlurTextPropsChange({ text: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="blur-animateBy" className={labelClass}>
                Split Type
              </label>
              <select
                id="blur-animateBy"
                value={blurTextProps.animateBy}
                onChange={(e) =>
                  onBlurTextPropsChange({
                    animateBy: e.target.value as 'characters' | 'words',
                  })
                }
                className={inputClass}
              >
                <option value="characters">chars</option>
                <option value="words">words</option>
              </select>
            </div>
            <div>
              <label htmlFor="blur-blurAmount" className={labelClass}>
                Blur Amount (px)
              </label>
              <input
                id="blur-blurAmount"
                type="number"
                min={0}
                max={30}
                value={blurTextProps.blurAmount ?? 10}
                onChange={(e) =>
                  onBlurTextPropsChange({
                    blurAmount: parseInt(e.target.value, 10) || 10,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="blur-delay" className={labelClass}>
                Delay (s)
              </label>
              <input
                id="blur-delay"
                type="number"
                min={0}
                step={0.1}
                value={blurTextProps.delay ?? 0}
                onChange={(e) =>
                  onBlurTextPropsChange({
                    delay: parseFloat(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="blur-duration" className={labelClass}>
                Duration (s)
              </label>
              <input
                id="blur-duration"
                type="number"
                min={0.1}
                step={0.1}
                value={blurTextProps.duration ?? 0.8}
                onChange={(e) =>
                  onBlurTextPropsChange({
                    duration: parseFloat(e.target.value) || 0.8,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="blur-className" className={labelClass}>
                Class (Tailwind)
              </label>
              <input
                id="blur-className"
                type="text"
                value={blurTextProps.className ?? ''}
                onChange={(e) =>
                  onBlurTextPropsChange({ className: e.target.value })
                }
                placeholder="e.g. text-4xl font-bold text-white"
                className={inputClass}
              />
            </div>
          </div>
        )}

        {selectedComponent === 'text-cursor' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="cursor-text" className={labelClass}>
                Text
              </label>
              <input
                id="cursor-text"
                type="text"
                value={textCursorProps.text}
                onChange={(e) =>
                  onTextCursorPropsChange({ text: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cursor-speed" className={labelClass}>
                Speed (ms per char)
              </label>
              <input
                id="cursor-speed"
                type="number"
                min={10}
                step={10}
                value={textCursorProps.speed ?? 50}
                onChange={(e) =>
                  onTextCursorPropsChange({
                    speed: parseInt(e.target.value, 10) || 50,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cursor-delay" className={labelClass}>
                Delay (ms)
              </label>
              <input
                id="cursor-delay"
                type="number"
                min={0}
                step={100}
                value={textCursorProps.delay ?? 0}
                onChange={(e) =>
                  onTextCursorPropsChange({
                    delay: parseInt(e.target.value, 10) || 0,
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cursor-cursor" className={labelClass}>
                Cursor character
              </label>
              <input
                id="cursor-cursor"
                type="text"
                maxLength={2}
                value={textCursorProps.cursor ?? '|'}
                onChange={(e) =>
                  onTextCursorPropsChange({
                    cursor: e.target.value || '|',
                  })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cursor-className" className={labelClass}>
                Class (Tailwind)
              </label>
              <input
                id="cursor-className"
                type="text"
                value={textCursorProps.className ?? ''}
                onChange={(e) =>
                  onTextCursorPropsChange({ className: e.target.value })
                }
                placeholder="e.g. text-3xl font-mono text-white"
                className={inputClass}
              />
            </div>
          </div>
        )}

        {selectedComponent === 'silk' && (
          <>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="silk-speed" className={labelClass}>
                    Speed
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {silkProps.speed ?? 5}
                  </span>
                </div>
                <input
                  id="silk-speed"
                  type="range"
                  min={0}
                  max={30}
                  step={0.5}
                  value={silkProps.speed ?? 5}
                  onChange={(e) =>
                    onSilkPropsChange({
                      speed: parseFloat(e.target.value) || 5,
                    })
                  }
                  className={sliderClass}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="silk-scale" className={labelClass}>
                    Scale
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {silkProps.scale ?? 1}
                  </span>
                </div>
                <input
                  id="silk-scale"
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={silkProps.scale ?? 1}
                  onChange={(e) =>
                    onSilkPropsChange({
                      scale: parseFloat(e.target.value) || 1,
                    })
                  }
                  className={sliderClass}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="silk-noiseIntensity" className={labelClass}>
                    Noise Intensity
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {silkProps.noiseIntensity ?? 1.5}
                  </span>
                </div>
                <input
                  id="silk-noiseIntensity"
                  type="range"
                  min={0}
                  max={3}
                  step={0.1}
                  value={silkProps.noiseIntensity ?? 1.5}
                  onChange={(e) =>
                    onSilkPropsChange({
                      noiseIntensity: parseFloat(e.target.value) || 1.5,
                    })
                  }
                  className={sliderClass}
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="silk-rotation" className={labelClass}>
                    Rotation
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {silkProps.rotation ?? 0}
                  </span>
                </div>
                <input
                  id="silk-rotation"
                  type="range"
                  min={0}
                  max={6.28}
                  step={0.1}
                  value={silkProps.rotation ?? 0}
                  onChange={(e) =>
                    onSilkPropsChange({
                      rotation: parseFloat(e.target.value) || 0,
                    })
                  }
                  className={sliderClass}
                />
              </div>
              <div>
                <label htmlFor="silk-color" className={labelClass}>
                  Color
                </label>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    id="silk-color"
                    type="color"
                    value={silkProps.color ?? '#7B7481'}
                    onChange={(e) => onSilkPropsChange({ color: e.target.value })}
                    className="h-9 w-14 cursor-pointer rounded border border-slate-600 bg-slate-800 p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded"
                  />
                  <input
                    type="text"
                    value={silkProps.color ?? '#7B7481'}
                    onChange={(e) => onSilkPropsChange({ color: e.target.value })}
                    className={inputClass + ' flex-1 font-mono text-xs'}
                    placeholder="#7B7481"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Props</h3>
              <div className="overflow-x-auto rounded-md border border-slate-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-800/80">
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">
                        Property
                      </th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">
                        Type
                      </th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">
                        Default
                      </th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    <tr className="border-b border-slate-700/80">
                      <td className="py-2 px-3 font-mono text-slate-200">
                        speed
                      </td>
                      <td className="py-2 px-3">number</td>
                      <td className="py-2 px-3">5</td>
                      <td className="py-2 px-3">
                        Controls the animation speed of the silk effect.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/80">
                      <td className="py-2 px-3 font-mono text-slate-200">
                        scale
                      </td>
                      <td className="py-2 px-3">number</td>
                      <td className="py-2 px-3">1</td>
                      <td className="py-2 px-3">
                        Controls the scale of the silk pattern.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/80">
                      <td className="py-2 px-3 font-mono text-slate-200">
                        color
                      </td>
                      <td className="py-2 px-3">string</td>
                      <td className="py-2 px-3">&apos;#7B7481&apos;</td>
                      <td className="py-2 px-3">
                        Hex color code for the silk pattern.
                      </td>
                    </tr>
                    <tr className="border-b border-slate-700/80">
                      <td className="py-2 px-3 font-mono text-slate-200">
                        noiseIntensity
                      </td>
                      <td className="py-2 px-3">number</td>
                      <td className="py-2 px-3">1.5</td>
                      <td className="py-2 px-3">
                        Amount of grain/noise over the pattern.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-slate-200">
                        rotation
                      </td>
                      <td className="py-2 px-3">number</td>
                      <td className="py-2 px-3">0</td>
                      <td className="py-2 px-3">
                        Rotation angle of the pattern (radians).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {selectedComponent === 'floating-lines' && (
          <>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="fl-animationSpeed" className={labelClass}>
                    Animation Speed
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {floatingLinesProps.animationSpeed ?? 1}
                  </span>
                </div>
                <input
                  id="fl-animationSpeed"
                  type="range"
                  min={0.1}
                  max={3}
                  step={0.1}
                  value={floatingLinesProps.animationSpeed ?? 1}
                  onChange={(e) =>
                    onFloatingLinesPropsChange({
                      animationSpeed: parseFloat(e.target.value) || 1,
                    })
                  }
                  className={sliderClass}
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Props</h3>
              <div className="overflow-x-auto rounded-md border border-slate-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-800/80">
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">Property</th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">Type</th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">Default</th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    <tr>
                      <td className="py-2 px-3 font-mono text-slate-200">animationSpeed</td>
                      <td className="py-2 px-3">number</td>
                      <td className="py-2 px-3">1</td>
                      <td className="py-2 px-3">Speed of the wave animation.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {(selectedComponent === 'smooth-scroll-hero' ||
          selectedComponent === 'aurora-hero' ||
          selectedComponent === 'faq') && (
          <div className="space-y-4 text-sm text-slate-400">
            <p>Section components don&apos;t have customizable props in this panel. Copy the code from the Code tab to use them in your project.</p>
          </div>
        )}

        {selectedComponent === 'light-pillar' && (
          <>
            <div className="space-y-5">
              <div>
                <label htmlFor="lp-topColor" className={labelClass}>
                  Top Color
                </label>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    id="lp-topColor"
                    type="color"
                    value={lightPillarProps.topColor ?? '#5227FF'}
                    onChange={(e) =>
                      onLightPillarPropsChange({ topColor: e.target.value })
                    }
                    className="h-9 w-14 cursor-pointer rounded border border-slate-600 bg-slate-800 p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded"
                  />
                  <input
                    type="text"
                    value={lightPillarProps.topColor ?? '#5227FF'}
                    onChange={(e) =>
                      onLightPillarPropsChange({ topColor: e.target.value })
                    }
                    className={inputClass + ' flex-1 font-mono text-xs'}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lp-bottomColor" className={labelClass}>
                  Bottom Color
                </label>
                <div className="flex gap-2 items-center mt-1">
                  <input
                    id="lp-bottomColor"
                    type="color"
                    value={lightPillarProps.bottomColor ?? '#FF9FFC'}
                    onChange={(e) =>
                      onLightPillarPropsChange({ bottomColor: e.target.value })
                    }
                    className="h-9 w-14 cursor-pointer rounded border border-slate-600 bg-slate-800 p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch]:rounded"
                  />
                  <input
                    type="text"
                    value={lightPillarProps.bottomColor ?? '#FF9FFC'}
                    onChange={(e) =>
                      onLightPillarPropsChange({ bottomColor: e.target.value })
                    }
                    className={inputClass + ' flex-1 font-mono text-xs'}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="lp-rotationSpeed" className={labelClass}>
                    Rotation Speed
                  </label>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {lightPillarProps.rotationSpeed ?? 0.3}
                  </span>
                </div>
                <input
                  id="lp-rotationSpeed"
                  type="range"
                  min={0}
                  max={2}
                  step={0.1}
                  value={lightPillarProps.rotationSpeed ?? 0.3}
                  onChange={(e) =>
                    onLightPillarPropsChange({
                      rotationSpeed: parseFloat(e.target.value) || 0.3,
                    })
                  }
                  className={sliderClass}
                />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Props</h3>
              <div className="overflow-x-auto rounded-md border border-slate-700">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-800/80">
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">
                        Property
                      </th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">
                        Type
                      </th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">
                        Default
                      </th>
                      <th className="text-left py-2 px-3 text-slate-300 font-medium">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    <tr className="border-b border-slate-700/80">
                      <td className="py-2 px-3 font-mono text-slate-200">
                        topColor
                      </td>
                      <td className="py-2 px-3">string</td>
                      <td className="py-2 px-3">&apos;#5227FF&apos;</td>
                      <td className="py-2 px-3">Hex color at top of pillar.</td>
                    </tr>
                    <tr className="border-b border-slate-700/80">
                      <td className="py-2 px-3 font-mono text-slate-200">
                        bottomColor
                      </td>
                      <td className="py-2 px-3">string</td>
                      <td className="py-2 px-3">&apos;#FF9FFC&apos;</td>
                      <td className="py-2 px-3">Hex color at bottom of pillar.</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono text-slate-200">
                        rotationSpeed
                      </td>
                      <td className="py-2 px-3">number</td>
                      <td className="py-2 px-3">0.3</td>
                      <td className="py-2 px-3">Rotation animation speed.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
