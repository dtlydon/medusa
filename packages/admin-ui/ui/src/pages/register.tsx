import { useAdminGetSession } from "medusa-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SEO from "../components/seo"
import PublicLayout from "../components/templates/login-layout"
import RegisterCard from "../components/organisms/register-card"

const RegisterPage = () => {

  const { user } = useAdminGetSession()

  const navigate = useNavigate()

  // Redirect to dashboard if user is logged in
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <PublicLayout>
      <SEO title="Register" />
      <RegisterCard />
    </PublicLayout>
  )
}

export default RegisterPage
