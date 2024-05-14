import { useAdminGetSession } from "medusa-react"
import { useMemo } from "react"

export const useIsSuperAdmin = () => {
  const { user } = useAdminGetSession()

  const isSuperAdmin = useMemo(() => {
    return !user?.store_id
  }, [user])

  return isSuperAdmin
}
