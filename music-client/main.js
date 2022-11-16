const SERVER_ROOT = 'http://localhost:3000';
window.onload = function () {
    if (localStorage.getItem('accessToken')) {
        afterLogin();
    } else {
        notLogin();
    }


    document.getElementById('loginBtn').onclick = function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        fetch(`${SERVER_ROOT}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => loggedInFeatures(data));
    }

    document.getElementById('logoutBtn').onclick = function () {
        localStorage.removeItem('accessToken');
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
        toast.success("Logged out  Successfully!");
        notLogin();
    }

    document.getElementById('searchMusic').onkeyup = function () {
        console.log(this.value)
        fetchMusic(this.value);
    }
}

function loggedInFeatures(data) {
    if (data.status) {
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
        toast.error(data.message);
    } else {
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
        toast.success("Logged In Successfully!");

        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('playType', data.playType);
        afterLogin();
    }


    document.getElementById('searchMusic').onkeyup = function (event) {
        console.log(this.value)
    }
}

function fetchMusic(search = null) {
    let url = search ? `${SERVER_ROOT}/api/music?search=${search}` : `${SERVER_ROOT}/api/music`
    fetch(url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(response => response.json())
        .then(songs => {
            const tableBody = document.getElementById("tableMusicBody");
            innerTableBody = '';
            let index = 1;
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
            tableBody.innerHTML = innerTableBody
        });

}

function fetchPlayList() {
    fetch(`${SERVER_ROOT}/api/playlist`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }).then(response => response.json())
        .then(data => {
            songs = [];
            currentPlayLists = [];
            const tablePlaylistBody = document.getElementById("tablePlaylistBody");
            innerTableBody = '';
            let index = 1;
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
                // songIndex++;

            })
            tablePlaylistBody.innerHTML = innerTableBody
        });
}

function afterLogin() {
    // document.getElementById('search').style.display = 'block';
    document.getElementById('logout-div').style.display = 'block';
    document.getElementById('login-div').style.display = 'none';
    fetchMusic();
    fetchPlayList();
    document.getElementById('musicContent').style.display = 'block';
    document.getElementById('musicTitle').style.display = 'block';
    document.getElementById('playListContent').style.display = 'block';
    document.getElementById('playListTitle').style.display = 'block';
    document.getElementById('welcomeTitle').style.display = 'none';
    document.getElementById('searchMusic').style.display = 'block';
    document.getElementById('outer-container').style.display = 'none';
}

function notLogin() {
    // document.getElementById('search').style.display = 'none';
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

function addToPlayList(songId) {
    let checkSongIndex = currentPlayLists.findIndex(i => i === songId);
    if (checkSongIndex > -1) {
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
        toast.error("Song already added to playlist");
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
            toast.success("Song added to playlist")
            fetchPlayList()
        });
}

function removeFromPlayList(songId) {
    fetch(`${SERVER_ROOT}/api/playlist/remove`, {
        method: 'POST',
        body: JSON.stringify({ songId: songId }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }).then(response => response.json())
        .then(data => {
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
            toast.success("Song remmoved from playlist")
            fetchPlayList()
        });
}
const closeButton = document.getElementById('close');
const musicOuterContainer = document.getElementById('outer-container');
const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const repeatBtn = document.getElementById('repeat');
const shuffleBtn = document.getElementById('shuffle');

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

let currentPlayLists = [

];

let currentSongIndex;
let songIndex = 0;
// // Keep track of song
// let songIndex = 0;

// // Initially load song details into DOM
// loadSong(songs[songIndex]);

// Update song details
function loadSong(song) {
    let songName = song.split('/');
    let lastSong = songName.pop();
    title.innerText = lastSong;
    audio.src = song;
    cover.src = "image/logo.png";
}

function playMusic(song) {
    // if (!songs.includes(song)) {
    //     songIndex++;
    //     songs.push(song)
    // }
    let index = songs.findIndex(i => i === song);
    loadSong(`http://localhost:3000/${songs[index]}`);
    musicOuterContainer.style.display = 'flex';
    playSong();
    currentSongIndex = index;
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
        let indexLists = [];
        let count = 0;
        songs.forEach(i => {
            indexLists.push(count);
            count++;
        })
        const random = Math.floor(Math.random() * indexLists.length);

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
        let indexLists = [];
        let count = 0;
        songs.forEach(i => {
            indexLists.push(count);
            count++;
        })
        const random = Math.floor(Math.random() * indexLists.length);

        songIndex = random
    }


    loadSong(`http://localhost:3000/${songs[songIndex]}`);

    playSong();
}

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


// Event listeners
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

closeButton.addEventListener('click', function () {
    musicOuterContainer.style.display = 'none'
    pauseSong();
})

// Time of song
// audio.addEventListener('timeupdate', audio.currentTime);
repeatBtn.addEventListener('click', function () {
    if (this.style.background && localStorage.getItem('playType')) {
        this.style.background = null;
        localStorage.setItem('playType', 'ORDER');
    }
    else {
        this.style.background = 'green';
        localStorage.setItem('playType', 'REPEAT');
    }
})

shuffleBtn.addEventListener('click', function () {
    if (this.style.background && localStorage.getItem('playType')) {
        this.style.background = null;
        localStorage.setItem('playType', 'ORDER');
    }
    else {
        this.style.background = 'green';
        localStorage.setItem('playType', 'SHUFFLE');
    }
})