var albumPicasso = {
	title: "The Colors",
	artist: "Pablo Picasso",
	label: "Cubism",
	year: "1881",
	albumArtUrl: "assets/images/album_covers/01.png",
	songs: [
		{ title: "Blue", duration: "4:26" },
		{ title: "Green", duration: "3:14" },
		{ title: "Red", duration: "5:01" },
		{ title: "Pink", duration: "3:21" },
		{ title: "Magenta", duration: "2:15" }
	]
};

var albumDuchamp = {
	title: "Fountain",
	artist: "Marcel Duchamp",
	label: "Dada",
	year: "1887",
	albumArtUrl: "assets/images/album_covers/03.png",
	songs: [
		{ title: "Waterways", duration: "3:01" },
        { title: "Don't throw Quarters", duration: "5:21" },
        { title: "Liquid Blue", duration: "2:01"},
        { title: "Fontaine", duration: "4:54" },
        { title: "Eau", duration: "2:25"}
     ]
};

var albumMarconi = {
	title: "The Telephone",
	artist: "Guglielmo Marconi",
	label: "EM",
	year: "1909",
	albumArtUrl: "assets/images/album_covers/20.png",
	songs: [
		{ title: "Hello, Operator?", duration: "1:01" },
        { title: "Ring, ring, ring", duration: "5:01" },
        { title: "Fits in your pocket", duration: "3:21" },
        { title: "Can you hear me now?", duration: "3:14" },
        { title: "Wrong phone number", duration: "2:15"}
     ]
};

// this makes one table row for the album's songs
var createSongRow = function(songNumber, songName, songLength) {
	var template =
		'<tr class="album-view-song-item">'
	+ '		<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber +'</td>'
	+ '		<td class="song-item-title">' + songName + '</td>'
	+ '		<td class="song-item-duration">' + songLength + '</td>'
	+ 	'</tr>'
	;

	return template;

}; // this creates a lot of <tbody> tags, why is that and is that okay?

// this block gives js variables to the css classes
// why wouldn't we just hardcode this like we did in the album details?
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0].childNodes[1];
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var setCurrentAlbum = function(album) {
	//a little confused about how these assignments work without assigning them variables
	albumTitle.firstChild.nodeValue = album.title;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl); // what?


	albumSongList.innerHTML = ' ';
	// this loop populates the album song list with the information in the album object
	for (var i = 0; i < album.songs.length; i++) {
		albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
	}
};

var currentlyPlayingSong = null;

// when the window is loaded, do this:
window.onload = function() {
	setCurrentAlbum(albumPicasso); // 1. load album picasso first.

	var findParentByClassName = function(element, targetClass) {
		if (element) {
			var currentParent = element.parentElement;
			while (currentParent.className != targetClass && currentParent.className !== null) {
				currentParent = currentParent.parentElement;
			}
			return currentParent;
		}
	}

	var getSongItem = function(element) {
		switch(element.className) {
			case 'ion-play':
			case 'ion-pause':
			case 'album-song-button':
				return findParentByClassName(element, 'song-item-number');
			case 'album-view-song-item': 
				return element.querySelector('.song-item-number');
			case 'song-item-title':
			case 'song-item-duration':
				return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
			case 'song-item-number':
				return element;
			default:
				return;
		}
	};

	var clickHandler = function(targetElement) {
		var songItem = getSongItem(targetElement);

		if (currentlyPlayingSong === null) {
			songItem.innerHTML = pauseButtonTemplate;
			currentlyPlayingSong = songItem.getAttribute('data-song-number');
		} else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
			songItem.innerHTML = playButtonTemplate;
			currentlyPlayingSong = null;
		} else if (currentlyPlayingSong != songItem.getAttribute('data-song-number')) {
			var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
			currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
			songItem.innerHTML = pauseButtonTemplate;
			currentlyPlayingSong = songItem.getAttribute('data-song-number');
		}
	};


	songListContainer.addEventListener("mouseover", function(event) {
	    if (event.target.parentElement.className === 'album-view-song-item') {
        	var songItem = getSongItem(event.target);

        	if (songItem.getAttribute('data-song-number') != currentlyPlayingSong) {
        		songItem.innerHTML = playButtonTemplate;
        	}
        }

        for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
        	var songItem = getSongItem(event.target);
        	var songItemNumber = songItem.getAttribute('data-song-number');

        	if(songItemNumber != currentlyPlayingSong) {
        		songItem.innerHTML = songItemNumber;
        	}
         });

         songRows[i].addEventListener('click', function(event) {
         	clickHandler(event.target);
         });
     }
		
	});

	var albums = [albumPicasso, albumMarconi, albumDuchamp];
	var index = 1;
	albumImage.addEventListener("click", function(event) { // on the event of click on the image, do this:
		setCurrentAlbum(albums[index]); // run setCurrentAlbum to the index (this loads at 0 but first click populates 1)
		index++; // now add one to index, so number two will load on next click
		if (index == albums.length) { // if we reach the last one
			index = 0; // load the first album again
		}
	});
};


