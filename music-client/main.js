const SERVER_ROOT = 'http://localhost:3000';
// window.onload = function () {
if (localStorage.getItem('accessToken')) {
    afterLogin();
} else {
    notLogin();
}

//login 
document.getElementById('loginBtn').onclick = async function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === '' && password === '') {
        shwoNotification('error', 'username/password is required');
        return;
    }
    let response = await fetch(`${SERVER_ROOT}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({
            username,
            password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await response.json();
    loggedInFeatures(data);
}

//logout
document.getElementById('logoutBtn').onclick = function () {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('playType');
    localStorage.removeItem('username');
    document.getElementById("loggedInUser").innerText = null;
    shwoNotification("success", "Logged out  Successfully!");
    notLogin();
}

//search music
document.getElementById('searchMusic').onkeyup = function () {
    fetchMusic(this.value);
}
// }

//called when logged in successfully
function loggedInFeatures(data) {
    if (data.status) {
        shwoNotification("error", data.message);
    } else {
        shwoNotification("success", "Logged In Successfully!")

        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('playType', data.playType);
        localStorage.setItem('username', data.username);
        // search music
        document.getElementById('searchMusic').onkeyup = function (event) {
            fetchMusic(this.value)
        }
        afterLogin();
    }
}


//fetch music
async function fetchMusic(search = null) {
    let url = search ? `${SERVER_ROOT}/api/music?search=${search}` : `${SERVER_ROOT}/api/music`
    let response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    let songs = await response.json();

    const tableBody = document.getElementById("tableMusicBody");
    innerTableBody = '';
    let index = 1;
    if (songs.length) {
        songs.forEach(song => {
            innerTableBody += `<tr>
                <th scope="row">${index}</th>
                <td>${song.title}</td>
                <td>${song.releaseDate}</td>
                <td><button class="btn btn-action btn-sm cursor-pointer" onClick="addToPlayList('${song.id}')" title="Add to playlist"><i class="fa-solid fa-plus"></i></button>
                </td>
              </tr>`
            index++;
        })
    }
    else {
        innerTableBody += `<tr>
    <th scope="row" colspan="4" style="text-align:center">No songs found</th>
  </tr>`
    }
    tableBody.innerHTML = innerTableBody


}

//fetch playlist
async function fetchPlayList() {
    let response = await fetch(`${SERVER_ROOT}/api/playlist`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    let data = await response.json();
    songs = [];
    currentPlayLists = [];
    const tablePlaylistBody = document.getElementById("tablePlaylistBody");
    innerTableBody = '';
    let index = 1;
    if (data.length > 0) {
        data.forEach(item => {
            innerTableBody += `<tr>
                <th scope="row">${index}</th>
                <td>${item.title}</td>
                <td>
                <button class="btn btn-action-remove btn-sm cursor-pointer" onClick="removeFromPlayList('${item.songId}')" title="Remove"><i class="fa-solid fa-minus"></i></button>
                <button class="btn btn-action btn-sm cursor-pointer" onClick="playMusic('${item.urlPath}')" title="Play"><i class="fa-solid fa-play"></i></button>
                </td>
              </tr>`
            index++;
            songs.push(item.urlPath);
            currentPlayLists.push(item.songId);
        })
        musicOuterContainer.style.display = 'flex';
        playMusic(songs[0], true);
    }
    else {
        musicOuterContainer.style.display = 'none';
        innerTableBody += `<tr>
                <th scope="row" colspan="3" style="text-align:center">No playlists found</th>
              </tr>`
    }
    const playType = localStorage.getItem('playType');
    if (playType === 'REPEAT') {
        musicActionIcon.classList.remove('fas', 'fa-shuffle')
        musicActionIcon.classList.remove('fas', 'fa-repeat')
        musicActionIcon.classList.add('fa-regular', 'fa-1');
    }
    else if (playType === 'SHUFFLE') {
        musicActionIcon.classList.remove('fas', 'fa-repeat')
        musicActionIcon.classList.remove('fa-regular', 'fa-1')
        musicActionIcon.classList.add('fas', 'fa-shuffle');
    }
    else {
        musicActionIcon.classList.remove('fa-regular', 'fa-1')
        musicActionIcon.classList.remove('fas', 'fa-shuffle')
        musicActionIcon.classList.add('fas', 'fa-repeat')
    }
    tablePlaylistBody.innerHTML = innerTableBody
}


//after logged in successfully
function afterLogin() {
    document.getElementById('logout-div').style.display = 'block';
    document.getElementById('login-div').style.display = 'none';
    fetchMusic();
    fetchPlayList();
    document.getElementById('musicContent').style.display = 'block';
    document.getElementById('musicTitle').style.display = 'block';
    document.getElementById('playListContent').style.display = 'block';
    document.getElementById('playListTitle').style.display = 'block';
    document.getElementById('welcomeTitle').style.display = 'block';
    document.getElementById('searchMusic').style.display = 'block';
    document.getElementById('outer-container').style.display = 'none';
    document.getElementById("loggedInUser").innerText = "#" + localStorage.getItem('username');
}

// if not logged in
function notLogin() {
    document.getElementById('logout-div').style.display = 'none';
    document.getElementById('login-div').style.display = 'block';
    document.getElementById('musicContent').style.display = 'none';
    document.getElementById('musicTitle').style.display = 'none';
    document.getElementById('playListContent').style.display = 'none';
    document.getElementById('playListTitle').style.display = 'none';
    document.getElementById('welcomeTitle').style.display = 'block';
    document.getElementById('searchMusic').style.display = 'none';
    document.getElementById('outer-container').style.display = 'none';
}


//add to playlist
function addToPlayList(songId) {
    let checkSongIndex = currentPlayLists.findIndex(i => i === songId);
    if (checkSongIndex > -1) {
        shwoNotification("error", "Song already added to playlist")
        return false;
    }
    fetch(`${SERVER_ROOT}/api/playlist/add`, {
        method: 'POST',
        body: JSON.stringify({ songId: songId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }).then(response => response.json())
        .then(data => {
            shwoNotification("success", "Song added to playlist")
            fetchPlayList()
        });
}

//remove from playlist
async function removeFromPlayList(songId) {
    let response = await fetch(`${SERVER_ROOT}/api/playlist/remove`, {
        method: 'POST',
        body: JSON.stringify({ songId: songId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    let data = await response.json();
    shwoNotification("success", "Song remmoved from playlist")
    fetchPlayList()

}

function shwoNotification(type, message) {
    var toast = new Toasty({
        transition: "fade",
        duration: 3000,
        progressBar: true,
        enableSounds: true,
        sounds: {
            // path to sound for informational message:
            info: "./toaster/sounds/info/1.mp3",
            // path to sound for successfull message:
            success: "./toaster/sounds/success/3.mp3",
            // path to sound for warn message:
            warning: "./toaster/sounds/warning/1.mp3",
            // path to sound for error message:
            error: "./toaster/sounds/error/1.mp3",
        },

    });
    switch (type) {
        case "success":
            toast.success(message)
            break;
        case "info":
            toast.info(message)
            break;
        case "warning":
            toast.warning(message)
            break;
        case "error":
            toast.error(message)
            break;
    }

}

//dom element
const closeButton = document.getElementById('close');
const musicOuterContainer = document.getElementById('outer-container');
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const musicActionBtn = document.getElementById('music-action-btn');
const musicActionIcon = document.getElementById('music-action-icon');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// Song titles
let songs = [

];

//current playlists
let currentPlayLists = [

];

let songIndex = 0;

// Update song details
function loadSong(song) {
    let songName = song.split('/');
    let lastSong = songName.pop();
    title.innerText = lastSong;
    audio.src = song;
    cover.src = "image/logo.png";
    audio.onloadedmetadata = () => {
        document.getElementById("current-duration").innerText = musicTimeFormat(audio.duration);
    };
}

function playMusic(song, initial = false) {
    let index = songs.findIndex(i => i === song);
    loadSong(`http://localhost:3000/${songs[index]}`);
    musicOuterContainer.style.display = 'flex';
    songIndex = index;
    if (!initial) {
        playSong();
    }
}

