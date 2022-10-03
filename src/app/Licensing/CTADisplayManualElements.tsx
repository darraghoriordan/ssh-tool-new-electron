import { CheckIcon } from '@heroicons/react/24/outline'

export const CTADisplayManualElements = () => {
  const openOpenStore = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.OpenStorePage.invoke()
  }

  return (
    <div className="px-6 py-10 mx-auto bg-white rounded-lg shadow">
      <div className=" ">
        <div className="max-w-3xl pb-0 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 ">
            Ready to purchase a License?
          </h2>
          <p className="pt-8 text-lg">Get your license from </p>
          <p className="mb-8 mt-2">
            <a
              className="p-2 mx-1 text-black underline bg-pink-200 font-bold rounded-md"
              href="https://devshell.darraghoriordan.com"
              onClick={e => openOpenStore(e)}
            >
              http://devshell.darraghoriordan.com
            </a>
            <br />
          </p>
        </div>
        <div>
          <div className="flex flex-col space-y-6">
            <div className="relative">
              <dt>
                <CheckIcon
                  className="absolute w-6 h-6 text-green-500"
                  aria-hidden="true"
                />
                <p className="text-lg font-medium text-gray-900 ml-9 leading-6">
                  A Perpetual License
                </p>
              </dt>
              <dd className="text-base text-gray-500 ml-9">
                You buy a license and you own the tools forever. No
                subscriptions for offline tools.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <CheckIcon
                  className="absolute w-6 h-6 text-green-500"
                  aria-hidden="true"
                />
                <p className="text-lg font-medium text-gray-900 ml-9 leading-6">
                  Mac and Windows apps
                </p>
              </dt>
              <dd className="text-base text-gray-500 ml-9">
                Local dev tools is universal. You can use the tools on Windows
                or Mac computers.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <CheckIcon
                  className="absolute w-6 h-6 text-green-500"
                  aria-hidden="true"
                />
                <p className="text-lg font-medium text-gray-900 ml-9 leading-6">
                  6+ Tools by devs, for devs
                </p>
              </dt>
              <dd className="text-base text-gray-500 ml-9">
                Useful tools that I built for myself and I use them every day.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <CheckIcon
                  className="absolute w-6 h-6 text-green-500"
                  aria-hidden="true"
                />
                <p className="text-lg font-medium text-gray-900 ml-9 leading-6">
                  1 Year of Updates
                </p>
              </dt>
              <dd className="text-base text-gray-500 ml-9">
                You get 1 year of free updates with your license. You can still
                use the last version if your updates expire.
              </dd>
            </div>{' '}
            <div className="relative">
              <dt>
                <CheckIcon
                  className="absolute w-6 h-6 text-green-500"
                  aria-hidden="true"
                />
                <p className="text-lg font-medium text-gray-900 ml-9 leading-6">
                  Use on all your Computers
                </p>
              </dt>
              <dd className="text-base text-gray-500 ml-9">
                Your license is valid for multiple computers. You can use the
                tools on work and home computers or purchase for a team.
              </dd>
            </div>
            <div className="relative">
              <dt>
                <CheckIcon
                  className="absolute w-6 h-6 text-green-500"
                  aria-hidden="true"
                />
                <p className="text-lg font-medium text-gray-900 ml-9 leading-6">
                  Safe Offline Tools
                </p>
              </dt>
              <dd className="text-base text-gray-500 ml-9">
                You can paste your json and JWTs with confidence. Stop using
                random internet sites.
              </dd>
            </div>
          </div>
          <div className="text-center">
            <p className="pt-8 text-lg">Get your license from </p>
            <p className="mb-8 mt-2">
              <a
                className="p-2 mx-1 text-black underline bg-pink-200 font-bold rounded-md"
                href="https://devshell.darraghoriordan.com"
                onClick={e => openOpenStore(e)}
              >
                http://devshell.darraghoriordan.com
              </a>
              <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
