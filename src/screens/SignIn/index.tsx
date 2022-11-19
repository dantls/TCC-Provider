import React, {useState} from 'react'; 
import {Alert} from 'react-native';
import { Input } from '@components/Input';
import { useAuth } from '../../hooks/auth';
import { Button } from '@components/Button';
import { useNavigation } from '@react-navigation/native';

import { KeyboardAvoidingView, Platform } from 'react-native';
import {
  Container,
  Content,
  Title,
  Brand,
  CreateAccountButton,
  CreateAccountButtonText,
  ForgotPasswordLabel,
  ForgotPasswordButton
} from './styles';


// import brandImg from '@assets/brand.png';

export function SignIn(){
  const { navigate } = useNavigation();
  const { signIn } = useAuth();

  const [email,setEmail]  = useState('');
  const [password,setPassword]  = useState('');

  function handleRegister(){
    try{
      signIn({email, password});
    }catch(error){
      Alert.alert('Usuário/Senha incorretos.');
    }
  }

  return(
    <Container>
       <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding': undefined}
        >
          <Content>
            {/* <Brand source={brandImg}/> */}
            <Title>Prestadores</Title>
            <Title>Faça seu Login</Title>
            <Input 
              placeholder="E-mail"
              type="secondary"
              autoCorrect = {false}
              autoCapitalize = "none"
              onChangeText={setEmail}
            />
            <Input 
              placeholder="Senha"
              type="secondary"
              secureTextEntry
              onChangeText={setPassword}

            />
            <Button 
              title="Entrar"
              type="secondary"
              onPress={handleRegister}
            />

            {/* <ForgotPasswordButton>
              <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
            </ForgotPasswordButton> */}

            {/* <CreateAccountButton
              onPress={() => {
                navigate('User');
              }}
            >
              <CreateAccountButtonText>Criar uma conta</CreateAccountButtonText>
            </CreateAccountButton> */}
          
        </Content>
      </KeyboardAvoidingView>
    </Container>
  )
}