import {isSummitEventDataUpdate} from "../../utils/data_update_utils";
import ActivitySynchStrategy from "../sync_strategies/activity_synch_strategy";
import SpeakerSynchStrategy from "./speaker_synch_strategy";
import VenueRoomSynchStrategy from "./venue_room_synch_strategy";

/**
 * SynchStrategyFactory
 */
class SynchStrategyFactory {

    /**
     * @param summit
     * @param location
     * @param allEvents
     * @param allIDXEvents
     * @param payload
     * @returns {null|*}
     */
    static build(summit , location, allEvents, allIDXEvents, payload) {
        const {entity_type} = payload;
        if (isSummitEventDataUpdate(entity_type)) {
            return new ActivitySynchStrategy(summit, location, allEvents, allIDXEvents);
        }

        if (entity_type === 'SummitVenueRoom') {
            return new VenueRoomSynchStrategy(summit, location, allEvents, allIDXEvents);
        }

        if (entity_type === 'PresentationSpeaker') {
            return new SpeakerSynchStrategy(summit, location, allEvents, allIDXEvents);
        }
        /*
        if (entity_type === 'Summit') {
            return new SummitSynchStrategy(summit, allEvents, allIDXEvents, allSpeakers, allIDXSpeakers, accessToken);
        }*/
        return null;
    }
}

export default SynchStrategyFactory;