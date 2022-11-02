import { Button } from '@components/Button';
import { Input } from '@components/Input';
import React, { useState, useCallback } from 'react'; 
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { KeyboardAvoidingView } from 'react-native';
import {
  Container,
  Content,
  Title,
  UserAvatar,
  UserAvatarButton,
  BackButton
} from './styles';


import { useAuth } from '../../hooks/auth';


export function Profile(){

  const navigation = useNavigation();
  const { user } = useAuth();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  },[])

  function handleRegister(){
    const data = {
      id: user.id,
      name,
      email,
      phone
    }
    fetch("https://api-flash-services.herokuapp.com/src/Routes/user/update/", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
        body: JSON.stringify({
            "id": data.id,
            "name": data.name,
            "email": data.email,
            "phone": data.phone
        })
      })
      .then(()=>{
        navigation.navigate('Home')
      })
      .catch(err => {
          console.log("Error occurred: " + err);
      })

  }

  const [name,setName]  = useState('');
  const [email,setEmail]  = useState('');
  const [phone,setPhone]  = useState('');


  return(
    <Container>
       <KeyboardAvoidingView>
          <Content>
            <BackButton
              onPress={handleGoBack}
            >
                <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <Title>Perfil</Title>
            
            

            <UserAvatarButton>
              <UserAvatar source={{uri: user.photo}}/>
            </UserAvatarButton>
            <Input 
              placeholder="Nome"
              type="secondary"
              value={user.name}
              autoCorrect = {false}
              autoCapitalize = "none"
              onChangeText={setName}
            />
            <Input 
             placeholder="E-mail"
             type="secondary"
             value = {user.email}
             autoCorrect = {false}
             autoCapitalize = "none"
             onChangeText={setEmail}
            />
            <Input 
             placeholder="Celular"
             type="secondary"
             value = {user.phone}
             autoCorrect = {false}
             autoCapitalize = "none"
             onChangeText={setPhone}
            />
          
           
           
            <Button 
              title="Salvar"
              type="secondary"
              onPress={handleRegister}
            />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  )
}