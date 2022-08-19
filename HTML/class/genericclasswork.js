
var video = null;
var URLF = null;
var blob = null;
var mediaSource = null;
var sourceBuffer = null; 
var bytesFetched = 0; 
var totalLength = 0;
var totalSegments =10;
var totalSegmentsc =0;
var mimeCodec = 'video/mp4; codecs="avc1.64001F, mp4a.40.2"';
var lastbytesFetched = 0;  
var xhr_getFileLength;
var xhr_fetchRange;
var xhr_fetchlistfile;
var read_is_finisehd = false;

var uvacs;
var obj;
var urls = [];

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

function getSourcesSearch() {

   document.createElement("videolist").length = 0;
    
    var path = 'path_info'; 
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // The request is done; did it work?
            if (xhr.status == 200) {
                // ***Yes, use `xhr.responseText` here***
                
                items = xhr.responseText.split('\n');
                var counter = 0;
                for(var line = 0; line < items.length-1; line++)
                {
                	const obj = JSON.parse(items[line]); //
                	//console.log('data --> ',obj);
                	
                	if(obj.tag ===  uvacs.toLowerCase())
                	{
                		urls[counter] = obj.path;
                		button_create(obj.imagebackground,counter);
                		counter++;
                	}
                }
                
               // callback(xhr.responseText);
            } else {
                // ***No, tell the callback the call failed***
               // callback(null);
            }
        }
    };
    xhr.open("GET", path);
    xhr.send();
}

function handleFileData(fileData) {
    if (!fileData) {
        // Show error
        return;
    }
    // Use the file data
}

// Do the request
//doGET("/path/to/file", handleFileData);


function getFileLength(url, cb) {
    xhr_getFileLength = new XMLHttpRequest;
    xhr_getFileLength.open('head', url);
    xhr_getFileLength.onload = function () {
        cb(xhr_getFileLength.getResponseHeader('content-length'));
    };
    xhr_getFileLength.send();
};


function get_entire_file(url)
{
  let xhr = new XMLHttpRequest;
  xhr.open('get', url);
  xhr.responseType = 'arraybuffer';
  xhr.onload = () => {
	  //console.log('loaded', mediaSource.readyState);
	  sourceBuffer.addEventListener('updateend', () => {
	  // 	console.log('playing', mediaSource.readyState);
	  	mediaSource.endOfStream();
		video.play();
	   });
          sourceBuffer.appendBuffer(xhr.response);
  };
  xhr.send();
}

function fetchRange (url, start, end, cb) {
    xhr_fetchRange = new XMLHttpRequest;
    xhr_fetchRange.open('get', url);
    xhr_fetchRange.responseType = 'arraybuffer';
    xhr_fetchRange.setRequestHeader('Range', 'bytes=' + start + '-' + end);
    xhr_fetchRange.onload = function () {
    cb(xhr_fetchRange.response);
    bytesFetched += end - start + 1;
    read_is_finisehd = true;
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

       console.log('totalSegmentsc , totalLength' ,totalSegmentsc , totalLength);
      
      if(read_is_finisehd){
	 	 
	 if (totalLength - bytesFetched <= 0)
	 {
	     	mediaSource.endOfStream();
	     	video.removeEventListener('timeupdate', checkBuffer);         
	 }else
	 {
	 	read_is_finisehd = false;
	 	if((totalLength - bytesFetched) < 1024*1024)
	 	{
	 		fetchRange(URLF, bytesFetched, bytesFetched + (totalLength - bytesFetched), appendSegment);
	 	}
	 	else
 			fetchRange(URLF, bytesFetched, bytesFetched + (1024*1024*2), appendSegment);
	 }
	 	         
     }

};

function sourceOpen (_) {

  	sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
       
        getFileLength(URLF, function (fileLength) {
        
          //console.log('TOTAL: ' ,(fileLength / 1024 / 1024).toFixed(2), 'MB');
          totalLength = fileLength;
          var counter = 1;
                                       
          if(fileLength <= 1024*1024*8)
          {
          	segmentLength = fileLength;
          	get_entire_file(URLF);
          }
          else
          {

		 fetchRange(URLF, 0, 1024*1024*2 , appendSegment);
          
		 video.addEventListener('timeupdate', checkBuffer);
		 video.addEventListener('canplay', function () {
		    	video.play();
		 });
          }


        });
};
	   
function updateSource(currentSource) {
   
   if(xhr_getFileLength == undefined && xhr_fetchRange == undefined)
   {}
   else
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
<<<<<<< HEAD
                    
   if(currentSource === 1)
   	URLF = 'video/.mp4';
   	
   if(currentSource === 2) 
	URLF = 'video/.mp4';

  if(currentSource === 3)
  	URLF = 'video/.mp4';
  
=======
             
  URLF = urls[currentSource];
>>>>>>> 2a0de06 (new change to make videos more playable.)
 
  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
        mediaSource = new MediaSource();
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', sourceOpen);
  } else {
      // console.error('Unsupported MIME type or codec: ', mimeCodec);
  } 
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function button_create(url_background_img,counter_options_video)
{  
   var divbtn=document.createElement("div");
   divbtn.className = "grid-item";
   
   var btn=document.createElement("button");	
   btn.style.backgroundImage = "url('"+ url_background_img +"')";
   btn.className = "buttongeneric";
   btn.setAttribute('onclick' , "updateSource("+ counter_options_video +")");
   
   divbtn.appendChild(btn);
   document.getElementById("videolist").appendChild(divbtn);
}


