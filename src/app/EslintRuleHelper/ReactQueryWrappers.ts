import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { ConsoleContext } from '../ConsoleArea/ConsoleContext'
import EslintRuleGenerationRecord from '../../electron/eslintRuleHelper/models/EslintRuleGeneration'
import EslintRuleGeneratorMeta from '../../electron/eslintRuleHelper/models/EslintRuleGeneratorMeta'

export const wellKnownQueries = {
  runGenerate: 'eslint-rule-generate',
}
export function useEslintRuleGenerator() {
  const [logMessages, logAMessage] = useContext(ConsoleContext)
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
          message: `${wellKnownQueries.runGenerate} tool completed successfully.`,
          level: 'info',
        })
      },
    }
  )
}
