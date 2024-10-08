import { useSelector } from 'react-redux'

function useFetchCurrentUserData() {
    const currentUserData = useSelector(state => state.auth.userData)
  return currentUserData && currentUserData
}

export default useFetchCurrentUserData
