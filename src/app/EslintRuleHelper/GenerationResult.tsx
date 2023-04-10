import { Panel, PanelGroup } from 'react-resizable-panels'
import { useGetPastGeneration } from './ReactQueryWrappers'
import ResizeHandle from '../components/ResizeHandle'
import { useState } from 'react'
import clsx from 'clsx'

export const GenerationResult = ({
  generationResultKey,
}: {
  generationResultKey: string | undefined
}) => {
  if (!generationResultKey) {
    return <></>
  }

  const { data: currentGenerationRecord, isLoading: currentGenRecordLoading } =
    useGetPastGeneration(generationResultKey)
  const [selectedEpoch, setSelectedEpoch] = useState<number>(
    currentGenerationRecord?.epochs
      ? currentGenerationRecord.epochs.length - 1
      : 0
  )

  if (currentGenRecordLoading) {
    return <div>Loading...</div>
  }
  return (
    <PanelGroup direction="horizontal" className="overflow-scroll">
      <Panel
        defaultSize={20}
        minSize={20}
        style={{
          display: 'flex',
          //alignItems: "stretch",
          flexDirection: 'column',
        }}
      >
        <div className="ml-2">
          <span className="mb-2 font-semibold">Epochs</span>
          <ul>
            {currentGenerationRecord?.epochs?.map((e, i) => {
              return (
                <li key={i}>
                  <button
                    className={clsx(
                      'text-sm font-medium text-gray-900 truncate',
                      i === selectedEpoch ? 'text-indigo-600' : 'text-gray-500'
                    )}
                    onClick={() => setSelectedEpoch(i)}
                  >
                    Epoch {i + 1}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </Panel>
      <ResizeHandle className="bg-dark-shade" />
      <Panel
        defaultSize={60}
        minSize={60}
        style={{
          display: 'flex',
          //alignItems: "stretch",
          flexDirection: 'column',
        }}
      >
        <div className="px-4">
          <h2 className="mb-2 font-semibold">Generation result</h2>
          <div className="mb-2">
            {currentGenerationRecord?.epochs?.[selectedEpoch]?.errors &&
            currentGenerationRecord?.epochs?.[selectedEpoch]?.errors.length >
              0 ? (
              <>
                <p>Errors found, will re-generate</p>
                <ul className="ml-2">
                  {currentGenerationRecord?.epochs?.[selectedEpoch].errors?.map(
                    (e, i) => {
                      return (
                        <li key={i}>
                          <p>Source: {e.source}</p>
                          Error: <pre>{e.message}</pre>
                        </li>
                      )
                    }
                  )}
                </ul>
              </>
            ) : (
              <p>No errors</p>
            )}
          </div>

          <p className="block text-sm font-medium text-gray-700">
            Generated Code
          </p>
          <pre>
            {currentGenerationRecord?.epochs?.[selectedEpoch]?.code || ''}
          </pre>
        </div>
      </Panel>
    </PanelGroup>
  )
}
