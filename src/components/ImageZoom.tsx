import React, { JSXElementConstructor, ReactElement, ReactNode, useRef } from 'react'
import styles from "./ImageZoom.module.css";
import PropTypes from "prop-types";
import cx from "classnames";




interface IImageZoomProps {
  imageURL: string;
  zoomImageURL?: string;
  placement?: string;
  imageSize?: any
  zoomedImageSize?: any
  isActive?: boolean;
  zoomType?: string;
  onZoom?: () => void;
  onClose?: () => void;

}

export const ImageZoom: React.FC<IImageZoomProps> = (props: IImageZoomProps) => {

  let normalImageRef = useRef<HTMLElement>(null);
  let zoomedImageRef = useRef<any>(null);

  ImageZoom.propTypes = {
    imageURL: PropTypes.string.isRequired,
    zoomImageURL: PropTypes.string.isRequired,
    placement: PropTypes.oneOf([
      "top-left",
      "top-right",
      "bottom-left",
      "bottom-right",
      "center"
    ]).isRequired,
    imageSize: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }),
    zoomedImageSize: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired
    }),
    isActive: PropTypes.bool.isRequired,
    onZoom: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    zoomType: PropTypes.oneOf(["click", "hover"]).isRequired
  };

  ImageZoom.defaultProps = {
    zoomImageURL: "",
    placement: "top-right",
    imageSize: {
      width: 300,
      height: 300
    },
    zoomedImageSize: {
      width: 600,
      height: 600
    },
    isActive: false,
    zoomType: "hover"
  };

  const normalImageStyle = {
    backgroundImage: `url(${props.imageURL})`,
    backgroundSize: `${props.imageSize.width}px ${props.imageSize.height}px`,
    width: `${props.imageSize.width}px`,
    height: `${props.imageSize.height}px`
  };

  const zoomedImageStyle = {
    backgroundImage: `url(${props.zoomImageURL || props.imageURL})`,
    backgroundSize:
      props.zoomType === "click"
        ? `${props.zoomedImageSize.width}px ${props.zoomedImageSize.height}px`
        : `${props.zoomedImageSize.width * 1.5}px ${props.zoomedImageSize.height * 1.5}px`,
    backgroundRepeat: "no-repeat",
    width: `${props.zoomedImageSize.width}px`,
    height: `${props.zoomedImageSize.height}px`
  };

  const openZoom = (e: any) => {
    if (zoomedImageRef.current) {
      moveLens(e);
    }

    const { onZoom } = props;
    onZoom && onZoom();
  };

  //Hide image
  const closeZoom = () => {
    const { onClose } = props;
    onClose && onClose();
  };


  const eventType =
    props.zoomType === "click"
      ? {
        onClick: props.isActive ? closeZoom : openZoom
      }
      : {
        onMouseMove: openZoom,
        onMouseLeave: closeZoom,
        onTouchMove: openZoom,
        onTouchEnd: closeZoom,
        onTouchCancel: closeZoom
      };

  //Show image

  //Get cursor position
  const getCursorPos = (e: React.MouseEvent<HTMLElement>): any => {
    let a,
      x = 0,
      y = 0;
    e = e || window.event;

    /* Get the x and y positions of the image: */
    a = normalImageRef.current?.getBoundingClientRect();

    /* Calculate the cursor's x and y coordinates, relative to the image: */
    if (a !== undefined) {
      x = e.pageX - a.left;
      y = e.pageY - a.top;
    }

    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;

    return { x: x, y: y };
  };

  //Focus over the zommed image
  const moveLens = (e: React.MouseEvent<HTMLElement>): any => {
    const viewArea = zoomedImageRef.current;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();

    /* Get the cursor's x and y positions: */
    const { x, y } = getCursorPos(e);

    //Move the zoomed image
    if (viewArea != undefined) {
      return viewArea.style.backgroundPosition = `-${x}px -${y}px`;
    }
  };


  return (
    <>
      {/* Actual Image */}
      <div
        className={cx(styles.normalImage, {
          [styles.zoomOutCursor]: props.isActive
        })}
        style={normalImageStyle}
        ref={normalImageRef as any}
        {...eventType}
      >
        {/* Zoomed Image View Area */}
        {props.isActive && (
          <div
            className={cx(styles.zoomedImage, styles[props.placement as any])}
            style={zoomedImageStyle}
            ref={zoomedImageRef as any}
          ></div>
        )}
      </div>
    </>
  );
}




