import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/student/enrolled/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/student/enrolled/"!</div>
}
