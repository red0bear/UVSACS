
var video = null;
var URLF = null;
var blob = null;
var mediaSource = null;
var sourceBuffer = null; 
var bytesFetched = 0; 
var totalLength = 0;
var totalSegments =10;
var totalSegmentsc =0;
var mimeCodec = 'video/mp4; codecs="avc1.640032, mp4a.40.2"';
var lastbytesFetched = 0;  
var xhr_getFileLength;
var xhr_fetchRange;

var capabilities = {
 "acceptSslCerts" : "false"
}

function choosetabs(evt, tabname) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tabname).style.display = "block";
  evt.currentTarget.className += " active";
}
           
function appendSegment (chunk) 
{
     sourceBuffer.appendBuffer(chunk);
};

function getFileLength(url, cb) {
    xhr_getFileLength = new XMLHttpRequest;
    xhr_getFileLength.open('head', url);
    xhr_getFileLength.onload = function () {
        cb(xhr_getFileLength.getResponseHeader('content-length'));
    };
    xhr_getFileLength.send();
};

function fetchRange (url, start, end, cb) {
    xhr_fetchRange = new XMLHttpRequest;
    xhr_fetchRange.open('get', url);
    xhr_fetchRange.responseType = 'arraybuffer';
    xhr_fetchRange.setRequestHeader('Range', 'bytes=' + start + '-' + end);
    xhr_fetchRange.onload = function () {
    //console.log('fetched bytes: ', start, end);
    bytesFetched += end - start + 1;
    totalSegmentsc += segmentLength; 
    cb(xhr_fetchRange.response);
    //console.log('fetched : ', bytesFetched);
   };
    xhr_fetchRange.send();
};

function seek (e) {
   // console.log(e);
    if (mediaSource.readyState === 'open') {
     // sourceBuffer.abort();
      console.log(mediaSource.readyState);
    } else {
     // console.log('seek but not open?');
      console.log(mediaSource.readyState);
    }
};

function checkBuffer (_) {

     //  console.log('bytesFetched , totalLength' ,bytesFetched , totalLength);
        
      if(bytesFetched > lastbytesFetched){
          	 
    	 lastbytesFetched = bytesFetched;
	 
	 if (totalSegmentsc > totalLength)
	 {
	     	mediaSource.endOfStream();
	     	video.removeEventListener('timeupdate', checkBuffer);         
	 }else
	 {
	     	//console.log('time to fetch next chunk', video.currentTime);
	 	fetchRange(URLF, bytesFetched, bytesFetched + segmentLength, appendSegment);
	 }
	 	         
     }
      //  console.log(video.currentTime, currentSegment, segmentDuration);
};

function sourceOpen (_) {

  	sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
       
        getFileLength(URLF, function (fileLength) {
        
          //console.log('TOTAL: ' ,(fileLength / 1024 / 1024).toFixed(2), 'MB');
          totalLength = fileLength;
          var counter = 1;
                                       
          if(fileLength <= 1024*1024*8)
          {
          
          }
          else
          {
		  do
		  {
		  	segmentLength = Math.round(fileLength / counter );
		  	totalSegments  = counter;
		  	counter++;
		  }while(segmentLength > (1024*1024) );
          }

          fetchRange(URLF, 0, segmentLength , appendSegment);
          
          video.addEventListener('timeupdate', checkBuffer);
          video.addEventListener('canplay', function () {
            	video.play();
          });
        });
};
	   
function updateSource(currentSource) {
   
   if(xhr_getFileLength == undefined && xhr_fetchRange == undefined)
   {}else
   {
   	xhr_getFileLength.abort();
   	xhr_fetchRange.abort();
   }
   URLF = null;
   blob = null;
   mediaSource = null;
   sourceBuffer = null; 
   bytesFetched = 0; 
   totalLength = 0;
   totalSegments =10;
   totalSegmentsc =0;
   lastbytesFetched = 0;
   
   video = document.querySelector('video');
   video.preload="auto";
                    
   if(currentSource === 1)
   	URLF = 'video/.mp4';
   	
   if(currentSource === 2) 
	URLF = 'video/.mp4';

  if(currentSource === 3)
  	URLF = 'video/.mp4';
  
 
  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        mediaSource = new MediaSource();
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', sourceOpen);
  } else {
      // console.error('Unsupported MIME type or codec: ', mimeCodec);
  }

 
}

