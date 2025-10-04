

import React from 'react';

const trendingSkills = [
  "React", "Node.js", "Figma", "UI/UX", "Webflow", "SEO", "Next.js", "Marketing"
];

export default function Sidebar() {
  return (
    <aside className="w-full lg:w-1/4 lg:pl-8">
      <div className="bg-white rounded-lg border border-gray-200 p-5 sticky top-24">
        <h3 className="font-semibold text-gray-900 mb-4">Trending Skills</h3>

        <div className="flex flex-wrap gap-2">
          {trendingSkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition"
            >
              {skill}
            </span>
          ))}
        </div>

        <button className="w-full mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
          Filter Posts
        </button>
      </div>
    </aside>
  );
}