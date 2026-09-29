/** Curated city points plus approximate postal-district points for offline location selection. */
import postalDistrictRows from './postal-districts.json';

export interface IndianStateUT { id: string; name: string; nameHi: string; kind: 'state' | 'union_territory' }
export interface City {
  id: string;
  name: string;
  nameHi: string;
  stateId: string;
  latitude: number;
  longitude: number;
  timezone: 'Asia/Kolkata';
  aliases: readonly string[];
  kind: 'city' | 'district';
}

export const INDIAN_STATES_UTS: readonly IndianStateUT[] = [
  ['AP','Andhra Pradesh','आंध्र प्रदेश'],['AR','Arunachal Pradesh','अरुणाचल प्रदेश'],['AS','Assam','असम'],
  ['BR','Bihar','बिहार'],['CG','Chhattisgarh','छत्तीसगढ़'],['GA','Goa','गोवा'],['GJ','Gujarat','गुजरात'],
  ['HR','Haryana','हरियाणा'],['HP','Himachal Pradesh','हिमाचल प्रदेश'],['JH','Jharkhand','झारखंड'],
  ['KA','Karnataka','कर्नाटक'],['KL','Kerala','केरल'],['MP','Madhya Pradesh','मध्य प्रदेश'],
  ['MH','Maharashtra','महाराष्ट्र'],['MN','Manipur','मणिपुर'],['ML','Meghalaya','मेघालय'],
  ['MZ','Mizoram','मिज़ोरम'],['NL','Nagaland','नागालैंड'],['OD','Odisha','ओडिशा'],
  ['PB','Punjab','पंजाब'],['RJ','Rajasthan','राजस्थान'],['SK','Sikkim','सिक्किम'],
  ['TN','Tamil Nadu','तमिलनाडु'],['TS','Telangana','तेलंगाना'],['TR','Tripura','त्रिपुरा'],
  ['UP','Uttar Pradesh','उत्तर प्रदेश'],['UK','Uttarakhand','उत्तराखंड'],['WB','West Bengal','पश्चिम बंगाल'],
  ['AN','Andaman and Nicobar Islands','अंडमान और निकोबार द्वीपसमूह','union_territory'],
  ['CH','Chandigarh','चंडीगढ़','union_territory'],['DH','Dadra and Nagar Haveli and Daman and Diu','दादरा और नगर हवेली और दमन और दीव','union_territory'],
  ['DL','Delhi','दिल्ली','union_territory'],['JK','Jammu and Kashmir','जम्मू और कश्मीर','union_territory'],
  ['LA','Ladakh','लद्दाख','union_territory'],['LD','Lakshadweep','लक्षद्वीप','union_territory'],
  ['PY','Puducherry','पुदुच्चेरी','union_territory'],
].map(([id,name,nameHi,kind]) => ({id,name,nameHi,kind: kind === 'union_territory' ? 'union_territory' : 'state'})) as IndianStateUT[];

