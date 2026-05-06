type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  return (
    <div className='flex flex-col gap-1 w-full'>
      {label && (
        <label htmlFor={id} className='font-bold text-sm'>
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-3 py-2 rounded-lg border border-black
          bg-input placeholder:text-black/40
          focus:outline-none focus:ring-2 focus:ring-black/20
          ${error ? 'border-mandatory' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className='text-mandatory text-xs'>{error}</span>}
    </div>
  );
}
