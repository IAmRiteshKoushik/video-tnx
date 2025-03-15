import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/courses/$id/learn/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/courses/$id/learn/"!</div>
}
