const Input = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
          error ? "border-red-500/50 focus:ring-red-500" : "focus:ring-violet-500 focus:border-transparent"
        }`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default Input;
