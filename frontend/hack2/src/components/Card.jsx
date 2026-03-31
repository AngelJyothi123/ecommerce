const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`glass-card overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-5 border-b border-white/10 bg-white/5 ${className}`}>{children}</div>
);

const CardBody = ({ children, className = "" }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = "" }) => (
  <div className={`px-6 py-5 border-t border-white/10 bg-[#0a0a0a]/50 ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
