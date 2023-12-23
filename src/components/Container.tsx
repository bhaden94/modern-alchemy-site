export default function PageContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container">
      <main>{children}</main>
    </div>
  )
}
