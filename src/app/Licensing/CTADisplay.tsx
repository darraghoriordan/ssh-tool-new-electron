import { CheckIcon } from '@heroicons/react/24/outline'

export const CTADisplay = () => {
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

  const openOpenStore = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.OpenStorePage.invoke()
  }

  return (
    <div className="bg-white shadow rounded-lg mt-8">
      <div className="mx-auto py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ready to purchase a License?
          </h2>
          <p className="mt-4 text-lg">
            Visit{' '}
            <a
              className="underline mx-1 p-1 text-blue-700 bg-pink-200 rounded-md"
              href="https://devshell.darraghoriordan.com"
              onClick={e => openOpenStore(e)}
            >
              http://devshell.darraghoriordan.com
            </a>{' '}
            to get a license
          </p>
        </div>
        <dl className="mt-12 gap-y-6 grid grid-cols-3 gap-x-6">
          {features.map(feature => (
            <div key={feature.name} className="relative">
              <dt>
                <CheckIcon
                  className="absolute h-6 w-6 text-green-500"
                  aria-hidden="true"
                />
                <p className="ml-9 text-lg font-medium leading-6 text-gray-900">
                  {feature.name}
                </p>
              </dt>
              <dd className="mt-2 ml-9 text-base text-gray-500">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
