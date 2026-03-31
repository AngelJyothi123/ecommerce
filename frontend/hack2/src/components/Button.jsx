const Button = ({ children, variant = "primary", loading = false, disabled, className = "", ...props }) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary text-gray-300",
    danger: "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)]",
    outline: "border border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.1)]",
  };

  return (
    <button
      className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center space-x-2">
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </span>
      ) : children}
    </button>
  );
};

export default Button;
