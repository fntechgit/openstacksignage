import AbstractSynchStrategy from "./abstract_synch_strategy";
import {fetchEventById} from "../actions/fetch-entities-actions";
import {insertSorted, intCheck, rebuildIndex} from "../../utils/array_utils";

// Location extractor (supports location.id or location_id)
const getEventLocationId = (e) => e?.location?.id ?? e?.location_id ?? null;

// Keep local/transient fields set by other strategies (e.g., overflow_url)
const PRESERVE_FIELDS = ["overflow_url"];

const mergeTransientFields = (former, next) => {
    if (!former) return next;
    const merged = { ...next };
    for (const f of PRESERVE_FIELDS) {
        if (former[f] !== undefined && merged[f] === undefined) {
            merged[f] = former[f];
        }
    }
    return merged;
};

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

        if (entity_operator !== "UPDATE") {
            return Promise.reject("ActivitySynchStrategy::process not valid operator");
        }

        if (!entity) {
            // unpublished: remove
            console.log(`ActivitySynchStrategy::process entity ${entity_id} not found at api removing it from local.`);
            eventsData = eventsData.filter((e) => e.id !== entity_id);
            this.allIDXEvents = rebuildIndex(eventsData);
        }
        else {

            // locate former entity (to preserve overflow_url, etc.)
            const formerIdx = this.allIDXEvents[entity.id] ?? eventsData.findIndex((e) => e.id === entity.id);
            const formerEntity = formerIdx >= 0 ? eventsData[formerIdx] : null;
            console.log(`ActivitySynchStrategy::process formerIdx ${formerIdx} formerEntity `, formerEntity);
            const currentLocationId = getEventLocationId(entity);
            if(currentLocationId !== locationId){
                console.log(`ActivitySynchStrategy::process currentLocationId ${currentLocationId} <> locationId ${locationId}`);
                // unpublished: remove
                eventsData = eventsData.filter((e) => e.id !== entity_id);
                this.allIDXEvents = rebuildIndex(eventsData);
            }
            else{

                // preserve transient fields from the former entity (e.g., overflow_url)
                const entityWithTransient = mergeTransientFields(formerEntity, entity);
                console.log(`ActivitySynchStrategy::process re inserting with order entity `, entityWithTransient);
                // ordered upsert: remove existing, then insert sorted
                eventsData = eventsData.filter((e) => e.id !== entity.id);
                this.allIDXEvents[entity.id] = insertSorted(eventsData, entityWithTransient, (a, b) => {
                    if (a.start_date === b.start_date) {
                        if (a.end_date === b.end_date) {
                            return intCheck(a.id, b.id);
                        }
                        return intCheck(a.end_date, b.end_date);
                    }
                    return intCheck(a.start_date, b.start_date);
                });
                this.allIDXEvents = rebuildIndex(eventsData);
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

export default ActivitySynchStrategy;