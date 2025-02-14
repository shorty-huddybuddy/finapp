interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  value?: number;
}

export function Slider({ error, ...props }: SliderProps) {
    return (
      <div>
        <input
          type="range"
          {...props}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        />
        {!props.disabled && <p className="mt-1 text-sm text-gray-500">{props.value}%</p>}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }

