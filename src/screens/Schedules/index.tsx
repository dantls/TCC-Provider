import React, { useCallback, useEffect,useState , useRef} from 'react'; 
import { Calendar,  DateData, MarkedDateProps } from '@src/components/Calendar';
import { generateMarked } from '@src/components/Calendar/generateMarked';
import { Alert, View} from 'react-native';
import { BackButton } from '@src/components/BackButton';
import { TextArea } from '@src/components/TextArea';
import { Button } from '@src/components/Button';
import { TextInputValue } from '@src/components/TextInputValue';
import { Swipeable } from 'react-native-gesture-handler';
import { useAuth } from '@hooks/auth';
import {useTheme} from 'styled-components/native';
import { Modalize } from 'react-native-modalize';
import {
  Container,
  RemoveButton,
  SectionTitle,
  CalendarContainer,
  CalendarTitle,
  OpenDatePickerButton,
  OpenDatePickerText,
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
import api from '@src/services/api';
import Icon from 'react-native-vector-icons/Feather';
import { EvilIcons } from '@expo/vector-icons';
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
  const modalizeRef = useRef<Modalize>(null);
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


  const [serviceValue, setServiceValue] = useState('');
  const [serviceSelected, setServiceSelected] = useState<Service | null>(null);
  const [serviceDescription, setServiceDescription] = useState('');
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
  const handleCloseModal = () => {
    modalizeRef.current?.close();
    setServiceSelected({});
    setServiceValue('');
    setServiceDescription('');
  }

  const navigateToDetail = (idprovider:string, idservice:string) => {
      navigation.navigate('AppointmentDetail',{idprovider,idservice});
  }

  const handleOpenModal = (service:Service) => {
    setServiceSelected(service);
    modalizeRef.current?.open();
  }

  const handleRemoveService = () => {
    Alert.alert('Remover',`Deseja remover a ${serviceSelected?.idprovider}?`,[
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: async ()=>{
          try {
            const responseServices = await api.post("/service/delete/", {id: String(serviceSelected?.id)}); 
            setServices(oldData => oldData.filter(item => item.id !== serviceSelected?.id));
            handleCloseModal();
          }
          catch(error){
            Alert.alert('Não foi possível remover')
          }
        }
      }
    ])
  }
  const handleCloseService = () => {
    Alert.alert('Finalizar',`Deseja finalizar o serviço ${serviceSelected?.idprovider}?`,[
      {
        text: 'Não',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: async ()=>{
          try {
            const responseServices = await api.post("/service/close/", {
              id: String(serviceSelected.id),
              value: serviceValue,
              description: serviceDescription
            }); 
            setServices(oldData => oldData.filter(item => item.id !== serviceSelected.id));
            handleCloseModal();
          }
          catch(error){
            Alert.alert('Não foi possível remover')
          }
        }
      }
    ])
  }


  

  return(
    <Container>
      <BackButton 
        onPress={handleNavigateBack}
        color="#fff"
      />

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
                          onPress={() => handleOpenModal(service)}
                        >
                          <EvilIcons 
                            name="gear"
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
      
        <Modalize
          ref={modalizeRef}
          snapPoint={600}
        >
           
          <View
            style={{
              flex:1,
              height:600,
              backgroundColor: '#312E38',
              paddingTop: 40
            }}
          >

            <SectionTitle>Valor do serviço</SectionTitle>
            <TextInputValue
              autoCorrect={false}
              onChangeText={setServiceValue}
              value={String(serviceValue)}
            />
            <SectionTitle>Descrição do serviço</SectionTitle>
            
            <TextArea
              multiline
              maxLength={100}
              numberOfLines={5}
              autoCorrect={false}
              onChangeText={setServiceDescription}
              value={serviceDescription}
            />

            <View
              style={{
                flexDirection: 'column',
                padding: 24,
                marginBottom: 24
              }}
            >
              <Button
                title="Finalizar serviço"
                onPress={handleCloseService}
              />
            </View>
            <View
              style={{
                flexDirection: 'column',
                padding: 24,
                marginBottom: 24
              }}
            >
              <Button
                title="Cancelar serviço"
                type="secondary"
                onPress={handleRemoveService}
              />
            </View>
          </View>
          
        </Modalize>
    </Container>
  )
}
