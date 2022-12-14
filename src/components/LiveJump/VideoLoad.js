import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ReactHlsPlayer from 'react-hls-player';
import React from 'react';
import preloadPic1 from './preloadPic1.jpg';

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝影片區＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

const StopVideoRange = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 20px;
`;

const StopVideoOutside = styled.div`
  background-color: #d2b48c;
  width: 40px;
  height: 40px;
  padding: 3px;
  display: flex;
  justify-content: center;
  border-radius: 60%;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #dcdcdc;
  }
`;

const StopVideoWord = styled.div`
  margin-left: 20px;
  font-size: 30px;
  letter-spacing: 3px;
`;

const StopVideo = styled.div`
  font-size: 30px;
  padding: 5px;
`;

const Video = styled.div`
  height: 200px;
  padding: 3% 5%;
  position: fixed;
  top: 0%;
  left: 5vw;
  right: 5vw;
  z-index: 50;
  max-width: 1500px;
  margin: 0 auto;
`;

const VideoInput = styled.div`
  margin-top: 20px;
  font-size: 30px;
  letter-spacing: 3px;
  margin-bottom: 20px;
  display: flex;
  align-item: center;
  color: brown;
`;

const VideoLive = styled.div`
  width: 20px;
  height: 20px;
  background: red;
  border-radius: 50%;
  margin-left: 8px;
  margin-top: 4px;
  animation: live 1s linear infinite;
  @keyframes live {
    0% {
      opacity: 100%;
    }
    50% {
      opacity: 30%;
    }
    100% {
      opacity: 100%;
    }
  }
`;

const VideoName = styled.div`
  max-width: 600px;
  display: flex;
`;

const VideoItSelf = styled.div`
  poaition: relative;
`;

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝影片區＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

const VideoLoad = (props) => {
  // let url = props.videoUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  const [hlsUrl, setHlsUrl] = useState();
  const playerRef = useRef();
  const [play, setPlay] = useState();

  return (
    <div>
      <Video>
        <StopVideoRange>
          <StopVideoOutside
            onClick={() => {
              props.closeVideo();
            }}
          >
            <StopVideo>X</StopVideo>
          </StopVideoOutside>
          <StopVideoWord>離開</StopVideoWord>
        </StopVideoRange>
        <VideoItSelf>
          <ReactHlsPlayer
            playerRef={playerRef}
            src={hlsUrl}
            controls={true}
            width="100%"
            autoPlay={true}
            poster={preloadPic1}
          />
        </VideoItSelf>
        <VideoInput>
          <VideoName>
            {props.name}的直播頁面
            <VideoLive />
          </VideoName>
        </VideoInput>
      </Video>
    </div>
  );
};

export const MemoVideoLoad = React.memo(VideoLoad);
