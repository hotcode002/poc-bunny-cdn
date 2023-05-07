/**
 * To let the user upload video directly from the browser, 
 * 
 * 1. Create a new video id in the library using the create video API
 * 2. Create a presigned signature (This is SHA256 encoded. So, it is safe to send to the front end.)
 * 3. Send these two parameters to the front end to upload the file
 */

const fetch = require('node-fetch');
const sha256 = require('sha256');
const { createHash } = require('crypto');


const BUNNY_API_ENDPOINT = "https://video.bunnycdn.com";

// Dashboard->Stream-><Video Library>->API->API Key
const BUNNY_API_KEY = "0977426a-d91e-43fa-85871f13a2a7-b05a-4a68"

// Dashboard->Stream-><VideoLibrary>->API
const libraryId = "118499"

const url = `${BUNNY_API_ENDPOINT}/library/${libraryId}/videos`;


/**
 * Step 1 Create a video id
 */

const options = {
    method: 'POST',
    headers: {
        accept: 'application/json',
        'content-type': 'application/*+json',
        AccessKey: BUNNY_API_KEY
    },
    body: '{"title":"Python for Beginners"}'
};

// guid is the video id.

fetch(url, options)
    .then(res => res.json())
    .then((json) => {
        // json.guid gives us the video id. Now, create a presigned signature
        const videoId = json.guid
        const expTime = Date.now() + 3600 * 1000
        console.log("expiry time = ", expTime)
        console.log("videoId = ", videoId)
        console.log("libraryId = ", libraryId)
        let encodeString = `${libraryId}${BUNNY_API_KEY}${expTime}${videoId}`
        console.log(encodeString)
        let hash = createHash("sha256");
        const encode = hash.update(encodeString).digest("hex");
        console.log(encode)

    })
    .catch(err => console.error('error:' + err));

/**
 * https://docs.bunny.net/docs/stream-webhook
 * 
 * Video upload status
 * 0 - Queued: The video has been queued for encoding
 * 1 - Processing: The video has begun processing the preview and format details
 * 2 - Encoding: The video is encoding
 * 3 - Finished: The video encoding has finished and the video is fully available
 * 4 - Resolution finished: The encoder has finished processing one of the resolutions. The first request also signals that the video is now playable.
 * 5 - Failed: The video encoding failed. The video has finished processing.
 * 6 - PresignedUploadStarted : A pre-signed upload has been initiated
 * 7 - PresignedUploadFinished : A pre-signed upload has been completed
 * 8 - PresignedUploadFailed : A pre-signed upload has failed
 */




