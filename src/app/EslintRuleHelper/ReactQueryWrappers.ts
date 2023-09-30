import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import EslintRuleGenerationRecord from '../../electron/eslintRuleHelper/models/EslintRuleGeneration'
import EslintRuleGeneratorMeta from '../../electron/eslintRuleHelper/models/EslintRuleGeneratorMeta'
import { PastGenerationFile } from '../../electron/eslintRuleHelper/channels/ListPastGenerationsChannelSub'

export const wellKnownQueries = {
  runGenerate: 'eslint-rule-generate',
  getPastGenerations: 'eslint-rule-past-generations',
  getPastGeneration: 'eslint-rule-past-generation',
}
export function useEslintRuleGenerator() {
  const [_logMessages, logAMessage] = useContext(ConsoleContext)
  const queryClient = useQueryClient()
  return useMutation<
    EslintRuleGenerationRecord,
    { message: string },
    EslintRuleGeneratorMeta,
    unknown
  >(
    [wellKnownQueries.runGenerate],
    async variables => {
      return window.EslintRuleGenerator.invoke(variables)
    },
    {
      onError: error => {
        logAMessage({ message: error.message, level: 'error' })
      },
      onSuccess: () => {
        logAMessage({
          message: `${wellKnownQueries.runGenerate} job has been started. This is an async process. Monitor the generations history section to track progress.`,
          level: 'info',
        })
        queryClient.invalidateQueries({
          queryKey: [wellKnownQueries.getPastGenerations],
        })
      },
    },
  )
}

export function useGetPastGenerations() {
  return useQuery<PastGenerationFile[]>(
    [wellKnownQueries.getPastGenerations],
    async () => window.EslintListPastGenerations.invoke(),
    {
      retry: false,
      refetchInterval: 3000,
    },
  )
}
export function useGetPastGeneration(fileName: string) {
  return useQuery<EslintRuleGenerationRecord>(
    [wellKnownQueries.getPastGeneration, { fileName }],
    async ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [key, { fileName }] = queryKey as [string, { fileName: string }]
      return window.EslintGetPastGeneration.invoke(fileName)
    },
    { retry: false, refetchInterval: 3000 },
  )
}
