import { Route, Routes } from 'react-router-dom'
import { Base64EncoderScreen } from './Base64Encoder/Base64EncoderScreen'
import { NotFound } from './components/NotFound'
import { GitConfigurationListScreen } from './GitConfiguration/GitConfigurationListScreen'
import { JsonEscaperScreen } from './JsonEscaper/JsonEscaperScreen'
import { JwtDecoderScreen } from './JwtDecoder/JwtDecoderScreen'
import { SettingsScreen } from './UserSettings/SettingsScreen'
import { SshUrlConverterScreen } from './SshUrlConverter/SshUrlConverterScreen'
import { TimestampConverterScreen } from './TimestampConverter/TimeStampConverterScreen'
import { QueryClientWrapper } from './QueryClientWrapper'
import { OnboardingScreen } from './Onboarding/OnboardingScreen'
import { LicensingScreen } from './Licensing/LicensingScreen'
import { UrlEncoderScreen } from './UrlEscaper/UrlEncoderScreen'
import { StringSorterScreen } from './StringSorter/StringSorterScreen'
import { StringCaseConverterScreen } from './StringCaseConverter/StringCaseConverterScreen'
import { EslintRuleGeneratorScreen } from './EslintRuleHelper/EslintRuleGeneratorScreen'
import { HtmlEncoderScreen } from './HtmlEncoder/HtmlEncoderScreen'
import { ColorConverterScreen } from './ColorConverter/ColorConverterScreen'
import { DevHistoryScreen } from './DevHistory/DevHistoryScreen'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<QueryClientWrapper />}>
        <Route index element={<GitConfigurationListScreen />} />
        <Route
          path="git-configuration"
          element={<GitConfigurationListScreen />}
        />
        <Route path="settings" element={<SettingsScreen />} />
        <Route path="jwt-decoder" element={<JwtDecoderScreen />} />
        <Route path="json-escaper" element={<JsonEscaperScreen />} />
        <Route path="base64-encoder" element={<Base64EncoderScreen />} />
        <Route path="git-url-converter" element={<SshUrlConverterScreen />} />
        <Route
          path="eslint-rule-generator"
          element={<EslintRuleGeneratorScreen />}
        />
        <Route path="html-char-encoding" element={<HtmlEncoderScreen />} />

        <Route
          path="unix-time-converter"
          element={<TimestampConverterScreen />}
        />
        <Route path="color-tools" element={<ColorConverterScreen />} />
        <Route path="onboarding" element={<OnboardingScreen />} />
        <Route path="licensing" element={<LicensingScreen />} />
        <Route path="string-case" element={<StringCaseConverterScreen />} />
        <Route path="url-encoder" element={<UrlEncoderScreen />} />
        <Route path="string-sort" element={<StringSorterScreen />} />
        <Route path="dev-history" element={<DevHistoryScreen />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
