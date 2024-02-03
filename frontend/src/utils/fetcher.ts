import { getErrorMessage } from "./error"
import { pubSub } from "./pubSub"

const {subscribe: fetcherSub, publish} = pubSub()

const fetcher = () => {
    let isFetching = false

    const getFetching = () => {
        return isFetching
    }

    const doFetching = async(url: URL, payload: RequestInit) => {
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

            const value = await response.json()

            publish([])
            return {
                success: true,
                message: `Status ${response.status}: request successful`,
                value
            }
        } catch (error) {
            isFetching = false
            
            const message = getErrorMessage(error)

            publish([])
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

export const {getFetching, doFetching} = fetcher()
export {fetcherSub}
