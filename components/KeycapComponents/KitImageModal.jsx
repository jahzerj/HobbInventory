import { createPortal } from "react-dom";
import Image from "next/image";
import styled from "styled-components";
import CloseButtonIcon from "../icons/ClosebuttonIcon";

export default function KitImageModal({ open, onClose, imageUrl, kitName }) {
  if (!open) return null;

  // Ensure the component works even if given a kit object instead of direct URL
  // (handles potential changes in how the component is called)
  const imageSource =
    typeof imageUrl === "object" ? imageUrl.image || imageUrl.pic : imageUrl;

  return createPortal(
    <>
      <Overlay />
      <ModalWrapper>
        <CloseButton onClick={onClose} aria-label="Close Image">
          <CloseButtonIcon />
        </CloseButton>
        <h2>{kitName}</h2>
        <ImageContainer>
          <StyledImage
            src={imageSource}
            alt={kitName}
            width={400}
            height={225}
            sizes="(min-width: 768px) 640px, 400px"
            priority
          />
        </ImageContainer>
      </ModalWrapper>
    </>,
    document.getElementById("portal")
  );
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  width: 400px;
  height: 225px;

  @media (min-width: 768px) {
    width: 640px;
    height: 320px;
  }
`;

const ModalWrapper = styled.section`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  z-index: 1001;
  border-radius: 10px;
  width: 350px;
  max-height: 90vh;
  overflow: hidden;

  @media (min-width: 768px) {
    width: 680px;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 24px;
  z-index: 1002;
`;
