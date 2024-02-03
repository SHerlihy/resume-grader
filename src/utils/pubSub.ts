type SubscriptionCallback = (...args: any[])=>void
type Subscriptions = Record<string, SubscriptionCallback>
type EventSubscriptions = Record<string, Subscriptions>

interface ISubscribeReturn {
    success: boolean;
    unsubscribe: ()=>boolean;
}

type Unsubscribe = (event: string, subId: string)=>boolean

type Publish = (event: string, args: any[])=>boolean


const pubSub = () => {
    const eventSubscriptions: EventSubscriptions = {}

    const subscribe = (event: string, cb: SubscriptionCallback): ISubscribeReturn => {
        const subId = crypto.randomUUID()
        eventSubscriptions[event][subId] = cb
        return {
            success: true,
            unsubscribe: () => {
                return unsubscribe(event, subId)
            },
        }
    }

    const unsubscribe: Unsubscribe = (event, subId) => {
        const eventSubs = eventSubscriptions[event]
        if (typeof eventSubs[subId] === "undefined") {
            return false
        }

        delete eventSubs[subId]
        return true
    }

    const publish: Publish = (event, args) => {
        const eventSubs = eventSubscriptions[event]
        for (const subId in eventSubs) {
            if (eventSubs.hasOwnProperty(subId)) {
                const cb = eventSubs[subId];
                cb(...args)
            }
        }

        return true
    }

    return {
        subscribe,
        publish
    }
}
