'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

export const MobileInput = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    icon = null,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            input-style w-full
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-12' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${isFocused ? 'ring-2 ring-blue-500 border-transparent' : ''}
            transition-all duration-200
          `}
                    {...props}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                        <FaTimes className="w-3 h-3 mr-1" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export const MobileTextarea = ({
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    rows = 4,
    maxLength,
    className = '',
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                <textarea
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={rows}
                    maxLength={maxLength}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
            input-style w-full resize-none
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${isFocused ? 'ring-2 ring-blue-500 border-transparent' : ''}
            transition-all duration-200
          `}
                    {...props}
                />

                {maxLength && (
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                        {value?.length || 0}/{maxLength}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                        <FaTimes className="w-3 h-3 mr-1" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export const MobileSelect = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Select an option',
    error,
    required = false,
    disabled = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
          input-style w-full
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          transition-all duration-200
        `}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
                    >
                        <FaTimes className="w-3 h-3 mr-1" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

export const MobileCheckbox = ({
    label,
    checked,
    onChange,
    disabled = false,
    className = ''
}) => {
    return (
        <label className={`flex items-center space-x-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    className="sr-only"
                />
                <div className={`
          w-5 h-5 rounded border-2 transition-all duration-200
          ${checked
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    }
        `}>
                    {checked && (
                        <FaCheck className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                    )}
                </div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                {label}
            </span>
        </label>
    );
};