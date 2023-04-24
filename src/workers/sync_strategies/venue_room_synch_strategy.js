import AbstractSynchStrategy from "./abstract_synch_strategy";
import { fetchLocationById } from "../actions/fetch-entities-actions";

/**
 * VenueRoomSynchStrategy
 */
class VenueRoomSynchStrategy extends AbstractSynchStrategy{

    async process(payload){

        console.log(`VenueRoomSynchStrategy::process`, payload);

        const {entity_operator, entity_id} = payload;

        if(this.location != entity_id){
            console.log(`VenueRoomSynchStrategy::process event does not belongs to current location`);
            return Promise.reject('VenueRoomSynchStrategy::process event does not belongs to current location');
        }

        const entity = await fetchLocationById(this.summit.id, entity_id, 'floor,venue' , this.accessToken);

        let eventsData = [...this.allEvents];

        let summit = {...this.summit};

        if (entity_operator === 'UPDATE') {

            if (entity && entity.hasOwnProperty('published_events')) {

                for (const publishedEventId of entity.published_events) {
                    const idx = this.allIDXEvents.hasOwnProperty(publishedEventId) ? this.allIDXEvents[publishedEventId] : -1;
                    let formerEntity = idx === -1 ? null : ( ( eventsData.length - 1) >= idx ? eventsData[idx] : null);
                    if(formerEntity === null){
                        console.log(`VenueRoomSynchStrategy::process published_events activity ${publishedEventId} not found on data set`);
                        continue;
                    }
                    if (formerEntity && formerEntity.id !== publishedEventId)
                        continue;
                    console.log(`VenueRoomSynchStrategy::process updating location for event ${publishedEventId} ...`);
                    eventsData[idx] = {...formerEntity, location: entity};
                }

                // update summit location
                summit.locations = summit.locations.map(l => {
                    if(l.id != entity.id) return l;
                    return {...l, ...entity};
                })

                let res = {
                    payload,
                    entity,
                    summit : summit,
                    eventsData,
                    allIDXEvents : this.allIDXEvents,
                };

                console.log(`VenueRoomSynchStrategy::process done`, res);

                return Promise.resolve(res);
            }
        }
    }
}

export default VenueRoomSynchStrategy;