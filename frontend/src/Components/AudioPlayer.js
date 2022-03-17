//Created by: Byron Georgopoulos
//Created on: 31/10/2021
//Last Modified on: 01/02/2022
/*Description: Bottom Nav Audio Player Component*/

import React from 'react';

//Audio Player Package
import ReactAudioPlayer from 'react-audio-player';

import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class AudioPlayer extends React.Component {

    constructor (props)
    {
        super(props);
        this.state = {
            // trackCount: 0,
            trackArr: [],
        };
    };

    // componentDidMount = () => {
    //     console.log('CDM');
    // };

    render ()
    {
        let trackArr = this.props.trackArr;
        let trackName = trackArr.name;
        
        //Slices extra characters off of track names of they're too long
        if (trackName !== undefined && trackName.length > 39)
        {
            trackName = trackName.slice(0,40) + '...';
        }

        let trackArtist = trackArr.artist;
        let trackCol = trackArr.col;
        let trackDesc = '';

        //Slices extra characters off of artist and collection (album) names if they're too long
        if (trackArtist && trackCol !== undefined && (trackArtist.length + trackCol.length) > 45)
        {
            let desc = trackArtist + ' | ' + trackCol;
            trackDesc = desc.slice(0,47) + '...';
        }
        if (trackArtist && trackCol !== undefined && (trackArtist.length + trackCol.length) <= 45)
        {
            trackDesc = trackArtist + ' | ' + trackCol;
        }  
        
        let trackArtwork = trackArr.artwork;
        let trackPreview = trackArr.preview;

        return (
            <div className='App'>
                <Navbar fixed='bottom' style={{ backgroundColor: '#1A1A1A', height: '60px', color: 'white' }} >

                    <div style={{ width: '450px', textAlign: 'left', float: 'left' }} >
                        <Image src={trackArtwork} style={{ width: '50px', textAlign: 'left', float: 'left', marginLeft: '20px' }} />
                        <div style={{ fontSize: '18px', marginLeft: '40px', paddingLeft: '40px' }} >
                            {trackName}
                        </div>
                        <div style={{ fontSize: '15px', marginLeft: '40px', paddingLeft: '40px' }} >
                            {trackDesc}
                        </div>
                    </div>

                    <ReactAudioPlayer src={trackPreview} autoPlay controls={true} style={{ width: '500px', textAlign: 'center', float: 'center', marginLeft: 'auto', marginRight: 'auto' }} />

                        <Row style={{ width: '450px' ,marginRight: '20px', textAlign: 'right', float: 'right', paddingLeft: '142.5px' }} >
                            <Col sm={3} style={{ textAlign: 'right', float: 'right', marginRight: '0px', paddingRight: '7.5px' }} >
                                 <Image style={{ width: '50px' }} src='https://upload.wikimedia.org/wikipedia/commons/d/df/ITunes_logo.svg' />
                            </Col>
                            <Col sm={9} style={{ fontSize: '20px', paddingTop: '10px', textAlign: 'left', float: 'left', marginLeft: '0px', paddingLeft: '0px', marginRight: '0px', paddingRight: '0px' }} >
                                Powered by the iTunes API
                            </Col>
                        </Row>

                </Navbar>
            </div>
        );
    };
};

export default AudioPlayer;