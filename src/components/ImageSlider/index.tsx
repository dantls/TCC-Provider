import React from 'react';

import {Container,
  ImageIndex,
  ImageIndexes,
  CarImageWrapper,
  CarImage,

} from './styles';

interface Props {
  imagesUrl: string;
}


export function ImageSlider({imagesUrl}:Props){
  return(
    <Container>
      {/* <ImageIndexes>
        <ImageIndex active={true}/>
        <ImageIndex active={false}/>
        <ImageIndex active={false}/>
      </ImageIndexes> */}

      <CarImageWrapper>
        <CarImage 
          source={{uri: imagesUrl }}
          resizeMode="contain"
        />
      </CarImageWrapper>
    </Container>

  )
}