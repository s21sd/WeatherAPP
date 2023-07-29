import { StatusBar } from 'expo-status-bar';
import { Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Text, View, KeyboardAvoidingView } from 'react-native';
import { theme } from './Themes/themes';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { CalendarDaysIcon } from 'react-native-heroicons/solid'
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash'
import { fetchLoactions, fetchWeatherForecase } from './API/Weatherapi';
import { weatherimg } from './Themes/Allimg';
import * as Progress from 'react-native-progress';
import { getData, storeData } from './AsysnStorage';

export default function App() {
  const [searchBar, toogleseachBar] = useState(false);

  const [locationn, setlocation] = useState({});

  const [weather, setweather] = useState({});

  const [loading, setloading] = useState(false);



  const handleLocation = (loc) => {
    // console.log('location', loc);
    setlocation([]);
    toogleseachBar(false);
    setloading(true);
    fetchWeatherForecase({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setweather(data);
      setloading(false);
      storeData('city', loc.name);
      // console.log('got forecast', data);
    })

  }

  const handleSearch = value => {
    // console.log('location',value)
    if (value.length > 2) {
      fetchLoactions({ cityName: value }).then(data => {
        // console.log('got location', data);
        setlocation(data);
      })
    }

  }
  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData('city');
    let cityName = 'Lucknow';
    if (myCity) cityName = myCity;
    fetchWeatherForecase({
      cityName,
      days: '7'
    }).then(data => {
      setweather(data);
      setloading(false);
    })
  }

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;

  return (

    <KeyboardAvoidingView behavior="height" className="flex-1">
      <View className="flex-1 relative">
        <StatusBar style="light" />
        <Image className="absolute w-full h-full" blurRadius={60} source={require("./assets/img/bg.png")} />
        {
          loading ? (
            <View className="flex-1 flex-row justify-center items-center ">
              <Progress.CircleSnail thickness={5} size={100} color="#0bb3b2" />

            </View>
          ) :
            (
              <SafeAreaView className="flex flex-1 absolute">
                {/* {seach area place} */}
                <View style={{ height: '9%' }} className=" mt-14 mx-4 relative z-50">
                  <View className="flex-row justify-end items-center rounded-full" style={{ backgroundColor: searchBar ? theme.bgWhite(0.2) : "transparent" }}>
                    {
                      searchBar ? (
                        < TextInput onChangeText={handleTextDebounce} placeholder='Search city' TextInput={'light'} className="pl-6 h-12 pb-1 flex-1 text-base text-white " />
                      ) : null
                    }
                    <TouchableOpacity onPress={() => toogleseachBar(!searchBar)} style={{ backgroundColor: theme.bgWhite(0.3) }} className="rounded-full p-3 m-1">
                      <MagnifyingGlassIcon size={25} color="white" />
                    </TouchableOpacity>
                  </View>
                  {
                    locationn.length > 0 && searchBar ? (
                      <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                        {
                          locationn.map((loc, index) => {
                            let showBorder = index + 1 != locationn.length;
                            let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : ''
                            return (
                              <TouchableOpacity
                                onPress={() => handleLocation(loc)}
                                key={index}
                                className={"flex-row items-center bottom-0 p-3 px-4 mb-1 " + borderClass} >
                                <MapPinIcon size={20} color="gray" />
                                <Text className="text-black text-lg ml-2">{loc?.name},{loc?.country}</Text>
                              </TouchableOpacity>
                            )
                          })
                        }
                      </View>
                    ) : null
                  }
                </View>

                {/* {forcast section} */}

                <View className="mx-4 flex flex-1 mb-2 justify-around">

                  {/* {location} */}

                  <Text className="text-white text-center text-2xl font-bold">
                    {location?.name},
                    <Text className="text-lg font-semibold text-gray-300 ">
                      {" " + location?.country}

                    </Text>
                  </Text>
                  {/* {Weather Image} */}
                  <View className="flex-row justify-center mt-8">
                    <Image source={weatherimg[current?.condition?.text]} className="h-52 w-52" />
                  </View>
                  {/* {Degree Celcius} */}
                  <View className="space-y-2 mt-8">
                    <Text className="text-center font-bold text-white text-6xl ml-5">
                      {current?.temp_c}&#176;
                    </Text>
                    <Text className="text-center mb-3 text-white text-xl tracking-widest">
                      {current?.condition?.text}
                    </Text>
                  </View>

                  {/* {other states} */}
                  <View className="flex-row justify-between mx-4">
                    <View className="flex-row space-x-2 items-center">
                      <Image source={require('./assets/img/wind.png')} className="h-6 w-6" />
                      <Text className="text-white font-semibold text-base">{current?.wind_kph}Km</Text>

                    </View>

                    <View className="flex-row space-x-2 items-center">
                      <Image source={require('./assets/img/drop.png')} className="h-6 w-6" />
                      <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>

                    </View>

                    <View className="flex-row space-x-2 items-center">
                      <Image source={require('./assets/img/sun.png')} className="h-6 w-6" />
                      <Text className="text-white font-semibold text-base">{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>

                    </View>

                  </View>

                </View>

                {/* {forecast for the next days} */}
                <View className="mb-2 space-y-3">
                  <View className="flex-row items-center mx-5 space-x-2">
                    <CalendarDaysIcon size="22" color="white" />
                    <Text className="text-white text-base">Daily forecast</Text>

                  </View>

                  <ScrollView horizontal contentContainerStyle={{ paddingHorizontal: 15 }} showsHorizontalScrollIndicator={false}>

                    {
                      weather?.forecast?.forecastday?.map((items, index) => {
                        let date = new Date(items.date);
                        let options = { weekday: 'long' };
                        let dayName = date.toLocaleDateString('en-US', options);
                        dayName = dayName.split(',')[0]
                        return (
                          <View key={index} className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 m-2" style={{ backgroundColor: theme.bgWhite(0.15) }}>

                            <Image source={weatherimg[items?.day?.condition?.text]} className="h-11 w-11" />
                            <Text className="text-white">{dayName}</Text>
                            <Text className="text-white text-xl font-semibold">{items?.day?.avgtemp_c}&#176;</Text>

                          </View>
                        )
                      })
                    }


                  </ScrollView>

                </View>


              </SafeAreaView>
            )
        }


      </View>
    </KeyboardAvoidingView>

  );
}
