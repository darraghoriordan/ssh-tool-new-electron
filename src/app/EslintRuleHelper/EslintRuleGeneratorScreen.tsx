/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactElement, useContext, useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
  ArrowDownIcon,
  DocumentCheckIcon,
  VariableIcon,
} from '@heroicons/react/24/outline'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import {
  useEslintRuleGenerator,
  useGetPastGenerations,
} from './ReactQueryWrappers'
import EslintRuleGeneratorMeta from '../../electron/eslintRuleHelper/models/EslintRuleGeneratorMeta'
import clsx from 'clsx'
import { RemoveButton } from './RemoveButton'
import { GenerationResult } from './GenerationResult'
import { DescriptionAndHelp } from '../components/DescriptionAndHelp'
import { format } from 'date-fns'
import { ScreenWrapper } from '../ReusableComponents/ScreenWrapper'

const faqs = [
  {
    id: 1,
    question: 'What is this tool for?',
    answer:
      'ESLint rules are a great way to enforce rules around your code. Many orgs will have a PR checklist that devs go through manually every time they change the code. Some of those items could be enforced by ESLint rules, but writing and testing these rules can be tricky. ',
  },
  {
    id: 2,
    question: 'Why use it?',
    answer:
      'Writing ESLint rules requires knowledge of ESLint, TSESLint and Abstract Syntax Tree for javascript/typescript. This tool uses an AI assistant to write the AST logic. This makes them far more accessible to all engineering teams.',
  },
  {
    id: 3,
    question: 'Viewing Progress and Results',
    answer:
      "It takes some time to run an ESLint generation. The process is asynchronous. Once you click 'submit' the process will start and you can follow the generation process in the results section by scrolling below the criteria input screens.",
  },
  {
    id: 4,
    question: 'YOU MUST PROVIDE:',
    answer:
      'You must provide an OpenAI api key in App Settings. You must have docker installed - this tool uses docker to run the generated code for security isolation. This is an electron app with minimal access to your environment so it depends on docker being installed or aliased in the default location - /usr/local/bin.',
  },
  {
    id: 5,
    question: 'What does it do?',
    answer:
      'The tool will use the criteria you provide to generate an ESLint rule. It will then test the rule against the passing and failing examples you provide. If the rule fails, it will be regenerated with the error message until it passes or the maximum number of attempts is reached.',
  },
  {
    id: 6,
    question: 'Limitations',
    answer:
      'The tool is limited to 4k total tokens at the moment, this is roughly 6 epochs. This is a limitation of OpenAI GPT 3.5 API. The tools test docker container only has access to @typescript/eslint packages. Dependency on any other package will cause an error, although you might be able to use the generated code as inspiration!',
  },
  {
    id: 7,
    question: 'How to use the code in your project',
    answer:
      'Generally eslint rules must be part of a "plugin" but you can add "rulePaths" to your eslint config to point to your rules. You can consider using eslint-plugin-local-rules to make this easier.',
  },
  {
    id: 8,
    question: 'Tip - every run produces a different result',
    answer:
      'You can re-run the same criteria multiple times and get a different result every time. It can be worth seeing the different approaches the AI assistant takes.',
  },
  {
    id: 9,
    question: 'Tip - some results are very close',
    answer:
      "The AI generally fails with complex examples. But the generated code is often quite close to a working solution. It's worth reviewing every epoch to find the best result.",
  },
  {
    id: 10,
    question: 'Need more help?',
    answer:
      'The full docs are available at https://usemiller.dev/docs/local-dev-tools/get-started/quick-start',
  },
]

