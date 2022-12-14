import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

// ========================Reel開始========================
const ReelsPanel = styled.div`
  height: 500px;
  width: 80%;
  margin: 20px auto;
  display: flex;
  position: relative;
  @media (max-width: 1279px) {
    height: auto;
    flex-wrap: wrap;
    flex-direction: column;
  }
`;
const Reel = styled.div`
  margin-top: 30px;
  height: 100%;
  width: 30%;
  background-color: #f3efef;
  border-radius: 10px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1279px) {
    flex-direction: column;
    flex-wrap: wrap;
    margin-top: 20px;
  }
`;
const ReelsDirection = styled.div`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: #999;
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 40%;
  background-color: #fff;
  border: 1px solid #999;
  &:hover {
    background-color: #dcdcdc;
  }
`;
const ReelsLeft = styled(ReelsDirection)`
  left: -10px;
`;
const ReelsRight = styled(ReelsDirection)`
  right: -10px;
`;

const ReelsEmpty = styled.div`
  color: #b67c62;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 3px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReelsBackground = styled.div`
  background-color: #f3efef;
  height: 100%;
  width: 80%;
  margin: 20px auto;
`;

// ========================Reel結束========================

const ReelsPage = (props) => {
  console.log(props.Reels);
  return (
    <>
      {props.Reels.length > 0 ? (
        <ReelsPanel>
          <ReelsLeft onClick={props.ReelPageReduce}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </ReelsLeft>
          {props.Reels.map((video) => (
            <Reel>
              <video autoPlay loop height={480} width={270} controls src={video.url} muted></video>
            </Reel>
          ))}
          <ReelsRight onClick={props.ReelPageAdd}>
            <FontAwesomeIcon icon={faAngleRight} />
          </ReelsRight>
        </ReelsPanel>
      ) : (
        <ReelsBackground>
          <ReelsEmpty>快上傳你的影片吧～～</ReelsEmpty>
        </ReelsBackground>
      )}
    </>
  );
};

export default ReelsPage;
