import AbstractSynchStrategy from "./abstract_synch_strategy";
import {fetchEventById} from "../actions/fetch-entities-actions";
import {insertSorted, intCheck} from "../../utils/array_utils";

/**
 * ActivitySynchStrategy
 */
class ActivitySynchStrategy extends AbstractSynchStrategy{

    async process(payload){

        console.log(`ActivitySynchStrategy::process`, payload);

        const {entity_operator, entity_id} = payload;

        const entity = await fetchEventById(this.summit.id, entity_id, this.accessToken);
        let eventsData = [...this.allEvents];

        if (entity_operator === 'UPDATE') {

            if(!entity){
                // was deleted ( un - published)
                // try to get from index
                const idx =  this.allIDXEvents.hasOwnProperty(entity_id) ? this.allIDXEvents[entity_id] : -1;
                console.log(`ActivitySynchStrategy::process unpublished presentation ${entity_id} idx ${idx}`);

                if(idx === -1)
                    return Promise.reject('ActivitySynchStrategy::process unpublished idx === -1.'); // does not exists on index ...
                // remove it from dataset
                eventsData.splice(idx, 1);
                // remove it from index
                delete this.allIDXEvents[entity_id];
            }
            else {
                // entity is published

                let idx = this.allIDXEvents.hasOwnProperty(entity.id) ? this.allIDXEvents[entity.id] : -1;
                console.log(`ActivitySynchStrategy::process entity is published got idx ${idx} eventsData length ${eventsData.length}`);
                let formerEntity = idx === -1 ? null : ( (eventsData.length - 1 ) >= idx ? eventsData[idx] : null ) ;
                console.log(`ActivitySynchStrategy::process entity is published`, formerEntity, entity, idx);
                if (formerEntity && formerEntity.id !== entity.id) {
                    console.log('ActivitySynchStrategy::process entity is published entities are not the same. looking on events');// it's not the same
                    formerEntity = eventsData.find((e, index) => {
                        let res = e.id == entity.id;
                        if(res){
                            console.log(`ActivitySynchStrategy::process entity id ${entity.id} found at idx ${index}`);
                            idx = index;
                        }
                        return res;
                    });
                    if(!formerEntity){
                        return Promise.reject(`ActivitySynchStrategy::process entity id ${entity.id} not found`);
                    }
                }
                if(!formerEntity){
                    console.log('ActivitySynchStrategy::process former entity does not exists, inserting new one', entity);
                    // entity was just published ... then do insert ordering
                    this.allIDXEvents[entity.id] = insertSorted(eventsData, entity, (a, b) => {
                        // multi-criteria sort

                        if (a.start_date === b.start_date) {

                            if (a.end_date === b.end_date) {
                                return intCheck(a.id, b.id);
                            }

                            return intCheck(a.end_date, b.end_date);
                        }

                        return intCheck(a.start_date, b.start_date);
                    });
                }
                else if
                (
                    formerEntity.start_date === entity.start_date &&
                    formerEntity.end_date === entity.end_date
                ) {
                    // presentation was just updated
                    console.log(`ActivitySynchStrategy::process updating presentation ${entity.id} at idx ${idx}`)
                    eventsData[idx] = entity;
                } else {
                    // publishing dates changed, we need to remove and do ordered re-insert
                    // remove it first

                    console.log(`ActivitySynchStrategy::process publishing dates had changed, deleting at idx ${idx}`, entity);
                    eventsData.splice(idx, 1);
                    // then do insert ordering
                    this.allIDXEvents[entity.id] = insertSorted(eventsData, entity, (a, b) => {
                        // multi-criteria sort

                        if (a.start_date === b.start_date) {

                            if (a.end_date === b.end_date) {
                                return intCheck(a.id, b.id);
                            }

                            return intCheck(a.end_date, b.end_date);
                        }

                        return intCheck(a.start_date, b.start_date);
                    });

                    let newAllIDXEvents = {};
                    eventsData.forEach((e, index) => newAllIDXEvents[e.id] = index);
                    this.allIDXEvents = newAllIDXEvents;
                }
            }

            // update files on cache
            console.log(`ActivitySynchStrategy::process updating cache files`);

            let res = {
                payload,
                entity,
                summit : this.summit,
                eventsData,
                allIDXEvents : this.allIDXEvents,
            };

            console.log(`ActivitySynchStrategy::process done`, res);

            return Promise.resolve(res);
        }
    }
}

export default ActivitySynchStrategy;