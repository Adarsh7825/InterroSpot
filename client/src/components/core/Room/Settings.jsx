import React from 'react';

const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'python', label: 'Python' },
    { value: 'c_cpp', label: 'C/C++' },
    { value: 'golang', label: 'Go' },
    { value: 'csharp', label: 'C#' },
    { value: 'rust', label: 'Rust' }
];

const themeOptions = [
    { value: 'github', label: 'Github' },
    { value: 'cobalt', label: 'Cobalt' },
    { value: 'dracula', label: 'Dracula' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'xcode', label: 'Xcode' },
    { value: 'terminal', label: 'Terminal' },
    { value: 'tomorrow_night', label: 'Tomorrow Night' },
    { value: 'solarized_dark', label: 'Solarized Dark' },
    { value: 'vibrant_ink', label: 'Vibrant Ink' },
    { value: 'one_dark', label: 'One Dark' }
];

const fontFamilyOptions = [
    { value: 'monospace', label: 'Monospace' },
    { value: 'Ubuntu Mono', label: 'Ubuntu Mono' },
    { value: 'Fira Code', label: 'Fira Code' },
    { value: 'Roboto Mono', label: 'Roboto Mono' },
    { value: 'Cascadia Code', label: 'Cascadia Code' },
    { value: 'Consolas', label: 'Consolas' },
    { value: 'Courier New', label: 'Courier New' },
    { value: 'Lucida Console', label: 'Lucida Console' },
    { value: 'Lucida Sans Typewriter', label: 'Lucida Sans Typewriter' },
    { value: 'Lucida Typewriter', label: 'Lucida Typewriter' },
];

const fontSizeOptions = [14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40];

const Settings = ({
    setTheme,
    setFontSize,
    setFontFamily,
    language,
    theme,
    fontSize,
    fontFamily,
    roomName,
    run,
    handleLangChange,
    roomid,
    running
}) => {
    return (
        <div className="editor-setting">
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                <div>
                    <h5 className="text-xl">{roomName}</h5>
                    <p>{roomid}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                        <label htmlFor="language-selector" className="text-sm">Language</label>
                        <select
                            id="language-selector"
                            value={language}
                            onChange={(e) => handleLangChange(e.target.value)}
                            className="p-2 bg-gray-700 text-black rounded"
                        >
                            {languageOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="theme-selector" className="text-sm">Theme</label>
                        <select
                            id="theme-selector"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="p-2 bg-gray-700 text-black rounded"
                        >
                            {themeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="font-family-selector" className="text-sm">Font Family</label>
                        <select
                            id="font-family-selector"
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="p-2 bg-gray-700 text-black rounded"
                        >
                            {fontFamilyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="font-size-selector" className="text-sm">Font Size</label>
                        <select
                            id="font-size-selector"
                            value={fontSize}
                            onChange={(e) => setFontSize(e.target.value)}
                            className="p-2 bg-gray-700 text-black rounded"
                        >
                            {fontSizeOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={run}
                        disabled={running}
                        className={`p-2 bg-blue-500 text-white rounded ${running ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-5.197-3.03A1 1 0 008 9.03v5.94a1 1 0 001.555.832l5.197-3.03a1 1 0 000-1.664z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;