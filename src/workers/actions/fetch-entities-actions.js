import URI from "urijs";
import {API_URL} from "../../config";

/**
 * @param summitId
 * @param eventId
 * @param accessToken
 * @returns {Promise<Response>}
 */
export const fetchEventById = async (summitId, eventId, accessToken = null) => {

    let apiUrl = URI(`${API_URL}/api/public/v1/summits/${summitId}/events/${eventId}/published`);
    if(accessToken){
        apiUrl = URI(`${API_URL}/api/v1/summits/${summitId}/events/${eventId}/published`);
        apiUrl.addQuery('access_token', accessToken);
    }

    apiUrl.addQuery('expand', 'slides, links, videos, media_uploads, type, track, track.allowed_access_levels, location, location.venue, location.floor, speakers, moderator, sponsors, current_attendance, groups, rsvp_template, tags');

    return fetch(apiUrl.toString(), {
        method: 'GET'
    }).then(async (response) => {
        if (response.status === 200) {
            return await response.json();
        }
        return null;
    });
}