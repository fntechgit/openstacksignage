import AbstractSynchStrategy from "./abstract_synch_strategy";
import {fetchEventById} from "../actions/fetch-entities-actions";
import {insertSorted, intCheck} from "../../utils/array_utils";

/**
 * ActivitySynchStrategy
 */
class ActivitySynchStrategy extends AbstractSynchStrategy{

    async process(payload){
        const locationId = this.location;
        console.log(`ActivitySynchStrategy::process locationId ${locationId}`, payload);

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
                // try to get it from current data-set
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
                    console.log('ActivitySynchStrategy::process former entity does not exists, trying to inserting new one', entity);
                    // entity didnt exists on current data set , check if belongs to this location ...
                    const currentEventLocationId = entity.hasOwnProperty('location')? entity.location.id:entity.location_id;
                    if(currentEventLocationId != locationId){
                        return Promise.reject(`ActivitySynchStrategy::process entity id ${entity.id} belongs to another location ${currentEventLocationId} and we are on location ${locationId}`);
                    }

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
                else{
                    // we have a former entity
                    // check location
                    const formerLocationId = formerEntity.location.id;
                    const currentLocationId = entity.hasOwnProperty('location')? entity.location.id:entity.location_id;

                    if(formerLocationId != currentLocationId || currentLocationId != locationId){
                        console.log(`ActivitySynchStrategy::process non matching locations, former location ${formerLocationId} current location ${currentLocationId} for ${entity.id} at idx ${idx}`)
                        // we need to remove it
                        if(idx === -1)
                            return Promise.reject('ActivitySynchStrategy::process non matching location idx === -1.'); // does not exists on index ...
                        // remove it from dataset
                        eventsData.splice(idx, 1);
                        // remove it from index
                        delete this.allIDXEvents[entity_id];
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

            }

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