import React, { useState,useEffect } from 'react';
import {StatusBar} from 'expo-status-bar';
import Icon from 'react-native-vector-icons/Feather';
import {
  Container,
  Content,
  SectionTitle,
  ServicesTime,
  ServicesTimeContainer,
  ServicesMetaText,
} from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackButton } from '@src/components/BackButton';
import { TextArea } from '@src/components/TextArea';
import api from '@src/services/api';
import { Service } from '../Schedules';

interface RouteParams {
  idprovider: string;
  idservice: string;
}


export function AppointmentDetail(){
  const route = useRoute();
  const {goBack} = useNavigation();

  const routeParams = route.params as RouteParams;
  const [service, setService] = useState<Service>({} as Service);

  const handleNavigateBack = () => {
     goBack();
  }

  async function loadData(){

    const responseServices = await api.post("/service/read/", {
      id: String(routeParams.idservice)
    }); 

    setService(responseServices.data?.service);
 
  }

  useEffect(() => {
    loadData();
  },[])

  return (
  <>
    <StatusBar style="light"  backgroundColor="transparent" translucent/>

    <Container>
      <BackButton 
        onPress={handleNavigateBack}
        color="#fff"
      />

      <Content>

          <ServicesTimeContainer>
            <ServicesTime>
                <Icon name="calendar" size={24} color="#FF9000" />
                <ServicesMetaText>
                  {service.dateservice}
                </ServicesMetaText>
            </ServicesTime>  
            <ServicesTime>  
                <Icon name="clock" size={24} color="#FF9000" />
                <ServicesMetaText>
                  {service.timeservice}
                </ServicesMetaText>
            </ServicesTime>   
          </ServicesTimeContainer>


          <SectionTitle>Tipo do serviço</SectionTitle>
        
          <TextArea
            multiline
            maxLength={100}
            numberOfLines={5}
            autoCorrect={false}
            value={service.typeservice}
          />
          <SectionTitle>Descrição do serviço</SectionTitle>
          <TextArea
            multiline
            maxLength={100}
            numberOfLines={5}
            autoCorrect={false}
            value={service.description}
          />
          <SectionTitle>Local do serviço</SectionTitle>
          <TextArea
            multiline
            maxLength={100}
            numberOfLines={5}
            autoCorrect={false}
            value={service.localservice}
          />
      </Content>
    </Container>
  </>
  );
}