type CityTuple = [id: string, name: string, nameHi: string, stateId: string, latitude: number, longitude: number, aliases?: string[]];
const CITY_ROWS: CityTuple[] = [
  ['amaravati','Amaravati','अमरावती','AP',16.5735,80.3575],
  ['visakhapatnam','Visakhapatnam','विशाखापत्तनम','AP',17.6868,83.2185,['Vizag']],
  ['vijayawada','Vijayawada','विजयवाड़ा','AP',16.5062,80.6480],
  ['itanagar','Itanagar','ईटानगर','AR',27.0844,93.6053],
  ['guwahati','Guwahati','गुवाहाटी','AS',26.1445,91.7362,['Gauhati','Dispur']],
  ['silchar','Silchar','सिलचर','AS',24.8333,92.7789],
  ['patna','Patna','पटना','BR',25.5941,85.1376],
  ['gaya','Gaya','गया','BR',24.7955,84.9994],
  ['raipur','Raipur','रायपुर','CG',21.2514,81.6296],
  ['bilaspur','Bilaspur','बिलासपुर','CG',22.0797,82.1409],
  ['panaji','Panaji','पणजी','GA',15.4909,73.8278,['Panjim']],
  ['margao','Margao','मडगांव','GA',15.2832,73.9862],
  ['gandhinagar','Gandhinagar','गांधीनगर','GJ',23.2156,72.6369],
  ['ahmedabad','Ahmedabad','अहमदाबाद','GJ',23.0225,72.5714],
  ['surat','Surat','सूरत','GJ',21.1702,72.8311],
  ['vadodara','Vadodara','वडोदरा','GJ',22.3072,73.1812,['Baroda']],
  ['rajkot','Rajkot','राजकोट','GJ',22.3039,70.8022],
  ['gurugram','Gurugram','गुरुग्राम','HR',28.4595,77.0266,['Gurgaon']],
  ['faridabad','Faridabad','फरीदाबाद','HR',28.4089,77.3178],
  ['kurukshetra','Kurukshetra','कुरुक्षेत्र','HR',29.9695,76.8783],
  ['shimla','Shimla','शिमला','HP',31.1048,77.1734,['Simla']],
  ['dharamshala','Dharamshala','धर्मशाला','HP',32.2190,76.3234],
  ['ranchi','Ranchi','रांची','JH',23.3441,85.3096],
  ['jamshedpur','Jamshedpur','जमशेदपुर','JH',22.8046,86.2029],
  ['bengaluru','Bengaluru','बेंगलुरु','KA',12.9716,77.5946,['Bangalore']],
  ['mysuru','Mysuru','मैसूर','KA',12.2958,76.6394,['Mysore']],
  ['mangaluru','Mangaluru','मंगलुरु','KA',12.9141,74.8560,['Mangalore']],
  ['thiruvananthapuram','Thiruvananthapuram','तिरुवनंतपुरम','KL',8.5241,76.9366,['Trivandrum']],
  ['kochi','Kochi','कोच्चि','KL',9.9312,76.2673,['Cochin']],
  ['kozhikode','Kozhikode','कोझिकोड','KL',11.2588,75.7804,['Calicut']],
  ['bhopal','Bhopal','भोपाल','MP',23.2599,77.4126],
  ['indore','Indore','इंदौर','MP',22.7196,75.8577],
  ['ujjain','Ujjain','उज्जैन','MP',23.1765,75.7885],
  ['jabalpur','Jabalpur','जबलपुर','MP',23.1815,79.9864],
  ['mumbai','Mumbai','मुंबई','MH',19.0760,72.8777,['Bombay']],
  ['pune','Pune','पुणे','MH',18.5204,73.8567,['Poona']],
  ['nagpur','Nagpur','नागपुर','MH',21.1458,79.0882],
  ['nashik','Nashik','नासिक','MH',19.9975,73.7898,['Nasik']],
  ['imphal','Imphal','इंफाल','MN',24.8170,93.9368],
  ['shillong','Shillong','शिलांग','ML',25.5788,91.8933],
  ['aizawl','Aizawl','आइज़ोल','MZ',23.7271,92.7176],
  ['kohima','Kohima','कोहिमा','NL',25.6751,94.1086],
  ['dimapur','Dimapur','दीमापुर','NL',25.9091,93.7266],
  ['bhubaneswar','Bhubaneswar','भुवनेश्वर','OD',20.2961,85.8245,['Bhubaneshwar']],
  ['puri','Puri','पुरी','OD',19.8135,85.8312],
  ['cuttack','Cuttack','कटक','OD',20.4625,85.8828],
  ['amritsar','Amritsar','अमृतसर','PB',31.6340,74.8723],
  ['ludhiana','Ludhiana','लुधियाना','PB',30.9010,75.8573],
  ['patiala','Patiala','पटियाला','PB',30.3398,76.3869],
  ['jaipur','Jaipur','जयपुर','RJ',26.9124,75.7873],
  ['jodhpur','Jodhpur','जोधपुर','RJ',26.2389,73.0243],
  ['udaipur','Udaipur','उदयपुर','RJ',24.5854,73.7125],
  ['ajmer','Ajmer','अजमेर','RJ',26.4499,74.6399],
  ['bikaner','Bikaner','बीकानेर','RJ',28.0229,73.3119],
  ['gangtok','Gangtok','गंगटोक','SK',27.3314,88.6138],
  ['chennai','Chennai','चेन्नई','TN',13.0827,80.2707,['Madras']],
  ['madurai','Madurai','मदुरै','TN',9.9252,78.1198],
  ['coimbatore','Coimbatore','कोयंबटूर','TN',11.0168,76.9558],
  ['tiruchirappalli','Tiruchirappalli','तिरुचिरापल्ली','TN',10.7905,78.7047,['Trichy']],
  ['hyderabad','Hyderabad','हैदराबाद','TS',17.3850,78.4867],
  ['warangal','Warangal','वारंगल','TS',17.9689,79.5941],
  ['agartala','Agartala','अगरतला','TR',23.8315,91.2868],
  ['lucknow','Lucknow','लखनऊ','UP',26.8467,80.9462],
  ['varanasi','Varanasi','वाराणसी','UP',25.3176,82.9739,['Banaras','Benares','Kashi','काशी']],
  ['prayagraj','Prayagraj','प्रयागराज','UP',25.4358,81.8463,['Allahabad']],
  ['kanpur','Kanpur','कानपुर','UP',26.4499,80.3319],
  ['ayodhya','Ayodhya','अयोध्या','UP',26.7999,82.2040],
  ['agra','Agra','आगरा','UP',27.1767,78.0081],
  ['dehradun','Dehradun','देहरादून','UK',30.3165,78.0322],
  ['haridwar','Haridwar','हरिद्वार','UK',29.9457,78.1642],
  ['rishikesh','Rishikesh','ऋषिकेश','UK',30.0869,78.2676],
  ['kolkata','Kolkata','कोलकाता','WB',22.5726,88.3639,['Calcutta']],
  ['siliguri','Siliguri','सिलीगुड़ी','WB',26.7271,88.3953],
  ['port-blair','Sri Vijaya Puram','श्री विजय पुरम','AN',11.6234,92.7265,['Port Blair','पोर्ट ब्लेयर']],
  ['chandigarh','Chandigarh','चंडीगढ़','CH',30.7333,76.7794,['Punjab capital','Haryana capital']],
  ['daman','Daman','दमन','DH',20.3974,72.8328],
  ['silvassa','Silvassa','सिलवासा','DH',20.2763,73.0083],
  ['delhi','Delhi','दिल्ली','DL',28.6139,77.2090,['New Delhi','नई दिल्ली']],
  ['srinagar','Srinagar','श्रीनगर','JK',34.0837,74.7973],
  ['jammu','Jammu','जम्मू','JK',32.7266,74.8570],
  ['leh','Leh','लेह','LA',34.1526,77.5771],
  ['kargil','Kargil','कारगिल','LA',34.5539,76.1349],
  ['kavaratti','Kavaratti','कवरत्ती','LD',10.5593,72.6358],
  ['puducherry','Puducherry','पुदुच्चेरी','PY',11.9416,79.8083,['Pondicherry']],
  ['karaikal','Karaikal','कराईकल','PY',10.9167,79.8333],
];

