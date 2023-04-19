import * as Ably from 'ably';
import { $store } from './store'
import {ABLY_SCHEDULE_UPDATES_SUBSCRIBER_API_KEY} from "./config";

class RealtimeUpdates
{
    constructor(apiKey) {
        this._client = new Ably.Realtime(ABLY_SCHEDULE_UPDATES_SUBSCRIBER_API_KEY);
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
            let {
                payload,
                entity,
                summit,
                eventsData,
                allIDXEvents: newAllIDXEvents,
            } = data;
            // do model update
            // $store.dispatch()
            console.log('RealtimeUpdates processed', data);
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
            console.log(`RealtimeUpdates got summit ${summitId}`);

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

                const schedule = $store.getters.schedule;
                const summit = $store.getters.summit;

                this._worker.postMessage({
                    accessToken: null,
                    noveltiesArray: JSON.stringify([payload]),
                    summit: JSON.stringify(summit),
                    allEvents: JSON.stringify(schedule.events),
                    allIDXEvents: JSON.stringify(schedule.idx_events),
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
    console.log(`ABLY_SCHEDULE_UPDATES_SUBSCRIBER_API_KEY missing, can not enable real time updates!`);
}

