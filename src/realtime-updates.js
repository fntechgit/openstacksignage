import * as Ably from 'ably';
import { $store } from './store'
import {ABLY_SCHEDULE_UPDATES_SUBSCRIBER_API_KEY} from "./config";

class RealtimeUpdates
{
    /**
     * @param apiKey
     */
    constructor(apiKey) {
        this._client = new Ably.Realtime(apiKey);
        this._wsError = false;
        this._worker = null;
    }

    run(){

        if(this._worker){
            this._worker.terminate();
            this._worker = null;
        }

        this._worker = new Worker(new URL('./workers/synch-worker.js', import.meta.url), {type: 'module'});

        this._worker.onmessage = (event) => {
            let {data} = event;
            // do model update
            console.log('RealtimeUpdates processed', data);
            $store.dispatch('updateEvents', data);
        }

        this._worker.onerror = (event) => {
            console.log('RealtimeUpdates There is an error with your worker!', event);
            alert(event.message + " (" + event.filename + ":" + event.lineno + ")");
        }

        // connect handler
        this._client.connection.on((stateChange) => {
            const {current: state} = stateChange;
            console.log(`RealtimeUpdates::connection WS ${state}`);
            if (state === 'connected') {
                this._wsError = false;
                return;
            }
            if (state === 'suspended') {
                if (!this._wsError) {
                    this._wsError = true;
                }
                return;
            }
            if (state === 'failed') {
                if (!this._wsError) {
                    this._wsError = true;
                }
            }
        });

        $store.dispatch('getSummitId').then(summitId => {
            $store.dispatch('getLocation').then(location => {

                console.log(`RealtimeUpdates got summit ${summitId} and location ${location}`);

                const channel = this._client.channels.get(`${summitId}:*:*`);

                channel.subscribe((message) => {
                    const {data: payload} = message;
                    console.log('RealtimeUpdates Change received', payload)
                    if(!this._worker)
                    {
                        console.log('RealtimeUpdates worker is null');
                        return;
                    }
                    // get model from store to update

                    const model = $store.getters.schedule;
                    const summit = $store.getters.summit;

                    this._worker.postMessage({
                        location: JSON.stringify(location),
                        noveltiesArray: JSON.stringify([payload]),
                        summit: JSON.stringify(summit),
                        allEvents: JSON.stringify(model.getEvents()),
                        allIDXEvents: JSON.stringify(model.getEventsIdx()),
                    });
                });

                // Overflow event channel
                const overflowChannel = this._client.channels.get(`${summitId}:OVERFLOW:*`);

                overflowChannel.subscribe((message) => {
                    const {data: payload} = message;
                    console.log('Event Overflow Change received', payload);
                    console.log('Overflow payload structure:', JSON.stringify(payload, null, 2));
                    
                    if (!this._worker) {
                        console.log('RealtimeUpdates worker is null');
                        return;
                    }

                    const model = $store.getters.schedule;
                    const summit = $store.getters.summit;

                    this._worker.postMessage({
                        location: JSON.stringify(location),
                        noveltiesArray: JSON.stringify([payload]),
                        summit: JSON.stringify(summit),
                        allEvents: JSON.stringify(model.getEvents()),
                        allIDXEvents: JSON.stringify(model.getEventsIdx()),
                    });
                });
            });

        })
    }

    stop(){
        console.log('RealtimeUpdates::stop terminating worker');
        this._worker.terminate();
        this._worker = null;
        this._client.close();
        this._client = null;
    }
}

if(ABLY_SCHEDULE_UPDATES_SUBSCRIBER_API_KEY) {
    const rt = new RealtimeUpdates(ABLY_SCHEDULE_UPDATES_SUBSCRIBER_API_KEY);
    rt.run();
}
else{
    console.log(`ABLY_SCHEDULE_UPDATES_SUBSCRIBER_API_KEY missing, can not enable schedule real time updates!`);
}

