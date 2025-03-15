import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/educator/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/educator/"!</div>
}
