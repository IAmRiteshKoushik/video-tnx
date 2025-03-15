import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/educator/courses/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/educator/courses/new/"!</div>
}
