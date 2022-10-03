import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { useSetLicensing } from './ReactQueryWrappers'

const features = [
  {
    name: 'Perpetual License',
    description:
      'You buy a license and you own the tools forever. No more subscriptions.',
  },
  {
    name: 'Mac and Windows apps',
    description:
      'Local dev tools is universal. You can use the tools on work and home computers.',
  },
  {
    name: '6+ Tools by devs, for devs',
    description:
      'Useful tools that I built for myself and I use them every day.',
  },
  {
    name: '1 year of updates',
    description:
      'You get 1 year of free updates with your license. You can still use the last version if your updates expire.',
  },
  {
    name: 'Use on 5 computers',
    description:
      'Your license is valid for 5 computers. There is team licensing available for your business.',
  },
  {
    name: 'Offline tools',
    description:
      'You can paste your json and JWTs with confidence. Stop using random internet sites.',
  },
]

export const CTAFromLicense = () => {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const setLicense = useSetLicensing()

  const openOpenStore = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.OpenStorePage.invoke()
  }
  return (
    <div
      style={{ width: '799px', height: '6640px' }}
      className="bg-white rounded-lg shadow"
    >
      <div className="max-w-3xl pt-12 pb-0 mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
          Ready to purchase a License?
        </h2>
        <p className="pt-4 pb-0 text-lg">
          Visit
          <a
            className="p-1 mx-1 text-blue-700 underline bg-pink-200 rounded-md"
            href="https://devshell.darraghoriordan.com"
            onClick={e => openOpenStore(e)}
          >
            http://devshell.darraghoriordan.com
          </a>
          to get a license{' '}
        </p>
      </div>

      <div className="px-4 py-5">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      </div>
    </div>
  )
}
