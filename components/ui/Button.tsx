type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'px-6 py-2 rounded-md border border-black transition-opacity disabled:opacity-40 cursor-pointer';

  const variants: Record<ButtonVariant, string> = {
    primary: 'text-booking bg-inactive hover:bg-modal-bg',
    ghost: 'text-black bg-transparent hover:bg-inactive border-transparent',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
