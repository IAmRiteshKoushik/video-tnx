/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as RegisterIndexImport } from './routes/register/index'
import { Route as LoginIndexImport } from './routes/login/index'
import { Route as CoursesLoadingImport } from './routes/courses/loading'
import { Route as DashboardStudentIndexImport } from './routes/dashboard/student/index'
import { Route as DashboardEducatorIndexImport } from './routes/dashboard/educator/index'
import { Route as CoursesIdIndexImport } from './routes/courses/$id/index'
import { Route as DashboardStudentLoadingImport } from './routes/dashboard/student/loading'
import { Route as CoursesIdLearnIndexImport } from './routes/courses/$id/learn/index'
import { Route as DashboardEducatorCoursesNewIndexImport } from './routes/dashboard/educator/courses/new/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const RegisterIndexRoute = RegisterIndexImport.update({
  id: '/register/',
  path: '/register/',
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  id: '/login/',
  path: '/login/',
  getParentRoute: () => rootRoute,
} as any)

const CoursesLoadingRoute = CoursesLoadingImport.update({
  id: '/courses/loading',
  path: '/courses/loading',
  getParentRoute: () => rootRoute,
} as any)

const DashboardStudentIndexRoute = DashboardStudentIndexImport.update({
  id: '/dashboard/student/',
  path: '/dashboard/student/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardEducatorIndexRoute = DashboardEducatorIndexImport.update({
  id: '/dashboard/educator/',
  path: '/dashboard/educator/',
  getParentRoute: () => rootRoute,
} as any)

const CoursesIdIndexRoute = CoursesIdIndexImport.update({
  id: '/courses/$id/',
  path: '/courses/$id/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardStudentLoadingRoute = DashboardStudentLoadingImport.update({
  id: '/dashboard/student/loading',
  path: '/dashboard/student/loading',
  getParentRoute: () => rootRoute,
} as any)

const CoursesIdLearnIndexRoute = CoursesIdLearnIndexImport.update({
  id: '/courses/$id/learn/',
  path: '/courses/$id/learn/',
  getParentRoute: () => rootRoute,
} as any)

