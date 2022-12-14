import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import logo from "./logo.png";
import search from "./search.png";
import cart from "./cart.png";
import cartMobile from "./cart-mobile.png";
import profile from "./profile.png";
import profileMobile from "./profile-mobile.png";
import CartContext from "../../contexts/CartContext";
import follow from "./follower.png";
import bell from "./bell.png";
import personhead from "./personhead.png";
import api from "../../utils/api";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 140px;
  width: 100%;
  padding: 0 24px 0 60px;
  border-bottom: 40px solid #313538;
  z-index: 9;
  background-color: white;
  display: flex;
  align-items: center;
  font-family: PingFangTC;

  @media screen and (max-width: 1279px) {
    height: 52px;
    padding: 0;
    border: none;
  }
`;
const Logo = styled(Link)`
  width: 230px;
  height: 48px;
  margin-top: 10px;
  background-image: url(${logo});
  background-size: contain;
  background-repeat: no-repeat;

  @media screen and (max-width: 1279px) {
    width: 129px;
    height: 24px;
    margin: 0px 0px 0px 25px;
  }
`;
const CategoryLinks = styled.div`
  margin: 16px 0 0 20px;

  @media screen and (max-width: 1279px) {
    margin: 0;
    position: fixed;
    top: 52px;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    background-color: #313538;
  }
`;
const CategoryLink = styled(Link)`
  font-size: 20px;
  letter-spacing: 30px;
  padding-left: 30px;
  padding-right: 1px;
  position: relative;
  text-decoration: none;
  color: ${(props) => (props.$isActive ? "#8b572a" : "#3f3a3a")};

  @media screen and (max-width: 1279px) {
    font-size: 16px;
    letter-spacing: normal;
    padding: 0;
    text-align: center;
    color: ${(props) => (props.$isActive ? "white" : "#828282")};
    line-height: 50px;
    flex-grow: 1;
  }

  &:hover {
    color: #8b572a;

    @media screen and (max-width: 1279px) {
      color: white;
    }
  }

  & + &::before {
    content: "|";
    position: absolute;
    left: 0;
    color: #3f3a3a;

    @media screen and (max-width: 1279px) {
      color: #828282;
    }
  }
`;
const SearchWrapper = styled.div`
  position: relative;
  @media screen and (max-width: 1279px) {
    position: absolute;
    z-index: 1;
    width: 100%;
  }
`;
const SearchInput = styled.input`
  width: 280px;
  height: 44px;
  border: none;
  outline: none;
  border: solid 1px #979797;
  color: #8b572a;
  border-radius: 20px;
  background-repeat: no-repeat;
  font-size: 20px;
  line-height: 24px;
  background-position: 230px;
  padding: 6px 45px 6px 80px;

  @media screen and (max-width: 1279px) {
    position: absolute;
    display: ${(props) => props.display};
    width: calc(100% - 30px);
    margin-left: 20px;
    border: solid 1px #979797;
    padding-left: 80px;
    top: -22px;
  }
`;
const SerachIcon = styled.div`
  background-image: url(${search});
  width: 44px;
  height: 44px;
  position: absolute;
  top: 0;
  right: 0;
  @media screen and (max-width: 1279px) {
    top: -22px;
    right: 10px;
  }
`;
const SearchSelect = styled.select`
  width: 70px;
  height: 44px;
  border: solid 1px #979797;
  padding-left: 10px;
  background-color: #f3efef;
  border-radius: 20px 0px 0px 20px;
  position: absolute;
  margint-right: 20px;
  @media screen and (max-width: 1279px) {
    display: ${(props) => props.display};
    z-index: 5;
    left: 20px;
    top: -22px;
  }
`;
const SearchSelectOption = styled.option``;
const UserSearchResults = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  position: absolute;
  top: 50px;
  left: 0;
  background-color: #ffdbd1;
  padding: 10px;
  @media screen and (max-width: 1279px) {
    width: calc(100% - 30px);
    top: 26px;
    left: 20px;
  }
`;
const UserSearchResultsCloseBtn = styled.button`
  display: inline-block;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 18px;
  background-color: #eee;
  border: 1px solid #aaa;
  align-self: flex-end;
  position: absolute;
`;
const UserSearchResult = styled(Link)`
  display: flex;
  align-items: center;
  color: #000;
  text-decoration: none;
  width: 100%;
  margin-bottom: 10px;
  &:not(:last-child) {
    border-bottom: 1px dashed #e27d60;
  }
`;
const UserSearchResultPicture = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;
const UserSearchResultName = styled.div`
  border-radius: 50%;
`;
const TrackIcon = styled.div`
  margin-right: 15px;
  background-image: url(${follow});
  width: 36px;
  height: 36px;
  cursor: pointer;
  background-size: contain;
  position: relative;
  @media screen and (max-width: 1279px) {
    position: fixed;
    right: 120px;
    margin-right: 0px;
  }
`;
const BellIcon = styled.div`
  margin-right: 20px;
  background-image: url(${bell});
  width: 36px;
  height: 36px;
  cursor: pointer;
  background-size: contain;
  position: relative;
  @media screen and (max-width: 1279px) {
    position: fixed;
    right: 50px;
  }
`;
const BellIconAlert = styled.div`
  width: 15px;
  height: 15px;
  background: red;
  position: absolute;
  border-radius: 50%;
  bottom: 0px;
  right: 0px;
`;
const PageLinks = styled.div`
  margin-left: auto;
  display: flex;
  align-item: center;
  justify-content: center;

  @media screen and (max-width: 1279px) {
    width: 100%;
    margin-left: 0;
    height: 60px;
    position: fixed;
    z-index: 5;
    left: 0;
    bottom: 0;
    background-color: #313538;
  }
`;
const PageLink = styled(Link)`
  @media screen and (max-width: 1279px) {
    width: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  & + & {
    ${"" /* margin-left: 42px; */}
    margin-right: 15px;

    @media screen and (max-width: 1279px) {
      margin-left: 0;
    }
  }

  & + &::before {
    @media screen and (max-width: 1279px) {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 24px;
      background-color: #828282;
    }
  }
`;
const PageLinkDiv = styled.div`
  @media screen and (max-width: 1279px) {
    width: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  & + & {
    @media screen and (max-width: 1279px) {
      margin-left: 0;
    }
  }

  & + &::before {
    @media screen and (max-width: 1279px) {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 24px;
      background-color: #828282;
    }
  }
`;
const PageLinkIcon = styled.div`
  width: 44px;
  height: 44px;
  cursor: pointer;
  background-size: contain;
  position: relative;
`;
const PageLinkCartIcon = styled(PageLinkIcon)`
  margin-right: 15px;
  background-image: url(${cart});

  @media screen and (max-width: 1279px) {
    background-image: url(${cartMobile});
  }
`;
const PageLinkProfileIcon = styled(PageLinkIcon)`
  background-image: url(${profile});
  margin-right: 15px;

  @media screen and (max-width: 1279px) {
    background-image: url(${profileMobile});
    margin-right: 0px;
  }
`;
const PageLinkIconNumber = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24px;
  height: 24px;
  background-color: #8b572a;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 24px;
