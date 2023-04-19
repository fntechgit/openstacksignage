import SynchStrategyFactory from "./sync_strategies/synch_strategy_factory";
// internal state
const queue = [];
let busy = false;
let localSummit = null;
let localAllEvents = null;
let localAllIDXEvents = null;

/* eslint-disable-next-line no-restricted-globals */
self.onmessage =  async (e) => {
    if(busy) {
        // wait
        queue.push(e);
        return;
    }
    // run
    busy = true;
    await run(e);
};

const run = async ( {
                        data: {
                            accessToken,
                            noveltiesArray,
                            summit,
                            allEvents,
                            allIDXEvents
                        }
                    }) => {

    noveltiesArray = JSON.parse(noveltiesArray);

    if(localSummit === null)
        localSummit = JSON.parse(summit);

    if(localAllEvents === null)
        localAllEvents = JSON.parse(allEvents);

    if(localAllIDXEvents === null)
        localAllIDXEvents = JSON.parse(allIDXEvents);

    console.log(`synch worker running for ${localSummit.id} ....`)
    let lastPayload = null;

    for (const payload of noveltiesArray) {

        console.log(`synch worker processing payload `, payload);

        const {entity_operator, entity_type, entity_id} = payload;

        if (
            lastPayload &&
            lastPayload.entity_type === entity_type &&
            lastPayload.entity_operator === entity_operator &&
            lastPayload.entity_id === entity_id) {
            console.log('synch worker skipping payload (already processed)');
            continue;
        }

        // micro updates logic goes here ...
        console.log(`synch worker trying to create process strategy for payload `, payload);

        let s = SynchStrategyFactory.build(localSummit, localAllEvents, localAllIDXEvents, accessToken, payload);

        lastPayload = payload;
        if (s === null) {
            console.log(`synch worker missing process strategy for payload`, payload);
            continue;
        }

        try {
            let res = await s.process(payload);
            console.log(`synch worker postMessage`);
            let {
                summit : resSummit,
                eventsData: resAllEvents,
                allIDXEvents : resAllIDXEvents
            } = res;

            // update internal state for next run
            if(resSummit)
                localSummit = resSummit;
            if(resAllEvents)
                localAllEvents = resAllEvents;
            if(resAllIDXEvents)
                localAllIDXEvents = resAllIDXEvents;

            /* eslint-disable-next-line no-restricted-globals */
            self.postMessage(res);
        } catch (error) {
            console.log(error);
        }
    }

    if(queue.length) {
        // run the next queued item
        await run(queue.shift());
        return;
    }

    console.log('synch worker queue is empty!.')
    // reset internal state
    busy = false;
    localSummit = null;
    localAllEvents = null;
    localAllIDXEvents = null;
}