const DashboardEducatorCoursesNewIndexRoute =
  DashboardEducatorCoursesNewIndexImport.update({
    id: '/dashboard/educator/courses/new/',
    path: '/dashboard/educator/courses/new/',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/courses/loading': {
      id: '/courses/loading'
      path: '/courses/loading'
      fullPath: '/courses/loading'
      preLoaderRoute: typeof CoursesLoadingImport
      parentRoute: typeof rootRoute
    }
    '/login/': {
      id: '/login/'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    '/register/': {
      id: '/register/'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/student/loading': {
      id: '/dashboard/student/loading'
      path: '/dashboard/student/loading'
      fullPath: '/dashboard/student/loading'
      preLoaderRoute: typeof DashboardStudentLoadingImport
      parentRoute: typeof rootRoute
    }
    '/courses/$id/': {
      id: '/courses/$id/'
      path: '/courses/$id'
      fullPath: '/courses/$id'
      preLoaderRoute: typeof CoursesIdIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/educator/': {
      id: '/dashboard/educator/'
      path: '/dashboard/educator'
      fullPath: '/dashboard/educator'
      preLoaderRoute: typeof DashboardEducatorIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/student/': {
      id: '/dashboard/student/'
      path: '/dashboard/student'
      fullPath: '/dashboard/student'
      preLoaderRoute: typeof DashboardStudentIndexImport
      parentRoute: typeof rootRoute
    }
    '/courses/$id/learn/': {
      id: '/courses/$id/learn/'
      path: '/courses/$id/learn'
      fullPath: '/courses/$id/learn'
      preLoaderRoute: typeof CoursesIdLearnIndexImport
      parentRoute: typeof rootRoute
    }
    '/dashboard/educator/courses/new/': {
      id: '/dashboard/educator/courses/new/'
      path: '/dashboard/educator/courses/new'
      fullPath: '/dashboard/educator/courses/new'
      preLoaderRoute: typeof DashboardEducatorCoursesNewIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/courses/loading': typeof CoursesLoadingRoute
  '/login': typeof LoginIndexRoute
  '/register': typeof RegisterIndexRoute
  '/dashboard/student/loading': typeof DashboardStudentLoadingRoute
  '/courses/$id': typeof CoursesIdIndexRoute
  '/dashboard/educator': typeof DashboardEducatorIndexRoute
  '/dashboard/student': typeof DashboardStudentIndexRoute
  '/courses/$id/learn': typeof CoursesIdLearnIndexRoute
  '/dashboard/educator/courses/new': typeof DashboardEducatorCoursesNewIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/courses/loading': typeof CoursesLoadingRoute
  '/login': typeof LoginIndexRoute
  '/register': typeof RegisterIndexRoute
  '/dashboard/student/loading': typeof DashboardStudentLoadingRoute
  '/courses/$id': typeof CoursesIdIndexRoute
  '/dashboard/educator': typeof DashboardEducatorIndexRoute
  '/dashboard/student': typeof DashboardStudentIndexRoute
  '/courses/$id/learn': typeof CoursesIdLearnIndexRoute
  '/dashboard/educator/courses/new': typeof DashboardEducatorCoursesNewIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/courses/loading': typeof CoursesLoadingRoute
  '/login/': typeof LoginIndexRoute
  '/register/': typeof RegisterIndexRoute
  '/dashboard/student/loading': typeof DashboardStudentLoadingRoute
  '/courses/$id/': typeof CoursesIdIndexRoute
  '/dashboard/educator/': typeof DashboardEducatorIndexRoute
  '/dashboard/student/': typeof DashboardStudentIndexRoute
  '/courses/$id/learn/': typeof CoursesIdLearnIndexRoute
  '/dashboard/educator/courses/new/': typeof DashboardEducatorCoursesNewIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/courses/loading'
    | '/login'
    | '/register'
    | '/dashboard/student/loading'
    | '/courses/$id'
    | '/dashboard/educator'
    | '/dashboard/student'
    | '/courses/$id/learn'
    | '/dashboard/educator/courses/new'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/courses/loading'
    | '/login'
    | '/register'
    | '/dashboard/student/loading'
    | '/courses/$id'
    | '/dashboard/educator'
    | '/dashboard/student'
    | '/courses/$id/learn'
    | '/dashboard/educator/courses/new'
  id:
    | '__root__'
    | '/'
    | '/courses/loading'
    | '/login/'
    | '/register/'
    | '/dashboard/student/loading'
    | '/courses/$id/'
    | '/dashboard/educator/'
    | '/dashboard/student/'
    | '/courses/$id/learn/'
    | '/dashboard/educator/courses/new/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  CoursesLoadingRoute: typeof CoursesLoadingRoute
  LoginIndexRoute: typeof LoginIndexRoute
  RegisterIndexRoute: typeof RegisterIndexRoute
  DashboardStudentLoadingRoute: typeof DashboardStudentLoadingRoute
  CoursesIdIndexRoute: typeof CoursesIdIndexRoute
  DashboardEducatorIndexRoute: typeof DashboardEducatorIndexRoute
  DashboardStudentIndexRoute: typeof DashboardStudentIndexRoute
  CoursesIdLearnIndexRoute: typeof CoursesIdLearnIndexRoute
  DashboardEducatorCoursesNewIndexRoute: typeof DashboardEducatorCoursesNewIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  CoursesLoadingRoute: CoursesLoadingRoute,
  LoginIndexRoute: LoginIndexRoute,
  RegisterIndexRoute: RegisterIndexRoute,
  DashboardStudentLoadingRoute: DashboardStudentLoadingRoute,
  CoursesIdIndexRoute: CoursesIdIndexRoute,
  DashboardEducatorIndexRoute: DashboardEducatorIndexRoute,
  DashboardStudentIndexRoute: DashboardStudentIndexRoute,
  CoursesIdLearnIndexRoute: CoursesIdLearnIndexRoute,
  DashboardEducatorCoursesNewIndexRoute: DashboardEducatorCoursesNewIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/courses/loading",
        "/login/",
        "/register/",
        "/dashboard/student/loading",
        "/courses/$id/",
        "/dashboard/educator/",
        "/dashboard/student/",
        "/courses/$id/learn/",
        "/dashboard/educator/courses/new/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/courses/loading": {
      "filePath": "courses/loading.tsx"
    },
    "/login/": {
      "filePath": "login/index.tsx"
    },
    "/register/": {
      "filePath": "register/index.tsx"
    },
    "/dashboard/student/loading": {
      "filePath": "dashboard/student/loading.tsx"
    },
    "/courses/$id/": {
      "filePath": "courses/$id/index.tsx"
    },
    "/dashboard/educator/": {
      "filePath": "dashboard/educator/index.tsx"
    },
    "/dashboard/student/": {
      "filePath": "dashboard/student/index.tsx"
    },
    "/courses/$id/learn/": {
      "filePath": "courses/$id/learn/index.tsx"
    },
    "/dashboard/educator/courses/new/": {
      "filePath": "dashboard/educator/courses/new/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
