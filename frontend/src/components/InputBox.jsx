const InputBox = ({label, placeholder, onChange}) => {
  return (
    <div>
      <div className="font-medium text-left text-sm py-2">
            {label}
      </div>
      <input onChange={onChange} placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" />
    </div>
  )
}

export default InputBox
