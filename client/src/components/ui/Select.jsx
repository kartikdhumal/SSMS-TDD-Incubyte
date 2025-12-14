const Select = ({ label, options, ...props }) => {
    return (
        <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">{label}</label>
            <select
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 transition duration-150 appearance-none"
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;