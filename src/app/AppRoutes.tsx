import { Route, Routes } from 'react-router-dom'
import { GitConfigurationListScreen } from './GitConfiguration/GitConfigurationListScreen'
import { Layout } from './Layout'
import { SettingsScreen } from './Settings/SettingsScreen'

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<GitConfigurationListScreen />} />
        <Route
          path="/git-configuration"
          element={<GitConfigurationListScreen />}
        />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </Layout>
  )
}

export default AppRoutes
