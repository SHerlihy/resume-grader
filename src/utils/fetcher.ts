import { getErrorMessage } from "./error"

const fetcher = () => {
    let isFetching = false

    const getFetching = () => {
        return isFetching
    }

    const doFetching = async(url: string, payload: Request) => {
        isFetching = true

        try{
            const response = await fetch(url, payload)
            isFetching = false

            if (response.status < 200 || 299 < response.status) {
                throw new Error(`Status ${response.status}: request unsuccessful`)
            }

            if (!response.ok) {
                throw new Error(`Status ${response.status}: request unsuccessful`)
            }

            return {
                success: true,
                message: `Status ${response.status}: request successful`,
                value: response.json()
            }
        } catch (error) {
            isFetching = false
            
            const message = getErrorMessage(error)

            return {
                success: false,
                message,
                value: {}
            }
        }
    }

    return {
        getFetching,
        doFetching,
    }
}
