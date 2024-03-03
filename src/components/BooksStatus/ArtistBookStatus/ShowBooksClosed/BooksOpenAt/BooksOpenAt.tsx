import { Text } from '@mantine/core'

const BooksOpenAt = ({ date }: { date?: Date | null }) => {
  if (!date) return <Text span>TBD...</Text>

  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  } as const
  const dateType = new Date(date)

  return <Text span>{dateType.toLocaleString('en-US', options)}</Text>
}

export default BooksOpenAt
