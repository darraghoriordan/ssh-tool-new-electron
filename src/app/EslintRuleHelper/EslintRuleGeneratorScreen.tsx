/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
  ArrowDownIcon,
  DocumentCheckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import { useEslintRuleGenerator } from './ReactQueryWrappers'
import EslintRuleGeneratorMeta from '../../electron/eslintRuleHelper/models/EslintRuleGeneratorMeta'
import EslintRuleGenerationRecord from '../../electron/eslintRuleHelper/models/EslintRuleGeneration'
import { PanelGroup, Panel } from 'react-resizable-panels'
import ResizeHandle from '../components/ResizeHandle'
import clsx from 'clsx'
import { RemoveButton } from './RemoveButton'

export function EslintRuleGeneratorScreen() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
  const runMutation = useEslintRuleGenerator()
  const [inputValue, setInputValue] = useState<EslintRuleGeneratorMeta>(
    new EslintRuleGeneratorMeta()
  )
  const [selectedEpoch, setSelectedEpoch] = useState<number>(0)
  const [criteriaEntry, setCriteriaEntry] = useState<string>('')
  const [passingExampleEntry, setPassingExampleEntry] = useState<string>('')
  const [failingMessageId, setFailingMessageIdEntry] = useState<string>('')
  const [failingCode, setFailingCodeEntry] = useState<string>('')
  const [outputValue, setOutputValue] = useState<
    EslintRuleGenerationRecord | undefined
  >()

  let control: ReactElement | undefined = undefined
  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const result = await runMutation.mutateAsync(inputValue)
    setOutputValue(result)
    setSelectedEpoch(result.epochs.length - 1)
  }
  const onDeleteCriteriaClick = async (itemText: string) => {
    const newCriteria = inputValue.criteria.filter(c => c !== itemText)
    setInputValue({ ...inputValue, criteria: newCriteria })
  }
  const onDeletePassingExampleClick = async (itemText: string) => {
    const newPassingExamples = inputValue.passingExamples.filter(
      c => c !== itemText
    )
    setInputValue({ ...inputValue, passingExamples: newPassingExamples })
  }
  const onDeleteFailingExampleClick = async (itemText: string) => {
    const newFailingExamples = inputValue.failingExamples.filter(
      c => c.code !== itemText
    )
    setInputValue({ ...inputValue, failingExamples: newFailingExamples })
  }
  const onAddCriteriaClick = async () => {
    const newCriteria = [...inputValue.criteria, criteriaEntry]
    setInputValue({ ...inputValue, criteria: newCriteria })
  }
  const onAddPassingCodeExampleClick = async () => {
    const newPassingExamples = [
      ...inputValue.passingExamples,
      passingExampleEntry,
    ]
    setInputValue({ ...inputValue, passingExamples: newPassingExamples })
  }
  const onAddFailingCodeExampleClick = async () => {
    const newFailingExamples = [
      ...inputValue.failingExamples,
      { code: failingCode, errorMessageId: failingMessageId },
    ]
    setInputValue({ ...inputValue, failingExamples: newFailingExamples })
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const ruleMeta: EslintRuleGeneratorMeta = {
      criteria: ['disallow class names that include the word "Zebra"'],
      maxNumberOfEpochs: 6,
      passingExamples: [`class AAA {}`, `class BBB {}`],
      failingExamples: [
        { code: `class AZebraA {}`, errorMessageId: 'dissallowZebraClass' },
        { code: `class ZebraA {}`, errorMessageId: 'dissallowZebraClass' },
      ],
      tmpCodeFilePath: '',
    }
    setInputValue(ruleMeta)
  }

  if (runMutation) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6 space-y-2">
        <div className="w-full p-4 border rounded-t-lg border-slate-200">
          <h2 className="mb-4 text-lg">Rule Criteria</h2>
          <div className="flex">
            <div className="w-1/2">
              {inputValue.criteria.length <= 0 && (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    No criteria have been added yet. Use the form to add. You
                    can add multiple criteria for your rule.
                  </p>
                  <p className="text-sm text-gray-500">
                    Examples of criteria are: &quot;Ensure all class names are
                    camelCase&quot; or &quot;disallow interface names that start
                    with I&quot;
                  </p>
                </>
              )}
              {inputValue.criteria.length > 0 && (
                <ul className="mb-4">
                  {inputValue.criteria.map((c, i) => {
                    return (
                      <li key={i} className="flex items-center">
                        {`${i + 1}. ${c}`}
                        <RemoveButton
                          className="ml-2"
                          onClick={() => onDeleteCriteriaClick(c)}
                        ></RemoveButton>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <div className="w-1/2">
              <label
                htmlFor="addCriteria"
                className="block text-sm font-medium text-gray-700"
              >
                Enter a new criteria for your rule
              </label>

              <input
                type="text"
                name="addCriteria"
                onChange={e => setCriteriaEntry(e.target.value)}
                id="addCriteria"
                className="mb-4 block w-full font-mono"
              />
              <button
                type="button"
                onClick={() => onAddCriteriaClick()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-full p-4 mb-8 border rounded-br-lg border-slate-200">
            <h2 className="mb-4 text-lg">Passing Code Examples</h2>
            <div className="flex">
              <div className="w-1/2">
                {inputValue.passingExamples.length <= 0 && (
                  <>
                    <p className="text-sm text-gray-500 mb-4">
                      No passing code examples have been added yet.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      You must provide at least one code example to verify that
                      your eslint rule passes
                    </p>
                  </>
                )}
                {inputValue.passingExamples.length > 0 && (
                  <ul className="">
                    {inputValue.passingExamples.map((c, i) => {
                      return (
                        <li key={i} className="mb-8">
                          <pre>{c} </pre>
                          <RemoveButton
                            className="mt-2"
                            onClick={() => onDeletePassingExampleClick(c)}
                          ></RemoveButton>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <div className="w-1/2 pl-4 border-l border-black">
                <label
                  htmlFor="passingCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code
                </label>

                <textarea
                  rows={8}
                  name="passingCode"
                  onChange={e => setPassingExampleEntry(e.target.value)}
                  id="passingCode"
                  className="block mb-4 font-mono"
                />

                <button
                  type="button"
                  onClick={() => onAddPassingCodeExampleClick()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="w-full p-4 mb-8 border rounded-br-lg border-slate-200">
            <h2 className="mb-4 text-lg">Failing Code Examples</h2>
            <div className="flex">
              <div className="w-1/2">
                {inputValue.failingExamples.length <= 0 && (
                  <>
                    <p className="text-sm text-gray-500 mb-4">
                      No failing code examples have been added yet.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Failing code examples need to have a code snippet that
                      will fail the Eslint rule and an error message Id. An
                      error message id should be descriptive of the error.
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Examples of error message ids are:
                      &quot;camelCase-only-classes&quot; or
                      &quot;noI-in-interface-name&quot;
                    </p>
                  </>
                )}
                {inputValue.failingExamples.length > 0 && (
                  <ul className="">
                    {inputValue.failingExamples.map((c, i) => {
                      return (
                        <li key={i} className="mb-8">
                          <pre>{c.code} </pre>
                          <div>{c.errorMessageId}</div>
                          <RemoveButton
                            className="mt-2"
                            onClick={() => onDeleteFailingExampleClick(c.code)}
                          ></RemoveButton>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <div className="w-1/2 pl-4 border-l border-black">
                <label
                  htmlFor="failingCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code
                </label>

                <textarea
                  rows={8}
                  name="failingCode"
                  onChange={e => setFailingCodeEntry(e.target.value)}
                  id="failingCode"
                  className="block mb-4 font-mono"
                />
                <label
                  htmlFor="failingMessageId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message Id
                </label>
                <input
                  type="text"
                  name="failingMessageId"
                  onChange={e => setFailingMessageIdEntry(e.target.value)}
                  id="failingMessageId"
                  className="block mb-4 font-mono"
                />

                <button
                  type="button"
                  onClick={() => onAddFailingCodeExampleClick()}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
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
            <span className="text-sm">Epochs</span>
            <ul>
              {outputValue?.epochs?.map((e, i) => {
                return (
                  <li key={i}>
                    <button
                      className={clsx(
                        'text-sm font-medium text-gray-900 truncate',
                        i === selectedEpoch
                          ? 'text-indigo-600'
                          : 'text-gray-500'
                      )}
                      onClick={() => setSelectedEpoch(i)}
                    >
                      Epoch {i}
                    </button>
                  </li>
                )
              })}
            </ul>
          </Panel>
          <ResizeHandle className="bg-dark-shade" />
          <Panel
            defaultSize={80}
            minSize={80}
            style={{
              display: 'flex',
              //alignItems: "stretch",
              flexDirection: 'column',
            }}
          >
            <div className="px-4">
              <label
                htmlFor="outputRule"
                className="block text-sm font-medium text-gray-700"
              >
                Generated Rule
              </label>
              <textarea
                rows={16}
                name="outputRule"
                disabled={true}
                id="outputRule"
                placeholder="Enter rule details and click the submit button"
                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={outputValue?.epochs?.[selectedEpoch]?.code || ''}
              />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-10xl">
      <PageHeader pageTitle={'Eslint Rule Generator'}>
        <button
          onClick={e => insertSampleValue(e)}
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownIcon className="w-5 h-5 mr-2" />
          Try with sample data
        </button>
        <button
          type="button"
          onClick={e => onSubmitClick(e)}
          disabled={runMutation.isLoading}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <DocumentCheckIcon className="w-5 h-5 mr-2" />
          Submit
        </button>
      </PageHeader>

      {control}
    </div>
  )
}
