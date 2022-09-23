import { Route, Routes } from 'react-router-dom'
import { NotFound } from './components/NotFound'
import { GitConfigurationListScreen } from './GitConfiguration/GitConfigurationListScreen'
import { JwtDecoderScreen } from './JwtDecoder/JwtDecoderScreen'
import { Layout } from './Layout'
import { SettingsScreen } from './Settings/SettingsScreen'

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
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
