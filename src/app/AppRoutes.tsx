import { Route, Routes } from 'react-router-dom'
import { GitConfigurationScreen } from './GitConfiguration/GitConfigurationScreen'
import { Layout } from './Layout'
import { SettingsScreen } from './Settings/SettingsScreen'

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<GitConfigurationScreen />} />
        <Route path="/git-configuration" element={<GitConfigurationScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </Layout>
  )
}

export default AppRoutes
