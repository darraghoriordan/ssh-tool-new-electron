import {
  ArrowUpCircleIcon,
  DocumentMagnifyingGlassIcon,
  Cog6ToothIcon,
  ClockIcon,
  FunnelIcon,
  CommandLineIcon,
  LinkIcon,
  CursorArrowRippleIcon,
  ChevronUpDownIcon,
  BarsArrowDownIcon,
  VariableIcon,
  HashtagIcon,
  PaintBrushIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'
import logo from '../../assets/logo-grey800-prompt.png'
import { MenuFooter } from '../components/MenuFooter'

const navigation = [
  {
    name: 'Git Project Configurations',
    href: '/',
    icon: ArrowUpCircleIcon,
    current: false,
    end: true,
  },
  {
    name: 'Git Url Converter',
    href: '/git-url-converter',
    icon: LinkIcon,
    current: false,
  },
  {
    name: 'Eslint Rule AI Agent',
    href: '/eslint-rule-generator',
    icon: VariableIcon,
    current: false,
  },
  {
    name: 'Html Char Encoding',
    href: '/html-char-encoding',
    icon: HashtagIcon,
    current: false,
  },
  {
    name: 'Marketing Week',
    href: '/marketing-week',
    icon: CalendarIcon,
    current: false,
  },
  {
    name: 'Color Tools',
    href: '/color-tools',
    icon: PaintBrushIcon,
    current: false,
  },
  {
    name: 'JWT Decoder',
    href: '/jwt-decoder',
    icon: DocumentMagnifyingGlassIcon,
    current: false,
  },

  {
    name: 'JSON Escape',
    href: '/json-escaper',
    icon: FunnelIcon,
    current: false,
  },
  {
    name: 'Base 64 Encode / Decode',
    href: '/base64-encoder',
    icon: CommandLineIcon,
    current: false,
  },
  {
    name: 'Timestamp Converter',
    href: '/unix-time-converter',
    icon: ClockIcon,
    current: false,
  },
  {
    name: 'String Case Converter',
    href: '/string-case',
    icon: ChevronUpDownIcon,
    current: false,
  },
  {
    name: 'Uri Encoder',
    href: '/url-encoder',
    icon: CursorArrowRippleIcon,
    current: false,
  },
  {
    name: 'String Sort',
    href: '/string-sort',
    icon: BarsArrowDownIcon,
    current: false,
  },
  {
    name: 'App Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    current: false,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export const SidebarMenu = () => {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center flex-shrink-0 px-4 my-4 h-18">
        <img src={logo} alt="Local Dev Tools" />
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map(item => (
            <NavLink
              end={item.end}
              key={item.name}
              to={item.href}
              className={input => {
                if (input.isActive) {
                  return classNames(
                    'bg-gray-900 text-white',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  )
                }
                return classNames(
                  'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
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

      <MenuFooter />
    </div>
  )
}
