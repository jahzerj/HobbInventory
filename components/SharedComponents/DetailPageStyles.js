import styled from "styled-components";
import Link from "next/link";

export const DetailPageContainer = styled.div`
  max-width: 900px;
  margin: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-bottom: 60px;
  background-color: #ccc;
  position: relative;
`;

export const StyledLink = styled(Link)`
  position: fixed;
  top: 5px;
  right: 5px;
  text-decoration: none;
  color: white;
  background-color: #007bff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  font-size: 24px;
  height: 45px;
  width: 45px;
  z-index: 1000;

  &:hover {
    background-color: darkblue;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;
`;

export const HeaderImage = styled.div`
  width: 340px;
  height: 170px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);

  @media (min-width: 430px) {
    width: 387px;
    height: 195px;
  }

  @media (min-width: 600px) {
    width: 640px;
    height: 320px;
  }
`;

export const SectionHeading = styled.h3`
  margin: 24px 0 12px 0;
  align-self: center;
`;

export const BoxContainer = styled.ul`
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
  width: 90%;
  max-width: 430px;
  text-align: left;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  list-style-type: none;
`;

export const ExternalLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }
`;

export const AcceptCancelEditButtonContainer = styled.div`
  position: fixed;
  bottom: 10px;
  left: ${(props) =>
    props.$innerWidth > 400 && props.$isEditMode ? "" : "10px"};
  display: flex;
  gap: 10px;
  z-index: 1000;
  align-self: ${(props) =>
    props.$innerWidth > 600 && props.$isEditMode ? "center" : ""};
`;

export const StyledSpan = styled.span`
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const StyledInput = styled.input`
  width: 90%;
  max-width: ${(props) => props.$maxWidth || "430px"};
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: ${(props) => props.$bgColor || "#f9f9f9"};
  margin-bottom: 20px;
`;

export const BaseButton = styled.button`
  margin-top: ${(props) => props.margin || "10px"};
  padding: 8px 15px;
  background-color: ${(props) => props.$bgColor || "#28a745"};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: ${(props) => props.fontSize || "16px"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.hoverColor || "#218838"};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;
