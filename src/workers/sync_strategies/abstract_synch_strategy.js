/**
 * AbstractSynchStrategy
 */
class AbstractSynchStrategy {

    /**
     * 
     * @param summit
     * @param allEvents
     * @param allIDXEvents
     * @param accessToken
     */
    constructor(summit, allEvents, allIDXEvents, accessToken = null) {
        this.summit = summit;
        this.allEvents = allEvents;
        this.allIDXEvents = allIDXEvents;
        this.accessToken = accessToken;
    }

    async process(payload){
        throw new Error('not implemented');
    }

}

export default AbstractSynchStrategy;