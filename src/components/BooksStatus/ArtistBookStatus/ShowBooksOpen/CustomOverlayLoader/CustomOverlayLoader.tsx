import { Loader, Text } from '@mantine/core'

const CustomOverlayLoader = ({ label }: { label: string }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Loader />
      <Text>{label}</Text>
    </div>
  )
}
export default CustomOverlayLoader