export const INDIAN_CITIES: readonly City[] = CITY_ROWS.map(([id,name,nameHi,stateId,latitude,longitude,aliases]) => ({
  id,name,nameHi,stateId,latitude,longitude,aliases: aliases ?? [],timezone: 'Asia/Kolkata',kind: 'city',
}));
export const POSTAL_DISTRICTS: readonly City[] = postalDistrictRows.map(([id,name,stateId,latitude,longitude]) => ({
  id: String(id), name: String(name), nameHi: String(name), stateId: String(stateId),
  latitude: Number(latitude), longitude: Number(longitude), timezone: 'Asia/Kolkata',
  aliases: id === 'pb-s-a-s-nagar' ? ['Mohali', 'SAS Nagar', 'Sahibzada Ajit Singh Nagar'] : [],
  kind: 'district',
}));
const CITY_BY_ID = new Map([...INDIAN_CITIES, ...POSTAL_DISTRICTS].map(city => [city.id,city]));

export function getCityById(id: string): City | null { return CITY_BY_ID.get(id) ?? null; }
export function getStateById(id: string): IndianStateUT | null { return INDIAN_STATES_UTS.find(state => state.id === id) ?? null; }
export function getDistrictsByState(stateId: string, query = ''): City[] {
  const needle = normalize(query);
  return POSTAL_DISTRICTS.filter((district) => district.stateId === stateId &&
    (!needle || [district.name, ...district.aliases].some((name) => normalize(name).includes(needle))));
}

function normalize(value: string): string { return value.normalize('NFKD').toLocaleLowerCase().replace(/\p{M}/gu, '').trim(); }
export function searchCities(query: string, stateId?: string): City[] {
  const needle = normalize(query);
  return INDIAN_CITIES.filter(city => (!stateId || city.stateId === stateId) &&
    (!needle || [city.name, city.nameHi, ...city.aliases].some(name => normalize(name).includes(needle))));
}
