import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faLine,
  faGoogle,
} from "@fortawesome/free-brands-svg-icons";
import getJwtToken from "../../utils/getJwtToken";
import api from "../../utils/api";

const LoginPanel = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: center;
  }
`;
const NativeLogInWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin-right: 40px;
  border-right: 1px solid #8b572a;
  padding-right: 10px;
  @media screen and (max-width: 1279px) {
    margin: 0px auto 40px auto;
    border-right: none;
  }
`;
const SwitchWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
`;
const Switch = styled.div`
  border-radius: 5px;
  margin-right: 10px;
  font-size: 18px;
  letter-spacing: 1px;
  border: 1px solid #8b572a;
  padding: 5px;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#fff" : "#8b572a")};
  background: ${(props) => (props.$active ? "#8b572a" : "#fff")};
`;
const InputWrapper = styled.div`
  diplay: flex;
  flex-direction: column;
  width: 100%;
`;
const Label = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
`;
const TextInput = styled.input`
  width: 100%;
  height: 30px;
  margin-bottom: 10px;
  padding-left: 5px;
  &:focus {
    background-color: #fbf3f2;
  }
`;
const NativeLogInBtn = styled.button`
  font-size: 14px;
  border: none;
  color: #fff;
  display: block;
  background-color: #8b572a;
  padding: 5px;
  cursor: pointer;
`;
const LoginBtnWrapper = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const LoginBtn = styled.div`
  width: 300px;
  height: 50px;
  text-align: center;
  border-radius: 30px;
  letter-spacing: 2px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const FbLoginBtn = styled(LoginBtn)`
  background-color: #1877f2;
  margin-bottom: 20px;
`;
const LineLoginBtn = styled(LoginBtn)`
  background-color: #00ba00;
  margin-bottom: 20px;
`;
const GoogleLoginBtn = styled(LoginBtn)`
  background-color: red;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: white;
  font-size: 30px;
  margin-right: 10px;
`;

function LogInPanel({ setProfile, setIsLoggedIn }) {
  const [switchSignIn, setSwitchSignIn] = useState(false);
  let navigate = useNavigate();
  let nameRef = useRef();
  let emailRef = useRef();
  let passwordRef = useRef();
  let passwordCheckRef = useRef();
  let emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  let passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*\d).{6,30}$/);
  const [tabSelected, setTabSelected] = useState({
    login: true,
    signin: false,
  });
  async function userSignIn() {
    if (passwordRef.current.value !== passwordCheckRef.current.value) {
      alert("???????????????");
      return;
    }
    if (!emailRegex.test(emailRef.current.value)) {
      alert("Invalid email form");
      return;
    } else if (!passwordRegex.test(passwordRef.current.value)) {
      alert("Password must be 6~30 numbers & lower case characters.");
      return;
    }
    const { data } = await api.signup({
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    window.localStorage.setItem("jwtToken", data.access_token);
    window.localStorage.setItem("user", JSON.stringify(data.user));
    setIsLoggedIn(true);
    setProfile(data.user);
    navigate(`../profile/${data.user.id}`, { replace: true });
  }
  async function userLogIn() {
    const { data } = await api.signin({
      provider: "native",
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    window.localStorage.setItem("jwtToken", data.access_token);
    window.localStorage.setItem("user", JSON.stringify(data.user));
    setIsLoggedIn(true);
    setProfile(data.user);
    navigate(`../profile/${data.user.id}`, { replace: true });
  }
  async function getProfile() {
    let jwtToken = window.localStorage.getItem("jwtToken");
    let userData;
    if (!jwtToken) {
      try {
        userData = await getJwtToken();
      } catch (e) {
        window.alert(e.message);
        return;
      }
    }
    window.localStorage.setItem("jwtToken", userData.access_token);
    window.localStorage.setItem("user", JSON.stringify(userData.user));
    setIsLoggedIn(true);
    setProfile(userData.user);
    navigate(`../profile/${userData.user.id}`, { replace: true });
  }
  function tabSwitched(target) {
    if (!target) return;
    let defaultTab = {
      login: false,
      signin: false,
    };
    defaultTab[target] = true;
    setTabSelected(defaultTab);
  }

  return (
    <LoginPanel>
      <NativeLogInWrapper>
        <SwitchWrapper onClick={(e) => tabSwitched(e.target.id)}>
          <Switch
            id="login"
            $active={tabSelected.login}
            onClick={() => {
              setSwitchSignIn(false);
            }}
          >
            ??????
          </Switch>
          <Switch
            id="signin"
            $active={tabSelected.signin}
            onClick={() => {
              setSwitchSignIn(true);
            }}
          >
            ??????
          </Switch>
        </SwitchWrapper>
        <InputWrapper>
          {switchSignIn && (
            <>
              <Label>??????</Label>
              <TextInput type="text" ref={nameRef} />
            </>
          )}
          <Label>????????????</Label>
          <TextInput type="text" ref={emailRef} />
          <Label>??????</Label>
          <TextInput type="password" ref={passwordRef} />
          {switchSignIn && (
            <>
              <Label>????????????</Label>
              <TextInput type="password" ref={passwordCheckRef} />
            </>
          )}
          {switchSignIn ? (
            <NativeLogInBtn onClick={userSignIn}>??????</NativeLogInBtn>
          ) : (
            <NativeLogInBtn onClick={userLogIn}>??????</NativeLogInBtn>
          )}
        </InputWrapper>
      </NativeLogInWrapper>
      <LoginBtnWrapper>
        <FbLoginBtn onClick={getProfile}>
          <StyledFontAwesomeIcon icon={faFacebook} />
          ???Facebook??????
        </FbLoginBtn>
        <LineLoginBtn>
          <StyledFontAwesomeIcon icon={faLine} />
          ???Line??????
        </LineLoginBtn>
        <GoogleLoginBtn>
          <StyledFontAwesomeIcon icon={faGoogle} />
          ???Google????????????
        </GoogleLoginBtn>
      </LoginBtnWrapper>
    </LoginPanel>
  );
}

export default LogInPanel;
