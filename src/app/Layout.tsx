import React from 'react'
import {
  ArrowDownOnSquareStackIcon,
  ShieldCheckIcon,
  ArrowUpCircleIcon,
  DocumentMagnifyingGlassIcon,
  Cog6ToothIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { NavLink, Outlet } from 'react-router-dom'
//import logo from '../assets/logo-tp.png'
import logo from '../assets/logo-grey800.png'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const navigation = [
  {
    name: 'Git Project Configurations',
    href: '/',
    icon: ArrowUpCircleIcon,
    current: false,
    end: true,
  },
  {
    name: 'Git SSH Configurations',
    href: '/ssh-configuration',
    icon: ShieldCheckIcon,
    hidden: true,
    current: false,
  },
  {
    name: 'JWT Decoder',
    href: '/jwt-decoder',
    icon: DocumentMagnifyingGlassIcon,
    current: false,
  },
  {
    name: 'Timezone Crossover',
    href: '/timezone-crossover',
    icon: ClockIcon,
    current: false,
  },
  {
    name: 'JSON Escape',
    href: '/json-escape',
    icon: ArrowDownOnSquareStackIcon,
    current: false,
  },
  {
    name: 'Base 64 Encode / Decode',
    href: '/base64-encode',
    icon: ArrowDownOnSquareStackIcon,
    current: false,
  },
  {
    name: 'Unix Time Converter',
    href: '/unix-time-converter',
    icon: ArrowDownOnSquareStackIcon,
    current: false,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    current: false,
  },
  //   { name: 'Team', href: '#', icon: UsersIcon, current: false },
  //   { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  //   { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  //   { name: 'Documents', href: '#', icon: InboxIcon, current: false },
  //   { name: 'Reports', href: '#', icon: ChartBarIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
const queryClient = new QueryClient()
export const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        {/* Static sidebar for desktop */}
        <div className="flex w-64 flex-col fixed inset-y-0 bg-gray-800">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center h-18 flex-shrink-0 px-4 my-4">
              <img src={logo} alt="Local Dev Tools" />
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation
                  .filter(x => x.hidden != true)
                  .map(item => (
                    <NavLink
                      end={item.end}
                      key={item.name}
                      to={item.href}
                      className={props => {
                        if (props.isActive) {
                          return classNames(
                            'bg-gray-900 text-white',
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                          )
                        }
                        return classNames(
                          'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                        )
                      }}
                    >
                      <item.icon
                        className={'mr-3 flex-shrink-0 h-6 w-6'}
                        aria-hidden="true"
                      />
                      {item.name}
                    </NavLink>
                  ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="pl-64 mx-8 mt-8">
          <main className="">
            <Outlet />
          </main>
        </div>
      </div>
    </QueryClientProvider>
  )
}
