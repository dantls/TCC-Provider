import React from 'react';
import {MaterialIcons} from '@expo/vector-icons';
import {TouchableOpacityProps} from 'react-native';

import {
  Container,
} from './styles';

interface Props extends TouchableOpacityProps{
  color?: string;
}

export function BackButton({color,...rest}: Props) {
  return (
      <Container {...rest }>
        <MaterialIcons 
          name="chevron-left"
          size={24}
          color={color}
        />
      </Container>

  )

}
