import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/student/loading')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/student/loading"!</div>
}
