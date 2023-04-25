import * as Ably from 'ably';
import { $store } from './store'
import { ABLY_KEY } from "./config";

// 1. RELOAD ( empty payload)
// channel.publish("RELOAD", { });
// 2. JUMP_TIME
// channel.publish("JUMP_TIME", { timestamp: <EPOCH VAL> });
// 3. SET_TEMPLATE
// channel.publish("SET_TEMPLATE", { template: <TEMPLATE_FILE_FROM_TEMPLATE_DDL>});

class AblyUpdates {
    /**
     * @param apiKey
     */
    constructor(apiKey) {
        this._client = new Ably.Realtime(apiKey);
        this._wsError = false;
        this._worker = null;
    }

    run() {

        if (this._worker) {
            this._worker.terminate();
            this._worker = null;
        }

        // connect handler
        this._client.connection.on((stateChange) => {
            const { current: state } = stateChange;            
            console.log(`AblyUpdates::connection WS ${state}`);
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
                console.log(`AblyUpdates got summit ${summitId} and location ${location}`);

                const channel = this._client.channels.get(`SIGNAGE:${summitId}:${location}:*`);

                channel.subscribe('SET_TEMPLATE', (message) => {
                    const { data: payload } = message;
                    console.log("Received: " + JSON.stringify(payload));

                    // let decoded = atob(message.val())
                    // let obj = JSON.parse(decoded)

                    // let path = '/'
                    // Object.keys(obj).forEach(function (key) {

                    //     let locations = obj[key].map(Number)
                    //     if (key !== 'schedule' && locations.includes(location)) {
                    //         path += key + '.html'
                    //     }
                    // });
                    
                    // if (window.location.pathname === path) {
                    //     return
                    // }
                    // let params = new URLSearchParams(window.location.href.split('?')[1])
                    // let url = path + '#/?' + params

                    // window.location = url

                });                
            });

        })
    }

    stop() {
        console.log('AblyUpdates::stop terminating worker');
        this._worker.terminate();
        this._worker = null;
        this._client.close();
        this._client = null;
    }
}

if (ABLY_KEY) {
    const rt = new AblyUpdates(ABLY_KEY);
    rt.run();
}
else {
    console.log(`ABLY_KEY missing, can not enable real time updates!`);
}

