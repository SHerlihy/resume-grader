import { getErrorMessage } from "./error"
import { pubSub } from "./pubSub"

const {subscribe: fetcherSub, publish} = pubSub()

const fetcher = () => {
    let isFetching = false

    const getFetching = () => {
        return isFetching
    }

    const doFetching = async(url: URL, payload: RequestInit) => {
            console.log("do fetching")
        isFetching = true

        try{
            console.log("fetching...")
            const response = await fetch(url, payload)
            console.log("fetched")
            isFetching = false

            if (response.status < 200 || 299 < response.status) {
                throw new Error(`Status ${response.status}: request unsuccessful`)
            }

            if (!response.ok) {
                throw new Error(`Status ${response.status}: request unsuccessful`)
            }

            publish([])
            return {
                success: true,
                message: `Status ${response.status}: request successful`,
                value: response.json()
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
