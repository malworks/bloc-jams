

var setSong = function(songNumber) {
	if (currentSoundFile) {
		currentSoundFile.stop();
	};

	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber -1];

	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {

		formats: ['mp3'],
		preload: true
	});

	setVolume(currentVolume);
};

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 };

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
};

var setCurrentTimeInPlayerBar = function(currentTime) {
	$('.current-time').text(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
	var $songDuration = $('.total-time');
	$songDuration.text(totalTime);
};

var filterTimeCode = function(timeInSeconds) {
  	var seconds = Number.parseFloat(timeInSeconds);
    var wholeSeconds = Math.floor(seconds);
    var minutes = Math.floor(wholeSeconds / 60);
    
    var remainingSeconds = wholeSeconds % 60;
    var output = minutes + ':';
    
    if (remainingSeconds < 10) {
        output += '0';   
    }
    
    output += remainingSeconds;
    return output;
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
};
// this makes one table row for the album's songs
var createSongRow = function(songNumber, songName, songLength) {
	var template =
		'<tr class="album-view-song-item">'
	+ '		<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber +'</td>'
	+ '		<td class="song-item-title">' + songName + '</td>'
	+ '		<td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
	+ 	'</tr>'
	;

	var $row =  $(template);

	var clickHandler = function() {
		var songNumber = parseInt($(this).attr('data-song-number'));

		if (currentlyPlayingSongNumber !== null) {
			var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}

		if (currentlyPlayingSongNumber !== songNumber) {
			var $volumeFill = $('.volume .fill');
			var $volumeThumb = $('.volume .thumb');
			$volumeFill.width(currentVolume + '%');
			$volumeThumb.css({left: currentVolume + '%'});
			$('.main-controls .play-pause').html(playerBarPauseButton);
			$(this).html(pauseButtonTemplate);
				setSong(songNumber);
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
				updatePlayerBarSong();
		} else if (currentlyPlayingSongNumber === songNumber) {
			if (currentSoundFile.isPaused()) {
				$(this).html(playButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPlayButton);
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
			} else {
				$(this).html(playButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPlayButton);
				currentSoundFile.pause();

			}
		}

	};

	var onHover = function(event) {
	var songNumberCell = $(this).find('.song-item-number');
	var songNumber = parseInt(songNumberCell.attr('data-song-number'));

		if (songNumber !== currentlyPlayingSongNumber) {
			songNumberCell.html(playButtonTemplate);
		}
	};

	var offHover = function(event) {
		var songNumberCell = $(this).find('.song-item-number');
		var songNumber = parseInt(songNumberCell.attr('data-song-number'));

		if (songNumber !== currentlyPlayingSongNumber) {
			songNumberCell.html(songNumber);
		}
	}; 

	$row.find('.song-item-number').click(clickHandler);
	$row.hover(onHover, offHover);
	return $row;

};

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class ="ion-play"></span>';
var playerBarPauseButton = '<span class ="ion-pause"></span>';

var setCurrentAlbum = function(album) {
	currentAlbum = album;
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);


	$albumSongList.empty();
	// this loop populates the album song list with the information in the album object
	for (var i = 0; i < album.songs.length; i++) {
	    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
	}
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
}

var nextSong = function() {
	 var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex]; //can this be changed to updatePlayerBarSong()?

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $playPause.html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};


var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    $playPause.html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var updatePlayerBarSong = function() {
	$('.currently-playing .song-name').text(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').text(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').text(currentAlbum.artist + ' - ' + currentSongFromAlbum.title);
	$('main-controls .play-pause').html(playerBarPauseButton);
	setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

	var togglePlayFromPlayerBar = function() {
		if (currentSoundFile.isPaused()) {
			$('.album-song-button').html(pauseButtonTemplate);
			$playPause.html(playerBarPauseButton);
			currentSoundFile.play();
		} else {
			$('.album-song-button').html(playButtonTemplate);
			$playPause.html(playerBarPlayButton);
			currentSoundFile.pause();
		}

	};

var updateSeekBarWhileSongPlays = function() {
	if (currentSoundFile) {
		currentSoundFile.bind('timeupdate', function(event) {
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');
			var currentTime = currentSoundFile.getTime();

			updateSeekPercentage($seekBar, seekBarFillRatio);
			setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
		});
	}
};

 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;

    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');
 
     $seekBars.click(function(event) {

         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();

         var seekBarFillRatio = offsetX / barWidth;

         if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
		}
 
         updateSeekPercentage($(this), seekBarFillRatio);
     });

     $seekBars.find('.thumb').mousedown(function(event) {

     	var $seekBar = $(this).parent();

     	$(document).bind('mousemove.thumb', function(event) {
     		var offsetX = event.pageX - $seekBar.offset().left;
     		var barWidth = $seekBar.width();
     		var seekBarFillRatio = offsetX / barWidth;

     		if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
			}

     		updateSeekPercentage($seekBar, seekBarFillRatio);
     	});
     
     	$(document).bind('mouseup.thumb', function() {
     		$(document).unbind('mousemove.thumb');
     		$(document).unbind('mouseup.thumb');
     	});

     });
 };


var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');


// when the window is loaded, do this:
$(document).ready(function() {

	setCurrentAlbum(albumPicasso); // 1. load album picasso first.
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playPause.click(togglePlayFromPlayerBar);
	setupSeekBars();


	var albums = [albumPicasso, albumMarconi, albumDuchamp];
	var index = 1;
	$albumImage.click(function(event) { // on the event of click on the image, do this:
		setCurrentAlbum(albums[index]); // run setCurrentAlbum to the index (this loads at 0 but first click populates 1)
		index++; // now add one to index, so number two will load on next click
		if (index == albums.length) { // if we reach the last one
			index = 0; // load the first album again
		}
	});

});


