/**
 * AbstractSynchStrategy
 */
class AbstractSynchStrategy {

    /**
     *
     * @param summit
     * @param location
     * @param allEvents
     * @param allIDXEvents
     * @param accessToken
     */
    constructor(summit, location, allEvents, allIDXEvents, accessToken = null) {
        this.summit = summit;
        this.location = location;
        this.allEvents = allEvents;
        this.allIDXEvents = allIDXEvents;
        this.accessToken = accessToken;
    }

    async process(payload){
        throw new Error('not implemented');
    }

}

export default AbstractSynchStrategy;