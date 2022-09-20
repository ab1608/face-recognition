import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = (props) => {
    const {box, imageUrl} = props;
    return (
        <div className={'center ma'}>
            <div className={'absolute mt2'}>
                <img id='input-image' alt={'Detect'} src={`${imageUrl}`} width={'500px'} height={'auto'}/>
                <div className={'bounding-box'}
                     style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>
    );
};

export default FaceRecognition;
