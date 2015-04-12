var imgs = [document.getElementById('image0'), document.getElementById('image1')];
var playBtn = document.getElementById('playBtn');
var playBtnImg = document.getElementById('playBtnImg');
var headphoneMsg = document.getElementById('headphone-msg');

(function(){
  var widgetIframe = document.getElementById('sc-widget');
  var widget = SC.Widget(widgetIframe);
  window.widget = widget;

  widget.bind(SC.Widget.Events.READY, function() {

  });

  playBtn.addEventListener('click', function(){
    widget.seekTo(0);
    widget.play();
    setInterval(updateImage, 10);
    this.style.opacity = 0;
    this.style.transform = 'rotate(80deg) scale(0.3)';
    this.style.pointerEvents = 'none';
    headphoneMsg.style.opacity = 0;
    setTimeout(function(){
      playBtnImg.src = "udacity-logo.png";
      playBtn.style.transition = "";
      playBtn.style.transform = "";
      playBtn.style.pointerEvents = "auto";
      headphoneMsg.style.color = "white";
      headphoneMsg.style.opacity = 1;
      headphoneMsg.textContent = "Click to Replay";
    }, 5000);
  }, false);

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

      var relPos = pos - 2080;
      var beat = Math.floor(relPos/1000/60*112)+1;
      var doubleBeat = Math.floor(relPos/1000/60*112*2)+1;
      console.log(beat);

      // intro
      if (pos < 2080) {
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
        showImage(null);
        playBtn.style.opacity = 1;
        return false;
      }

      // ending drums
      else if (beat >= 445) {
        document.body.style.transition = "opacity 2s";
        document.body.style.opacity = 0;
      }


      // double time
      if (beat >= 445 && beat < 446) {
        showImage( doubleBeat % 2 );
      }

      // half time
      else if ((beat >= 161 && beat < 177) ||
               (beat >= 289 && beat < 321)) {
        showImage( Math.floor((beat - 1)/2) % 2 );
      }

      // normal time
      else {
        showImage( beat % 2 );
      }

    });
  }
}());
