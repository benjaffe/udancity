var imgs = [document.getElementById('image0'), document.getElementById('image1')];
var playBtn = document.getElementById('playBtn');
var playBtnImg = document.getElementById('playBtnImg');
var headphoneMsg = document.getElementById('headphone-msg');
var playBar = document.getElementById('play-bar');
var playBarStatus = document.getElementById('play-bar-status');

(function(){
  var widgetIframe = document.getElementById('sc-widget');
  var widget = SC.Widget(widgetIframe);
  var duration;
  window.widget = widget;

  widget.bind(SC.Widget.Events.READY, function() {
    widget.getDuration(function(d) {
      duration = d;
      document.body.style.opacity = 1;
      document.body.style.pointerEvents = 'auto';
    });
  });

  playBtn.addEventListener('click', function(){
    widget.seekTo(0);
    widget.play();
    setInterval(updateImage, 10);
    this.style.opacity = 0;
    this.style.transform = 'rotate(80deg) scale(0.3)';
    this.style.pointerEvents = 'none';
    headphoneMsg.style.opacity = 0;
    playBar.style.height = '10px';

    setTimeout(function(){
      playBtnImg.src = "udacity-logo.png";
      playBtn.style.transition = "";
      playBtn.style.transform = "";
      headphoneMsg.style.color = "white";
      headphoneMsg.style.opacity = 1;
      headphoneMsg.style.marginTop = "-25px";
      headphoneMsg.innerHTML = 'Udancity<br><span style="font-size:0.8em;">Click to Replay<span>';
    }, 5000);
  }, false);

  playBar.addEventListener('click', function (e) {
    widget.seekTo( (e.offsetX / playBar.offsetWidth) * duration );
  });

  function showImage (num) {
    imgs.forEach(function(img, i){
      if (i === num) {
        img.style.display = 'block';
      } else {
        img.style.display = 'none';
      }
    });
  }

  function updateImage() {
    widget.getPosition(function(pos){

      var relPos = pos - 2090;
      var beat = Math.floor(relPos/1000/60*112)+1;
      var doubleBeat = Math.floor(relPos/1000/60*112*2)+1;
      console.log(beat);

      playBarStatus.style.width = ((pos / duration) * 100) + '%';

      // intro
      if (pos < 2090) {
        showImage(null);
        return false;
      }

      // pauses
      else if ((beat > 33 && beat < 36) ||
              (beat >= 223 && beat < 225) ||
              (beat >= 350 && beat < 352)) {
        return false;
      }

      // final note
      else if (pos > 241980) {
        document.body.style.transition = "";
        document.body.style.opacity = 1;
        playBtn.style.pointerEvents = "auto";
        showImage(null);
        playBtn.style.opacity = 1;
        return false;
      }

      // ending drums
      else if (beat >= 445) {
        document.body.style.opacity = 0;
        playBar.style.height = '0';
      }


      // triplets
      if (beat >= 257 && beat < 288 ||
         (beat >= 321 && beat < 349)) {
        if (doubleBeat % 8 === 1 || doubleBeat % 8 === 3 || doubleBeat % 8 === 6) {
          showImage( 1 );
        } else if (doubleBeat % 8 === 2 || doubleBeat % 8 === 5 || doubleBeat % 8 === 7) {
          showImage( 0 );
        }
      }

      // half time
      else if ((beat >= 161 && beat < 177) ||
               (beat >= 289 && beat < 321) ||
               (beat > 417)) {
        showImage( Math.floor((beat - 1)/2) % 2 );
      }

      // normal time
      else {
        showImage( beat % 2 );
      }

    });
  }
}());
