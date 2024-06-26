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
    }

    run() {
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

                $store.dispatch('loadTemplate', location).then(({ data }) => {
                    $store.commit('setTemplate', data[0]?.template);
                })

                const channel = this._client.channels.get(`SIGNAGE:${summitId}:${location}`);

                channel.subscribe('SET_TEMPLATE', (message) => {
                    const { data: payload } = message;
                    console.log("Received: " + JSON.stringify(payload));
                    let { template } = payload;
                    $store.commit('setTemplate', template);
                });

                channel.subscribe('RELOAD', (message) => {
                    const { data: payload } = message;
                    console.log("Received: " + JSON.stringify(payload));
                    $store.dispatch('reload', location);
                })

                channel.subscribe('JUMP_TIME', (message) => {
                    const { data: payload } = message;
                    console.log("Received: " + JSON.stringify(payload));
                    let { timestamp } = payload;

                    $store.dispatch('updateTime', {
                        location: parseInt(location),
                        timestamp: parseInt(timestamp),
                    })
                })

            });
        })
    }

    stop() {
        console.log('AblyUpdates::stop terminating worker');
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

