
var playbackQueue = []
var currentTrack;
var playing = false;

window.addEventListener("load",function () {
    updateIndex(() => {
        updateTrackList()
        updateAlbumList()
        updateCurrentTrack()
        updatePlaybackQueue()
        updateFormAlbumDropdown()
    })
    var player = document.getElementById("audioplayer")
    player.volume = parseFloat(getCookie("volume")) || 1.0
    player.onvolumechange = () => {
        setCookie("volume",player.volume,10)
    }
});

function updateAlbumList() {
    var table = document.getElementById("album-list");
    for(const album of albums) {
        var tr = albumListItem(album);
        table.appendChild(tr);
    }
}

function updateTrackList() {
    var table = document.getElementById("track-list");
    for(const track of tracks) {
        var tr = trackListItem(track);
        table.appendChild(tr);
    }
}

function updatePlaybackQueue() {
    var h = document.getElementById("playback-queue-headline")
    h.textContent = (playbackQueue.length == 0) ? "No Tracks in enqueued" : "Playback queue:"
    var table = document.getElementById("playback-queue")
    table.innerHTML = ""
    for (const track of playbackQueue) {
        table.appendChild(trackListItem(track,true))
    }
}

function updateCurrentTrack() {
    var div = document.getElementById("current-track")
    if (!currentTrack) return div.innerHTML = `<p>No Track playing right now</p>`
    div.innerHTML = `
        <p><bold>${safeText(currentTrack.title)}</bold> by ${safeText(currentTrack.artist)}</p>
    `
}


function trackListItem(track,queueMode) {
    var tr = document.createElement("tr")
    tr.classList.add("track-item")
    tr.innerHTML = `
        <td>
            <p>${safeText(track.title)}</p>
        </td>
        <td>
            <p class="artist">${safeText(track.artist)}</p>
        </td>
        <td>
            <input type="button" value="Add to queue" onclick="javascript:schedulePlayback('${track.id}')" />
            <a href="/media/track/${track.id}" download="${getProposedDownloadName(track)}">Download</a>
            ${queueMode ? `<input type="button" value="Remove from queue" onclick="javascript:removeTrackFromQueue('${track.id}')" />` : ""}
        </td>`
    return tr
}


function albumListItem(album) {
    var tr = document.createElement("tr")
    tr.classList.add("album-item")
    tr.innerHTML = `
        <td>
            <p>${safeText(album.title)}</p>
        </td>
        <td>
            <p class="artist">${safeText(album.artist)}</p>
        </td>
        <td>
            <input type="button" value="Add to queue" onclick="javascript:schedulePlaybackAlbum('${album.id}')" />
            <a href="/media/album/${album.id}" download="${getProposedDownloadName(album)}">Download</a>
        </td>`
    return tr
}


function schedulePlayback(id){
    console.log(`Scheduled playback of ${id}`);
    playbackQueue.push(trackById(id))
    setTimeout(updatePlaybackQueue)
    if (!playing) playNextTrack()
}

function playNextTrack() {
    var audioplayer = document.getElementById("audioplayer")
    currentTrack = playbackQueue.pop()
    setTimeout(updateCurrentTrack,0)
    setTimeout(updatePlaybackQueue,0)
    playing = false;
    if (!currentTrack) return audioplayer.src = ""
    playing = true;
    audioplayer.src = `/media/track/${currentTrack.id}`
    audioplayer.play()
    audioplayer.onended = playNextTrack
}

function removeTrackFromQueue(id){
    playbackQueue = playbackQueue.filter(t => t.id != id)
    updatePlaybackQueue()
}

function updateFormAlbumDropdown() {
    var sel = document.getElementById("album-select")
    sel.innerHTML = ""
    for (const album of albums) {
        var op = document.createElement("option")
        op.textContent = `${album.title} - ${album.artist}`
        sel.appendChild(op)
    }
}