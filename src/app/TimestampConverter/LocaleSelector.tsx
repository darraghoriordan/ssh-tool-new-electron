import locale from 'locale-codes'

export default function LocaleSelector({
  defaultValue,
  setSelectedLocale,
}: {
  defaultValue: string | undefined
  setSelectedLocale: (locale: string) => void
}) {
  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = event.target.value
    setSelectedLocale(newLocale)
  }

  return (
    <select name="locale" onChange={onChange} defaultValue={defaultValue}>
      {locale.all.map(l => (
        <option key={l.tag} value={l.tag}>{`${l.name} (${l.tag})`}</option>
      ))}
    </select>
  )
}
