// import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Gallery from 'react-grid-gallery';
import PropTypes from "prop-types";

const captionStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    maxHeight: "240px",
    overflow: "hidden",
    position: "absolute",
    bottom: "0",
    width: "100%",
    color: "white",
    padding: "2px",
    fontSize: "90%"
 };
 
 const wrapperStyle = {
    display: "block",
    minHeight: "1px",
    width: "100%",
    border: "1px solid #ddd",
    overflow: "auto"
 };


export default function PhotoGallery(props) {
    const {images} = props;
    const imageArr = images.map(img => {
        return {
            ...img,
            customOverlay: (
                <div style={captionStyle}>
                    <div>{`${img.id}:${img.title}`}</div>
                </div>
            )
        }
    });


  return (
    <div style={wrapperStyle}>
        <Gallery
            images={imageArr}
            enableImageSelection={false}
            backdropClosesModal={true}
        />
    </div>

  )
}


PhotoGallery.propTypes = {
    images: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            thumbnail: PropTypes.string.isRequired,
            thumbnailWidth: PropTypes.number.isRequired,
            thumbnailHeight: PropTypes.number.isRequired,
        })
    ).isRequired
};
 

 
