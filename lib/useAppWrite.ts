import { useEffect, useState } from 'react'
import { Alert } from 'react-native';

function useAppWrite<TData>(func : () => Promise<any>, initialState: any = []) {

  const [data, setData] = useState<TData>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
    async function fetchData() {
        setIsLoading(true)

      try {
        const response = await func()
        setData(response)
        
      } catch (error: any) {
        Alert.alert("Error", error.message)
      } finally {
        setIsLoading(false)
      }
    }
    
  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => fetchData()

  return {data, isLoading, refetch}
}

export default useAppWrite