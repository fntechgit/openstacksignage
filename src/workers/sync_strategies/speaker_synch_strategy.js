import AbstractSynchStrategy from "./abstract_synch_strategy";
import {fetchSpeakerById} from "../actions/fetch-entities-actions";

/**
 * SpeakerSynchStrategy
 */
class SpeakerSynchStrategy extends AbstractSynchStrategy{
    async process(payload) {

        console.log(`SpeakerSynchStrategy::process`, payload);

        const {entity_operator, entity_id} = payload;

        const entity = await fetchSpeakerById(this.summit.id, entity_id, this.accessToken);

        let eventsData = [...this.allEvents];

        if (entity_operator === 'UPDATE') {
            if(!entity) return Promise.reject('SpeakerSynchStrategy::process entity not retrieved.');

            // check presentations
            if (entity && entity.hasOwnProperty('presentations')) {
                for (const publishedEventId of entity.presentations) {
                    const eventIdx = this.allIDXEvents.hasOwnProperty(publishedEventId) ? this.allIDXEvents[publishedEventId] : -1;
                    let formerEntity = eventIdx === -1 ? null : ( (eventsData.length - 1) >= eventIdx ? eventsData[eventIdx] : null);
                    if(formerEntity === null){
                        console.log(`SpeakerSynchStrategy::process presentations activity ${publishedEventId} not found on data set`);
                        continue;
                    }
                    if (formerEntity && formerEntity.id !== publishedEventId) continue;
                    // check if speakers collection
                    let speakers = formerEntity.speakers.map( s => {
                        if(s.id === entity_id){
                            return entity;
                        }
                        return s;
                    })
                    eventsData[eventIdx] = {...formerEntity, speakers: speakers};
                }
            }

            // check moderated presentations
            if(entity && entity.hasOwnProperty('moderated_presentations')){
                for (const publishedEventId of entity.moderated_presentations) {
                    const eventIdx = this.allIDXEvents.hasOwnProperty(publishedEventId) ? this.allIDXEvents[publishedEventId] : -1;
                    let formerEntity = eventIdx === -1 ? null : ( (eventsData.length - 1 ) >= eventIdx ? eventsData[eventIdx] : null);
                    if(formerEntity === null) {
                        console.log(`SpeakerSynchStrategy::process  moderated_presentations activity ${publishedEventId} not found on data set`);
                        continue;
                    }
                    if (formerEntity && formerEntity.id !== publishedEventId) continue; // it's not the same
                    // check if speakers collection
                    eventsData[eventIdx] = {...formerEntity, moderator: entity};
                }
            }

            let res = {
                payload,
                entity,
                summit : this.summit,
                eventsData,
                allIDXEvents : this.allIDXEvents,
            };

            console.log(`SpeakerSynchStrategy::process done`, res);

            return Promise.resolve(res);

        }
    }
}

export default SpeakerSynchStrategy;