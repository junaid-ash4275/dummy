import React, { useState } from 'react';

const PasswordGenerator = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(12);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [strength, setStrength] = useState('');
    const [copied, setCopied] = useState(false);
    const [sampleWord, setSampleWord] = useState('');

    const generatePassword = () => {
        let charset = '';
        let generatedPassword = '';

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (includeUppercase) charset += uppercase;
        if (includeLowercase) charset += lowercase;
        if (includeNumbers) charset += numbers;
        if (includeSymbols) charset += symbols;

        if (charset === '') {
            setPassword('');
            setStrength('');
            return;
        }

        // If sample word is provided, use it as base
        if (sampleWord && sampleWord.trim() !== '') {
            const cleanWord = sampleWord.trim();

            // Start with the sample word
            generatedPassword = cleanWord;

            // Calculate remaining length
            const remainingLength = length - cleanWord.length;

            if (remainingLength > 0) {
                // Add random characters from selected types
                let additionalChars = '';

                // Ensure at least one character from each selected type
                if (includeUppercase) additionalChars += uppercase[Math.floor(Math.random() * uppercase.length)];
                if (includeLowercase) additionalChars += lowercase[Math.floor(Math.random() * lowercase.length)];
                if (includeNumbers) additionalChars += numbers[Math.floor(Math.random() * numbers.length)];
                if (includeSymbols) additionalChars += symbols[Math.floor(Math.random() * symbols.length)];

                // Fill the rest with random characters
                for (let i = additionalChars.length; i < remainingLength; i++) {
                    additionalChars += charset[Math.floor(Math.random() * charset.length)];
                }

                // Shuffle additional characters
                additionalChars = additionalChars.split('').sort(() => Math.random() - 0.5).join('');

                // Randomly insert additional characters into the sample word
                const wordArray = generatedPassword.split('');
                const additionalArray = additionalChars.split('');

                additionalArray.forEach(char => {
                    const randomPos = Math.floor(Math.random() * (wordArray.length + 1));
                    wordArray.splice(randomPos, 0, char);
                });

                generatedPassword = wordArray.join('');
            }
        } else {
            // Original logic when no sample word
            // Ensure at least one character from each selected type
            if (includeUppercase) generatedPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
            if (includeLowercase) generatedPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
            if (includeNumbers) generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
            if (includeSymbols) generatedPassword += symbols[Math.floor(Math.random() * symbols.length)];

            // Fill the rest of the password
            for (let i = generatedPassword.length; i < length; i++) {
                generatedPassword += charset[Math.floor(Math.random() * charset.length)];
            }

            // Shuffle the password
            generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');
        }

        setPassword(generatedPassword);
        calculateStrength(generatedPassword);
        setCopied(false);
    };

    const calculateStrength = (pass) => {
        let score = 0;

        if (pass.length >= 8) score++;
        if (pass.length >= 12) score++;
        if (pass.length >= 16) score++;
        if (/[a-z]/.test(pass)) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^a-zA-Z0-9]/.test(pass)) score++;

        if (score <= 2) setStrength('Weak');
        else if (score <= 4) setStrength('Medium');
        else if (score <= 6) setStrength('Strong');
        else setStrength('Very Strong');
    };

    const copyToClipboard = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getStrengthColor = () => {
        switch (strength) {
            case 'Weak': return 'text-red-600 bg-red-50';
            case 'Medium': return 'text-yellow-600 bg-yellow-50';
            case 'Strong': return 'text-green-600 bg-green-50';
            case 'Very Strong': return 'text-blue-600 bg-blue-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getStrengthBarColor = () => {
        switch (strength) {
            case 'Weak': return 'bg-red-500';
            case 'Medium': return 'bg-yellow-500';
            case 'Strong': return 'bg-green-500';
            case 'Very Strong': return 'bg-blue-500';
            default: return 'bg-gray-300';
        }
    };

    const getStrengthBarWidth = () => {
        switch (strength) {
            case 'Weak': return 'w-1/4';
            case 'Medium': return 'w-2/4';
            case 'Strong': return 'w-3/4';
            case 'Very Strong': return 'w-full';
            default: return 'w-0';
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[400px] p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl m-5 shadow-2xl">
            <div className="bg-white p-10 rounded-xl max-w-md w-full shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent text-center">
                    Password Generator
                </h2>

                {/* Sample Word Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Sample Word (Optional)
                    </label>
                    <input
                        type="text"
                        value={sampleWord}
                        onChange={(e) => setSampleWord(e.target.value)}
                        placeholder="Enter a word to include in password"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Your word will be mixed with random characters
                    </p>
                </div>

                {/* Password Display */}
                <div className="mb-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-pink-50 p-4 rounded-lg border-2 border-indigo-200">
                        <div className="flex items-center justify-between gap-2">
                            <input
                                type="text"
                                value={password}
                                readOnly
                                placeholder="Click Generate to create password"
                                className="flex-1 bg-transparent text-lg font-mono font-semibold text-indigo-600 outline-none min-w-0 break-all"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg transition-all duration-300 hover:shadow-md"
                                title="Copy to clipboard"
                                disabled={!password}
                            >
                                {copied ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Strength Indicator */}
                    {password && (
                        <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Password Strength:</span>
                                <span className={`text-sm font-bold px-3 py-1 rounded-full ${getStrengthColor()}`}>
                                    {strength}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className={`h-full ${getStrengthBarColor()} ${getStrengthBarWidth()} transition-all duration-500`}></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Length Slider */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-600">Password Length</label>
                        <span className="text-lg font-bold text-indigo-600">{length}</span>
                    </div>
                    <input
                        type="range"
                        min="4"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>4</span>
                        <span>32</span>
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-3 mb-6">
                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">Include Uppercase (A-Z)</span>
                        <input
                            type="checkbox"
                            checked={includeUppercase}
                            onChange={(e) => setIncludeUppercase(e.target.checked)}
                            className="w-5 h-5 accent-indigo-500 cursor-pointer"
                        />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">Include Lowercase (a-z)</span>
                        <input
                            type="checkbox"
                            checked={includeLowercase}
                            onChange={(e) => setIncludeLowercase(e.target.checked)}
                            className="w-5 h-5 accent-indigo-500 cursor-pointer"
                        />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">Include Numbers (0-9)</span>
                        <input
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={(e) => setIncludeNumbers(e.target.checked)}
                            className="w-5 h-5 accent-indigo-500 cursor-pointer"
                        />
                    </label>

                    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">Include Symbols (!@#$%)</span>
                        <input
                            type="checkbox"
                            checked={includeSymbols}
                            onChange={(e) => setIncludeSymbols(e.target.checked)}
                            className="w-5 h-5 accent-indigo-500 cursor-pointer"
                        />
                    </label>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generatePassword}
                    className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white border-none py-3 px-8 text-base font-semibold rounded-full cursor-pointer transition-all duration-300 uppercase tracking-wider hover:transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-400/50 active:transform-none"
                >
                    Generate Password
                </button>

                {/* Info Text */}
                <p className="mt-4 text-xs text-center text-gray-500">
                    Create strong, secure passwords to protect your accounts
                </p>
            </div>
        </div>
    );
};

export default PasswordGenerator;
