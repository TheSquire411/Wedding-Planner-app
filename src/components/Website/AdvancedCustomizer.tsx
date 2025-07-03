import React, { useState, useRef } from 'react';
import { Palette, Type, Layout, Image, Code, Smartphone, Monitor, Tablet, Save, Download, Upload, Layers, Grid, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, RotateCcw, Eye, Settings } from 'lucide-react';

interface CustomizationOptions {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    accent: string;
  };
  layout: {
    headerStyle: 'fixed' | 'static' | 'transparent';
    navigationStyle: 'horizontal' | 'vertical' | 'hamburger';
    sectionSpacing: 'compact' | 'normal' | 'spacious';
    containerWidth: 'narrow' | 'normal' | 'wide' | 'full';
  };
  animations: {
    enabled: boolean;
    speed: 'slow' | 'normal' | 'fast';
    effects: string[];
  };
  responsive: {
    mobileLayout: 'stack' | 'grid' | 'carousel';
    tabletLayout: 'desktop' | 'mobile' | 'hybrid';
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
}

interface AdvancedCustomizerProps {
  websiteData: any;
  onUpdate: (updates: any) => void;
  selectedTemplate: any;
}

export default function AdvancedCustomizer({ websiteData, onUpdate, selectedTemplate }: AdvancedCustomizerProps) {
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'animations' | 'responsive' | 'custom-css'>('colors');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [customizations, setCustomizations] = useState<CustomizationOptions>({
    colors: {
      primary: '#F8BBD9',
      secondary: '#D4AF37',
      accent: '#9CAF88',
      background: '#FFFFFF',
      text: '#333333'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
      accent: 'Dancing Script'
    },
    layout: {
      headerStyle: 'fixed',
      navigationStyle: 'horizontal',
      sectionSpacing: 'normal',
      containerWidth: 'normal'
    },
    animations: {
      enabled: true,
      speed: 'normal',
      effects: ['fadeIn', 'slideUp']
    },
    responsive: {
      mobileLayout: 'stack',
      tabletLayout: 'hybrid',
      breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1200
      }
    }
  });

  const [customCSS, setCustomCSS] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fontOptions = [
    { name: 'Playfair Display', category: 'serif', preview: 'Elegant & Classic' },
    { name: 'Montserrat', category: 'sans-serif', preview: 'Modern & Clean' },
    { name: 'Lora', category: 'serif', preview: 'Readable & Warm' },
    { name: 'Open Sans', category: 'sans-serif', preview: 'Friendly & Open' },
    { name: 'Crimson Text', category: 'serif', preview: 'Traditional & Refined' },
    { name: 'Nunito', category: 'sans-serif', preview: 'Rounded & Soft' },
    { name: 'Dancing Script', category: 'script', preview: 'Handwritten & Personal' },
    { name: 'Great Vibes', category: 'script', preview: 'Elegant Script' },
    { name: 'Roboto', category: 'sans-serif', preview: 'Technical & Modern' },
    { name: 'Merriweather', category: 'serif', preview: 'Literary & Classic' }
  ];

  const animationEffects = [
    { id: 'fadeIn', name: 'Fade In', description: 'Elements fade in smoothly' },
    { id: 'slideUp', name: 'Slide Up', description: 'Elements slide up from bottom' },
    { id: 'slideLeft', name: 'Slide Left', description: 'Elements slide in from right' },
    { id: 'zoomIn', name: 'Zoom In', description: 'Elements scale up on appearance' },
    { id: 'bounce', name: 'Bounce', description: 'Elements bounce on hover' },
    { id: 'parallax', name: 'Parallax', description: 'Background moves at different speed' },
    { id: 'typewriter', name: 'Typewriter', description: 'Text appears character by character' },
    { id: 'pulse', name: 'Pulse', description: 'Elements pulse gently' }
  ];

  const updateCustomization = (section: keyof CustomizationOptions, updates: any) => {
    setCustomizations(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    
    // Update website data
    onUpdate({
      customizations: {
        ...customizations,
        [section]: { ...customizations[section], ...updates }
      }
    });
  };

  const handleColorChange = (colorType: keyof CustomizationOptions['colors'], color: string) => {
    updateCustomization('colors', { [colorType]: color });
  };

  const handleFontChange = (fontType: keyof CustomizationOptions['fonts'], font: string) => {
    updateCustomization('fonts', { [fontType]: font });
  };

  const toggleAnimationEffect = (effectId: string) => {
    const currentEffects = customizations.animations.effects;
    const newEffects = currentEffects.includes(effectId)
      ? currentEffects.filter(id => id !== effectId)
      : [...currentEffects, effectId];
    
    updateCustomization('animations', { effects: newEffects });
  };

  const exportCustomizations = () => {
    const exportData = {
      template: selectedTemplate?.id,
      customizations,
      customCSS,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-website-customizations-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCustomizations = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (importData.customizations) {
          setCustomizations(importData.customizations);
        }
        if (importData.customCSS) {
          setCustomCSS(importData.customCSS);
        }
        alert('Customizations imported successfully!');
      } catch (error) {
        alert('Failed to import customizations. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all customizations to default values?')) {
      setCustomizations({
        colors: {
          primary: selectedTemplate?.colors?.[0] || '#F8BBD9',
          secondary: selectedTemplate?.colors?.[1] || '#D4AF37',
          accent: selectedTemplate?.colors?.[2] || '#9CAF88',
          background: '#FFFFFF',
          text: '#333333'
        },
        fonts: {
          heading: 'Playfair Display',
          body: 'Inter',
          accent: 'Dancing Script'
        },
        layout: {
          headerStyle: 'fixed',
          navigationStyle: 'horizontal',
          sectionSpacing: 'normal',
          containerWidth: 'normal'
        },
        animations: {
          enabled: true,
          speed: 'normal',
          effects: ['fadeIn', 'slideUp']
        },
        responsive: {
          mobileLayout: 'stack',
          tabletLayout: 'hybrid',
          breakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200
          }
        }
      });
      setCustomCSS('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">Advanced Customization</h2>
          <p className="text-gray-600 mt-2">Customize every aspect of your wedding website</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button
            onClick={exportCustomizations}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Device Preview Toggle */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Preview Device</h3>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                previewDevice === 'desktop'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Monitor className="h-4 w-4" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setPreviewDevice('tablet')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                previewDevice === 'tablet'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Tablet className="h-4 w-4" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                previewDevice === 'mobile'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Smartphone className="h-4 w-4" />
              <span>Mobile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customization Tabs */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {[
              { key: 'colors', label: 'Colors & Themes', icon: Palette },
              { key: 'typography', label: 'Typography', icon: Type },
              { key: 'layout', label: 'Layout & Structure', icon: Layout },
              { key: 'animations', label: 'Animations & Effects', icon: Layers },
              { key: 'responsive', label: 'Responsive Design', icon: Smartphone },
              { key: 'custom-css', label: 'Custom CSS', icon: Code }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Colors & Themes Tab */}
          {activeTab === 'colors' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Color Palette</h3>
                <div className="grid md:grid-cols-5 gap-6">
                  {Object.entries(customizations.colors).map(([colorType, colorValue]) => (
                    <div key={colorType} className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {colorType} Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                          style={{ backgroundColor: colorValue }}
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'color';
                            input.value = colorValue;
                            input.onchange = (e) => handleColorChange(colorType as any, (e.target as HTMLInputElement).value);
                            input.click();
                          }}
                        />
                        <div>
                          <input
                            type="text"
                            value={colorValue}
                            onChange={(e) => handleColorChange(colorType as any, e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <p className="text-xs text-gray-500 mt-1">{colorType}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Predefined Color Schemes */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4">Predefined Color Schemes</h4>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { name: 'Classic Romance', colors: ['#F8BBD9', '#D4AF37', '#9CAF88', '#FFFFFF', '#333333'] },
                    { name: 'Modern Elegance', colors: ['#2C3E50', '#ECF0F1', '#3498DB', '#FFFFFF', '#2C3E50'] },
                    { name: 'Rustic Charm', colors: ['#8B4513', '#DEB887', '#F4A460', '#FFF8DC', '#654321'] },
                    { name: 'Ocean Breeze', colors: ['#20B2AA', '#F0F8FF', '#FFE4B5', '#F0FFFF', '#2F4F4F'] }
                  ].map((scheme, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCustomizations(prev => ({
                          ...prev,
                          colors: {
                            primary: scheme.colors[0],
                            secondary: scheme.colors[1],
                            accent: scheme.colors[2],
                            background: scheme.colors[3],
                            text: scheme.colors[4]
                          }
                        }));
                      }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 transition-colors"
                    >
                      <div className="flex space-x-1 mb-2">
                        {scheme.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-6 h-6 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium text-gray-800">{scheme.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Font Selection</h3>
                <div className="space-y-6">
                  {Object.entries(customizations.fonts).map(([fontType, fontValue]) => (
                    <div key={fontType} className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700 capitalize">
                        {fontType} Font
                      </label>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {fontOptions.map((font) => (
                          <button
                            key={font.name}
                            onClick={() => handleFontChange(fontType as any, font.name)}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                              fontValue === font.name
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div
                              className="text-lg font-medium mb-1"
                              style={{ fontFamily: font.name }}
                            >
                              {font.name}
                            </div>
                            <div className="text-sm text-gray-600">{font.category}</div>
                            <div
                              className="text-sm text-gray-500 mt-2"
                              style={{ fontFamily: font.name }}
                            >
                              {font.preview}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Font Size and Spacing */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-4">Typography Settings</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Font Size</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="14">14px</option>
                      <option value="16" selected>16px</option>
                      <option value="18">18px</option>
                      <option value="20">20px</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Line Height</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="1.2">Tight (1.2)</option>
                      <option value="1.5" selected>Normal (1.5)</option>
                      <option value="1.8">Relaxed (1.8)</option>
                      <option value="2.0">Loose (2.0)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Letter Spacing</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option value="-0.05em">Tight</option>
                      <option value="0" selected>Normal</option>
                      <option value="0.05em">Wide</option>
                      <option value="0.1em">Extra Wide</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Header Style</h4>
                  <div className="space-y-3">
                    {[
                      { value: 'fixed', label: 'Fixed Header', description: 'Header stays at top when scrolling' },
                      { value: 'static', label: 'Static Header', description: 'Header scrolls with content' },
                      { value: 'transparent', label: 'Transparent Header', description: 'Header overlays content' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="headerStyle"
                          value={option.value}
                          checked={customizations.layout.headerStyle === option.value}
                          onChange={(e) => updateCustomization('layout', { headerStyle: e.target.value })}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Navigation Style</h4>
                  <div className="space-y-3">
                    {[
                      { value: 'horizontal', label: 'Horizontal Menu', description: 'Traditional horizontal navigation' },
                      { value: 'vertical', label: 'Vertical Menu', description: 'Sidebar navigation' },
                      { value: 'hamburger', label: 'Hamburger Menu', description: 'Collapsible mobile-style menu' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="navigationStyle"
                          value={option.value}
                          checked={customizations.layout.navigationStyle === option.value}
                          onChange={(e) => updateCustomization('layout', { navigationStyle: e.target.value })}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Section Spacing</h4>
                  <select
                    value={customizations.layout.sectionSpacing}
                    onChange={(e) => updateCustomization('layout', { sectionSpacing: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="compact">Compact - Minimal spacing</option>
                    <option value="normal">Normal - Balanced spacing</option>
                    <option value="spacious">Spacious - Generous spacing</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Container Width</h4>
                  <select
                    value={customizations.layout.containerWidth}
                    onChange={(e) => updateCustomization('layout', { containerWidth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="narrow">Narrow - 800px max</option>
                    <option value="normal">Normal - 1200px max</option>
                    <option value="wide">Wide - 1400px max</option>
                    <option value="full">Full Width - 100%</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Animations Tab */}
          {activeTab === 'animations' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Animation Settings</h3>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={customizations.animations.enabled}
                    onChange={(e) => updateCustomization('animations', { enabled: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Enable Animations</span>
                </label>
              </div>

              {customizations.animations.enabled && (
                <>
                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Animation Speed</h4>
                    <div className="flex space-x-4">
                      {['slow', 'normal', 'fast'].map((speed) => (
                        <label key={speed} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="animationSpeed"
                            value={speed}
                            checked={customizations.animations.speed === speed}
                            onChange={(e) => updateCustomization('animations', { speed: e.target.value })}
                          />
                          <span className="text-sm text-gray-700 capitalize">{speed}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-4">Animation Effects</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {animationEffects.map((effect) => (
                        <label key={effect.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={customizations.animations.effects.includes(effect.id)}
                            onChange={() => toggleAnimationEffect(effect.id)}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-gray-800">{effect.name}</div>
                            <div className="text-sm text-gray-600">{effect.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Responsive Tab */}
          {activeTab === 'responsive' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Responsive Breakpoints</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {Object.entries(customizations.responsive.breakpoints).map(([device, value]) => (
                    <div key={device}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {device} Breakpoint (px)
                      </label>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => updateCustomization('responsive', {
                          breakpoints: {
                            ...customizations.responsive.breakpoints,
                            [device]: Number(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Mobile Layout</h4>
                  <div className="space-y-3">
                    {[
                      { value: 'stack', label: 'Stack Layout', description: 'Elements stack vertically' },
                      { value: 'grid', label: 'Grid Layout', description: 'Maintain grid structure' },
                      { value: 'carousel', label: 'Carousel Layout', description: 'Swipeable sections' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="mobileLayout"
                          value={option.value}
                          checked={customizations.responsive.mobileLayout === option.value}
                          onChange={(e) => updateCustomization('responsive', { mobileLayout: e.target.value })}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Tablet Layout</h4>
                  <div className="space-y-3">
                    {[
                      { value: 'desktop', label: 'Desktop-like', description: 'Similar to desktop layout' },
                      { value: 'mobile', label: 'Mobile-like', description: 'Similar to mobile layout' },
                      { value: 'hybrid', label: 'Hybrid Layout', description: 'Optimized for tablets' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name="tabletLayout"
                          value={option.value}
                          checked={customizations.responsive.tabletLayout === option.value}
                          onChange={(e) => updateCustomization('responsive', { tabletLayout: e.target.value })}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom CSS Tab */}
          {activeTab === 'custom-css' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Custom CSS</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCustomCSS('')}
                    className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600">
                    Validate
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Add custom CSS to override default styles. Use standard CSS syntax.
                </p>
                <textarea
                  value={customCSS}
                  onChange={(e) => setCustomCSS(e.target.value)}
                  placeholder={`/* Add your custom CSS here */
.custom-header {
  background: linear-gradient(45deg, #F8BBD9, #D4AF37);
}

.custom-button {
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Responsive styles */
@media (max-width: 768px) {
  .custom-header {
    padding: 1rem;
  }
}`}
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm resize-none"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">CSS Tips & Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use specific selectors to avoid conflicts with existing styles</li>
                  <li>• Test your CSS on different screen sizes</li>
                  <li>• Use CSS variables for consistent theming: var(--primary-color)</li>
                  <li>• Consider using !important sparingly for overrides</li>
                  <li>• Validate your CSS before applying to avoid layout issues</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6">
        <div className="text-sm text-gray-600">
          Changes are automatically saved as you customize
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onUpdate({ customizations, customCSS })}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save All Changes</span>
          </button>
          <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4" />
            <span>Preview Live</span>
          </button>
        </div>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={importCustomizations}
        className="hidden"
      />
    </div>
  );
}