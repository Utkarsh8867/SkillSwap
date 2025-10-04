'use client';

import { FaPlus, FaTimes } from 'react-icons/fa';
import { Controller } from 'react-hook-form';

export const SkillTags = ({ name, control, label, placeholder, rules }) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
          <div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder={placeholder || "Add a skill and press Enter"}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = e.target.value.trim();
                    if (value && !(field.value || []).includes(value)) {
                      field.onChange([...(field.value || []), value]);
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(field.value || []).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(field.value.filter((_, i) => i !== index));
                    }}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error.message}</p>}
        </div>
      )}
    />
  );
};