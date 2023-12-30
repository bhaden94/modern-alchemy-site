export default function PageContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto p-8 xl:max-w-[--mantine-breakpoint-xl]">
      <main>{children}</main>
    </div>
  )
}
