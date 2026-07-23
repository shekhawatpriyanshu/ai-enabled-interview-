import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const TagInput = ({ tags = [], setTags }) => {
  const [input, setInput] = useState("");

  const addTag = () => {
    const value = input.trim();

    if (!value) return;

    // Prevent duplicate tags (case-insensitive)
    const exists = tags.some(
      (tag) => tag.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      setInput("");
      return;
    }

    setTags([...tags, value]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  return (
    <div className="space-y-3">

      <label className="block font-semibold">
        Tags
      </label>

      <input
        type="text"
        value={input}
        placeholder="Type a tag and press Enter"
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-wrap gap-2">

        {tags.map((tag, index) => (

          <div
            key={index}
            className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
          >

            <span>{tag}</span>

            <button
              type="button"
              onClick={() => removeTag(index)}
            >
              <FaTimes size={12} />
            </button>

          </div>

        ))}

      </div>

    </div>
  );
};

export default TagInput;