type SubscriptionCallback = (...args: any[])=>void
type Subscriptions = Record<string, SubscriptionCallback>

interface ISubscribeReturn {
    success: boolean;
    unsubscribe: ()=>void;
}

type Unsubscribe = (subId: string)=>void

type Publish = (args: any[])=>void

export const pubSub = () => {
    const subscriptions: Subscriptions = {}

    const subscribe = (cb: SubscriptionCallback): ISubscribeReturn => {
        const subId = crypto.randomUUID()
        subscriptions[subId] = cb
        return {
            success: true,
            unsubscribe: () => {
                return unsubscribe(subId)
            },
        }
    }

    const unsubscribe: Unsubscribe = (subId) => {
        delete subscriptions[subId]
    }

    const publish: Publish = (args) => {
        for (const subId in subscriptions) {
            if (subscriptions.hasOwnProperty(subId)) {
                const cb = subscriptions[subId];
                cb(...args)
            }
        }
    }

    return {
        subscribe,
        publish
    }
}