`;
const PageLinkText = styled.div`
  display: none;

  @media screen and (max-width: 1279px) {
    display: block;
    color: white;
  }
`;
const categories = [
  {
    name: "women",
    displayText: "??????",
  },
  {
    name: "men",
    displayText: "??????",
  },
  {
    name: "accessories",
    displayText: "??????",
  },
];

function Header({ switchSidebar, setSwitchSidebar, isLoggedIn }) {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const { getItems } = useContext(CartContext);
  const [mobileSearch, setMobileSearch] = useState("none");
  let jwtToken = localStorage.getItem("jwtToken");
  let user = JSON.parse(localStorage.getItem("user"));
  const [searchType, setSearchType] = useState("product");
  function sidebarToggle(target) {
    let defaultCondition = { followList: "none", notification: "none" };
    if (switchSidebar[target] === "none") defaultCondition[target] = "block";
    else if (switchSidebar[target] === "block")
      defaultCondition[target] = "none";
    setSwitchSidebar(defaultCondition);
  }

  function mobileSearchToggle() {
    if (mobileSearch === "none") setMobileSearch("block");
    else if (mobileSearch === "block") setMobileSearch("none");
  }

  function handleProfileClick() {
    if (jwtToken) navigate(`/profile/${user.id}`);
    else navigate("/login");
  }

  function handleSearchTypeChange(e) {
    setSearchType(e.value);
  }

  useEffect(() => {
    if (category) setInputValue("");
  }, [category]);

  const [searchUserData, setSearchUserData] = useState();

  async function handleSearchKeyPress() {
    let type = searchType;
    if (type === "product") navigate(`/?keyword=${inputValue}`);
    else if (type === "account") {
      const { data } = await api.searchUsers(inputValue);
      setSearchUserData(data);
    }
  }

  function logInReminder() {
    if (!isLoggedIn) alert("???????????????");
  }

  return (
    <Wrapper>
      <Logo to="/" />
      <CategoryLinks>
        {categories.map(({ name, displayText }, index) => (
          <CategoryLink
            to={`/?category=${name}`}
            $isActive={category === name}
            key={index}
          >
            {displayText}
          </CategoryLink>
        ))}
      </CategoryLinks>
      <PageLinks>
        <PageLink to="/checkout">
          <PageLinkCartIcon icon={cart}>
            <PageLinkIconNumber>{getItems().length}</PageLinkIconNumber>
          </PageLinkCartIcon>
          <PageLinkText>?????????</PageLinkText>
        </PageLink>
        <PageLinkDiv onClick={handleProfileClick}>
          <PageLinkProfileIcon icon={profile} />
          <PageLinkText>??????</PageLinkText>
        </PageLinkDiv>
      </PageLinks>
      <TrackIcon
        icon={follow}
        onClick={() => {
          sidebarToggle("followList");
          logInReminder();
        }}
      />
      <BellIcon
        icon={bell}
        onClick={() => {
          sidebarToggle("notification");
          logInReminder();
        }}
      >
        {/* if notice.find -> msg.read === 0 */}
        {/* { && <BellIconAlert />} */}
      </BellIcon>
      <SearchWrapper>
        <SearchSelect
          display={mobileSearch}
          onChange={(e) => handleSearchTypeChange(e.target)}
        >
          <SearchSelectOption value="product">??????</SearchSelectOption>
          <SearchSelectOption value="account">??????</SearchSelectOption>
        </SearchSelect>
        <SearchInput
          display={mobileSearch}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearchKeyPress();
            }
          }}
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        ></SearchInput>
        <SerachIcon onClick={mobileSearchToggle} />
        {searchUserData && (
          <UserSearchResults>
            <UserSearchResultsCloseBtn
              onClick={() => {
                setSearchUserData();
                setInputValue("");
              }}
            >
              x
            </UserSearchResultsCloseBtn>
            {searchUserData &&
              searchUserData.map((user) => {
                return (
                  <UserSearchResult
                    key={user.id}
                    to={`/profile/${user.id}`}
                    onClick={() => setSearchUserData()}
                  >
                    <UserSearchResultPicture src={user.picture || personhead} />
                    <UserSearchResultName>{user.name}</UserSearchResultName>
                  </UserSearchResult>
                );
              })}
          </UserSearchResults>
        )}
      </SearchWrapper>
    </Wrapper>
  );
}

export default Header;