// Play song
function playSong() {
    musicContainer.classList.add('play');
    playBtn.querySelector('i.fas').classList.remove('fa-play');
    playBtn.querySelector('i.fas').classList.add('fa-pause');
    console.log(songIndex);
    audio.play();
}

// Pause song
function pauseSong() {
    musicContainer.classList.remove('play');
    playBtn.querySelector('i.fas').classList.add('fa-play');
    playBtn.querySelector('i.fas').classList.remove('fa-pause');
    audio.pause();
}

// Previous song
function prevSong() {
    if (localStorage.getItem('playType') === 'ORDER') {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
    }
    else if (localStorage.getItem('playType') === 'SHUFFLE') {
        const random = Math.floor(Math.random() * songs.length);
        songIndex = random
    }

    loadSong(`http://localhost:3000/${songs[songIndex]}`);

    playSong();
}

// Next song
function nextSong() {
    if (localStorage.getItem('playType') === 'ORDER') {
        songIndex++;

        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
    }
    else if (localStorage.getItem('playType') === 'SHUFFLE') {
        const random = Math.floor(Math.random() * songs.length);
        songIndex = random
    }

    loadSong(`http://localhost:3000/${songs[songIndex]}`);

    playSong();
}

const musicTimeFormat = (timeInput) => {
    let minute = Math.floor(timeInput / 60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
};

// Update progress bar
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

// Set progress bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

setInterval(() => {
    document.getElementById("current-duration").innerText = musicTimeFormat(audio.currentTime) + '/' + musicTimeFormat(audio.duration);
});


// Event listeners for play/pause
playBtn.addEventListener('click', () => {
    const isPlaying = musicContainer.classList.contains('play');

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Change song
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Time/song update
audio.addEventListener('timeupdate', updateProgress);

// Click on progress bar
progressContainer.addEventListener('click', setProgress);

// Song ends
audio.addEventListener('ended', nextSong);


// music player close button
closeButton.addEventListener('click', function () {
    musicOuterContainer.style.display = 'none'
    pauseSong();
})

musicActionBtn.addEventListener('click', function () {
    const playType = localStorage.getItem('playType');
    if (playType === 'ORDER') {
        localStorage.setItem('playType', 'REPEAT');
        musicActionIcon.classList.remove('fas', 'fa-repeat');
        musicActionIcon.classList.add('fa-regular', 'fa-1')
    }
    else if (playType === 'REPEAT') {
        localStorage.setItem('playType', 'SHUFFLE');
        musicActionIcon.classList.remove('fa-regular', 'fa-1');
        musicActionIcon.classList.add('fas', 'fa-shuffle')
    }
    else {
        localStorage.setItem('playType', 'ORDER');
        musicActionIcon.classList.remove('fas', 'fa-shuffle');
        musicActionIcon.classList.add('fas', 'fa-repeat')
    }
})