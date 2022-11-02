import React, { useCallback, useEffect,useState } from 'react'; 
import { Calendar,  DateData, MarkedDateProps } from '@src/components/Calendar';
import { generateMarked } from '@src/components/Calendar/generateMarked';
import { Alert, KeyboardAvoidingView, Platform ,View} from 'react-native';
import { BackButton } from '@src/components/BackButton';
import { Swipeable } from 'react-native-gesture-handler';
import { useAuth } from '@hooks/auth';
import {useTheme} from 'styled-components/native';
import {
  Container,
  RemoveButton,

  CalendarContainer,
  CalendarTitle,
  OpenDatePickerButton,
  OpenDatePickerText,


  ServicesList,
  ServicesContainer,
  ServicesAvatar,
  ServicesTimeContainer,
  ServicesInfo,
  ServicesName,
  ServicesMeta,
  ServicesText,
  ServicesTime,
  ServicesMetaText,
  ServicesListTitle,
 
} from './styles';
import api from '@src/services/api';
import Icon from 'react-native-vector-icons/Feather';
import { Feather } from '@expo/vector-icons';
import { Animated } from 'react-native';

export interface Service {
  id: number;
  iduser:string;
  idprovider: string;
  localservice: string;
  dateservice: string;
  timeservice: string;
  typeservice: string;
  description: string;
}

export function Schedules({ navigation }){
  const theme = useTheme();
  const {user} = useAuth(); 
  const [markedDate, setMarketDate] = useState<MarkedDateProps>({}as MarkedDateProps);
  const [selectedDate, setSelectedDate] = useState<DateData>(()=> {
    const data = new Date();
    return({
      year: data.getFullYear(),
      month: data.getMonth(),
      day: data.getDate(),
      timestamp: data.getTime(),
      dateString:`${String(data.getDate()).padStart(2,'0')}-${String(data.getMonth()+1).padStart(2,'0')}-${data.getFullYear()}`
    })
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [services, setServices] = useState<Service[]>([]);

  const handleToggleDatePicker = () => {
    setShowDatePicker((state) => !state);
  }

  const handleChangeDate = useCallback(async (date:DateData)=>{
    setMarketDate(generateMarked(date));

    const responseServices = await api.post("/service/getserviceprovider/", {
      idprovider: String(user.id),
      date: `${String(date.day).padStart(2,'0')}-${String(date.month).padStart(2,'0')}-${date.year}`,
    }); 

    const {service} = responseServices.data;

    setServices(service);

    setSelectedDate(date);

    handleToggleDatePicker();
    

  },[selectedDate])



  // useCallconst handleChangeDate = (date:DateData)=>{
  //   setSelectedDate(date)
  //   setMarketDate(generateMarked(date))
  //   const responseServices = await api.post("/service/getserviceprovider/", {
  //     idprovider: String(user.id)
  //   }); 

  //   const {service} = responseServices.data;

  //   setServices(service);
  // }

  async function handleRemove(service :Service) {
    Alert.alert('Remover',`Deseja remover a ${service.idprovider}?`,[
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: async ()=>{
          try {
            const responseServices = await api.post("/service/delete/", {id: String(service.id)}); 
            setServices(oldData => oldData.filter(item => item.id !== service.id))
          }
          catch(error){
            Alert.alert('Não foi possível remover')
          }
        }
      }
    ])
  }
 
  async function loadData(){

    const responseServices = await api.post("/service/getserviceprovider/", {
      idprovider: String(user.id)
    }); 

    const {service} = responseServices.data;

    setServices(service);
 
  }

  useEffect(() => {
    loadData();
  },[]);

  const handleNavigateBack = () => {
   navigation.goBack();
  }

  const navigateToDetail = (idprovider:string,idservice:string) => {
      navigation.navigate('AppointmentDetail',{idprovider,idservice});
   }

  return(
    <Container>
      <BackButton 
        onPress={handleNavigateBack}
        color="#fff"
      />
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding': undefined}
      > */}

    <CalendarContainer>
        <CalendarTitle>Escolha a data</CalendarTitle>

        <OpenDatePickerButton
          onPress={handleToggleDatePicker}
        >
          <OpenDatePickerText>Escolha outra data</OpenDatePickerText>
        </OpenDatePickerButton>
        {
          showDatePicker &&
          (
            <Calendar
            markedDates={markedDate}
            onDayPress={handleChangeDate}
            />
          )        
        }
      </CalendarContainer>
      {/* {showCalendar && (
         <Calendar
         markedDates={markedDate}
         onDayPress={handleChangeDate}
         />
      ) } */}
        
         <ServicesList
            data={services}
            keyExtractor={service => String(service.id)}
            ListHeaderComponent={
              <ServicesListTitle>Serviços Agendados</ServicesListTitle>
            }
            renderItem={({ item: service }) => (
              <Swipeable
                overshootRight={false}
                renderRightActions={()=>(
                  <Animated.View>
                    <View>
                        <RemoveButton
                          onPress={() => handleRemove(service)}
                        >
                          <Feather 
                            name="trash"
                            size={32}
                            color= {theme.COLORS.SHAPE}
                          />
                        </RemoveButton>
                    </View>
                  </Animated.View>
                )}
              >
                <ServicesContainer
                  onPress={() => navigateToDetail(service.idprovider, service.id)}
                >
                  <ServicesInfo>
                    <ServicesName>{service.iduser}</ServicesName> 
                    <ServicesMeta>
                      {/* <Icon name="phone" size={14} color="#FF9000" /> */}
                      <ServicesText>{service.typeservice}</ServicesText>
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
              </Swipeable>
            )}
          />
      
        
      {/* </KeyboardAvoidingView> */}
    </Container>
  )
}