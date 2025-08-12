import AbstractSynchStrategy from "./abstract_synch_strategy";

/**
 * OverflowActivitySynchStrategy
 */
class OverflowActivitySynchStrategy extends AbstractSynchStrategy {

    async process(payload) {

        const { entity_id: event_id, params: { overflow_url } = {} } = payload;

        if (!event_id || !overflow_url) {
            console.log(`OverflowActivitySynchStrategy::missing required fields - event_id: ${event_id}, overflow_url: ${overflow_url}`);
            return Promise.reject(`OverflowActivitySynchStrategy::missing required fields`);
        }

        console.log(`OverflowActivitySynchStrategy::overflow event ${event_id}`, payload);

        let eventsData = [...this.allEvents];

        // Find the event and update its overflow_url        
        const eventIndex = this.allIDXEvents[event_id];

        if (eventIndex === undefined) {
            console.log(`OverflowActivitySynchStrategy::overflow event ${event_id} not found in events`);
            return Promise.reject(`OverflowActivitySynchStrategy::Event ${event_id} not found`);
        }

        eventsData[eventIndex].overflow_url = overflow_url;
        console.log(`OverflowActivitySynchStrategy::overlow event ${event_id} with overflow_url`);

        return Promise.resolve({
            summit: this.summit,
            eventsData,
            allIDXEvents: this.allIDXEvents
        });
    }
}

export default OverflowActivitySynchStrategy;