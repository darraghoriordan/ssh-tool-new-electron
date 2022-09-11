import { Route, Routes } from 'react-router-dom'
import { GitConfigurationScreen } from './GitConfiguration/GitConfigurationScreen'
import { Layout } from './Layout'
import { SshConfigurationScreen } from './SshAgentConfiguration/SshConfigurationScreen'

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<GitConfigurationScreen />} />
        <Route path="/git-configuration" element={<GitConfigurationScreen />} />
      </Routes>
    </Layout>
  )
}

export default AppRoutes
