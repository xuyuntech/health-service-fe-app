export const BaseURL = 'https://api.boxlinker.com';
export const DEV = process.env.NODE_ENV === 'development';
const DevURL = {
  Find: 'http://localhost:8080',
  Query: 'http://localhost:8080',
  Arrangement: 'http://localhost:8080',
  RegisterHistory: 'http://localhost:8080',
};

function getURL(url, moduler) {
  if (DEV) {
    return `${DevURL[moduler]}${url}`;
  }
  return `${BaseURL}${url}`;
}

export const API = {
  Find: key => getURL(`/find?key=${key}`, 'Find'),
  Query: (type) => {
    if (typeof type === 'string') {
      return getURL(`/query?query_string=${decodeURIComponent(JSON.stringify({ selector: { docType: { $eq: type } } }))}`, 'Query');
    }
    return getURL(`/query?query_string=${decodeURIComponent(JSON.stringify(type))}`, 'Query');
  },
  RegisterHistory: {
    Create: (arrangementKey, userKey) => getURL(`/createRegister?arrangementKey=${arrangementKey}&userKey=${userKey}`, 'RegisterHistory'),
  },
  Arrangement: {
    Create: getURL('/arrangement', 'Arrangement'),
  },
};

export const RegisterState = {
  Register: '已挂号',
  Visiting: '已就诊',
  Finished: '已完成',
};

export default {};
