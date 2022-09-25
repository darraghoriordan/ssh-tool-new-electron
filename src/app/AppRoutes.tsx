import { Route, Routes } from 'react-router-dom'
import { Base64EncoderScreen } from './Base64Encoder/Base64EncoderScreen'
import { NotFound } from './components/NotFound'
import { GitConfigurationListScreen } from './GitConfiguration/GitConfigurationListScreen'
import { JsonEscaperScreen } from './JsonEscaper/JsonEscaperScreen'
import { JwtDecoderScreen } from './JwtDecoder/JwtDecoderScreen'
import { Layout } from './Layout'
import { SettingsScreen } from './Settings/SettingsScreen'
import { SshUrlConverterScreen } from './SshUrlConverter/SshUrlConverterScreen'
import { TimestampConverterScreen } from './TimestampConverter/TimeStampConverterScreen'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
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
          path="unix-time-converter"
          element={<TimestampConverterScreen />}
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
