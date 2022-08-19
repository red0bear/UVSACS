  MYVIDEO="MY_PATH_TO_GET_LIST_VIDEOS"; 
  counter=0;
  for entry in  $(find $MYVIDEO -name "path_to_videos")
  do
  
	for mentry in  $(find $entry -name "*.mp4")
	do
		ffmpeg -re -i $mentry -acodec copy  -g 52  -f mp4 -movflags default_base_moof+frag_keyframe+empty_moov+separate_moof output/$counter.mp4
		let counter++
      done
 done
