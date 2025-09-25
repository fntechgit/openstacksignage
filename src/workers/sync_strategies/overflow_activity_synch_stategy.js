import AbstractSynchStrategy from "./abstract_synch_strategy";

/**
 * OverflowActivitySynchStrategy
 */
class OverflowActivitySynchStrategy extends AbstractSynchStrategy {

    async process(payload) {

        const { entity_id: event_id, params: { overflow_url } = {} } = payload;

        console.log(`OverflowActivitySynchStrategy::overflow event ${event_id}`, payload);

        let eventsData = [...this.allEvents];

        // Find the event and update its overflow_url        
        let eventIndex = this.allIDXEvents[event_id];

        if (eventIndex === undefined) {
            console.log(`OverflowActivitySynchStrategy::overflow event ${event_id} not found in index, checking events data`);

            // fallback: search in events data
            const event = eventsData.find((e, index) => {
                if (e.id === event_id) {
                    eventIndex = index;
                    return true;
                }
                return false;
            });
            
            if (!event) {
                console.log(`OverflowActivitySynchStrategy::overflow event ${event_id} not found in events data either`);
                return Promise.reject(`OverflowActivitySynchStrategy::Event ${event_id} not found`);
            }
            
            console.log(`OverflowActivitySynchStrategy::found event ${event_id} at position ${eventIndex} via fallback search`);
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