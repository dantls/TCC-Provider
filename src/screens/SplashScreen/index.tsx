import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react'
import {ActivityIndicator}from 'react-native';
import {Container} from './styles'

export function SplashScreen() {
  const {reset} = useNavigation();
 
  useEffect(() => {
    setTimeout(() => {
      reset({
        routes: [
          { name: 'MainBottom'}
        ],
        index: 0
      })
    }, 2000)
  }, [reset])

  return (
    <Container>
      <ActivityIndicator size="large" color="#999"/>
    </Container>
  )
}