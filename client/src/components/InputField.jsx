// components/InputField.jsx
const InputField = ({ label, id, type = "text", placeholder, value, onChange }) => (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-sm text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm p-2"
      />
    </div>
  );
  
  export default InputField;
  