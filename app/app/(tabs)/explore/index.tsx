import DatesCard from '@/components/DatesCard';
import Loader from '@/components/Loader';
import { BASE_URI } from '@/constants/api';
import { dummyPfp } from '@/constants/dummy.constant';
import { IUser } from '@/interfaces/user.interface';
import { withErrorHandler } from '@/libs';
import { getData } from '@/libs/asyncStorage.libs';
import { getToast } from '@/libs/Toast.libs';
import { useUserStore } from '@/store/user.store';
import AntDesign from '@expo/vector-icons/AntDesign';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';

const android = Platform.OS === 'android';
const { width, height } = Dimensions.get('window');

const Index = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [feedData, setFeedData] = useState<IUser[]>([]);
  const { user } = useUserStore();

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = await getData('user_token');

        const res = await withErrorHandler(async () => {
          return await axios.get(BASE_URI + 'feed', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })();

        if (res?.status === 200) setFeedData(res?.data?.data);
        else
          getToast(
            'error',
            'Something went wrong',
            'Server is under maintenance ',
          );

        const INVALID_USER_STATUS = [400, 401, 404];

        console.log('res code', res?.status);
        if (res?.status && INVALID_USER_STATUS.includes(res?.status)) {
          router.replace('/(auth)/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSwipe = async (status: string, index: number) => {
    try {
      const userId = feedData[index]._id;
      const token = await getData('user_token');
      const res = await withErrorHandler(async () => {
        return await axios.post(
          BASE_URI + `connection/send/${status}/${userId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      })();

      console.log('res', res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      className="bg-white flex-1 justify-between"
      style={{
        paddingTop: android ? hp(5) : 0,
      }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* header */}
          <View className="w-full flex-row justify-between items-center px-4 mb-8">
            <TouchableOpacity
              className="rounded-full items-center justify-center"
              onPress={() => router.navigate('/(tabs)/profile')}
            >
              <Image
                style={{ width: hp(4.5), height: hp(4.5), resizeMode: 'cover' }}
                className="rounded-full"
                source={{ uri: user?.profilePic || dummyPfp }}
              />
            </TouchableOpacity>

            <View>
              <Text
                style={{ fontFamily: 'SpaceGroteskSemiBold' }}
                className="text-xl font-semibold text-center uppercase"
              >
                HOOKITUP Dates
              </Text>
            </View>
            <View className="bg-black/10 p-2 rounded-full items-center justify-center">
              <TouchableOpacity>
                <AntDesign
                  name="heart"
                  size={25}
                  strokeWidth={2}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* carousel */}
          <View className="pb-4">
            <View className="mx-4 mb-2">
              <Text
                style={{ fontFamily: 'SpaceGroteskSemiBold' }}
                className="capitalize text-2xl font-semibold"
              >
                Find your vibe
              </Text>
            </View>
          </View>

          <View style={{ height: height * 0.77 }}>
            <Swiper
              cards={feedData}
              renderCard={(user: IUser) => (
                <DatesCard
                  date={user}
                  handleClick={(date) => console.log('hyy', date)}
                />
              )}
              onSwipedLeft={(index) => handleSwipe('ignored', index)}
              onSwipedRight={(index) => handleSwipe('interested', index)}
              backgroundColor="transparent"
              cardIndex={0}
              stackSize={2}
              showSecondCard={true}
              infinite={false}
              stackSeparation={10}
              disableTopSwipe
              disableBottomSwipe
              animateCardOpacity
              useViewOverflow={false}
              cardVerticalMargin={0}
              verticalSwipe={false}
              containerStyle={styles.container}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.77,
    backgroundColor: 'transparent',
  },
  card: {
    width: width * 0.9,
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
