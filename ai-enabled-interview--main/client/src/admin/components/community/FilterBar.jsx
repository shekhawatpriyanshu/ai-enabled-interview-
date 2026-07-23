const FilterBar = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex justify-end">
      <select
        value={value}
        onChange={onChange}
        className="border rounded-lg px-4 py-2"
      >
        <option value="-createdAt">
          Newest First
        </option>

        <option value="createdAt">
          Oldest First
        </option>

        <option value="likes">
          Most Likes
        </option>

        <option value="comments">
          Most Comments
        </option>
      </select>
    </div>
  );
};

export default FilterBar;