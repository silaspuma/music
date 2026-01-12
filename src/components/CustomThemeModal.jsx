import { useState } from 'react';
import { X } from 'lucide-react';

const CustomThemeModal = ({ onClose, onSave, initialTheme }) => {
    const [colors, setColors] = useState(initialTheme || {
        name: 'My Custom Theme',
        bg: '#121212',
        bgLight: '#1a1a1a',
        bgLighter: '#282828',
        primary: '#1ed760',
        primaryHover: '#1fdf64',
        text: '#ffffff',
        textMuted: '#b3b3b3',
    });

    const handleColorChange = (key, value) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        onSave(colors);
    };

    const colorFields = [
        { key: 'bg', label: 'Background' },
        { key: 'bgLight', label: 'Background Light' },
        { key: 'bgLighter', label: 'Background Lighter' },
        { key: 'primary', label: 'Primary (Accent)' },
        { key: 'primaryHover', label: 'Primary Hover' },
        { key: 'text', label: 'Text Color' },
        { key: 'textMuted', label: 'Text Muted' },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a1a1a] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#282828]">
                    <h2 className="text-2xl font-bold">Create Custom Theme</h2>
                    <button
                        onClick={onClose}
                        className="text-[#b3b3b3] hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Theme Name */}
                    <div>
                        <label className="block text-sm font-bold text-[#b3b3b3] mb-2">Theme Name</label>
                        <input
                            type="text"
                            value={colors.name}
                            onChange={(e) => handleColorChange('name', e.target.value)}
                            className="w-full bg-[#282828] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-[#1ed760]"
                            placeholder="My Custom Theme"
                        />
                    </div>

                    {/* Color Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {colorFields.map(field => (
                            <div key={field.key}>
                                <label className="block text-sm font-bold text-[#b3b3b3] mb-2">
                                    {field.label}
                                </label>
                                <div className="flex gap-3 items-center">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={colors[field.key]}
                                            onChange={(e) => handleColorChange(field.key, e.target.value)}
                                            className="w-full bg-[#282828] border border-[#3a3a3a] rounded px-3 py-2 text-white focus:outline-none focus:border-[#1ed760] text-sm font-mono"
                                            placeholder="#000000"
                                        />
                                    </div>
                                    <input
                                        type="color"
                                        value={colors[field.key]}
                                        onChange={(e) => handleColorChange(field.key, e.target.value)}
                                        className="w-12 h-10 rounded cursor-pointer border border-[#3a3a3a]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Preview */}
                    <div className="border-t border-[#282828] pt-6">
                        <p className="text-sm font-bold text-[#b3b3b3] mb-3">Preview</p>
                        <div
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                            className="p-6 rounded-lg border border-[#3a3a3a]"
                        >
                            <div style={{ backgroundColor: colors.bgLight }} className="p-4 rounded mb-3">
                                <p className="font-bold mb-2">Light Background</p>
                                <p style={{ color: colors.textMuted }} className="text-sm">Muted text example</p>
                            </div>
                            <button
                                style={{ backgroundColor: colors.primary }}
                                className="px-6 py-2 rounded font-bold text-black hover:opacity-90 transition"
                            >
                                Primary Button
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-[#282828]">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#282828] hover:bg-[#3a3a3a] text-white font-bold py-2 px-4 rounded transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        style={{ backgroundColor: colors.primary }}
                        className="flex-1 text-black font-bold py-2 px-4 rounded hover:opacity-90 transition"
                    >
                        Save Theme
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomThemeModal;
