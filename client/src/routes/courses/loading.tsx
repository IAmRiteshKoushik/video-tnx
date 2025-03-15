import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courses/loading')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/courses/loading"!</div>
}
