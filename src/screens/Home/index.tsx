import { Header } from '@src/components/Header/Index';
import { useAuth } from '@src/hooks/auth';
import React,{useEffect, useState} from 'react'; 
import { KeyboardAvoidingView, Platform ,RefreshControl} from 'react-native';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  ServicesList,
  ServicesContainer,
  ServicesTimeContainer,
  ServicesInfo,
  ServicesName,
  ServicesMeta,
  ServicesText,
  ServicesTime,
  ServicesMetaText,
  ServicesListTitle,
 
} from './styles';

export interface Service {
  id: number;
  idprovider: string;
  localservice: string;
  dateservice: string;
  timeservice: string;
  typeservice: string;
}


export function Home({ navigation }){
  const { user } = useAuth();

  const [services, setServices] = useState<Service[]>([]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setServices([]);
    loadData();
  };
  
  async function loadData(){

    const responseServices = await api.post("service/getservicebyprovider/", {idprovider: String(user.id)}); 

    const {service} = responseServices.data;

    setServices(service);

    setRefreshing(false);

  }

  useEffect(() => {
    loadData();
  },[])
  return(

        <Container>
          <Header />
          {/* <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding': undefined}
            > */}
              <ServicesList
                  data={services}
                  keyExtractor={service => String(service.id)}
                  ListHeaderComponent={
                    <ServicesListTitle>Serviços do dia</ServicesListTitle>
                  }
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  renderItem={({ item: service }) => (
                    <ServicesContainer
                        // onPress={() => navigateToCreateAppointment(provider.id)}
                      >
                        <ServicesInfo>
                          <ServicesName>{service.typeservice}</ServicesName> 
                          <ServicesMeta>
                          </ServicesMeta>       
                          <ServicesText>{service.description}</ServicesText>               
                                            
                            
                        </ServicesInfo>
                        
                        <ServicesTimeContainer>
                          <ServicesTime>
                              <Icon name="calendar" size={14} color="#FF9000" />
                              <ServicesMetaText>{service.dateservice}</ServicesMetaText>
                          </ServicesTime>  
                          <ServicesTime>  
                              <Icon name="clock" size={14} color="#FF9000" />
                              <ServicesMetaText>{service.timeservice}</ServicesMetaText>
                          </ServicesTime>   
                        </ServicesTimeContainer>
                    
                      </ServicesContainer>
                  )}
                />
            
              
            {/* </KeyboardAvoidingView> */}
        </Container>
  )
}