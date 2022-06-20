import React from 'react';
import Tilty from 'react-tilty';
import brain from './brain.png'
import './Logo.css'


function Logo(props) {
    return (
        <div className={'ma4 mt0'}>
            <Tilty className={'Tilt br2 shadow-2'} option={{max:20}} style={{height:250, width:250}}>
                <div className={"Tilt-inner pa3"}>
                    <img alt={'logo'} src={brain} style={{paddingTop:'5px'}}/>
                </div>
            </Tilty>
        </div>
    );
}

export default Logo;