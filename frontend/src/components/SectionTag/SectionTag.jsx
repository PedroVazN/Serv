export default function SectionTag({ children, dark = false }) {
  return (
    <span className={`mb-4 inline-block rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[.14em] ${dark ? 'border-serv-500/25 bg-serv-500/10 text-serv-600' : 'border-serv-500/30 bg-serv-500/15 text-serv-300'}`}>
      {children}
    </span>
  )
}
