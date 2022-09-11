import React from 'react'
import {
  ArrowDownOnSquareStackIcon,
  ShieldCheckIcon,
  ArrowUpCircleIcon,
  DocumentMagnifyingGlassIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-tp.png'

const navigation = [
  {
    name: 'Git Project Configurations',
    href: '/',
    icon: ArrowUpCircleIcon,
    current: false,
  },
  {
    name: 'Git SSH Configurations',
    href: '/ssh-configuration',
    icon: ShieldCheckIcon,
    hidden: true,
    current: true,
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
  //   { name: 'Team', href: '#', icon: UsersIcon, current: false },
  //   { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  //   { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  //   { name: 'Documents', href: '#', icon: InboxIcon, current: false },
  //   { name: 'Reports', href: '#', icon: ChartBarIcon, current: false },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* Static sidebar for desktop */}
      <div className="flex w-64 flex-col fixed inset-y-0">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
          <div className="flex items-center h-18 flex-shrink-0 px-4 bg-gray-800">
            <img src={logo} alt="Local Dev Tools" />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation
                .filter(x => x.hidden != true)
                .map(item => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={(props: { isActive: boolean }): string => {
                      return classNames(
                        props.isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
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
      <div className="md:pl-64 flex flex-col">
        <main className="flex-1">
          <div className="pb-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
