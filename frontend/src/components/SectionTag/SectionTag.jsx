export default function SectionTag({ children, dark = false }) {
  return (
    <span className={`mb-4 inline-flex border-l-2 px-3 py-1.5 text-sm font-semibold ${dark ? 'border-serv-600 bg-serv-500/5 text-serv-700' : 'border-serv-200 bg-white/[.04] text-serv-100'}`}>
      {children}
    </span>
  )
}
