import React, { useState } from "react";

interface TabsProps {
  tabs: string[];
  defaultIndex?: number;
  onChange?: (index: number) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultIndex = 0, onChange }) => {
  const [active, setActive] = useState(defaultIndex);

  const handleClick = (index: number) => {
    setActive(index);
    onChange?.(index);
  };

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((label, idx) => (
        <div
          key={idx}
          onClick={() => handleClick(idx)}
          className={`
            px-4 py-2 -mb-px text-sm font-medium transition-colors cursor-pointer
            ${
              active === idx
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            }
          `}
        >
          {label}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
