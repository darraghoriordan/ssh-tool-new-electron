import { Panel, PanelGroup } from 'react-resizable-panels'
import { useGetPastGeneration } from './ReactQueryWrappers'
import ResizeHandle from '../components/ResizeHandle'
import { useContext, useState } from 'react'
import clsx from 'clsx'
import Errors from './Errors'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import Success from './Success'
import InProgress from './InProgress'

export const GenerationResult = ({
  generationResultKey,
}: {
  generationResultKey: string | undefined
}) => {
  if (!generationResultKey) {
    return <></>
  }
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const { data: currentGenerationRecord, isLoading: currentGenRecordLoading } =
    useGetPastGeneration(generationResultKey)
  const [selectedEpoch, setSelectedEpoch] = useState<number>(
    currentGenerationRecord?.epochs
      ? currentGenerationRecord.epochs.length - 1
      : 0
  )

  const clipCode = (value: string) => {
    navigator.clipboard.writeText(value)
    logAMessage({
      message: `Copied code to clipboard`,
      level: 'info',
    })
  }

  if (currentGenRecordLoading) {
    return <div>Loading...</div>
  }
  return (
    <PanelGroup direction="horizontal" className="overflow-scroll">
      <Panel
        defaultSize={15}
        minSize={10}
        className="pr-8"
        style={{
          display: 'flex',

          //alignItems: "stretch",
          flexDirection: 'column',
        }}
      >
        <h3 className="mb-4 font-semibold">Epochs</h3>

        {currentGenerationRecord?.epochs &&
        currentGenerationRecord?.epochs?.length > 0 ? (
          <ul>
            {currentGenerationRecord?.epochs?.map((e, i) => {
              return (
                <li key={i}>
                  <button
                    className={clsx(
                      'w-full',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                      i === selectedEpoch
                        ? 'bg-gray-50 text-indigo-600'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                    )}
                    onClick={() => setSelectedEpoch(i)}
                  >
                    Epoch {i + 1}
                  </button>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="p-2 text-red-700 bg-red-50 rounded-md">
            No epochs recorded
          </p>
        )}
      </Panel>
      <ResizeHandle className="bg-dark-shade" />
      <Panel
        defaultSize={85}
        minSize={30}
        style={{
          display: 'flex',
          //alignItems: "stretch",
          flexDirection: 'column',
        }}
      >
        {' '}
        <div className="pl-8 overflow-x-auto">
          <h2 className="mb-4 font-semibold">Generation result</h2>
          {currentGenerationRecord?.epochs?.[selectedEpoch] ? (
            <>
              <p className="block mb-2 text-sm font-medium text-gray-700">
                Overall Result
              </p>
              <div className="mb-4">
                {!currentGenerationRecord?.epochs?.[selectedEpoch]
                  ?.completed && (
                  <InProgress
                    epoch={currentGenerationRecord.epochs[selectedEpoch]}
                  />
                )}

                {currentGenerationRecord?.epochs?.[selectedEpoch]?.completed &&
                  (currentGenerationRecord?.epochs?.[selectedEpoch]?.errors &&
                  currentGenerationRecord?.epochs?.[selectedEpoch]?.errors
                    .length > 0 ? (
                    <Errors
                      errors={
                        currentGenerationRecord.epochs[selectedEpoch].errors
                      }
                    />
                  ) : (
                    <Success />
                  ))}
              </div>
              <p className="block mb-2 text-sm font-medium text-gray-700">
                Tokens Used
              </p>
              <p>
                {currentGenerationRecord?.epochs?.[selectedEpoch]?.tokensUsed}
              </p>
              <p className="flex items-center mb-2 text-sm font-medium text-gray-700">
                Generated Code{' '}
                <ClipboardDocumentCheckIcon
                  className="w-10 h-10 p-2 ml-4 border rounded-lg hover:cursor-pointer"
                  title="click to copy to clipboard"
                  onClick={() =>
                    clipCode(
                      currentGenerationRecord?.epochs?.[selectedEpoch]?.code ||
                        ''
                    )
                  }
                ></ClipboardDocumentCheckIcon>
              </p>

              <pre className="p-2 border rounded-lg w-full">
                {currentGenerationRecord?.epochs?.[selectedEpoch]?.code || ''}
              </pre>
            </>
          ) : (
            <p>Nothing was generated</p>
          )}
        </div>
      </Panel>
    </PanelGroup>
  )
}
