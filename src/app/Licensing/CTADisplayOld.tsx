import { CheckIcon } from '@heroicons/react/24/outline'
const features = [
  {
    name: 'A Perpetual License',
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
    name: '1 Year of Updates',
    description:
      'You get 1 year of free updates with your license. You can still use the last version if your updates expire.',
  },
  {
    name: 'Use on 5 Computers',
    description:
      'Your license is valid for 5 computers. There is team licensing available for your business.',
  },
  {
    name: 'Safe Offline Tools',
    description:
      'You can paste your json and JWTs with confidence. Stop using random internet sites.',
  },
]

export const CTADisplayOld = () => {
  const openOpenStore = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.OpenStorePage.invoke()
  }

  return (
    <div className="px-4 py-10 mx-auto bg-white rounded-lg shadow">
      <div className=" ">
        <div className="max-w-3xl pb-0 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
            Ready to purchase a License?
          </h2>
          <p className="pb-0 my-8 text-lg">
            Visit{' '}
            <a
              className="mx-1 text-blue-700 underline bg-pink-200 rounded-md"
              href="https://devshell.darraghoriordan.com"
              onClick={e => openOpenStore(e)}
            >
              http://devshell.darraghoriordan.com
            </a>{' '}
            to get a license
          </p>
        </div>
        <div>
          <dl className="gap-y-6 grid grid-cols-3 gap-x-6">
            {features.map(feature => (
              <div key={feature.name} className="relative">
                <dt>
                  <CheckIcon
                    className="absolute w-6 h-6 text-green-500"
                    aria-hidden="true"
                  />
                  <p className="text-lg font-medium text-gray-900 ml-9 leading-6">
                    {feature.name}
                  </p>
                </dt>
                <dd className="text-base text-gray-500 ml-9">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