export function EslintRuleGeneratorScreen() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  // form fields
  const [criteriaEntry, setCriteriaEntry] = useState<string>('')
  const [passingExampleEntry, setPassingExampleEntry] = useState<string>('')
  const [failingMessageId, setFailingMessageIdEntry] = useState<string>('')
  const [failingCode, setFailingCodeEntry] = useState<string>('')

  const runMutation = useEslintRuleGenerator()
  const [inputValue, setInputValue] = useState<EslintRuleGeneratorMeta>(
    new EslintRuleGeneratorMeta(),
  )

  const [selectedGenerationRecordKey, setCurrentGenerationRecordKey] = useState<
    string | undefined
  >()
  const {
    data: pastGenerations,
    isLoading: pastGenerationsLoading,
    isError: _pastGenerationsError,
  } = useGetPastGenerations()
  let control: ReactElement | undefined = undefined

  const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    logAMessage({
      message: 'Checking criteria...',
      level: 'info',
    })
    if (
      inputValue.criteria.length === 0 ||
      inputValue.passingExamples.length === 0 ||
      inputValue.failingExamples.length === 0
    ) {
      logAMessage({
        message:
          'You must have at least one criteria, passing example and failing example to generate a rule.',
        level: 'error',
      })
      return
    }
    inputValue.requestDate = new Date()
    await runMutation.mutateAsync(inputValue)
    // set timer for 3 seconds to allow the mutation to complete
    // then set the currentGenerationRecordKey to the new record
    setTimeout(() => {
      setCurrentGenerationRecordKey(
        format(inputValue.requestDate, 'yyyyMMdd-HHmmss-SS'),
      )
    }, 3000)
  }

  const onDeleteCriteriaClick = async (itemText: string) => {
    const newCriteria = inputValue.criteria.filter(c => c !== itemText)
    setInputValue({ ...inputValue, criteria: newCriteria })
    logAMessage({
      message: "Deleted criteria '" + itemText + "'",
      level: 'info',
    })
  }
  const onDeletePassingExampleClick = async (itemText: string) => {
    const newPassingExamples = inputValue.passingExamples.filter(
      c => c !== itemText,
    )
    setInputValue({ ...inputValue, passingExamples: newPassingExamples })
    logAMessage({
      message: "Deleted passing example '" + itemText + "'",
      level: 'info',
    })
  }
  const onDeleteFailingExampleClick = async (itemText: string) => {
    const newFailingExamples = inputValue.failingExamples.filter(
      c => c.code !== itemText,
    )
    setInputValue({ ...inputValue, failingExamples: newFailingExamples })
    logAMessage({
      message: "Deleted failing example '" + itemText + "'",
      level: 'info',
    })
  }
  const onAddCriteriaClick = async () => {
    if (criteriaEntry === '') {
      logAMessage({
        message: 'Cannot add empty criteria',
        level: 'error',
      })
      return
    }
    const newCriteria = [...inputValue.criteria, criteriaEntry]
    setInputValue({ ...inputValue, criteria: newCriteria })
  }
  const onAddPassingCodeExampleClick = async () => {
    if (passingExampleEntry === '') {
      logAMessage({
        message: 'Cannot add empty example',
        level: 'error',
      })
      return
    }
    const newPassingExamples = [
      ...inputValue.passingExamples,
      passingExampleEntry,
    ]
    setInputValue({ ...inputValue, passingExamples: newPassingExamples })
  }
  const onAddFailingCodeExampleClick = async () => {
    if (failingCode === '' || failingMessageId === '') {
      logAMessage({
        message: 'Cannot add empty code or message id',
        level: 'error',
      })
      return
    }
    const newFailingExamples = [
      ...inputValue.failingExamples,
      { code: failingCode, errorMessageId: failingMessageId },
    ]
    setInputValue({ ...inputValue, failingExamples: newFailingExamples })
  }
  const insertSampleValue = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const ruleMeta: EslintRuleGeneratorMeta = {
      requestDate: new Date(),
      criteria: ['disallow interface names that start with the letter "I"'],
      maxNumberOfEpochs: 15,
      passingExamples: [
        `interface MyInterface {}`,
        `interface AnotherInterface {}`,
      ],
      failingExamples: [
        {
          code: `interface IForNoReason {}`,
          errorMessageId: 'noIinInterfaceNames',
        },
        { code: `interface IWhy {}`, errorMessageId: 'noIinInterfaceNames' },
      ],
    }
    setInputValue(ruleMeta)
  }
  const insertComplexSampleValue = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    const ruleMeta: EslintRuleGeneratorMeta = {
      requestDate: new Date(),
      criteria: [
        'all optional properties should have @IsOptional() decorator',
        'all required properties should have @IsDefined() decorator',
        'a property should never have both @IsDefined() and  @IsOptional()',
      ],
      maxNumberOfEpochs: 15,
      passingExamples: [
        // prettier-ignore
        `
class A {
  @IsDefined()
  b: string

  @IsDefined()
  c: string
}`,
        `class A {
  @IsOptional()
  b?: number

  @IsOptional()
  c?: string
}`,
        `class A {
    @IsDefined()
    b: number

    @IsOptional()
    c?: string
  }`,
      ],
      failingExamples: [
        {
          code: `class A {
@IsOptional()
b: string
          }
`,
          errorMessageId: 'missing-is-defined-decorator',
        },
        {
          code: `
            class A {
@IsOptional()
b?: string

  c: string
            }`,
          errorMessageId: 'missing-is-defined-decorator',
        },
        {
          code: `
        class A {
@IsInt()
 b?: string
        }
`,
          errorMessageId: 'missing-is-optional-decorator',
        },
        {
          code: `
        class A {
          @IsDefined()
          b?: string
        }`,
          errorMessageId: 'missing-is-optional-decorator',
        },
        {
          code: `
            class A {
              @IsDefined()
              @IsOptional()
              b?: string
            }`,
          errorMessageId: 'conflicting-defined-decorators',
        },
      ],
    }
    setInputValue(ruleMeta)
  }

  if (runMutation) {
    control = (
      <div className="px-4 py-5 bg-white shadow sm:rounded-lg sm:p-6 space-y-2">
        <div className="w-full p-4 border rounded-t-lg border-slate-200">
          <h2 className="mb-4 text-lg">Rule Criteria</h2>
          <div className="flex space-x-4">
            <div className="w-1/2">
              {inputValue.criteria.length <= 0 && (
                <>
                  <p className="mb-4 text-sm text-gray-500">
                    No criteria have been added yet. Use the form to add. You
                    can add multiple criteria for your rule.
                  </p>
                  <p className="mb-4 text-sm text-gray-500">
                    Examples of criteria are: &quot;Ensure all class names are
                    camelCase&quot; or &quot;disallow interface names that start
                    with I&quot;
                  </p>
                  <p className="text-sm text-gray-500">
                    It&apos;s best to keep your rules simple and focused rather
                    than joining many criteria together.
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
                className="block w-full mb-4 font-mono"
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
            <div className="2xl:flex 2xl:space-x-4">
              <div className="2xl:w-1/2 ">
                {inputValue.passingExamples.length <= 0 && (
                  <>
                    <p className="mb-4 text-sm text-gray-500">
                      No passing code examples have been added yet. A passing
                      code example is code that should not trigger your rule.
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                      The generated rule is verified in ESLint with the code
                      examples provided here.
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                      You must provide at least one code example to verify that
                      your ESLint rule passes
                    </p>
                  </>
                )}
                {inputValue.passingExamples.length > 0 && (
                  <ul className="overflow-x-auto">
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
              <div className="border-black 2xl:w-1/2 2xl:pl-4 2xl:border-l">
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
                  className="block w-full mb-4 font-mono"
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
            <div className="2xl:flex 2xl:space-x-4">
              <div className="2xl:w-1/2">
                {inputValue.failingExamples.length <= 0 && (
                  <>
                    <p className="mb-4 text-sm text-gray-500">
                      No failing code examples have been added yet. A failing
                      code example is code that should trigger your rule.
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                      Failing code examples also require an Error Message Id
                      that ESLint uses for reporting. An Error Message Id should
                      be descriptive of the error.
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                      Examples of error message ids are:
                      &quot;camelCase-only-classes&quot; or
                      &quot;no-I-in-interface-name&quot;
                    </p>
                  </>
                )}
                {inputValue.failingExamples.length > 0 && (
                  <ul className="overflow-x-auto">
                    {inputValue.failingExamples.map((c, i) => {
                      // prettier-ignore
                      const wrangledCode = `{
  code: "${c.code}",
  errorMessageId: "${c.errorMessageId}",
}`
                      return (
                        <li key={i} className="flex flex-col mb-8 space-y-4">
                          <pre>{wrangledCode}</pre>
                          <RemoveButton
                            className="inline-flex items-center justify-center w-1/2 mt-2 text-center"
                            onClick={() => onDeleteFailingExampleClick(c.code)}
                          ></RemoveButton>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <div className="border-black 2xl:w-1/2 2xl:pl-4 2xl:border-l">
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
                  className="block w-full mb-4 font-mono"
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
                  className="block w-full mb-4 font-mono"
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
        <div className="flex justify-start space-x-8">
          <div
            className="pr-8 border-gray-200 shrink-0 border-r-[6px]"
            style={{
              display: 'flex',
              //alignItems: "stretch",
              flexDirection: 'column',
            }}
          >
            <h3 className="mb-4 font-semibold">Past ESLint Rule Generations</h3>
            {pastGenerationsLoading && <p>loading...</p>}
            {!pastGenerationsLoading &&
              pastGenerations &&
              pastGenerations.length === 0 && <p>No records yet</p>}
            {!pastGenerationsLoading &&
              pastGenerations &&
              pastGenerations.length > 0 && (
                <ul className="flex flex-col space-y-3">
                  {pastGenerations.map((e, i) => {
                    return (
                      <li key={i} className="w-full">
                        <button
                          className={clsx(
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                            e.displayName === selectedGenerationRecordKey
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                          )}
                          onClick={() =>
                            setCurrentGenerationRecordKey(e.displayName)
                          }
                        >
                          <VariableIcon
                            className={clsx(
                              'h-6 w-6 shrink-0',
                              e.displayName === selectedGenerationRecordKey
                                ? 'text-indigo-600'
                                : 'text-gray-400 group-hover:text-indigo-600',
                            )}
                          />
                          {e.displayName}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
          </div>

          <GenerationResult generationResultKey={selectedGenerationRecordKey} />
        </div>
      </div>
    )
  }
  return (
    <ScreenWrapper>
      <PageHeader pageTitle={'ESLint Rule AI Agent'}>
        <button
          onClick={e => insertComplexSampleValue(e)}
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownIcon className="w-5 h-5 mr-2" />
          Try complex example
        </button>
        <button
          onClick={e => insertSampleValue(e)}
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <ArrowDownIcon className="w-5 h-5 mr-2" />
          Try simple example
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
      <DescriptionAndHelp
        title="Description and FAQ (Please Read!!)"
        faqs={faqs}
      />
      {control}
    </ScreenWrapper>
  )
}
