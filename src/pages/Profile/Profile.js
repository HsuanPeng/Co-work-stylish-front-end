import { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext, useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import LiveStreamingAlert from './LiveStreamingAlert';
import io from 'socket.io-client';
import api from '../../utils/api';
import personhead from './personhead.png';

//上傳影片Reels
import axios from 'axios';
//直播畫面

import Game from './Game/Game';
import { MemoVideoLoad } from '../../components/LiveJump/VideoLoad';
import VideoProducts from '../../components/LiveJump//VideoProducts';
//引入心願清單
import WishPage from './WishPage';
//引入couponPage
import CouponPage from './CouponPage';
//引入ReelsPage
import ReelsPage from './ReelsPage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1;
`;
const UserMainColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SeeLive = styled.div`
  color: #e27d60;
  font-size: 20px;
  display: flex;
  position: absolute;
  z-index: 20;
  top: 300px;
  left: 700px;
  letter-spacing: 1.2px;
  @media (min-width: 600px) and (max-width: 1279px) {
    top: 240px;
    left: 380px;
  }
`;

const SeeLiveFinger = styled.div`
  font-size: 30px;
  padding-right: 5px;
  animation: seeme 0.8s linear infinite;
  @keyframes seeme {
    0% {
      transform: translate(0px, -5px);
    }
    50% {
      transform: translate(0px, 5px);
    }
    100% {
      transform: translate(0px, -5px);
    }
  }
`;

const UserWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: #f3efef;
  width: 100%;
  height: 200px;
`;
const UserInfoWrapper = styled.div`
  width: 80%;
  height: 50%;
  display: flex;
  align-items: center;

  & * {
    margin-right: 20px;
  }
  @media (max-width: 1279px) {
    width: 100%;
    justify-content: center;
    & * {
      margin-right: 10px;
    }
  }
`;

const NameFollowers = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
`;

const NameButton = styled.div`
  margin-left: 15px;
  @media (max-width: 1279px) {
  }
`;

const Photo = styled.img`
  border-radius: 50%;
  width: 150px;
  cursor: pointer;
  animation: ${(props) => (props.$status === 1 ? 'pump 1s linear infinite' : null)};
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes pump {
    0% {
      box-shadow: 0px 0px 0px 0px rgba(255, 0, 0, 0.5);
      scale: 1;
      transform: rotate(0deg);
    }
    50% {
      box-shadow: 0px 0px 15px 15px rgba(255, 0, 0, 0.5);
      scale: 1.05;
      transform: rotate(180deg);
    }
    100% {
      box-shadow: 0px 0px 1px 1px rgba (255, 0, 0, 0.5);
      scale: 1;
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1279px) {
    width: 90px;
  }
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 500;
  white-space: nowrap;
  @media (max-width: 1279px) {
    font-size: 18px;
  }
`;

const Followers = styled.div`
  display: flex;
  align-items: center;
`;

const FollowersTitle = styled.div`
  font-weight: 500;
  font-size: 20px;
  @media (max-width: 1279px) {
    font-size: 14px;
  }
`;
const FollowersNumbers = styled.div`
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  @media (max-width: 1279px) {
    font-size: 14px;
  }
`;
const Button = styled.button`
  color: #fff;
  letter-spacing: 1px;
  margin: 10px 20px 10px 0px;
  padding: 5px 20px;
  height: 100%;
  border-radius: 5px;
  cursor: pointer;
  white-space: nowrap;
  @media (max-width: 1279px) {
    font-size: 12px;
    padding: 3px 5px;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 1279px) {
  }
`;
const LiveButton = styled(Button)`
  background-color: #e27d60;
  border: 1px solid #e27d60;
`;

const UploadVideoInputButton = styled(Button)`
  background-color: #e27d60;
  border: 1px solid #e27d60;
  @media (max-width: 1279px) {
  }
`;

const UploadVideoButton = styled(Button)`
  background-color: #e27d60;
  border: 1px solid #e27d60;
  @media (max-width: 1279px) {
  }
`;

const LogoutButton = styled(Button)`
  background-color: #8b572a;
  border: 1px solid #8b572a;
`;
const DailyTaskReminder = styled.div`
  height: 10vh;
  line-height: 10vh;
  font-size: 24px;
  border-bottom: 1px solid #f3efef;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 1279px) {
    font-size: 16px;
  }
`;
const Tabs = styled.div`
  border-bottom: 10px solid #f3efef;
  width: 80%;
  margin: 0px auto 0px auto;
  display: flex;
`;
const Tab = styled.div`
  height: 30px;
  line-height: 30px;
  color: #8b572a;
  border-radius: 5px 5px 0px 0px;
  border: 3px solid #f3efef;
  border-bottom: none;
  margin: 45px 15px 0px 0px;
  padding: 0px 10px;
  cursor: pointer;
  background-color: ${(props) => (props.$bgColor ? '#f3efef' : 'none')};
  white-space: nowrap;
  @media (max-width: 1279px) {
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
    padding: 0px 5px;
  }
`;
const GameWrapper = styled.div`
  background-color: #f3efef;
  height: 100%;
  width: 80%;
  margin: 20px auto;
`;

// ========================遊戲區開始========================
const MonsterOutside = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  animation: seeme 0.8s linear infinite;
  @keyframes seeme {
    0% {
      transform: translate(0px, -5px);
    }
    50% {
      transform: translate(0px, 5px);
    }
    100% {
      transform: translate(0px, -5px);
    }
  }
`;

const MonsterTitle = styled.div`
  margin: 30px 30px;
  color: #ffa500;
  font-size: 25px;
`;

const MonsterBodyZone = styled.div`
  scale: 0.6;
`;

const Monster = styled.div`
  box-shadow: 0 0 0 1em #ffdead, 0 1em 0 1em #ffdead, -2.5em 1.5em 0 0.5em #ffdead, 2.5em 1.5em 0 0.5em #ffdead,
    -3em -3em 0 0 #ffdead, 3em -3em 0 0 #ffdead, -2em -2em 0 0 #ffdead, 2em -2em 0 0 #ffdead, -3em -1em 0 0 #ffdead,
    -2em -1em 0 0 #ffdead, 2em -1em 0 0 #ffdead, 3em -1em 0 0 #ffdead, -4em 0 0 0 #ffdead, -3em 0 0 0 #ffdead,
    3em 0 0 0 #ffdead, 4em 0 0 0 #ffdead, -5em 1em 0 0 #ffdead, -4em 1em 0 0 #ffdead, 4em 1em 0 0 #ffdead,
    5em 1em 0 0 #ffdead, -5em 2em 0 0 #ffdead, 5em 2em 0 0 #ffdead, -5em 3em 0 0 #ffdead, -3em 3em 0 0 #ffdead,
    3em 3em 0 0 #ffdead, 5em 3em 0 0 #ffdead, -2em 4em 0 0 #ffdead, -1em 4em 0 0 #ffdead, 1em 4em 0 0 #ffdead,
    2em 4em 0 0 #ffdead;
  background: #ffdead;
  width: 1em;
  height: 1em;
  overflow: hidden;
  margin: 70px 0 70px 65px;
`;
const Today = styled.div`
  padding: 5px 0px;
  border-radius: 5px;
  border: 2px solid #e27d60;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const TodayText = styled.p`
  position: absolute;
  color: #e27d60;
  font-size: 14px;
  line-height: 100%;
  bottom: -18px;
`;
const ProgressWrapper = styled.div`
  display: flex;
  width: 90%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
const Progress = styled.div`
  display: flex;
  border-radius: 50%;
  width: 50px;
  height: 40px;
  border: 2px solid #ffe38d;
  justify-content: center;
  align-items: center;
  margin: 0 15px;
  @media screen and (max-width: 550px) {
    width: 30px;
    height: 30px;
    margin: 0 10px;
  }
`;
const ProgressInner = styled.div`
  border-radius: 50%;
  width: 35px;
  height: 30px;
  background: #ffe38d;
`;
const ProgressChecked = styled(Progress)`
  border: 2px solid #8b572a;
`;
const ProgressInnerChecked = styled(ProgressInner)`
  background: #8b572a;
`;
const ProgressPassed = styled(Progress)`
  border: 2px solid #ddd;
`;
const ProgressInnerPassed = styled(ProgressInner)`
  background: #ddd;
`;
const GameCompleted = styled(GameWrapper)`
  color: #b67c62;
  font-size: 30px;
  font-weight: 700;
  letter-spacing: 3px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoRealOutside = styled.div`
  display: flex;
  flex-direction: column;
  height: 1400px;
`;

// ========================遊戲區開始========================

// ========================function開始========================

function Profile() {
  const paramId = useParams().id;
  let userId = JSON.parse(localStorage.getItem('user'))?.id;
  const [profile, setProfile] = useState();
  let navigate = useNavigate();

  const { isLoggedIn, setIsLoggedIn, setShowMask, ws, setWs, followList, setFollowList, notice, setNotice } =
    useOutletContext();

  const [isLiveStreamingOn, setIsLiveStreamingOn] = useState(false);
  const [showLiveAlert, setShowLiveAlert] = useState(false);
  const [tabSelected, setTabSelected] = useState({
    task: true,
    reels: false,
    wishList: false,
    coupon: false,
  });
  const [tabCustomSelected, setTabCustomSelected] = useState({
    reels: true,
    wishList: false,
  });
  const [liveKey, setLiveKey] = useState();
  const [url, setUrl] = useState();
  const [gameProgress, setGameProgress] = useState();
  const [today, setToday] = useState();
  //Reels
  const [Reels, setReels] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [videoZone, setVideoZone] = useState('none');
  const [followStatus, setFollowStatus] = useState(null);
  const [followerNumber, setFollowerNumber] = useState();
  const [author, setAuthor] = useState();
  const closeVideo = useCallback(() => {
    setVideoZone('none');
  }, []);
  const openVideo = useCallback(() => {
    setVideoZone('block');
  }, []);

  //心願清單
  const [wish, setWish] = useState([]);
  //coupons
  const [coupon, setCoupon] = useState([]);

  function tabSwitched(target) {
    if (!target) return;
    let defaultTab = {
      task: false,
      reels: false,
      wishList: false,
      coupon: false,
    };
    defaultTab[target] = true;
    setTabSelected(defaultTab);
  }
  function tabCustomSwitched(target) {
    if (!target) return;
    let defaultTab = {
      reels: false,
      wishList: false,
    };
    defaultTab[target] = true;
    setTabCustomSelected(defaultTab);
  }
  const disconnectWs = () => {
    ws.on('disconnect');
    setWs(null);
  };
  const openLive = (data) => {
    const live = io('https://www.domingoos.store/influencer', {
      query: { live_setting: 1, key: false },
      extraHeaders: {
        jwtToken: localStorage.getItem('jwtToken'),
      },
    });

    live.emit('liveInfo', { status: 1, products: data, secret: liveKey });
    live.on('disconnect');
    let currentProfile = { ...profile, liveStatus: 1 };
    setProfile(currentProfile);
  };
  const authLive = () => {
    const live = io('https://www.domingoos.store/influencer', {
      query: { live_setting: 1, key: true },
      extraHeaders: {
        jwtToken: localStorage.getItem('jwtToken'),
      },
    });
    live.on('status', (data) => {
      if (data.status == 200) {
        live.on('key', (data) => {
          if (data.status == 200) {
            console.log(data.key);
            setLiveKey(data.key);
            setUrl(data.url);
            setShowLiveAlert(true);
            setShowMask(true);
          } else {
            window.alert('金鑰取得失敗！');
          }
        });
      }
    });

    live.on('disconnect');
  };
  const closeLive = () => {
    const live = io('https://www.domingoos.store/influencer', {
      query: { live_setting: 0 },
      extraHeaders: {
        jwtToken: localStorage.getItem('jwtToken'),
      },
    });
    live.on('status', (msg) => {
      console.log(msg);
      if (msg.status != 200) alert('直播關閉失敗');
      else if (msg.status == 200) {
        let profileData = { ...profile, liveStatus: 0 };
        setProfile(profileData);
      }
    });
    live.on('disconnect');
  };
  const updateFollowList = () => {
    const data = {
      followStatus: 1,
      follow_id: Number(paramId),
    };
    ws.emit('updateFollow', data);
    setFollowStatus(true);
    setFollowerNumber((prev) => prev + 1);
  };

  useEffect(() => {
    if (userId === Number(paramId)) setAuthor(1);
    else if (userId !== Number(paramId)) setAuthor(2);
    async function getProfile() {
      const { data } = await api.getProfile(paramId);
      setProfile(data);
      setFollowerNumber(data.follower_count);
    }
    getProfile();
    if (userId && userId === Number(paramId)) {
      async function getGameStatus() {
        const { data } = await api.getGameStatus(paramId, localStorage.getItem('jwtToken'));
        setGameProgress(data.progress);
        const date = new Date().getDay();
        setToday(date - 1);
        console.log(data.progress);
      }
      getGameStatus();
    }
    if (userId && userId !== Number(paramId)) {
      async function getFollowStatus() {
        const { data } = await api.getFollowStatus(paramId, localStorage.getItem('jwtToken'));
        setFollowStatus(data);
      }
      getFollowStatus();
    }
  }, [paramId]);

  useEffect(() => {
    if (isLoggedIn) {
      setWs(
        io('https://www.domingoos.store', {
          extraHeaders: {
            jwtToken: localStorage.getItem('jwtToken'),
          },
        })
      );
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (ws) {
      ws.on('followList', (data) => {
        if (data.status === 200) {
          console.log(data.followList);
          setFollowList(data.followList);
        }
      });

      ws.on('live', (data) => {
        console.log(data);
        let currentNotice = [...notice];
        if (!data.status) {
          let newNotice = currentNotice.concat({ ...data, read: 0 });
          setNotice(newNotice);
          console.log(newNotice);
        }
        let newFollowStatus = data;
        let currentFollowList = [...followList];
        let removeStatus = currentFollowList.find((person, index) => data.id === person.id);
        let removeStatusId = currentFollowList.indexOf(removeStatus);
        currentFollowList[removeStatusId] = newFollowStatus;
        console.log(currentFollowList);
        setFollowList(currentFollowList);
      });
    }
  }, [ws]);

  //＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝上傳影片＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  const jwtToken = localStorage.getItem('jwtToken');

  const inputRef = useRef();
  const wsRef = useRef();
  async function uploadVideo() {
    const video = inputRef.current.files[0];
    let formData = new FormData();
    formData.append('video', video);
    formData.append('userID', 1);
    const { data } = await axios({
      method: 'post',
      url: `https://www.domingoos.store/api/1.0/user/${paramId}/reels`,
      data: formData,
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    getVideo();
  }
  function inputClick() {
    inputRef.current.click();
  }

  //＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝上傳影片＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  //＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝Reel拿影片區＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  function ReelPageAdd() {
    setCurrentPage(currentPage + 1);
  }
  function ReelPageReduce() {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }
  function getVideo() {
    fetch(`https://www.domingoos.store/api/1.0/user/${paramId}/reels?paging=${currentPage}`)
      .then((res) => res.json())
      .then((data) => {
        setReels(data.data);
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    getVideo();
  }, [currentPage]);
  if (!Reels) return null;
  //＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝Reel拿影片區＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

  //================關閉直播區開始================

  const VideoBackground = styled.div`
    width: 100%;
    height: 100%;
    top: 0%;
    left: 0%;
    position: fixed;
    background: black;
    opacity: 90%;
    z-index: 10;
    background: #a9a9a9;
  `;
  //================關閉直播區結束================

  // ========================coupon開始========================

  function getCoupon() {
    fetch(`https://www.domingoos.store/api/1.0/user/${paramId}/coupons`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((res) => setCoupon(res.data));
  }

  // ========================coupon結束========================

  // ========================許願清單開始========================

  function getWishList() {
    fetch(`https://www.domingoos.store/api/1.0/user/${paramId}/like`)
      .then((res) => res.json())
      .then((res) => setWish(res.data));
  }

  // ========================許願清單結束========================

  const btnList = () => {
    if (!userId) {
      return null;
    } else if (Number(paramId) === userId) {
      return (
        <>
          {profile.role_id[0] === 3 && !profile.liveStatus && (
            <LiveButton
              onClick={() => {
                authLive();
              }}
            >
              直播
            </LiveButton>
          )}
          {profile.role_id[0] === 3 && profile.liveStatus === 1 && (
            <LiveButton
              onClick={() => {
                closeLive();
                setIsLiveStreamingOn(false);
              }}
            >
              結束直播
            </LiveButton>
          )}
          <UploadVideoInputButton onClick={inputClick}>
            上傳
            <input
              ref={inputRef}
              id="video-input"
              type="file"
              className="file-uploader"
              data-target="file-uploader"
              accept="video/*"
              style={{ display: 'none' }}
            />
          </UploadVideoInputButton>
          <UploadVideoButton onClick={uploadVideo} id="video-btn">
            提交
          </UploadVideoButton>
          <LogoutButton
            onClick={() => {
              window.localStorage.removeItem('jwtToken');
              window.localStorage.removeItem('user');
              setIsLoggedIn(false);
              disconnectWs();
              navigate('/login');
            }}
          >
            登出
          </LogoutButton>
        </>
      );
    } else if (Number(paramId) !== userId) {
      return (
        <>
          {profile.liveStatus === 1 && <LiveButton onClick={openVideo}>點此看直播</LiveButton>}
          {followStatus === false && <LiveButton onClick={updateFollowList}>追蹤</LiveButton>}
          {followStatus === true && <LiveButton>已追蹤</LiveButton>}
        </>
      );
    }
  };

  return (
    <>
      <Wrapper>
        {videoZone === 'block' && (
          <>
            <VideoRealOutside>
              <MemoVideoLoad closeVideo={closeVideo} videoUrl={profile.liveUrl} name={profile.name} />
              <VideoProducts />
            </VideoRealOutside>
            <VideoBackground />
          </>
        )}
        <UserMainColumn position={isLoggedIn}>
          {profile && (
            <UserWrapper>
              <UserInfoWrapper>
                <Photo src={profile.picture || personhead} onClick={openVideo} $status={profile.liveStatus} />
                <NameButton>
                  <NameFollowers>
                    <Name>{profile.name}</Name>
                    <Followers>
                      <FollowersTitle>粉絲數量</FollowersTitle>
                      <FollowersNumbers>{followerNumber}</FollowersNumbers>
                    </Followers>
                  </NameFollowers>
                  <ButtonWrapper>{btnList()}</ButtonWrapper>
                </NameButton>
              </UserInfoWrapper>
            </UserWrapper>
          )}
          {showLiveAlert && (
            <LiveStreamingAlert
              setShowLiveAlert={setShowLiveAlert}
              setIsLiveStreamingOn={setIsLiveStreamingOn}
              setShowMask={setShowMask}
              openLive={openLive}
              liveKey={liveKey}
              url={url}
            />
          )}

          {author === 1 && (
            <DailyTaskReminder>
              <ProgressWrapper>
                {gameProgress &&
                  gameProgress.map((record, index) => {
                    {
                      if (record === 1 && index === today)
                        return (
                          <Today>
                            <ProgressChecked>
                              <ProgressInnerChecked />
                            </ProgressChecked>
                            <TodayText>Today</TodayText>
                          </Today>
                        );
                      else if (record === 0 && index === today)
                        return (
                          <Today>
                            <Progress>
                              <ProgressInner />
                            </Progress>
                            <TodayText>Today</TodayText>
                          </Today>
                        );
                      else if (record === 0 && index < today)
                        return (
                          <ProgressPassed>
                            <ProgressInnerPassed />
                          </ProgressPassed>
                        );
                      else if (record === 0 && index >= today)
                        return (
                          <Progress>
                            <ProgressInner />
                          </Progress>
                        );
                      else if (record === 1)
                        return (
                          <ProgressChecked>
                            <ProgressInnerChecked />
                          </ProgressChecked>
                        );
                    }
                  })}
              </ProgressWrapper>
            </DailyTaskReminder>
          )}
          <Tabs
            onClick={(e) => {
              if (author === 1) tabSwitched(e.target.id);
              else tabCustomSwitched(e.target.id);
            }}
          >
            {author === 1 && (
              <>
                <Tab id="task" $bgColor={tabSelected.task}>
                  每日任務
                </Tab>
                <Tab id="reels" $bgColor={tabSelected.reels}>
                  Reels
                </Tab>
                <Tab id="wishList" $bgColor={tabSelected.wishList} onClick={getWishList}>
                  心願清單
                </Tab>
                <Tab id="coupon" $bgColor={tabSelected.coupon} onClick={getCoupon}>
                  Coupon
                </Tab>
              </>
            )}
            {author !== 1 && (
              <>
                <Tab id="reels" $bgColor={tabCustomSelected.reels}>
                  Reels
                </Tab>
                <Tab id="wishList" $bgColor={tabCustomSelected.wishList} onClick={getWishList}>
                  心願清單
                </Tab>
              </>
            )}
          </Tabs>

          {tabSelected.task && author === 1 && gameProgress && gameProgress[today] === 0 ? (
            <>
              <GameWrapper>
                <Game setGameProgress={setGameProgress} userId={userId} jwtToken={jwtToken} setShowMask={setShowMask} />
              </GameWrapper>
              <MonsterOutside>
                <MonsterTitle> 玩遊戲即可獲得小驚喜喔～</MonsterTitle>
                <MonsterBodyZone>
                  <Monster />
                </MonsterBodyZone>
              </MonsterOutside>
            </>
          ) : tabSelected.task && author === 1 && gameProgress && gameProgress[today] === 1 ? (
            <GameCompleted>今日任務已完成</GameCompleted>
          ) : (author === 1 && tabSelected.reels) || (author !== 1 && tabCustomSelected.reels) ? (
            <ReelsPage Reels={Reels} ReelPageAdd={ReelPageAdd} ReelPageReduce={ReelPageReduce} />
          ) : (author === 1 && tabSelected.wishList) || (author !== 1 && tabCustomSelected.wishList) ? (
            <WishPage wish={wish} />
          ) : tabSelected.coupon && author === 1 ? (
            <CouponPage coupon={coupon} />
          ) : null}
        </UserMainColumn>
      </Wrapper>
    </>
  );
}

export default Profile;
